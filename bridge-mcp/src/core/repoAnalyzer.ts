import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import semver from "semver";

const execFileAsync = promisify(execFile);
const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_BUFFER_BYTES = 10 * 1024 * 1024;

export type UpdateType = "patch" | "minor" | "major" | "unknown";

export interface OutdatedPackage {
  name: string;
  current: string;
  wanted: string;
  latest: string;
  location?: string;
  dependencyType?: string;
  updateType: UpdateType;
}

export interface RepoAnalysis {
  outdated: OutdatedPackage[];
  vulnerabilities: { critical: number; high: number; medium: number; low: number; total: number };
  fileStats: { totalFiles: number; totalLines: number; largestFiles: { path: string; lines: number }[] };
  hasTests: boolean;
  hasTestFiles: boolean;
  testCommand: string | null;
  hasLinter: boolean;
  todoCount: number;
  circularDeps: number;
  languages: string[];
  hasCoverageData: boolean;
  readmeExists: boolean;
  readmeWordCount: number;
  dependencyNames: string[];
}

interface CommandResult {
  ok: boolean;
  exitCode: number | null;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  errorMessage?: string;
}

interface PackageJsonInfo {
  scripts: Record<string, string>;
  dependencyNames: string[];
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function runCommand(
  command: string,
  args: string[],
  cwd: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<CommandResult> {
  try {
    const { stdout, stderr } = await execFileAsync(command, args, {
      cwd,
      timeout: timeoutMs,
      maxBuffer: MAX_BUFFER_BYTES,
      encoding: "utf8",
    });

    return {
      ok: true,
      exitCode: 0,
      stdout: stdout ?? "",
      stderr: stderr ?? "",
      timedOut: false,
    };
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException & {
      code?: string | number;
      stdout?: string;
      stderr?: string;
      killed?: boolean;
      signal?: string;
      message?: string;
    };

    const exitCode = typeof nodeError.code === "number" ? nodeError.code : null;
    const timedOut = Boolean(nodeError.killed) || nodeError.signal === "SIGTERM";

    return {
      ok: false,
      exitCode,
      stdout: nodeError.stdout ?? "",
      stderr: nodeError.stderr ?? "",
      timedOut,
      errorMessage: nodeError.message,
    };
  }
}

function safeJsonParse<T>(raw: string): T | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  try {
    return JSON.parse(trimmed) as T;
  } catch {
    const firstBrace = trimmed.indexOf("{");
    const firstBracket = trimmed.indexOf("[");
    const start =
      firstBrace === -1
        ? firstBracket
        : firstBracket === -1
          ? firstBrace
          : Math.min(firstBrace, firstBracket);
    if (start >= 0) {
      try {
        return JSON.parse(trimmed.slice(start)) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}

function classifyUpdateType(current: string, latest: string): UpdateType {
  const currentVersion = semver.coerce(current);
  const latestVersion = semver.coerce(latest);

  if (!currentVersion || !latestVersion) {
    return "unknown";
  }

  const difference = semver.diff(currentVersion, latestVersion);
  if (!difference) {
    return "unknown";
  }

  if (difference.includes("major")) {
    return "major";
  }
  if (difference.includes("minor")) {
    return "minor";
  }
  if (difference.includes("patch") || difference.includes("pre")) {
    return "patch";
  }
  return "unknown";
}

async function loadPackageJson(repoPath: string): Promise<PackageJsonInfo> {
  const packagePath = path.join(repoPath, "package.json");
  if (!(await pathExists(packagePath))) {
    return { scripts: {}, dependencyNames: [] };
  }

  try {
    const raw = await fs.readFile(packagePath, "utf8");
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    const scripts: Record<string, string> = {};
    if (parsed.scripts && typeof parsed.scripts === "object") {
      for (const [key, value] of Object.entries(parsed.scripts as Record<string, unknown>)) {
        if (typeof value === "string") {
          scripts[key] = value;
        }
      }
    }

    const depSources = ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"];
    const names: string[] = [];

    for (const depSource of depSources) {
      const depBlock = parsed[depSource];
      if (depBlock && typeof depBlock === "object") {
        names.push(...Object.keys(depBlock as Record<string, unknown>));
      }
    }

    return { scripts, dependencyNames: Array.from(new Set(names)) };
  } catch {
    return { scripts: {}, dependencyNames: [] };
  }
}

async function analyzeOutdated(repoPath: string): Promise<OutdatedPackage[]> {
  if (!(await pathExists(path.join(repoPath, "package.json")))) {
    return [];
  }

  const result = await runCommand("npm", ["outdated", "--json"], repoPath);
  const payload = safeJsonParse<Record<string, any>>(result.stdout || result.stderr);

  if (!payload || typeof payload !== "object") {
    return [];
  }

  return Object.entries(payload)
    .map(([name, value]) => {
      if (!value || typeof value !== "object") {
        return null;
      }

      const current = String((value as Record<string, unknown>).current ?? "");
      const wanted = String((value as Record<string, unknown>).wanted ?? "");
      const latest = String((value as Record<string, unknown>).latest ?? "");

      if (!current.trim()) {
        return null;
      }

      if (!latest) {
        return null;
      }

      return {
        name,
        current,
        wanted,
        latest,
        location: typeof (value as Record<string, unknown>).location === "string" ? (value as Record<string, unknown>).location as string : undefined,
        dependencyType:
          typeof (value as Record<string, unknown>).type === "string"
            ? ((value as Record<string, unknown>).type as string)
            : undefined,
        updateType: classifyUpdateType(current, latest),
      } as OutdatedPackage;
    })
    .filter((item): item is OutdatedPackage => Boolean(item));
}

async function analyzeVulnerabilities(
  repoPath: string,
): Promise<{ critical: number; high: number; medium: number; low: number; total: number }> {
  if (!(await pathExists(path.join(repoPath, "package.json")))) {
    return { critical: 0, high: 0, medium: 0, low: 0, total: 0 };
  }

  const result = await runCommand("npm", ["audit", "--json"], repoPath);
  const payload = safeJsonParse<Record<string, any>>(result.stdout || result.stderr);
  const vulnerabilities = payload?.metadata?.vulnerabilities;

  if (!vulnerabilities || typeof vulnerabilities !== "object") {
    return { critical: 0, high: 0, medium: 0, low: 0, total: 0 };
  }

  const critical = Number(vulnerabilities.critical ?? 0) || 0;
  const high = Number(vulnerabilities.high ?? 0) || 0;
  const medium = Number(vulnerabilities.medium ?? vulnerabilities.moderate ?? 0) || 0;
  const low = Number(vulnerabilities.low ?? vulnerabilities.info ?? 0) || 0;
  const total = Number(vulnerabilities.total ?? critical + high + medium + low) || 0;

  return { critical, high, medium, low, total };
}

const IGNORED_DIRECTORIES = new Set([
  "node_modules",
  ".git",
  "dist",
  "dist-electron",
  "build",
  "coverage",
  ".next",
  ".bridge",
  "out",
  "releases",
]);

const IGNORED_FILE_NAMES = new Set([
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "bun.lockb",
  "Cargo.lock",
]);

const BINARY_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".ico",
  ".pdf",
  ".zip",
  ".tar",
  ".gz",
  ".jar",
  ".lock",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".mp3",
  ".mp4",
  ".mov",
  ".wasm",
  ".db",
]);

const EXTENSION_TO_LANGUAGE: Record<string, string> = {
  ".ts": "TypeScript",
  ".tsx": "TypeScript",
  ".js": "JavaScript",
  ".jsx": "JavaScript",
  ".mjs": "JavaScript",
  ".cjs": "JavaScript",
  ".py": "Python",
  ".go": "Go",
  ".rs": "Rust",
  ".java": "Java",
  ".kt": "Kotlin",
  ".swift": "Swift",
  ".rb": "Ruby",
  ".php": "PHP",
  ".cs": "C#",
  ".c": "C",
  ".h": "C",
  ".cpp": "C++",
  ".hpp": "C++",
  ".json": "JSON",
  ".yaml": "YAML",
  ".yml": "YAML",
  ".md": "Markdown",
  ".sh": "Shell",
};

function lineCount(text: string): number {
  if (text.length === 0) {
    return 0;
  }
  return text.split(/\r?\n/).length;
}

async function readTextSafely(filePath: string, byteLimit = 1_500_000): Promise<string | null> {
  try {
    const stat = await fs.stat(filePath);
    if (stat.size > byteLimit) {
      return null;
    }

    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

async function analyzeFileTree(repoPath: string): Promise<{
  fileStats: RepoAnalysis["fileStats"];
  languages: string[];
  todoCount: number;
  hasTestFiles: boolean;
  readmeExists: boolean;
  readmeWordCount: number;
}> {
  const queue: string[] = [repoPath];

  let totalFiles = 0;
  let totalLines = 0;
  let todoCount = 0;
  let hasTestFiles = false;
  let readmeExists = false;
  let readmeWordCount = 0;

  const largestFiles: Array<{ path: string; lines: number }> = [];
  const languageCount = new Map<string, number>();

  while (queue.length > 0) {
    const currentDir = queue.pop();
    if (!currentDir) {
      continue;
    }

    let entries;
    try {
      entries = await fs.readdir(currentDir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(repoPath, fullPath);

      if (entry.isDirectory()) {
        if (IGNORED_DIRECTORIES.has(entry.name)) {
          continue;
        }
        queue.push(fullPath);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      totalFiles += 1;

      if (IGNORED_FILE_NAMES.has(entry.name)) {
        continue;
      }

      const normalizedName = entry.name.toLowerCase();
      if (normalizedName === "readme.md" || normalizedName === "readme") {
        readmeExists = true;
      }

      if (/(^|\.|-)(test|spec)\./i.test(normalizedName) || /__tests__/.test(relativePath)) {
        hasTestFiles = true;
      }

      const extension = path.extname(entry.name).toLowerCase();
      const language = EXTENSION_TO_LANGUAGE[extension];
      if (language) {
        languageCount.set(language, (languageCount.get(language) ?? 0) + 1);
      }

      if (BINARY_EXTENSIONS.has(extension)) {
        continue;
      }

      const content = await readTextSafely(fullPath);
      if (content === null) {
        continue;
      }

      const lines = lineCount(content);
      totalLines += lines;
      largestFiles.push({ path: relativePath, lines });

      const todoMatches = content.match(/\b(TODO|FIXME|HACK)\b/g);
      if (todoMatches) {
        todoCount += todoMatches.length;
      }

      if (normalizedName === "readme.md" || normalizedName === "readme") {
        readmeWordCount = content
          .replace(/[#>*_`\-\[\]()]/g, " ")
          .split(/\s+/)
          .filter(Boolean).length;
      }
    }
  }

  largestFiles.sort((a, b) => b.lines - a.lines);
  const languages = Array.from(languageCount.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name)
    .slice(0, 10);

  return {
    fileStats: {
      totalFiles,
      totalLines,
      largestFiles: largestFiles.slice(0, 15),
    },
    languages,
    todoCount,
    hasTestFiles,
    readmeExists,
    readmeWordCount,
  };
}

async function analyzeCircularDependencies(repoPath: string): Promise<number> {
  const result = await runCommand("npx", ["--yes", "madge", "--circular", "--json", "."], repoPath);
  if (!result.stdout.trim() && !result.stderr.trim()) {
    return 0;
  }

  const payload = safeJsonParse<unknown>(result.stdout || result.stderr);
  if (!payload) {
    return 0;
  }

  if (Array.isArray(payload)) {
    return payload.length;
  }

  if (typeof payload === "object") {
    const objectPayload = payload as Record<string, unknown>;
    const values = Object.values(objectPayload);
    const cycleCount = values.filter((value) => Array.isArray(value) && value.length > 0).length;
    return cycleCount;
  }

  return 0;
}

function selectTestCommand(scripts: Record<string, string>): string | null {
  if (typeof scripts.test === "string" && scripts.test.trim().length > 0) {
    return "npm run test";
  }

  const fallback = Object.keys(scripts).find((name) => /^test(:|$)/.test(name));
  if (fallback) {
    return `npm run ${fallback}`;
  }

  return null;
}

async function detectLinter(repoPath: string, scripts: Record<string, string>): Promise<boolean> {
  if (Object.keys(scripts).some((name) => /^lint(:|$)/.test(name))) {
    return true;
  }

  const linterFiles = [
    ".eslintrc",
    ".eslintrc.js",
    ".eslintrc.cjs",
    ".eslintrc.json",
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.cjs",
    ".stylelintrc",
    ".stylelintrc.json",
  ];

  for (const fileName of linterFiles) {
    if (await pathExists(path.join(repoPath, fileName))) {
      return true;
    }
  }

  return false;
}

async function detectCoverage(repoPath: string, scripts: Record<string, string>): Promise<boolean> {
  if (await pathExists(path.join(repoPath, "coverage"))) {
    return true;
  }

  return Object.entries(scripts).some(([name, value]) => {
    if (!/^test(:|$)/.test(name)) {
      return false;
    }
    return /coverage|--cov|nyc|c8/.test(value);
  });
}

export async function analyzeRepo(repoPath: string): Promise<RepoAnalysis> {
  const packageInfo = await loadPackageJson(repoPath);
  const [outdated, vulnerabilities, treeStats, circularDeps, hasLinter, hasCoverageData] = await Promise.all([
    analyzeOutdated(repoPath),
    analyzeVulnerabilities(repoPath),
    analyzeFileTree(repoPath),
    analyzeCircularDependencies(repoPath),
    detectLinter(repoPath, packageInfo.scripts),
    detectCoverage(repoPath, packageInfo.scripts),
  ]);

  const testCommand = selectTestCommand(packageInfo.scripts);
  const hasTests = Boolean(testCommand) || treeStats.hasTestFiles;

  return {
    outdated,
    vulnerabilities,
    fileStats: treeStats.fileStats,
    hasTests,
    hasTestFiles: treeStats.hasTestFiles,
    testCommand,
    hasLinter,
    todoCount: treeStats.todoCount,
    circularDeps,
    languages: treeStats.languages,
    hasCoverageData,
    readmeExists: treeStats.readmeExists,
    readmeWordCount: treeStats.readmeWordCount,
    dependencyNames: packageInfo.dependencyNames,
  };
}
