import fs from "node:fs/promises";
import path from "node:path";
import { loadBridgeConfig, hasBridgeConfig } from "../core/bridgeConfig.js";
import { evaluateGates } from "../core/gateEvaluator.js";
import { analyzeRepo, type RepoAnalysis } from "../core/repoAnalyzer.js";
import { calculateScore, type TechDebtScore } from "../core/scorer.js";
import {
  LATEST_CONTEXT_FILE,
  LATEST_SCAN_FILE,
  LATEST_SCORE_FILE,
  cachePath,
  ensureBridgeDir,
  readJsonFile,
  statMtime,
  writeJsonFile,
} from "../core/cache.js";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export interface BridgeContextPayload {
  repo_name: string;
  scanned_at: string;
  debt_score: number;
  grade: TechDebtScore["grade"];
  has_bridge_config: boolean;
  critical_issues: string[];
  top_actions: Array<{ title: string; impact: number; automatable: boolean }>;
  conventions: string[];
  avoid: string[];
  preferred_libraries: Record<string, string>;
  banned_packages: string[];
  pinned_packages: Record<string, string>;
  update_policy: {
    patch: "auto" | "review" | "ignore";
    minor: "auto" | "review" | "ignore";
    major: "review" | "ignore";
  };
  outdated_summary: { total: number; patch: number; minor: number; major: number };
  gates_passing: boolean;
  failing_gates: string[];
  focus?: string;
}

async function verifyRepoPath(repoPath: string): Promise<string> {
  const resolved = path.resolve(repoPath);
  const stat = await fs.stat(resolved);
  if (!stat.isDirectory()) {
    throw new Error(`repo_path is not a directory: ${resolved}`);
  }
  return resolved;
}

function summarizeOutdated(outdated: RepoAnalysis["outdated"]): {
  total: number;
  patch: number;
  minor: number;
  major: number;
} {
  let patch = 0;
  let minor = 0;
  let major = 0;

  for (const pkg of outdated) {
    if (pkg.updateType === "patch") {
      patch += 1;
    } else if (pkg.updateType === "minor") {
      minor += 1;
    } else if (pkg.updateType === "major") {
      major += 1;
    }
  }

  return {
    total: outdated.length,
    patch,
    minor,
    major,
  };
}

function buildCriticalIssues(
  analysis: RepoAnalysis,
  score: TechDebtScore,
  failingGates: string[],
): string[] {
  const issues: string[] = [];

  if (analysis.vulnerabilities.critical > 0) {
    issues.push(
      `${analysis.vulnerabilities.critical} critical security vulnerabilities - run \`npm audit fix\` to resolve.`,
    );
  }

  if (analysis.vulnerabilities.high > 0) {
    issues.push(
      `${analysis.vulnerabilities.high} high security vulnerabilities - run \`npm audit fix\` and review results.`,
    );
  }

  if (!analysis.testCommand) {
    issues.push("No test command found in package.json scripts.");
  }

  if (analysis.circularDeps > 0) {
    issues.push(`${analysis.circularDeps} circular dependencies detected`);
  }

  for (const gateName of failingGates) {
    if (!issues.some((issue) => issue.toLowerCase().includes(gateName.replace(/-/g, " ")))) {
      issues.push(`Gate failing: ${gateName}`);
    }
  }

  if (issues.length === 0 && score.topContributors.length > 0) {
    issues.push(score.topContributors[0].description);
  }

  return issues.slice(0, 6);
}

async function loadOrAnalyze(repoPath: string): Promise<{ analysis: RepoAnalysis; scannedAt: string }> {
  await ensureBridgeDir(repoPath);

  const scanCachePath = cachePath(repoPath, LATEST_SCAN_FILE);
  const mtimeMs = await statMtime(scanCachePath);
  const isFresh = typeof mtimeMs === "number" && Date.now() - mtimeMs <= CACHE_TTL_MS;

  if (isFresh) {
    const cached = await readJsonFile<RepoAnalysis>(scanCachePath);
    if (cached) {
      return {
        analysis: cached,
        scannedAt: new Date(mtimeMs).toISOString(),
      };
    }
  }

  const analysis = await analyzeRepo(repoPath);
  await writeJsonFile(scanCachePath, analysis);
  return {
    analysis,
    scannedAt: new Date().toISOString(),
  };
}

function textMatchesFocus(text: string, focus: string | undefined): boolean {
  if (!focus) {
    return true;
  }

  const normalizedFocus = focus.trim().toLowerCase();
  if (!normalizedFocus) {
    return true;
  }

  return text.toLowerCase().includes(normalizedFocus);
}

function filterTopActions(
  actions: TechDebtScore["actionItems"],
  focus: string | undefined,
): Array<{ title: string; impact: number; automatable: boolean }> {
  const filtered = actions
    .filter((item) => textMatchesFocus(item.title, focus))
    .map((item) => ({ title: item.title, impact: item.impact, automatable: item.automatable }));

  if (filtered.length > 0) {
    return filtered.slice(0, 5);
  }

  return actions.slice(0, 5).map((item) => ({ title: item.title, impact: item.impact, automatable: item.automatable }));
}

export async function runBridgeGetContext(
  repoPathInput: string,
  focus?: string,
): Promise<BridgeContextPayload> {
  const repoPath = await verifyRepoPath(repoPathInput);
  const bridgeConfigExists = await hasBridgeConfig(repoPath);
  const config = await loadBridgeConfig(repoPath);

  const { analysis, scannedAt } = await loadOrAnalyze(repoPath);
  const score = calculateScore(analysis, config);

  const gates = evaluateGates(config, analysis);
  const failingGates = gates.filter((gate) => !gate.passed).map((gate) => gate.name);

  const contextPayload: BridgeContextPayload = {
    repo_name: config.project.name,
    scanned_at: scannedAt,
    debt_score: score.total,
    grade: score.grade,
    has_bridge_config: bridgeConfigExists,
    critical_issues: buildCriticalIssues(analysis, score, failingGates),
    top_actions: filterTopActions(score.actionItems, focus),
    conventions: config.agent.conventions,
    avoid: config.agent.avoidPatterns,
    preferred_libraries: config.agent.preferredLibraries,
    banned_packages: config.dependencies.bannedPackages,
    pinned_packages: config.dependencies.pinnedPackages || {},
    update_policy: config.dependencies.updatePolicy,
    outdated_summary: summarizeOutdated(analysis.outdated),
    gates_passing: failingGates.length === 0,
    failing_gates: failingGates,
    focus: focus?.trim() ? focus.trim() : undefined,
  };

  const contextCachePath = cachePath(repoPath, LATEST_CONTEXT_FILE);
  const scoreCachePath = cachePath(repoPath, LATEST_SCORE_FILE);
  await writeJsonFile(contextCachePath, contextPayload);
  await writeJsonFile(scoreCachePath, score);

  return contextPayload;
}
