import fs from "node:fs/promises";
import path from "node:path";

export type BridgePrimaryLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "ruby"
  | "elixir"
  | "go"
  | "rust"
  | "java"
  | "multi";

export type BridgePackageManager =
  | "npm"
  | "yarn"
  | "pnpm"
  | "pip"
  | "poetry"
  | "bundler"
  | "mix"
  | "cargo"
  | "maven"
  | "gradle"
  | "bun"
  | "pipenv";

export interface BridgeConfig {
  version: 1;
  project: {
    name: string;
    description?: string;
    primaryLanguage: BridgePrimaryLanguage | string;
    packageManager?: BridgePackageManager | string;
    monorepo?: boolean;
    workspacePatterns?: string[];
  };
  dependencies: {
    updatePolicy: {
      patch: "auto" | "review" | "ignore";
      minor: "auto" | "review" | "ignore";
      major: "review" | "ignore";
    };
    bannedPackages: string[];
    requiredPackages: string[];
    pinnedPackages?: Record<string, string>;
    maxAge?: {
      patch: number;
      minor: number;
      major: number;
    };
    securityPolicy: {
      autoFixCritical: boolean;
      autoFixHigh: boolean;
      blockOnCritical: boolean;
      blockOnHigh: boolean;
    };
  };
  gates: {
    tests: { required: boolean; command?: string; minCoverage?: number; timeout?: number };
    lint: { required: boolean; command?: string };
    build: { required: boolean; command?: string };
    bundleSize?: { maxBytes?: number; maxDeltaPercent?: number };
    circularDependencies: { maxAllowed: number; failOnNew: boolean };
    deadCode: { maxDeadFiles: number; maxUnusedExports: number; failOnNew: boolean };
    documentation: { requireReadme: boolean; requireChangelog: boolean; maxDaysSinceReadmeUpdate?: number };
  };
  agent: {
    context: string;
    conventions: string[];
    avoidPatterns: string[];
    preferredLibraries: Record<string, string>;
    reviewChecklist: string[];
  };
  scoring: {
    weights: {
      dependencies: number;
      security: number;
      architecture: number;
      testing: number;
      documentation: number;
      codeHealth: number;
    };
    thresholds?: {
      maxOutdatedDeps?: number;
      maxCircularDeps?: number;
      maxDeadFiles?: number;
      minTestCoverage?: number;
      maxOversizedFiles?: number;
      maxDebtScore?: number;
    };
  };
  scan: {
    schedule?: "hourly" | "daily" | "weekly" | "monthly" | "manual";
    exclude: string[];
    include?: string[];
    features: Record<string, boolean>;
  };
  console?: {
    projectId?: string;
    autoUpload: boolean;
    uploadOn?: Array<"scan" | "update" | "schedule">;
  };
}

export interface BridgeConfigValidationResult {
  errors: string[];
  warnings: string[];
}

export const BRIDGE_CONFIG_FILE = ".bridge.json";

export const DEFAULT_BRIDGE_CONFIG: BridgeConfig = {
  version: 1,
  project: {
    name: "Unnamed Project",
    primaryLanguage: "multi",
    monorepo: false,
    workspacePatterns: [],
  },
  dependencies: {
    updatePolicy: {
      patch: "auto",
      minor: "review",
      major: "review",
    },
    bannedPackages: [],
    requiredPackages: [],
    pinnedPackages: {},
    maxAge: {
      patch: 7,
      minor: 30,
      major: 90,
    },
    securityPolicy: {
      autoFixCritical: true,
      autoFixHigh: true,
      blockOnCritical: true,
      blockOnHigh: false,
    },
  },
  gates: {
    tests: {
      required: true,
      minCoverage: 80,
      timeout: 300,
    },
    lint: {
      required: false,
    },
    build: {
      required: false,
    },
    bundleSize: {
      maxDeltaPercent: 10,
    },
    circularDependencies: {
      maxAllowed: 0,
      failOnNew: true,
    },
    deadCode: {
      maxDeadFiles: 5,
      maxUnusedExports: 10,
      failOnNew: false,
    },
    documentation: {
      requireReadme: true,
      requireChangelog: false,
      maxDaysSinceReadmeUpdate: 90,
    },
  },
  agent: {
    context: "Repository managed by Bridge. Follow existing project conventions and keep changes safe and test-backed.",
    conventions: [],
    avoidPatterns: [],
    preferredLibraries: {
      dates: "date-fns",
      validation: "zod",
    },
    reviewChecklist: [
      "Preserve existing behavior",
      "Add or update tests for behavior changes",
      "Keep dependency and security risk low",
    ],
  },
  scoring: {
    weights: {
      dependencies: 20,
      security: 25,
      architecture: 20,
      testing: 20,
      documentation: 5,
      codeHealth: 10,
    },
    thresholds: {
      maxOutdatedDeps: 10,
      maxCircularDeps: 0,
      maxDeadFiles: 5,
      minTestCoverage: 80,
      maxOversizedFiles: 10,
      maxDebtScore: 70,
    },
  },
  scan: {
    schedule: "manual",
    exclude: ["node_modules", ".git", "dist", "build", ".next", "coverage", ".bridge"],
    include: [],
    features: {
      dependencies: true,
      security: true,
      circularDeps: true,
      deadCode: true,
      bundleSize: true,
      testCoverage: true,
      documentation: true,
      codeSmells: true,
      fileAnalysis: true,
    },
  },
  console: {
    autoUpload: false,
    uploadOn: ["scan"],
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stripJsonComments(input: string): string {
  return input.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:\\])\/\/.*$/gm, "$1");
}

function deepMerge<T>(base: T, override: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }

  if (!isRecord(base) || !isRecord(override)) {
    return (override === undefined ? base : override) as T;
  }

  const merged: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (key.startsWith("__comment")) {
      continue;
    }
    if (value === undefined) {
      continue;
    }

    if (key in merged && isRecord(merged[key]) && isRecord(value)) {
      merged[key] = deepMerge(merged[key], value);
    } else {
      merged[key] = value;
    }
  }

  return merged as T;
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(stripJsonComments(raw)) as T;
  } catch {
    return null;
  }
}

function uniqueStrings(values: string[] | undefined): string[] {
  return Array.from(new Set((values || []).map((value) => String(value).trim()).filter(Boolean)));
}

function normalizePrimaryLanguage(language: string | undefined): BridgePrimaryLanguage {
  const normalized = (language || "").toLowerCase();
  if (normalized === "js" || normalized === "javascript") return "javascript";
  if (normalized === "ts" || normalized === "typescript") return "typescript";
  if (normalized === "python" || normalized === "py") return "python";
  if (normalized === "ruby" || normalized === "rb") return "ruby";
  if (normalized === "elixir" || normalized === "ex") return "elixir";
  if (normalized === "go") return "go";
  if (normalized === "rust" || normalized === "rs") return "rust";
  if (normalized === "java") return "java";
  return "multi";
}

function normalizeConfig(config: BridgeConfig): BridgeConfig {
  return {
    ...config,
    project: {
      ...config.project,
      name: config.project.name.trim() || "Unnamed Project",
      description: config.project.description?.trim() || undefined,
      primaryLanguage: normalizePrimaryLanguage(String(config.project.primaryLanguage || "multi")),
      packageManager: config.project.packageManager?.toString().trim() || undefined,
      monorepo: Boolean(config.project.monorepo),
      workspacePatterns: uniqueStrings(config.project.workspacePatterns),
    },
    dependencies: {
      ...config.dependencies,
      bannedPackages: uniqueStrings(config.dependencies.bannedPackages),
      requiredPackages: uniqueStrings(config.dependencies.requiredPackages),
      pinnedPackages: Object.fromEntries(
        Object.entries(config.dependencies.pinnedPackages || {}).filter(
          ([pkg, version]) => pkg.trim().length > 0 && typeof version === "string" && version.trim().length > 0,
        ),
      ),
      maxAge: {
        patch: Math.max(0, Number(config.dependencies.maxAge?.patch ?? DEFAULT_BRIDGE_CONFIG.dependencies.maxAge?.patch ?? 7)),
        minor: Math.max(0, Number(config.dependencies.maxAge?.minor ?? DEFAULT_BRIDGE_CONFIG.dependencies.maxAge?.minor ?? 30)),
        major: Math.max(0, Number(config.dependencies.maxAge?.major ?? DEFAULT_BRIDGE_CONFIG.dependencies.maxAge?.major ?? 90)),
      },
    },
    gates: {
      ...config.gates,
      tests: {
        ...config.gates.tests,
        required: Boolean(config.gates.tests.required),
        command: config.gates.tests.command?.trim() || undefined,
        minCoverage: config.gates.tests.minCoverage,
        timeout: config.gates.tests.timeout,
      },
      lint: {
        ...config.gates.lint,
        required: Boolean(config.gates.lint.required),
        command: config.gates.lint.command?.trim() || undefined,
      },
      build: {
        ...config.gates.build,
        required: Boolean(config.gates.build.required),
        command: config.gates.build.command?.trim() || undefined,
      },
      circularDependencies: {
        maxAllowed: Math.max(0, Number(config.gates.circularDependencies.maxAllowed ?? 0)),
        failOnNew: Boolean(config.gates.circularDependencies.failOnNew),
      },
      deadCode: {
        maxDeadFiles: Math.max(0, Number(config.gates.deadCode.maxDeadFiles ?? 0)),
        maxUnusedExports: Math.max(0, Number(config.gates.deadCode.maxUnusedExports ?? 0)),
        failOnNew: Boolean(config.gates.deadCode.failOnNew),
      },
      documentation: {
        requireReadme: Boolean(config.gates.documentation.requireReadme),
        requireChangelog: Boolean(config.gates.documentation.requireChangelog),
        maxDaysSinceReadmeUpdate: config.gates.documentation.maxDaysSinceReadmeUpdate,
      },
    },
    agent: {
      ...config.agent,
      context: config.agent.context.trim(),
      conventions: uniqueStrings(config.agent.conventions),
      avoidPatterns: uniqueStrings(config.agent.avoidPatterns),
      preferredLibraries: Object.fromEntries(
        Object.entries(config.agent.preferredLibraries || {}).filter(
          ([key, value]) => key.trim().length > 0 && typeof value === "string" && value.trim().length > 0,
        ),
      ),
      reviewChecklist: uniqueStrings(config.agent.reviewChecklist),
    },
    scoring: {
      ...config.scoring,
      weights: {
        dependencies: Number(config.scoring.weights.dependencies),
        security: Number(config.scoring.weights.security),
        architecture: Number(config.scoring.weights.architecture),
        testing: Number(config.scoring.weights.testing),
        documentation: Number(config.scoring.weights.documentation),
        codeHealth: Number(config.scoring.weights.codeHealth),
      },
      thresholds: {
        ...(config.scoring.thresholds || {}),
      },
    },
    scan: {
      ...config.scan,
      exclude: uniqueStrings(config.scan.exclude),
      include: uniqueStrings(config.scan.include),
      features: Object.fromEntries(
        Object.entries(config.scan.features || {}).map(([key, value]) => [key, Boolean(value)]),
      ),
    },
    console: config.console
      ? {
          projectId: config.console.projectId?.trim() || undefined,
          autoUpload: Boolean(config.console.autoUpload),
          uploadOn: config.console.uploadOn || ["scan"],
        }
      : undefined,
  };
}

function packageManagerRunCommand(packageManager: string | undefined, scriptName: string): string {
  if (packageManager === "pnpm") {
    return scriptName === "test" ? "pnpm test" : `pnpm run ${scriptName}`;
  }
  if (packageManager === "yarn") {
    return `yarn ${scriptName}`;
  }
  if (packageManager === "bun") {
    return `bun run ${scriptName}`;
  }
  return scriptName === "test" ? "npm test" : `npm run ${scriptName}`;
}

async function detectLanguage(repoPath: string): Promise<BridgePrimaryLanguage> {
  const extensionCount = new Map<string, number>();
  const maxDepth = 5;
  const ignoredDirs = new Set([".git", "node_modules", "dist", "build", ".next", "coverage", ".bridge"]);

  const walk = async (dir: string, depth: number): Promise<void> => {
    if (depth > maxDepth) return;

    let entries: import("fs").Dirent[];
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (ignoredDirs.has(entry.name)) continue;
        await walk(path.join(dir, entry.name), depth + 1);
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();
      if (!ext) continue;
      extensionCount.set(ext, (extensionCount.get(ext) || 0) + 1);
    }
  };

  await walk(repoPath, 0);

  const indicators: Array<[BridgePrimaryLanguage, string[]]> = [
    ["typescript", [".ts", ".tsx"]],
    ["javascript", [".js", ".jsx", ".mjs", ".cjs"]],
    ["python", [".py"]],
    ["ruby", [".rb"]],
    ["elixir", [".ex", ".exs"]],
    ["go", [".go"]],
    ["rust", [".rs"]],
    ["java", [".java"]],
  ];

  const scores = indicators
    .map(([lang, exts]) => ({
      lang,
      count: exts.reduce((sum, ext) => sum + (extensionCount.get(ext) || 0), 0),
    }))
    .sort((a, b) => b.count - a.count);

  const top = scores[0];
  const second = scores[1];

  if (!top || top.count === 0) {
    if (await pathExists(path.join(repoPath, "package.json"))) return "javascript";
    if (await pathExists(path.join(repoPath, "pyproject.toml")) || (await pathExists(path.join(repoPath, "requirements.txt")))) {
      return "python";
    }
    if (await pathExists(path.join(repoPath, "Gemfile"))) return "ruby";
    if (await pathExists(path.join(repoPath, "mix.exs"))) return "elixir";
    if (await pathExists(path.join(repoPath, "go.mod"))) return "go";
    if (await pathExists(path.join(repoPath, "Cargo.toml"))) return "rust";
    if (await pathExists(path.join(repoPath, "pom.xml")) || (await pathExists(path.join(repoPath, "build.gradle")))) return "java";
    return "multi";
  }

  if (second && second.count > 0 && top.count < second.count * 3) {
    return "multi";
  }

  return top.lang;
}

async function detectPackageManager(repoPath: string): Promise<BridgePackageManager | undefined> {
  if (await pathExists(path.join(repoPath, "pnpm-lock.yaml"))) return "pnpm";
  if (await pathExists(path.join(repoPath, "yarn.lock"))) return "yarn";
  if (await pathExists(path.join(repoPath, "package-lock.json"))) return "npm";
  if (await pathExists(path.join(repoPath, "bun.lockb"))) return "bun";
  if (await pathExists(path.join(repoPath, "poetry.lock"))) return "poetry";
  if (await pathExists(path.join(repoPath, "Pipfile.lock"))) return "pipenv";
  if (await pathExists(path.join(repoPath, "requirements.txt"))) return "pip";
  if (await pathExists(path.join(repoPath, "Gemfile.lock"))) return "bundler";
  if (await pathExists(path.join(repoPath, "mix.lock"))) return "mix";
  if (await pathExists(path.join(repoPath, "Cargo.lock"))) return "cargo";
  if (await pathExists(path.join(repoPath, "pom.xml"))) return "maven";
  if ((await pathExists(path.join(repoPath, "build.gradle"))) || (await pathExists(path.join(repoPath, "build.gradle.kts")))) {
    return "gradle";
  }
  return undefined;
}

async function detectWorkspacePatterns(repoPath: string): Promise<{ monorepo: boolean; workspacePatterns: string[] }> {
  const patterns = new Set<string>();

  const packageJson = await readJsonFile<Record<string, unknown>>(path.join(repoPath, "package.json"));
  if (packageJson) {
    if (Array.isArray(packageJson.workspaces)) {
      for (const value of packageJson.workspaces) {
        if (typeof value === "string" && value.trim()) {
          patterns.add(value.trim());
        }
      }
    } else if (isRecord(packageJson.workspaces) && Array.isArray(packageJson.workspaces.packages)) {
      for (const value of packageJson.workspaces.packages) {
        if (typeof value === "string" && value.trim()) {
          patterns.add(value.trim());
        }
      }
    }
  }

  const pnpmWorkspace = path.join(repoPath, "pnpm-workspace.yaml");
  if (await pathExists(pnpmWorkspace)) {
    try {
      const raw = await fs.readFile(pnpmWorkspace, "utf8");
      for (const line of raw.split(/\r?\n/)) {
        const match = line.match(/^\s*-\s*['\"]?([^'\"]+)['\"]?\s*$/);
        if (match?.[1]) {
          patterns.add(match[1].trim());
        }
      }
    } catch {
      // noop
    }
  }

  if (await pathExists(path.join(repoPath, "lerna.json"))) {
    patterns.add("packages/*");
  }

  return {
    monorepo: patterns.size > 0,
    workspacePatterns: Array.from(patterns),
  };
}

async function detectFramework(repoPath: string): Promise<string | null> {
  const packageJson = await readJsonFile<Record<string, unknown>>(path.join(repoPath, "package.json"));
  if (!packageJson) {
    return null;
  }

  const deps = {
    ...(isRecord(packageJson.dependencies) ? packageJson.dependencies : {}),
    ...(isRecord(packageJson.devDependencies) ? packageJson.devDependencies : {}),
  };

  const frameworks: Array<[string, string]> = [
    ["next", "Next.js"],
    ["react", "React"],
    ["vue", "Vue"],
    ["svelte", "Svelte"],
    ["nuxt", "Nuxt"],
    ["angular", "Angular"],
    ["express", "Express"],
    ["fastify", "Fastify"],
    ["nestjs", "NestJS"],
    ["electron", "Electron"],
  ];

  for (const [pkg, framework] of frameworks) {
    if (pkg in deps) {
      return framework;
    }
  }

  return null;
}

async function detectNodeScripts(repoPath: string): Promise<Record<string, string>> {
  const packageJson = await readJsonFile<Record<string, unknown>>(path.join(repoPath, "package.json"));
  if (!packageJson || !isRecord(packageJson.scripts)) {
    return {};
  }

  const scripts: Record<string, string> = {};
  for (const [name, value] of Object.entries(packageJson.scripts)) {
    if (typeof value === "string") {
      scripts[name] = value;
    }
  }

  return scripts;
}

async function detectReadme(repoPath: string): Promise<{ description?: string; words: number }> {
  const readmeCandidates = ["README.md", "readme.md", "Readme.md"];
  for (const file of readmeCandidates) {
    const filePath = path.join(repoPath, file);
    if (!(await pathExists(filePath))) {
      continue;
    }

    try {
      const raw = await fs.readFile(filePath, "utf8");
      const normalized = raw.replace(/[#>*_`\-\[\]()]/g, " ");
      const words = normalized.split(/\s+/).filter(Boolean).length;
      const paragraphs = raw
        .replace(/\r/g, "")
        .split("\n\n")
        .map((chunk) => chunk.replace(/^#+\s+/gm, "").trim())
        .filter((chunk) => chunk.length > 0 && !chunk.startsWith("!["));
      const firstMeaningful = paragraphs.find((chunk) => chunk.split(/\s+/).length > 8);
      return {
        description: firstMeaningful,
        words,
      };
    } catch {
      return { words: 0 };
    }
  }

  return { words: 0 };
}

function hasAny(keys: string[], scripts: Record<string, string>): string | undefined {
  for (const key of keys) {
    if (scripts[key]) {
      return key;
    }
  }
  return undefined;
}

function addLanguageSpecificConventions(config: BridgeConfig, language: BridgePrimaryLanguage, hasReact: boolean): void {
  if (language === "typescript") {
    config.agent.conventions.push(
      "Use strict TypeScript - avoid any types",
      "Prefer named exports over default exports",
      "Use async/await over raw Promise chaining",
    );
    config.agent.avoidPatterns.push(
      "Do not use @ts-ignore without explanation",
      "Do not disable ESLint rules inline without justification",
    );
  }

  if (hasReact) {
    config.agent.conventions.push(
      "Use functional components with hooks",
      "Co-locate component tests with component files",
    );
    config.agent.avoidPatterns.push("Do not use class components");
  }
}

export function validateConfig(config: Partial<BridgeConfig>): BridgeConfigValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config || typeof config !== "object") {
    return { errors: ["Config must be an object."], warnings };
  }

  const merged = normalizeConfig(deepMerge(DEFAULT_BRIDGE_CONFIG, config));

  if (merged.version !== 1) {
    errors.push("Only config version 1 is supported.");
  }

  if (!merged.project.name.trim()) {
    errors.push("project.name is required.");
  }

  if (merged.gates.tests.minCoverage !== undefined) {
    if (merged.gates.tests.minCoverage < 0 || merged.gates.tests.minCoverage > 100) {
      errors.push("gates.tests.minCoverage must be between 0 and 100.");
    }
  }

  if (merged.gates.circularDependencies.maxAllowed < 0) {
    errors.push("gates.circularDependencies.maxAllowed cannot be negative.");
  }

  if (merged.gates.deadCode.maxDeadFiles < 0 || merged.gates.deadCode.maxUnusedExports < 0) {
    errors.push("gates.deadCode thresholds cannot be negative.");
  }

  const maxDebtScore = merged.scoring.thresholds?.maxDebtScore;
  if (maxDebtScore !== undefined && (maxDebtScore < 0 || maxDebtScore > 100)) {
    errors.push("scoring.thresholds.maxDebtScore must be between 0 and 100.");
  }

  if (merged.dependencies.maxAge) {
    if (merged.dependencies.maxAge.patch < 0 || merged.dependencies.maxAge.minor < 0 || merged.dependencies.maxAge.major < 0) {
      errors.push("dependencies.maxAge values cannot be negative.");
    }
  }

  if (merged.agent.context.trim().length < 20) {
    warnings.push("agent.context is very short; add project-specific instructions.");
  }

  return { errors, warnings };
}

export async function hasBridgeConfig(repoPath: string): Promise<boolean> {
  return pathExists(path.join(repoPath, BRIDGE_CONFIG_FILE));
}

export async function generateDefaultConfig(repoPath: string): Promise<BridgeConfig> {
  const repoName = path.basename(path.resolve(repoPath));
  const [language, packageManager, workspace, scripts, framework, readme] = await Promise.all([
    detectLanguage(repoPath),
    detectPackageManager(repoPath),
    detectWorkspacePatterns(repoPath),
    detectNodeScripts(repoPath),
    detectFramework(repoPath),
    detectReadme(repoPath),
  ]);

  const config = structuredClone(DEFAULT_BRIDGE_CONFIG);
  config.project.name = repoName;
  config.project.description = readme.description;
  config.project.primaryLanguage = language;
  config.project.packageManager = packageManager;
  config.project.monorepo = workspace.monorepo;
  config.project.workspacePatterns = workspace.workspacePatterns;

  const testScriptName = hasAny(["test", "test:unit", "test:ci"], scripts);
  const lintScriptName = hasAny(["lint", "lint:ci"], scripts);
  const buildScriptName = hasAny(["build"], scripts);

  config.gates.tests.command = testScriptName ? packageManagerRunCommand(packageManager, testScriptName) : undefined;
  config.gates.lint.command = lintScriptName ? packageManagerRunCommand(packageManager, lintScriptName) : undefined;
  config.gates.build.command = buildScriptName ? packageManagerRunCommand(packageManager, buildScriptName) : undefined;

  config.gates.tests.required = true;
  config.gates.lint.required = Boolean(config.gates.lint.command);
  config.gates.build.required = Boolean(config.gates.build.command);
  config.gates.documentation.requireReadme = true;
  config.gates.documentation.requireChangelog = await pathExists(path.join(repoPath, "CHANGELOG.md"));

  const frameworkOrLanguage = framework || config.project.primaryLanguage;
  const contextParts: string[] = [];
  contextParts.push(`${config.project.name} is a ${frameworkOrLanguage} project`);
  if (config.project.monorepo) contextParts.push("using a monorepo structure");
  if (config.project.packageManager) contextParts.push(`managed with ${config.project.packageManager}`);
  config.agent.context = `${contextParts.join(" ")}.`;

  addLanguageSpecificConventions(config, language, framework === "React" || framework === "Next.js");

  if (readme.words > 400) {
    config.agent.reviewChecklist.push("Keep README and docs aligned with behavioral changes");
  }

  config.agent.conventions = uniqueStrings(config.agent.conventions);
  config.agent.avoidPatterns = uniqueStrings(config.agent.avoidPatterns);
  config.agent.reviewChecklist = uniqueStrings(config.agent.reviewChecklist);

  return normalizeConfig(config);
}

function serializeConfigWithComments(config: BridgeConfig): string {
  const payload: Record<string, unknown> = {
    __comment_0:
      "Bridge project configuration. Keep this file in source control so all engineers and agents share policy.",
    __comment_1: "Fields named __comment_* are ignored by Bridge and safe to remove.",
    ...config,
  };

  return `${JSON.stringify(payload, null, 2)}\n`;
}

export async function writeBridgeConfig(repoPath: string, config: BridgeConfig): Promise<void> {
  const normalized = normalizeConfig(config);
  const validation = validateConfig(normalized);
  if (validation.errors.length > 0) {
    throw new Error(`Invalid Bridge config: ${validation.errors.join("; ")}`);
  }

  const configPath = path.join(repoPath, BRIDGE_CONFIG_FILE);
  await fs.writeFile(configPath, serializeConfigWithComments(normalized), "utf8");
}

export async function loadBridgeConfig(repoPath: string): Promise<BridgeConfig> {
  const configPath = path.join(repoPath, BRIDGE_CONFIG_FILE);
  const generatedDefaults = await generateDefaultConfig(repoPath);

  if (!(await pathExists(configPath))) {
    return generatedDefaults;
  }

  const existing = await readJsonFile<BridgeConfig>(configPath);
  if (!existing) {
    return generatedDefaults;
  }

  const merged = normalizeConfig(deepMerge(generatedDefaults, existing));
  const validation = validateConfig(merged);
  if (validation.errors.length > 0) {
    return generatedDefaults;
  }

  return merged;
}
