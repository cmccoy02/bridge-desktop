import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { loadBridgeConfig } from "../core/bridgeConfig.js";

const execFileAsync = promisify(execFile);
const DEFAULT_TIMEOUT_MS = 15_000;
const MAX_BUFFER = 5 * 1024 * 1024;

const KNOWN_ALTERNATIVES: Record<string, string[]> = {
  dates: ["moment", "dayjs", "luxon", "date-fns"],
  http: ["request", "axios", "got", "node-fetch", "ky"],
  validation: ["joi", "yup", "zod", "ajv"],
  state: ["redux", "mobx", "zustand", "jotai", "valtio"],
  testing: ["jest", "mocha", "vitest", "ava"],
  auth: ["passport", "lucia", "next-auth", "clerk"],
};

export interface PackageCheckResult {
  package_name: string;
  version_checked: string | null;
  allowed: boolean;
  is_banned: boolean;
  ban_reason: string | null;
  is_preferred: boolean;
  preferred_for_category: string | null;
  preferred_alternative: string | null;
  alternative_reason: string | null;
  is_already_installed: boolean;
  latest_version: string | null;
  warnings: string[];
  recommendation: string;
}

async function runCommand(command: string, args: string[], cwd: string): Promise<{ stdout: string; stderr: string }> {
  try {
    const { stdout, stderr } = await execFileAsync(command, args, {
      cwd,
      timeout: DEFAULT_TIMEOUT_MS,
      maxBuffer: MAX_BUFFER,
      encoding: "utf8",
    });
    return { stdout: stdout ?? "", stderr: stderr ?? "" };
  } catch (error) {
    const execErr = error as NodeJS.ErrnoException & { stdout?: string; stderr?: string; message?: string };
    return {
      stdout: execErr.stdout ?? "",
      stderr: execErr.stderr ?? execErr.message ?? "",
    };
  }
}

function toLower(value: string): string {
  return value.trim().toLowerCase();
}

function buildRecommendation(input: {
  isBanned: boolean;
  banReason: string | null;
  preferredAlternative: string | null;
  alternativeReason: string | null;
  isAlreadyInstalled: boolean;
  isPreferred: boolean;
  warnings: string[];
  latestVersion: string | null;
  packageName: string;
}): string {
  if (input.isBanned) {
    const alt = input.preferredAlternative ? ` Use ${input.preferredAlternative} instead.` : "";
    return `Do not install ${input.packageName}. ${input.banReason || "Package is banned by policy."}.${alt}`;
  }

  if (input.preferredAlternative && !input.isPreferred) {
    return `Allowed, but ${input.preferredAlternative} is preferred for this category (${input.alternativeReason || "project policy"}).`;
  }

  if (input.isPreferred) {
    return `Allowed and aligned with preferred library policy.${input.latestVersion ? ` Latest version: ${input.latestVersion}.` : ""}`;
  }

  if (input.isAlreadyInstalled) {
    return `Package is already installed. Reuse existing dependency unless a version change is required.`;
  }

  if (input.warnings.length > 0) {
    return `Allowed with warnings. Review metadata before installing.`;
  }

  return `Allowed. Proceed with normal dependency review.${input.latestVersion ? ` Latest version: ${input.latestVersion}.` : ""}`;
}

async function readPackageJsonDeps(repoPath: string): Promise<Set<string>> {
  try {
    const packageJsonPath = path.join(repoPath, "package.json");
    const raw = await fs.readFile(packageJsonPath, "utf8");
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    const allDeps: string[] = [];
    for (const field of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
      const block = parsed[field];
      if (block && typeof block === "object") {
        allDeps.push(...Object.keys(block as Record<string, unknown>));
      }
    }

    return new Set(allDeps.map((name) => toLower(name)));
  } catch {
    return new Set<string>();
  }
}

async function npmViewVersion(repoPath: string, packageName: string): Promise<string | null> {
  const { stdout } = await runCommand("npm", ["view", packageName, "version", "--json"], repoPath);
  const trimmed = stdout.trim();
  if (!trimmed) return null;

  try {
    const parsed = JSON.parse(trimmed) as string | string[];
    if (typeof parsed === "string") return parsed;
    if (Array.isArray(parsed) && parsed.length > 0) return String(parsed[parsed.length - 1]);
  } catch {
    if (trimmed) return trimmed.replace(/^"|"$/g, "");
  }

  return null;
}

async function npmViewMeta(repoPath: string, packageName: string): Promise<{ deprecated?: string }> {
  const { stdout } = await runCommand("npm", ["view", packageName, "--json"], repoPath);
  const trimmed = stdout.trim();
  if (!trimmed) return {};

  try {
    const parsed = JSON.parse(trimmed) as Record<string, unknown>;
    return {
      deprecated: typeof parsed.deprecated === "string" ? parsed.deprecated : undefined,
    };
  } catch {
    return {};
  }
}

function findCategoryAndPreferred(
  packageName: string,
  preferredLibraries: Record<string, string>,
): { category: string | null; preferred: string | null } {
  const normalizedPkg = toLower(packageName);
  for (const [category, alternatives] of Object.entries(KNOWN_ALTERNATIVES)) {
    const normalizedAlternatives = alternatives.map((value) => toLower(value));
    if (!normalizedAlternatives.includes(normalizedPkg)) {
      continue;
    }

    const preferred = preferredLibraries[category];
    return {
      category,
      preferred: preferred || null,
    };
  }

  return { category: null, preferred: null };
}

export async function runBridgeCheckPackage(
  repoPathInput: string,
  packageNameInput: string,
  version?: string,
): Promise<PackageCheckResult> {
  const repoPath = path.resolve(repoPathInput);
  const packageName = packageNameInput.trim();

  if (!packageName) {
    throw new Error("package_name is required");
  }

  const config = await loadBridgeConfig(repoPath);
  const warnings: string[] = [];

  const normalizedPackage = toLower(packageName);
  const bannedSet = new Set((config.dependencies.bannedPackages || []).map((name) => toLower(name)));
  const preferredLibraries = config.agent.preferredLibraries || {};

  const isBanned = bannedSet.has(normalizedPackage);
  const banReason = isBanned ? `Package '${packageName}' is listed in dependencies.bannedPackages.` : null;

  const installedDeps = await readPackageJsonDeps(repoPath);
  const isAlreadyInstalled = installedDeps.has(normalizedPackage);

  const preferredValues = new Set(Object.values(preferredLibraries).map((value) => toLower(value)));
  const isPreferred = preferredValues.has(normalizedPackage);

  const { category, preferred } = findCategoryAndPreferred(packageName, preferredLibraries);
  const preferredAlternative = preferred && toLower(preferred) !== normalizedPackage ? preferred : null;
  const alternativeReason =
    preferredAlternative && category
      ? `Project prefers ${preferredAlternative} for '${category}'.`
      : null;

  const latestVersion = await npmViewVersion(repoPath, packageName);
  const versionChecked = version || latestVersion;

  if (!latestVersion) {
    warnings.push("Unable to resolve latest version from npm registry.");
  }

  const meta = await npmViewMeta(repoPath, packageName);
  if (meta.deprecated) {
    warnings.push(`Package is deprecated: ${meta.deprecated}`);
  }

  const recommendation = buildRecommendation({
    isBanned,
    banReason,
    preferredAlternative,
    alternativeReason,
    isAlreadyInstalled,
    isPreferred,
    warnings,
    latestVersion,
    packageName,
  });

  return {
    package_name: packageName,
    version_checked: versionChecked ?? null,
    allowed: !isBanned,
    is_banned: isBanned,
    ban_reason: banReason,
    is_preferred: isPreferred,
    preferred_for_category: category,
    preferred_alternative: preferredAlternative,
    alternative_reason: alternativeReason,
    is_already_installed: isAlreadyInstalled,
    latest_version: latestVersion,
    warnings,
    recommendation,
  };
}
