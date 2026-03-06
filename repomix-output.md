This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.bridge/
  latest-context.json
  latest-scan.json
  latest-score.json
.claude/
  settings.local.json
bridge-mcp/
  src/
    core/
      bridgeConfig.ts
      cache.ts
      gateEvaluator.ts
      repoAnalyzer.ts
      scorer.ts
    resources/
      conventions.ts
      score.ts
    tools/
      checkGates.ts
      checkPackage.ts
      getContext.ts
      init.ts
      scan.ts
      updateDeps.ts
    index.ts
  .mcp.json
  package.json
  README.md
  tsconfig.json
electron/
  services/
    analysis.ts
    appSettings.ts
    bridgeConfig.ts
    bridgeConsoleApi.ts
    bridgeProjectConfig.ts
    cli.ts
    fileSystem.ts
    gateEvaluator.ts
    git.ts
    languages.ts
    patchBatch.ts
    scanReport.ts
    scheduler.ts
    securityPatterns.ts
    securityScanner.ts
    smartScheduler.ts
    store.ts
    techDebtScorer.ts
  main.ts
  preload.ts
releases/
  .gitkeep
scripts/
  notarize.cjs
src/
  components/
    Cleanup/
      Cleanup.tsx
    Dashboard/
      Dashboard.tsx
    FileBrowser/
      FileBrowser.tsx
    FullScan/
      CircularDepsGraph.tsx
      FullScan.tsx
    Layout/
      Header.tsx
      Sidebar.tsx
    PatchBatch/
      PatchBatch.tsx
    Scheduler/
      Scheduler.tsx
    Security/
      Security.tsx
    Settings/
      Settings.tsx
  contexts/
    AppSettingsContext.tsx
    RepositoryContext.tsx
    ScanContext.tsx
    ThemeContext.tsx
  types/
    global.d.ts
    index.ts
  App.tsx
  index.css
  main.tsx
.bridge.json
.gitignore
DEMO.md
index.html
package.json
README.md
tsconfig.json
tsconfig.node.json
vite.config.ts
```

# Files

## File: .bridge/latest-context.json
````json
{
  "repo_name": "bridge-desktop",
  "scanned_at": "2026-03-05T23:50:34.661Z",
  "debt_score": 31,
  "grade": "C",
  "has_bridge_config": true,
  "critical_issues": [
    "No test command found in package.json scripts.",
    "Gate failing: tests-exist"
  ],
  "top_actions": [
    {
      "title": "No test command found",
      "impact": 40,
      "automatable": true
    },
    {
      "title": "No test files detected",
      "impact": 30,
      "automatable": true
    },
    {
      "title": "No linter configured",
      "impact": 10,
      "automatable": true
    },
    {
      "title": "TODO/FIXME/HACK markers exceed 10 (54)",
      "impact": 10,
      "automatable": false
    },
    {
      "title": "TODO/FIXME/HACK markers exceed 30 (54)",
      "impact": 10,
      "automatable": false
    }
  ],
  "conventions": [
    "Use strict TypeScript - avoid any types",
    "Prefer named exports over default exports",
    "Use async/await over raw Promise chaining",
    "Use functional components with hooks",
    "Co-locate component tests with component files"
  ],
  "avoid": [
    "Do not use @ts-ignore without explanation",
    "Do not disable ESLint rules inline without justification",
    "Do not use class components"
  ],
  "preferred_libraries": {
    "dates": "date-fns",
    "validation": "zod"
  },
  "banned_packages": [],
  "pinned_packages": {},
  "update_policy": {
    "patch": "auto",
    "minor": "review",
    "major": "review"
  },
  "outdated_summary": {
    "total": 0,
    "patch": 0,
    "minor": 0,
    "major": 0
  },
  "gates_passing": false,
  "failing_gates": [
    "tests-exist"
  ]
}
````

## File: .bridge/latest-scan.json
````json
{
  "outdated": [],
  "vulnerabilities": {
    "critical": 0,
    "high": 0,
    "medium": 0,
    "low": 0,
    "total": 0
  },
  "fileStats": {
    "totalFiles": 85,
    "totalLines": 64283,
    "largestFiles": [
      {
        "path": "repomix-output.md",
        "lines": 43072
      },
      {
        "path": "sandbox/fixtures/large-fixture.json",
        "lines": 2003
      },
      {
        "path": "electron/services/patchBatch.ts",
        "lines": 1838
      },
      {
        "path": "electron/services/analysis.ts",
        "lines": 1482
      },
      {
        "path": "src/index.css",
        "lines": 1175
      },
      {
        "path": "electron/preload.ts",
        "lines": 921
      },
      {
        "path": "src/components/PatchBatch/PatchBatch.tsx",
        "lines": 823
      },
      {
        "path": "bridge-mcp/src/core/bridgeConfig.ts",
        "lines": 807
      },
      {
        "path": "electron/main.ts",
        "lines": 694
      },
      {
        "path": "src/components/Scheduler/Scheduler.tsx",
        "lines": 680
      },
      {
        "path": "src/types/index.ts",
        "lines": 638
      },
      {
        "path": "src/components/FullScan/FullScan.tsx",
        "lines": 604
      },
      {
        "path": "bridge-mcp/src/core/repoAnalyzer.ts",
        "lines": 583
      },
      {
        "path": "bridge-mcp/src/core/scorer.ts",
        "lines": 546
      },
      {
        "path": "electron/services/scheduler.ts",
        "lines": 523
      }
    ]
  },
  "hasTests": false,
  "hasTestFiles": false,
  "testCommand": null,
  "hasLinter": false,
  "todoCount": 54,
  "circularDeps": 0,
  "languages": [
    "TypeScript",
    "JSON",
    "Markdown",
    "JavaScript"
  ],
  "hasCoverageData": false,
  "readmeExists": true,
  "readmeWordCount": 415,
  "dependencyNames": [
    "dependency-cruiser",
    "electron-store",
    "knip",
    "nyc",
    "react",
    "react-dom",
    "remark",
    "remark-lint",
    "semver",
    "unimported",
    "vis-network",
    "webpack-bundle-analyzer",
    "@types/node",
    "@types/react",
    "@types/react-dom",
    "@types/semver",
    "@vitejs/plugin-react",
    "@electron/notarize",
    "electron",
    "electron-builder",
    "typescript",
    "vite",
    "vite-plugin-electron",
    "vite-plugin-electron-renderer"
  ]
}
````

## File: .bridge/latest-score.json
````json
{
  "total": 31,
  "grade": "C",
  "trend": "unknown",
  "dimensions": {
    "dependencies": {
      "score": 0,
      "weight": 20,
      "weightedScore": 0,
      "findings": [],
      "metrics": {
        "outdatedCount": 0,
        "patchCount": 0,
        "minorCount": 0,
        "majorCount": 0
      }
    },
    "security": {
      "score": 0,
      "weight": 25,
      "weightedScore": 0,
      "findings": [],
      "metrics": {
        "critical": 0,
        "high": 0,
        "medium": 0,
        "low": 0,
        "total": 0
      }
    },
    "architecture": {
      "score": 70,
      "weight": 20,
      "weightedScore": 14,
      "findings": [
        "repomix-output.md exceeds 500 lines (43072)",
        "repomix-output.md exceeds 1000 lines (43072)",
        "sandbox/fixtures/large-fixture.json exceeds 500 lines (2003)",
        "sandbox/fixtures/large-fixture.json exceeds 1000 lines (2003)",
        "electron/services/patchBatch.ts exceeds 500 lines (1838)",
        "electron/services/patchBatch.ts exceeds 1000 lines (1838)",
        "electron/services/analysis.ts exceeds 500 lines (1482)",
        "electron/services/analysis.ts exceeds 1000 lines (1482)",
        "src/index.css exceeds 500 lines (1175)",
        "src/index.css exceeds 1000 lines (1175)",
        "electron/preload.ts exceeds 500 lines (921)",
        "src/components/PatchBatch/PatchBatch.tsx exceeds 500 lines (823)",
        "bridge-mcp/src/core/bridgeConfig.ts exceeds 500 lines (807)",
        "electron/main.ts exceeds 500 lines (694)",
        "src/components/Scheduler/Scheduler.tsx exceeds 500 lines (680)",
        "src/types/index.ts exceeds 500 lines (638)",
        "src/components/FullScan/FullScan.tsx exceeds 500 lines (604)",
        "bridge-mcp/src/core/repoAnalyzer.ts exceeds 500 lines (583)",
        "bridge-mcp/src/core/scorer.ts exceeds 500 lines (546)",
        "electron/services/scheduler.ts exceeds 500 lines (523)"
      ],
      "metrics": {
        "circularDeps": 0,
        "filesOver500": 15,
        "filesOver1000": 5
      }
    },
    "testing": {
      "score": 70,
      "weight": 20,
      "weightedScore": 14,
      "findings": [
        "No test command found",
        "No test files detected"
      ],
      "metrics": {
        "hasTests": 0,
        "hasTestFiles": 0,
        "hasCoverageData": 0
      }
    },
    "documentation": {
      "score": 0,
      "weight": 5,
      "weightedScore": 0,
      "findings": [],
      "metrics": {
        "readmeExists": 1,
        "readmeWordCount": 415
      }
    },
    "codeHealth": {
      "score": 30,
      "weight": 10,
      "weightedScore": 3,
      "findings": [
        "TODO/FIXME/HACK markers exceed 10 (54)",
        "TODO/FIXME/HACK markers exceed 30 (54)",
        "No linter configured"
      ],
      "metrics": {
        "todoCount": 54,
        "hasLinter": 0
      }
    }
  },
  "topContributors": [
    {
      "dimension": "testing",
      "description": "No test command found",
      "impact": 40,
      "fixable": true,
      "effort": "medium"
    },
    {
      "dimension": "testing",
      "description": "No test files detected",
      "impact": 30,
      "fixable": true,
      "effort": "medium"
    },
    {
      "dimension": "codeHealth",
      "description": "TODO/FIXME/HACK markers exceed 10 (54)",
      "impact": 10,
      "fixable": false,
      "effort": "small"
    },
    {
      "dimension": "codeHealth",
      "description": "TODO/FIXME/HACK markers exceed 30 (54)",
      "impact": 10,
      "fixable": false,
      "effort": "medium"
    },
    {
      "dimension": "codeHealth",
      "description": "No linter configured",
      "impact": 10,
      "fixable": true,
      "effort": "small"
    },
    {
      "dimension": "architecture",
      "description": "repomix-output.md exceeds 1000 lines (43072)",
      "impact": 5,
      "fixable": false,
      "effort": "large"
    },
    {
      "dimension": "architecture",
      "description": "sandbox/fixtures/large-fixture.json exceeds 1000 lines (2003)",
      "impact": 5,
      "fixable": false,
      "effort": "large"
    },
    {
      "dimension": "architecture",
      "description": "electron/services/patchBatch.ts exceeds 1000 lines (1838)",
      "impact": 5,
      "fixable": false,
      "effort": "large"
    },
    {
      "dimension": "architecture",
      "description": "electron/services/analysis.ts exceeds 1000 lines (1482)",
      "impact": 5,
      "fixable": false,
      "effort": "large"
    },
    {
      "dimension": "architecture",
      "description": "src/index.css exceeds 1000 lines (1175)",
      "impact": 5,
      "fixable": false,
      "effort": "large"
    }
  ],
  "actionItems": [
    {
      "priority": 1,
      "title": "No test command found",
      "description": "No test command found",
      "dimension": "testing",
      "impact": 40,
      "effort": "medium",
      "automatable": true
    },
    {
      "priority": 2,
      "title": "No test files detected",
      "description": "No test files detected",
      "dimension": "testing",
      "impact": 30,
      "effort": "medium",
      "automatable": true
    },
    {
      "priority": 3,
      "title": "No linter configured",
      "description": "No linter configured",
      "dimension": "codeHealth",
      "impact": 10,
      "effort": "small",
      "automatable": true,
      "command": "npm init @eslint/config"
    },
    {
      "priority": 4,
      "title": "TODO/FIXME/HACK markers exceed 10 (54)",
      "description": "TODO/FIXME/HACK markers exceed 10 (54)",
      "dimension": "codeHealth",
      "impact": 10,
      "effort": "small",
      "automatable": false
    },
    {
      "priority": 5,
      "title": "TODO/FIXME/HACK markers exceed 30 (54)",
      "description": "TODO/FIXME/HACK markers exceed 30 (54)",
      "dimension": "codeHealth",
      "impact": 10,
      "effort": "medium",
      "automatable": false
    },
    {
      "priority": 6,
      "title": "repomix-output.md exceeds 1000 lines (43072)",
      "description": "repomix-output.md exceeds 1000 lines (43072)",
      "dimension": "architecture",
      "impact": 5,
      "effort": "large",
      "automatable": false
    },
    {
      "priority": 7,
      "title": "sandbox/fixtures/large-fixture.json exceeds 1000 lines (2003)",
      "description": "sandbox/fixtures/large-fixture.json exceeds 1000 lines (2003)",
      "dimension": "architecture",
      "impact": 5,
      "effort": "large",
      "automatable": false
    },
    {
      "priority": 8,
      "title": "electron/services/patchBatch.ts exceeds 1000 lines (1838)",
      "description": "electron/services/patchBatch.ts exceeds 1000 lines (1838)",
      "dimension": "architecture",
      "impact": 5,
      "effort": "large",
      "automatable": false
    },
    {
      "priority": 9,
      "title": "electron/services/analysis.ts exceeds 1000 lines (1482)",
      "description": "electron/services/analysis.ts exceeds 1000 lines (1482)",
      "dimension": "architecture",
      "impact": 5,
      "effort": "large",
      "automatable": false
    },
    {
      "priority": 10,
      "title": "src/index.css exceeds 1000 lines (1175)",
      "description": "src/index.css exceeds 1000 lines (1175)",
      "dimension": "architecture",
      "impact": 5,
      "effort": "large",
      "automatable": false
    },
    {
      "priority": 11,
      "title": "repomix-output.md exceeds 500 lines (43072)",
      "description": "repomix-output.md exceeds 500 lines (43072)",
      "dimension": "architecture",
      "impact": 3,
      "effort": "medium",
      "automatable": false
    },
    {
      "priority": 12,
      "title": "sandbox/fixtures/large-fixture.json exceeds 500 lines (2003)",
      "description": "sandbox/fixtures/large-fixture.json exceeds 500 lines (2003)",
      "dimension": "architecture",
      "impact": 3,
      "effort": "medium",
      "automatable": false
    },
    {
      "priority": 13,
      "title": "electron/services/patchBatch.ts exceeds 500 lines (1838)",
      "description": "electron/services/patchBatch.ts exceeds 500 lines (1838)",
      "dimension": "architecture",
      "impact": 3,
      "effort": "medium",
      "automatable": false
    },
    {
      "priority": 14,
      "title": "electron/services/analysis.ts exceeds 500 lines (1482)",
      "description": "electron/services/analysis.ts exceeds 500 lines (1482)",
      "dimension": "architecture",
      "impact": 3,
      "effort": "medium",
      "automatable": false
    },
    {
      "priority": 15,
      "title": "src/index.css exceeds 500 lines (1175)",
      "description": "src/index.css exceeds 500 lines (1175)",
      "dimension": "architecture",
      "impact": 3,
      "effort": "medium",
      "automatable": false
    }
  ]
}
````

## File: .claude/settings.local.json
````json
{
  "permissions": {
    "allow": [
      "Bash(npm install:*)",
      "Bash(npm run dev:*)",
      "Bash(npm run build:*)",
      "Bash(git status:*)"
    ]
  }
}
````

## File: bridge-mcp/src/core/bridgeConfig.ts
````typescript
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
````

## File: bridge-mcp/src/core/cache.ts
````typescript
import fs from "node:fs/promises";
import path from "node:path";

export const BRIDGE_DIR_NAME = ".bridge";
export const LATEST_SCAN_FILE = "latest-scan.json";
export const LATEST_SCORE_FILE = "latest-score.json";
export const LATEST_CONTEXT_FILE = "latest-context.json";

export function bridgeDir(repoPath: string): string {
  return path.join(repoPath, BRIDGE_DIR_NAME);
}

export function cachePath(repoPath: string, fileName: string): string {
  return path.join(bridgeDir(repoPath), fileName);
}

export async function ensureBridgeDir(repoPath: string): Promise<string> {
  const dir = bridgeDir(repoPath);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export async function writeJsonFile(target: string, payload: unknown): Promise<void> {
  await fs.writeFile(target, JSON.stringify(payload, null, 2) + "\n", "utf8");
}

export async function readJsonFile<T>(target: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(target, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function statMtime(target: string): Promise<number | null> {
  try {
    const stat = await fs.stat(target);
    return stat.mtimeMs;
  } catch {
    return null;
  }
}
````

## File: bridge-mcp/src/core/gateEvaluator.ts
````typescript
import type { BridgeConfig } from "./bridgeConfig.js";
import type { RepoAnalysis } from "./repoAnalyzer.js";

export interface GateResult {
  name: string;
  passed: boolean;
  message: string;
  severity: "error" | "warning" | "info";
  details?: Record<string, unknown>;
}

export function evaluateGates(config: BridgeConfig, analysis: RepoAnalysis): GateResult[] {
  const results: GateResult[] = [];

  const critical = analysis.vulnerabilities.critical;
  const high = analysis.vulnerabilities.high;

  if (config.dependencies.securityPolicy.blockOnCritical) {
    results.push({
      name: "security-critical",
      passed: critical === 0,
      message:
        critical === 0
          ? `No critical vulnerabilities detected (policy: blockOnCritical=${config.dependencies.securityPolicy.blockOnCritical}).`
          : `${critical} critical vulnerabilities found (policy: blockOnCritical=${config.dependencies.securityPolicy.blockOnCritical}).`,
      severity: critical === 0 ? "info" : "error",
      details: {
        critical,
        blockOnCritical: config.dependencies.securityPolicy.blockOnCritical,
      },
    });
  }

  if (config.dependencies.securityPolicy.blockOnHigh) {
    results.push({
      name: "security-high",
      passed: high === 0,
      message:
        high === 0
          ? `No high vulnerabilities detected (policy: blockOnHigh=${config.dependencies.securityPolicy.blockOnHigh}).`
          : `${high} high vulnerabilities found (policy: blockOnHigh=${config.dependencies.securityPolicy.blockOnHigh}).`,
      severity: high === 0 ? "info" : "error",
      details: {
        high,
        blockOnHigh: config.dependencies.securityPolicy.blockOnHigh,
      },
    });
  }

  const allowedCircular = config.gates.circularDependencies.maxAllowed;
  const failOnNewCircular = config.gates.circularDependencies.failOnNew;
  results.push({
    name: "circular-deps",
    passed: analysis.circularDeps <= allowedCircular,
    message:
      analysis.circularDeps <= allowedCircular
        ? `${analysis.circularDeps} circular dependencies - within policy limit of ${allowedCircular} (failOnNew=${failOnNewCircular}).`
        : `${analysis.circularDeps} circular dependencies - exceeds policy limit of ${allowedCircular} (failOnNew=${failOnNewCircular}).`,
    severity: analysis.circularDeps <= allowedCircular ? "info" : failOnNewCircular ? "error" : "warning",
    details: {
      circularDeps: analysis.circularDeps,
      maxAllowed: allowedCircular,
      failOnNew: failOnNewCircular,
    },
  });

  const installedPackages = new Set(
    [
      ...analysis.dependencyNames,
      ...analysis.outdated.map((pkg) => pkg.name),
    ].map((name) => name.toLowerCase()),
  );
  const banned = config.dependencies.bannedPackages.map((name) => name.toLowerCase());
  const foundBanned = banned.filter((name) => installedPackages.has(name));

  results.push({
    name: "banned-packages",
    passed: foundBanned.length === 0,
    message:
      foundBanned.length === 0
        ? "No banned packages detected."
        : `Banned packages detected: ${foundBanned.join(", ")}.`,
    severity: foundBanned.length === 0 ? "info" : "error",
    details: {
      bannedConfigured: config.dependencies.bannedPackages,
      bannedPresent: foundBanned,
    },
  });

  if (config.gates.tests.required) {
    const passed = Boolean(analysis.testCommand);
    results.push({
      name: "tests-exist",
      passed,
      message: passed
        ? `Test command configured: ${analysis.testCommand}.`
        : `No test command configured while tests gate is required (required=${config.gates.tests.required}).`,
      severity: passed ? "info" : "warning",
      details: {
        required: config.gates.tests.required,
        configuredCommand: analysis.testCommand,
      },
    });
  }

  if (config.gates.lint.required) {
    results.push({
      name: "lint-configured",
      passed: analysis.hasLinter,
      message: analysis.hasLinter
        ? "Lint script/config detected."
        : `No lint script/config detected while lint gate is required (required=${config.gates.lint.required}).`,
      severity: analysis.hasLinter ? "info" : "warning",
      details: {
        required: config.gates.lint.required,
      },
    });
  }

  return results;
}
````

## File: bridge-mcp/src/core/repoAnalyzer.ts
````typescript
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
````

## File: bridge-mcp/src/core/scorer.ts
````typescript
import semver from "semver";
import type { BridgeConfig } from "./bridgeConfig.js";
import type { OutdatedPackage, RepoAnalysis } from "./repoAnalyzer.js";

export interface DimensionScore {
  score: number;
  weight: number;
  weightedScore: number;
  findings: string[];
  metrics: Record<string, number | string>;
}

export interface DebtContributor {
  dimension: string;
  description: string;
  impact: number;
  fixable: boolean;
  effort: "trivial" | "small" | "medium" | "large";
}

export interface ActionItem {
  priority: number;
  title: string;
  description: string;
  dimension: string;
  impact: number;
  effort: "trivial" | "small" | "medium" | "large";
  automatable: boolean;
  command?: string;
}

export interface TechDebtScore {
  total: number;
  grade: "A" | "B" | "C" | "D" | "F";
  trend: "improving" | "stable" | "declining" | "unknown";
  dimensions: {
    dependencies: DimensionScore;
    security: DimensionScore;
    architecture: DimensionScore;
    testing: DimensionScore;
    documentation: DimensionScore;
    codeHealth: DimensionScore;
  };
  topContributors: DebtContributor[];
  actionItems: ActionItem[];
}

type DimensionKey = keyof TechDebtScore["dimensions"];

interface ContributionSeed {
  dimension: DimensionKey;
  description: string;
  impact: number;
  fixable: boolean;
  effort: "trivial" | "small" | "medium" | "large";
  automatable?: boolean;
  command?: string;
}

interface DimensionAccumulator {
  points: number;
  findings: string[];
  metrics: Record<string, number | string>;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function safeNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function gradeFromScore(score: number): "A" | "B" | "C" | "D" | "F" {
  if (score <= 15) return "A";
  if (score <= 30) return "B";
  if (score <= 50) return "C";
  if (score <= 70) return "D";
  return "F";
}

function makeAccumulator(): DimensionAccumulator {
  return { points: 0, findings: [], metrics: {} };
}

function addContribution(
  accumulator: DimensionAccumulator,
  contributions: ContributionSeed[],
  payload: ContributionSeed,
): void {
  if (payload.impact <= 0) return;
  accumulator.points += payload.impact;
  accumulator.findings.push(payload.description);
  contributions.push(payload);
}

function resolveWeights(config: BridgeConfig) {
  const defaults = {
    dependencies: 20,
    security: 25,
    architecture: 20,
    testing: 20,
    documentation: 5,
    codeHealth: 10,
  };

  return {
    dependencies: safeNumber(config.scoring?.weights?.dependencies, defaults.dependencies),
    security: safeNumber(config.scoring?.weights?.security, defaults.security),
    architecture: safeNumber(config.scoring?.weights?.architecture, defaults.architecture),
    testing: safeNumber(config.scoring?.weights?.testing, defaults.testing),
    documentation: safeNumber(config.scoring?.weights?.documentation, defaults.documentation),
    codeHealth: safeNumber(config.scoring?.weights?.codeHealth, defaults.codeHealth),
  };
}

function classifyOutdatedPackage(pkg: OutdatedPackage): "patch" | "minor" | "major" | "unknown" {
  if (pkg.updateType !== "unknown") {
    return pkg.updateType;
  }

  const current = semver.coerce(pkg.current);
  const latest = semver.coerce(pkg.latest);
  if (!current || !latest) {
    return "unknown";
  }

  const diff = semver.diff(current, latest);
  if (!diff) {
    return "unknown";
  }

  if (diff.includes("major")) return "major";
  if (diff.includes("minor")) return "minor";
  if (diff.includes("patch") || diff.includes("pre")) return "patch";
  return "unknown";
}

function dependencyDimension(
  analysis: RepoAnalysis,
  contributions: ContributionSeed[],
): DimensionAccumulator {
  const acc = makeAccumulator();

  let patchCount = 0;
  let minorCount = 0;
  let majorCount = 0;

  for (const dep of analysis.outdated) {
    const updateType = classifyOutdatedPackage(dep);

    if (updateType === "patch") {
      patchCount += 1;
      addContribution(acc, contributions, {
        dimension: "dependencies",
        description: `${dep.name} has a patch update pending`,
        impact: 1,
        fixable: true,
        effort: "trivial",
        automatable: true,
        command: "npx bridge-mcp",
      });
    } else if (updateType === "minor") {
      minorCount += 1;
      addContribution(acc, contributions, {
        dimension: "dependencies",
        description: `${dep.name} has a minor update pending`,
        impact: 2,
        fixable: true,
        effort: "trivial",
        automatable: true,
        command: "npx bridge-mcp",
      });
    } else if (updateType === "major") {
      majorCount += 1;
      addContribution(acc, contributions, {
        dimension: "dependencies",
        description: `${dep.name} has a major update pending`,
        impact: 5,
        fixable: true,
        effort: "medium",
      });
    }
  }

  acc.metrics.outdatedCount = analysis.outdated.length;
  acc.metrics.patchCount = patchCount;
  acc.metrics.minorCount = minorCount;
  acc.metrics.majorCount = majorCount;

  return acc;
}

function securityDimension(
  analysis: RepoAnalysis,
  contributions: ContributionSeed[],
): DimensionAccumulator {
  const acc = makeAccumulator();
  const vulnerabilities = analysis.vulnerabilities;

  if (vulnerabilities.critical > 0) {
    addContribution(acc, contributions, {
      dimension: "security",
      description: `${vulnerabilities.critical} critical vulnerabilities detected`,
      impact: vulnerabilities.critical * 20,
      fixable: true,
      effort: "small",
      automatable: true,
      command: "npm audit fix --force",
    });
  }

  if (vulnerabilities.high > 0) {
    addContribution(acc, contributions, {
      dimension: "security",
      description: `${vulnerabilities.high} high vulnerabilities detected`,
      impact: vulnerabilities.high * 10,
      fixable: true,
      effort: "small",
      automatable: true,
      command: "npm audit fix --force",
    });
  }

  if (vulnerabilities.medium > 0) {
    addContribution(acc, contributions, {
      dimension: "security",
      description: `${vulnerabilities.medium} medium vulnerabilities detected`,
      impact: vulnerabilities.medium * 3,
      fixable: true,
      effort: "small",
      automatable: true,
      command: "npm audit fix --force",
    });
  }

  if (vulnerabilities.low > 0) {
    addContribution(acc, contributions, {
      dimension: "security",
      description: `${vulnerabilities.low} low vulnerabilities detected`,
      impact: vulnerabilities.low,
      fixable: true,
      effort: "small",
      automatable: true,
      command: "npm audit fix --force",
    });
  }

  acc.metrics.critical = vulnerabilities.critical;
  acc.metrics.high = vulnerabilities.high;
  acc.metrics.medium = vulnerabilities.medium;
  acc.metrics.low = vulnerabilities.low;
  acc.metrics.total = vulnerabilities.total;

  return acc;
}

function architectureDimension(
  analysis: RepoAnalysis,
  contributions: ContributionSeed[],
): DimensionAccumulator {
  const acc = makeAccumulator();

  if (analysis.circularDeps > 0) {
    addContribution(acc, contributions, {
      dimension: "architecture",
      description: `${analysis.circularDeps} circular dependency cycles detected`,
      impact: analysis.circularDeps * 8,
      fixable: true,
      effort: "medium",
    });
  }

  let oversized500 = 0;
  let oversized1000 = 0;

  for (const file of analysis.fileStats.largestFiles) {
    if (file.lines > 500) {
      oversized500 += 1;
      addContribution(acc, contributions, {
        dimension: "architecture",
        description: `${file.path} exceeds 500 lines (${file.lines})`,
        impact: 3,
        fixable: false,
        effort: "medium",
      });
    }

    if (file.lines > 1000) {
      oversized1000 += 1;
      addContribution(acc, contributions, {
        dimension: "architecture",
        description: `${file.path} exceeds 1000 lines (${file.lines})`,
        impact: 5,
        fixable: false,
        effort: "large",
      });
    }
  }

  acc.metrics.circularDeps = analysis.circularDeps;
  acc.metrics.filesOver500 = oversized500;
  acc.metrics.filesOver1000 = oversized1000;

  return acc;
}

function testingDimension(
  analysis: RepoAnalysis,
  contributions: ContributionSeed[],
): DimensionAccumulator {
  const acc = makeAccumulator();

  if (!analysis.testCommand) {
    addContribution(acc, contributions, {
      dimension: "testing",
      description: "No test command found",
      impact: 40,
      fixable: true,
      effort: "medium",
    });
  }

  if (!analysis.hasTestFiles) {
    addContribution(acc, contributions, {
      dimension: "testing",
      description: "No test files detected",
      impact: 30,
      fixable: true,
      effort: "medium",
    });
  }

  if (analysis.hasTests && !analysis.hasCoverageData) {
    addContribution(acc, contributions, {
      dimension: "testing",
      description: "Coverage data not found",
      impact: 15,
      fixable: true,
      effort: "small",
    });
  }

  acc.metrics.hasTests = analysis.hasTests ? 1 : 0;
  acc.metrics.hasTestFiles = analysis.hasTestFiles ? 1 : 0;
  acc.metrics.hasCoverageData = analysis.hasCoverageData ? 1 : 0;

  return acc;
}

function documentationDimension(
  analysis: RepoAnalysis,
  contributions: ContributionSeed[],
): DimensionAccumulator {
  const acc = makeAccumulator();

  if (!analysis.readmeExists) {
    addContribution(acc, contributions, {
      dimension: "documentation",
      description: "README is missing",
      impact: 30,
      fixable: true,
      effort: "trivial",
    });
  } else if (analysis.readmeWordCount < 100) {
    addContribution(acc, contributions, {
      dimension: "documentation",
      description: `README is short (${analysis.readmeWordCount} words)`,
      impact: 15,
      fixable: true,
      effort: "trivial",
    });
  }

  acc.metrics.readmeExists = analysis.readmeExists ? 1 : 0;
  acc.metrics.readmeWordCount = analysis.readmeWordCount;

  return acc;
}

function codeHealthDimension(
  analysis: RepoAnalysis,
  contributions: ContributionSeed[],
): DimensionAccumulator {
  const acc = makeAccumulator();

  if (analysis.todoCount > 10) {
    addContribution(acc, contributions, {
      dimension: "codeHealth",
      description: `TODO/FIXME/HACK markers exceed 10 (${analysis.todoCount})`,
      impact: 10,
      fixable: false,
      effort: "small",
    });
  }

  if (analysis.todoCount > 30) {
    addContribution(acc, contributions, {
      dimension: "codeHealth",
      description: `TODO/FIXME/HACK markers exceed 30 (${analysis.todoCount})`,
      impact: 10,
      fixable: false,
      effort: "medium",
    });
  }

  if (!analysis.hasLinter) {
    addContribution(acc, contributions, {
      dimension: "codeHealth",
      description: "No linter configured",
      impact: 10,
      fixable: true,
      effort: "small",
      automatable: true,
      command: "npm init @eslint/config",
    });
  }

  acc.metrics.todoCount = analysis.todoCount;
  acc.metrics.hasLinter = analysis.hasLinter ? 1 : 0;

  return acc;
}

function buildDimensionScore(
  accumulator: DimensionAccumulator,
  weight: number,
): DimensionScore {
  const score = clamp(accumulator.points, 0, 100);
  const weightedScore = (score * weight) / 100;

  return {
    score,
    weight,
    weightedScore,
    findings: accumulator.findings,
    metrics: accumulator.metrics,
  };
}

function effortRank(value: ActionItem["effort"]): number {
  if (value === "trivial") return 1;
  if (value === "small") return 2;
  if (value === "medium") return 3;
  return 4;
}

function toActionItems(contributors: DebtContributor[]): ActionItem[] {
  const itemSeeds: Array<ActionItem & { rank: number }> = contributors
    .map((contributor) => {
      const title = contributor.description.length > 72
        ? `${contributor.description.slice(0, 69)}...`
        : contributor.description;

      const automatable = contributor.fixable;
      let command: string | undefined;

      if (contributor.dimension === "security" && automatable) {
        command = "npm audit fix --force";
      } else if (contributor.dimension === "dependencies" && automatable) {
        command = "npx bridge-mcp";
      } else if (contributor.description.toLowerCase().includes("linter")) {
        command = "npm init @eslint/config";
      }

      return {
        priority: 0,
        title,
        description: contributor.description,
        dimension: contributor.dimension,
        impact: contributor.impact,
        effort: contributor.effort,
        automatable,
        command,
        rank: contributor.impact / effortRank(contributor.effort),
      };
    })
    .sort((a, b) => {
      if (a.automatable !== b.automatable) {
        return a.automatable ? -1 : 1;
      }
      return b.rank - a.rank;
    })
    .slice(0, 15);

  return itemSeeds.map((item, index) => {
    const { rank, ...actionItem } = item;
    return {
      ...actionItem,
      priority: index + 1,
    };
  });
}

export function calculateScore(analysis: RepoAnalysis, config: BridgeConfig): TechDebtScore {
  const weights = resolveWeights(config);
  const totalWeight = Object.values(weights).reduce((sum, value) => sum + value, 0) || 100;

  const contributions: ContributionSeed[] = [];

  const dependenciesAcc = dependencyDimension(analysis, contributions);
  const securityAcc = securityDimension(analysis, contributions);
  const architectureAcc = architectureDimension(analysis, contributions);
  const testingAcc = testingDimension(analysis, contributions);
  const documentationAcc = documentationDimension(analysis, contributions);
  const codeHealthAcc = codeHealthDimension(analysis, contributions);

  const dimensions = {
    dependencies: buildDimensionScore(dependenciesAcc, (weights.dependencies / totalWeight) * 100),
    security: buildDimensionScore(securityAcc, (weights.security / totalWeight) * 100),
    architecture: buildDimensionScore(architectureAcc, (weights.architecture / totalWeight) * 100),
    testing: buildDimensionScore(testingAcc, (weights.testing / totalWeight) * 100),
    documentation: buildDimensionScore(documentationAcc, (weights.documentation / totalWeight) * 100),
    codeHealth: buildDimensionScore(codeHealthAcc, (weights.codeHealth / totalWeight) * 100),
  };

  const total = clamp(
    Object.values(dimensions).reduce((sum, dimension) => sum + dimension.weightedScore, 0),
    0,
    100,
  );

  const contributors: DebtContributor[] = contributions
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 50)
    .map((seed) => ({
      dimension: seed.dimension,
      description: seed.description,
      impact: seed.impact,
      fixable: seed.fixable,
      effort: seed.effort,
    }));

  const topContributors = contributors.slice(0, 10);
  const actionItems = toActionItems(contributors);

  return {
    total: Number(total.toFixed(1)),
    grade: gradeFromScore(total),
    trend: "unknown",
    dimensions,
    topContributors,
    actionItems,
  };
}
````

## File: bridge-mcp/src/resources/conventions.ts
````typescript
import path from "node:path";
import { loadBridgeConfig } from "../core/bridgeConfig.js";

export interface ConventionsResourcePayload {
  repo_path: string;
  context: string;
  conventions: string[];
  avoid_patterns: string[];
  preferred_libraries: Record<string, string>;
  review_checklist: string[];
}

function resolveRepoPathFromUri(uri: URL): string {
  const fromQuery = uri.searchParams.get("repo_path");
  return fromQuery ? path.resolve(fromQuery) : process.cwd();
}

export async function readConventionsResource(uri: URL): Promise<ConventionsResourcePayload> {
  const repoPath = resolveRepoPathFromUri(uri);
  const config = await loadBridgeConfig(repoPath);

  return {
    repo_path: repoPath,
    context: config.agent.context,
    conventions: config.agent.conventions,
    avoid_patterns: config.agent.avoidPatterns,
    preferred_libraries: config.agent.preferredLibraries,
    review_checklist: config.agent.reviewChecklist,
  };
}
````

## File: bridge-mcp/src/resources/score.ts
````typescript
import path from "node:path";
import { LATEST_SCORE_FILE, cachePath, readJsonFile } from "../core/cache.js";
import type { TechDebtScore } from "../core/scorer.js";

export interface ScoreResourcePayload {
  repo_path: string;
  score: TechDebtScore | null;
  message?: string;
}

function resolveRepoPathFromUri(uri: URL): string {
  const fromQuery = uri.searchParams.get("repo_path");
  return fromQuery ? path.resolve(fromQuery) : process.cwd();
}

export async function readScoreResource(uri: URL): Promise<ScoreResourcePayload> {
  const repoPath = resolveRepoPathFromUri(uri);
  const scorePath = cachePath(repoPath, LATEST_SCORE_FILE);
  const score = await readJsonFile<TechDebtScore>(scorePath);

  if (!score) {
    return {
      repo_path: repoPath,
      score: null,
      message: "No cached score found. Run bridge_scan or bridge_get_context first.",
    };
  }

  return {
    repo_path: repoPath,
    score,
  };
}
````

## File: bridge-mcp/src/tools/checkGates.ts
````typescript
import fs from "node:fs/promises";
import path from "node:path";
import { loadBridgeConfig } from "../core/bridgeConfig.js";
import { evaluateGates, type GateResult } from "../core/gateEvaluator.js";
import { analyzeRepo } from "../core/repoAnalyzer.js";

export interface BridgeCheckGatesResult {
  repoPath: string;
  passing: boolean;
  results: GateResult[];
  checkedAt: string;
}

async function verifyRepoPath(repoPath: string): Promise<string> {
  const resolved = path.resolve(repoPath);
  const stat = await fs.stat(resolved);
  if (!stat.isDirectory()) {
    throw new Error(`repo_path is not a directory: ${resolved}`);
  }
  return resolved;
}

export async function runBridgeCheckGates(repoPathInput: string): Promise<BridgeCheckGatesResult> {
  const repoPath = await verifyRepoPath(repoPathInput);
  const config = await loadBridgeConfig(repoPath);
  const analysis = await analyzeRepo(repoPath);
  const results = evaluateGates(config, analysis);

  return {
    repoPath,
    passing: results.every((result) => result.passed),
    results,
    checkedAt: new Date().toISOString(),
  };
}
````

## File: bridge-mcp/src/tools/checkPackage.ts
````typescript
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
````

## File: bridge-mcp/src/tools/getContext.ts
````typescript
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
````

## File: bridge-mcp/src/tools/init.ts
````typescript
import fs from "node:fs/promises";
import path from "node:path";
import {
  BRIDGE_CONFIG_FILE,
  generateDefaultConfig,
  hasBridgeConfig,
  writeBridgeConfig,
} from "../core/bridgeConfig.js";
import { BRIDGE_DIR_NAME, ensureBridgeDir } from "../core/cache.js";

export interface BridgeInitResult {
  repoPath: string;
  hadConfig: boolean;
  configPath: string;
  bridgeDir: string;
  detected: {
    name: string;
    description?: string;
    primaryLanguage: string;
    packageManager?: string;
    monorepo?: boolean;
    testCommand?: string;
    lintCommand?: string;
    buildCommand?: string;
  };
}

async function verifyRepoPath(repoPath: string): Promise<string> {
  const resolved = path.resolve(repoPath);
  const stat = await fs.stat(resolved);
  if (!stat.isDirectory()) {
    throw new Error(`repo_path is not a directory: ${resolved}`);
  }
  return resolved;
}

export async function runBridgeInit(repoPathInput: string): Promise<BridgeInitResult> {
  const repoPath = await verifyRepoPath(repoPathInput);
  const hadConfig = await hasBridgeConfig(repoPath);

  const config = await generateDefaultConfig(repoPath);
  await writeBridgeConfig(repoPath, config);

  await ensureBridgeDir(repoPath);

  return {
    repoPath,
    hadConfig,
    configPath: path.join(repoPath, BRIDGE_CONFIG_FILE),
    bridgeDir: path.join(repoPath, BRIDGE_DIR_NAME),
    detected: {
      name: config.project.name,
      description: config.project.description,
      primaryLanguage: config.project.primaryLanguage,
      packageManager: config.project.packageManager,
      monorepo: config.project.monorepo,
      testCommand: config.gates.tests.command,
      lintCommand: config.gates.lint.command,
      buildCommand: config.gates.build.command,
    },
  };
}
````

## File: bridge-mcp/src/tools/scan.ts
````typescript
import fs from "node:fs/promises";
import path from "node:path";
import { loadBridgeConfig } from "../core/bridgeConfig.js";
import { analyzeRepo, type RepoAnalysis } from "../core/repoAnalyzer.js";
import { calculateScore, type TechDebtScore } from "../core/scorer.js";
import {
  LATEST_CONTEXT_FILE,
  LATEST_SCAN_FILE,
  LATEST_SCORE_FILE,
  cachePath,
  ensureBridgeDir,
  writeJsonFile,
} from "../core/cache.js";
import { runBridgeGetContext, type BridgeContextPayload } from "./getContext.js";

export interface BridgeScanResult {
  repoPath: string;
  scanPath: string;
  scorePath: string;
  contextPath: string;
  analysis: RepoAnalysis;
  score: TechDebtScore;
  context: BridgeContextPayload;
  scannedAt: string;
}

async function verifyRepoPath(repoPath: string): Promise<string> {
  const resolved = path.resolve(repoPath);
  const stat = await fs.stat(resolved);
  if (!stat.isDirectory()) {
    throw new Error(`repo_path is not a directory: ${resolved}`);
  }
  return resolved;
}

export async function runBridgeScan(repoPathInput: string): Promise<BridgeScanResult> {
  const repoPath = await verifyRepoPath(repoPathInput);
  const config = await loadBridgeConfig(repoPath);
  const analysis = await analyzeRepo(repoPath);
  const score = calculateScore(analysis, config);

  await ensureBridgeDir(repoPath);

  const scanPath = cachePath(repoPath, LATEST_SCAN_FILE);
  const scorePath = cachePath(repoPath, LATEST_SCORE_FILE);
  const contextPath = cachePath(repoPath, LATEST_CONTEXT_FILE);

  await writeJsonFile(scanPath, analysis);
  await writeJsonFile(scorePath, score);
  const context = await runBridgeGetContext(repoPath);

  return {
    repoPath,
    scanPath,
    scorePath,
    contextPath,
    analysis,
    score,
    context,
    scannedAt: new Date().toISOString(),
  };
}
````

## File: bridge-mcp/src/tools/updateDeps.ts
````typescript
import path from "node:path";
import { loadBridgeConfig } from "../core/bridgeConfig.js";
import { analyzeRepo } from "../core/repoAnalyzer.js";

export interface UpdateDepsResult {
  repo_path: string;
  dry_run: boolean;
  policy: { patch: string; minor: string; major: string };
  would_update: { name: string; current: string; latest: string; type: string }[];
  would_skip: { name: string; reason: string; current: string; latest: string }[];
  pinned: { name: string; pinned_version: string }[];
  total_updatable: number;
  recommendation: string;
}

export async function runBridgeUpdateDeps(repoPathInput: string): Promise<UpdateDepsResult> {
  const repoPath = path.resolve(repoPathInput);
  const config = await loadBridgeConfig(repoPath);
  const analysis = await analyzeRepo(repoPath);

  const policy = config.dependencies.updatePolicy;
  const pinnedPackages = config.dependencies.pinnedPackages || {};

  const wouldUpdate: UpdateDepsResult["would_update"] = [];
  const wouldSkip: UpdateDepsResult["would_skip"] = [];
  const pinned: UpdateDepsResult["pinned"] = [];

  for (const outdated of analysis.outdated) {
    const pin = pinnedPackages[outdated.name];
    if (pin) {
      pinned.push({ name: outdated.name, pinned_version: pin });
      wouldSkip.push({
        name: outdated.name,
        reason: `Pinned to ${pin} in .bridge.json`,
        current: outdated.current,
        latest: outdated.latest,
      });
      continue;
    }

    if (outdated.updateType === "patch") {
      if (policy.patch === "ignore") {
        wouldSkip.push({
          name: outdated.name,
          reason: "Patch updates are ignored by policy",
          current: outdated.current,
          latest: outdated.latest,
        });
      } else if (policy.patch === "review") {
        wouldSkip.push({
          name: outdated.name,
          reason: "Patch update requires review by policy",
          current: outdated.current,
          latest: outdated.latest,
        });
      } else {
        wouldUpdate.push({
          name: outdated.name,
          current: outdated.current,
          latest: outdated.latest,
          type: outdated.updateType,
        });
      }
      continue;
    }

    if (outdated.updateType === "minor") {
      if (policy.minor === "ignore") {
        wouldSkip.push({
          name: outdated.name,
          reason: "Minor updates are ignored by policy",
          current: outdated.current,
          latest: outdated.latest,
        });
      } else if (policy.minor === "review") {
        wouldSkip.push({
          name: outdated.name,
          reason: "Minor update requires review by policy",
          current: outdated.current,
          latest: outdated.latest,
        });
      } else {
        wouldUpdate.push({
          name: outdated.name,
          current: outdated.current,
          latest: outdated.latest,
          type: outdated.updateType,
        });
      }
      continue;
    }

    if (outdated.updateType === "major") {
      if (policy.major === "ignore") {
        wouldSkip.push({
          name: outdated.name,
          reason: "Major updates are ignored by policy",
          current: outdated.current,
          latest: outdated.latest,
        });
      } else {
        wouldSkip.push({
          name: outdated.name,
          reason: "Major updates require review by policy",
          current: outdated.current,
          latest: outdated.latest,
        });
      }
      continue;
    }

    wouldSkip.push({
      name: outdated.name,
      reason: "Unable to classify update type",
      current: outdated.current,
      latest: outdated.latest,
    });
  }

  // TODO: wire this tool to invoke PatchBatch execution paths after shared core extraction.
  const recommendation =
    wouldUpdate.length > 0
      ? `Dry-run identified ${wouldUpdate.length} dependency updates allowed by policy.`
      : "No policy-approved dependency updates found in dry-run.";

  return {
    repo_path: repoPath,
    dry_run: true,
    policy: {
      patch: policy.patch,
      minor: policy.minor,
      major: policy.major,
    },
    would_update: wouldUpdate,
    would_skip: wouldSkip,
    pinned,
    total_updatable: wouldUpdate.length,
    recommendation,
  };
}
````

## File: bridge-mcp/src/index.ts
````typescript
#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { runBridgeGetContext } from "./tools/getContext.js";
import { runBridgeInit } from "./tools/init.js";
import { runBridgeCheckGates } from "./tools/checkGates.js";
import { runBridgeScan } from "./tools/scan.js";
import { runBridgeCheckPackage } from "./tools/checkPackage.js";
import { runBridgeUpdateDeps } from "./tools/updateDeps.js";
import { readConventionsResource } from "./resources/conventions.js";
import { readScoreResource } from "./resources/score.js";

function jsonContent(payload: unknown) {
  return [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }];
}

function toolErrorPayload(message: string, details?: unknown) {
  return {
    isError: true,
    content: jsonContent({
      error: message,
      details,
    }),
  };
}

const repoPathSchema = z.object({
  repo_path: z.string().min(1),
});

const getContextInputSchema = repoPathSchema.extend({
  focus: z.string().optional(),
});

const server = new McpServer({
  name: "bridge-mcp",
  version: "0.1.0",
});

server.registerTool(
  "bridge_get_context",
  {
    title: "Get Bridge Context",
    description:
      "Load repo-level debt intelligence before coding. Returns score, critical issues, gates, conventions, and prioritized actions. Uses 24h cached analysis when available.",
    inputSchema: getContextInputSchema,
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
    },
  },
  async (args) => {
    try {
      const payload = await runBridgeGetContext(args.repo_path, args.focus);
      return { content: jsonContent(payload) };
    } catch (error) {
      console.error("bridge_get_context failed", error);
      return toolErrorPayload("bridge_get_context failed", String(error));
    }
  },
);

server.registerTool(
  "bridge_init",
  {
    title: "Initialize Bridge Config",
    description:
      "Generate and write a useful .bridge.json based on project autodetection, and create .bridge cache directory.",
    inputSchema: repoPathSchema,
  },
  async (args) => {
    try {
      const payload = await runBridgeInit(args.repo_path);
      return { content: jsonContent(payload) };
    } catch (error) {
      console.error("bridge_init failed", error);
      return toolErrorPayload("bridge_init failed", String(error));
    }
  },
);

server.registerTool(
  "bridge_check_gates",
  {
    title: "Check Quality Gates",
    description:
      "Analyze repository state and evaluate Bridge quality/security gates to determine whether changes are safe to merge.",
    inputSchema: repoPathSchema,
  },
  async (args) => {
    try {
      const payload = await runBridgeCheckGates(args.repo_path);
      return { content: jsonContent(payload) };
    } catch (error) {
      console.error("bridge_check_gates failed", error);
      return toolErrorPayload("bridge_check_gates failed", String(error));
    }
  },
);

server.registerTool(
  "bridge_scan",
  {
    title: "Run Bridge Scan",
    description:
      "Run full lightweight analysis for dependencies, vulnerabilities, architecture and testing; compute debt score and write .bridge cache artifacts.",
    inputSchema: repoPathSchema,
  },
  async (args) => {
    try {
      const payload = await runBridgeScan(args.repo_path);
      return { content: jsonContent(payload) };
    } catch (error) {
      console.error("bridge_scan failed", error);
      return toolErrorPayload("bridge_scan failed", String(error));
    }
  },
);

server.registerTool(
  "bridge_check_package",
  {
    title: "Check Package Before Installing",
    description:
      "Check whether a specific npm package is allowed in this repository BEFORE adding it as a dependency. Returns ban status, preferred alternatives, deprecation warnings, and a recommendation. Call this before running npm install for any new package.",
    inputSchema: z.object({
      repo_path: z.string().min(1).describe("Absolute path to the repository root"),
      package_name: z.string().min(1).describe("Name of the npm package to check"),
      version: z.string().optional().describe("Specific version to check (defaults to latest)"),
    }),
    annotations: {
      title: "Bridge: Check Package",
      readOnlyHint: true,
      openWorldHint: true,
    },
  },
  async (args) => {
    try {
      const payload = await runBridgeCheckPackage(args.repo_path, args.package_name, args.version);
      return { content: jsonContent(payload) };
    } catch (error) {
      console.error("bridge_check_package failed", error);
      return toolErrorPayload("bridge_check_package failed", String(error));
    }
  },
);

server.registerTool(
  "bridge_update_deps",
  {
    title: "Plan Dependency Updates (Dry Run)",
    description:
      "Dry-run dependency update plan based on .bridge.json policy. Reports what would be updated, skipped, or pinned without executing changes.",
    inputSchema: repoPathSchema,
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
    },
  },
  async (args) => {
    try {
      const payload = await runBridgeUpdateDeps(args.repo_path);
      return { content: jsonContent(payload) };
    } catch (error) {
      console.error("bridge_update_deps failed", error);
      return toolErrorPayload("bridge_update_deps failed", String(error));
    }
  },
);

server.registerResource(
  "bridge-conventions",
  "bridge://conventions",
  {
    title: "Bridge Agent Conventions",
    description:
      "Project conventions, avoid patterns, and preferred libraries from .bridge.json. Optional repo_path query parameter is supported.",
    mimeType: "application/json",
  },
  async (uri) => {
    try {
      const payload = await readConventionsResource(uri);
      return {
        contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(payload, null, 2) }],
      };
    } catch (error) {
      console.error("bridge://conventions read failed", error);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify({ error: "Failed to read bridge://conventions", details: String(error) }, null, 2),
          },
        ],
      };
    }
  },
);

server.registerResource(
  "bridge-conventions-by-repo",
  new ResourceTemplate("bridge://conventions{?repo_path}", { list: undefined }),
  {
    title: "Bridge Agent Conventions (Scoped)",
    description:
      "Project conventions scoped to a specific repo path using bridge://conventions?repo_path=/abs/path.",
    mimeType: "application/json",
  },
  async (uri) => {
    try {
      const payload = await readConventionsResource(uri);
      return {
        contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(payload, null, 2) }],
      };
    } catch (error) {
      console.error("bridge://conventions template read failed", error);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify({ error: "Failed to read bridge://conventions template", details: String(error) }, null, 2),
          },
        ],
      };
    }
  },
);

server.registerResource(
  "bridge-score",
  "bridge://score",
  {
    title: "Bridge Cached Score",
    description:
      "Latest cached TechDebtScore from .bridge/latest-score.json. Optional repo_path query parameter is supported.",
    mimeType: "application/json",
  },
  async (uri) => {
    try {
      const payload = await readScoreResource(uri);
      return {
        contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(payload, null, 2) }],
      };
    } catch (error) {
      console.error("bridge://score read failed", error);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify({ error: "Failed to read bridge://score", details: String(error) }, null, 2),
          },
        ],
      };
    }
  },
);

server.registerResource(
  "bridge-score-by-repo",
  new ResourceTemplate("bridge://score{?repo_path}", { list: undefined }),
  {
    title: "Bridge Cached Score (Scoped)",
    description: "Cached score scoped to a specific repo path using bridge://score?repo_path=/abs/path.",
    mimeType: "application/json",
  },
  async (uri) => {
    try {
      const payload = await readScoreResource(uri);
      return {
        contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(payload, null, 2) }],
      };
    } catch (error) {
      console.error("bridge://score template read failed", error);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify({ error: "Failed to read bridge://score template", details: String(error) }, null, 2),
          },
        ],
      };
    }
  },
);

async function main(): Promise<void> {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Bridge MCP server connected over stdio");
  } catch (error) {
    console.error("Bridge MCP server failed to start", error);
    process.exit(1);
  }
}

void main();
````

## File: bridge-mcp/.mcp.json
````json
{
  "mcpServers": {
    "bridge": {
      "command": "node",
      "args": ["/Users/connormccoy/Desktop/bridge-desktop/bridge-mcp/build/index.js"]
    }
  }
}
````

## File: bridge-mcp/package.json
````json
{
  "name": "bridge-mcp",
  "version": "0.1.0",
  "description": "Bridge MCP server — tech debt intelligence for AI coding agents",
  "type": "module",
  "bin": {
    "bridge-mcp": "./build/index.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node build/index.js",
    "dev": "npx tsx src/index.ts"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.12.0",
    "zod": "^3.24.0",
    "semver": "^7.5.4"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/semver": "^7.5.6",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  }
}
````

## File: bridge-mcp/README.md
````markdown
# Bridge MCP

Bridge MCP is a standalone [Model Context Protocol](https://modelcontextprotocol.io/) server that gives coding agents repo health and tech debt intelligence before they write code.

It is designed for fast pre-task context and post-change validation:
- Pre-task: `bridge_get_context`
- Validation: `bridge_check_gates`
- Full refresh: `bridge_scan`
- Bootstrap: `bridge_init`
- Package policy check: `bridge_check_package`
- Dependency policy dry-run: `bridge_update_deps`

## Features

- Standalone Node.js package (`node build/index.js`)
- Stdio MCP transport for Claude Code/Cursor
- `.bridge.json` project config loader + generator
- Lightweight analyzer (dependency drift, vulnerabilities, file stats, TODO debt, circular deps, language profile)
- Weighted tech debt score with grade and prioritized actions
- Quality gate evaluation for security and repo policy checks
- Cache artifacts under `.bridge/` for fast context responses

## Installation

```bash
cd bridge-mcp
npm install
npm run build
```

Run directly:

```bash
node build/index.js
```

## Claude Code MCP Config Example

Use `bridge-mcp/.mcp.json` as a template and replace path as needed.

```json
{
  "mcpServers": {
    "bridge": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/bridge-mcp/build/index.js"]
    }
  }
}
```

## Tools

### `bridge_get_context`
Input:
```json
{ "repo_path": "/path/to/repo", "focus": "security" }
```

Returns condensed repo context:
- debt score and grade
- critical issues
- top recommended actions
- conventions and avoid patterns
- outdated summary
- gate pass/fail snapshot

Behavior:
- Uses `.bridge/latest-scan.json` cache when fresh (< 24h)
- Falls back to live analysis when cache is missing/stale
- Writes `.bridge/latest-context.json`, `.bridge/latest-score.json`

### `bridge_init`
Input:
```json
{ "repo_path": "/path/to/repo" }
```

Generates `.bridge.json` with autodetected defaults and creates `.bridge/`.

### `bridge_check_gates`
Input:
```json
{ "repo_path": "/path/to/repo" }
```

Runs analysis and evaluates configured gates.

### `bridge_scan`
Input:
```json
{ "repo_path": "/path/to/repo" }
```

Runs analysis and writes:
- `.bridge/latest-scan.json`
- `.bridge/latest-score.json`

### `bridge_check_package`
Input:
```json
{ "repo_path": "/path/to/repo", "package_name": "moment" }
```

Checks package policy before install:
- banned package enforcement
- preferred-library alternative guidance
- npm deprecation metadata warnings
- install recommendation

### `bridge_update_deps`
Input:
```json
{ "repo_path": "/path/to/repo" }
```

Dry-run dependency policy plan:
- what would update automatically
- what would be skipped by policy
- what is pinned in `.bridge.json`
- recommendation summary

## Resources

### `bridge://conventions`
Returns `agent` conventions from `.bridge.json`.

Optional query param:
- `repo_path=/absolute/path`

### `bridge://score`
Returns cached score from `.bridge/latest-score.json`.

Optional query param:
- `repo_path=/absolute/path`

## Cache Files

Bridge writes cache under `<repo>/.bridge/`:
- `latest-scan.json`
- `latest-score.json`
- `latest-context.json`

## Development

```bash
cd bridge-mcp
npm run dev
```

## Notes

- MCP JSON-RPC uses stdout. Bridge MCP logs only to stderr.
- Analyzer commands are time-limited and degrade gracefully when tools are missing.
````

## File: bridge-mcp/tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./build",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
````

## File: electron/services/bridgeConfig.ts
````typescript
// Single source of truth lives in bridge-mcp core.
// TODO: move bridge-mcp core into a shared package to avoid cross-project source imports.
export {
  type BridgePrimaryLanguage,
  type BridgePackageManager,
  type BridgeConfig,
  type BridgeConfigValidationResult,
  BRIDGE_CONFIG_FILE,
  DEFAULT_BRIDGE_CONFIG,
  loadBridgeConfig,
  generateDefaultConfig,
  writeBridgeConfig,
  validateConfig,
  hasBridgeConfig,
} from "../../bridge-mcp/src/core/bridgeConfig.js";
````

## File: electron/services/cli.ts
````typescript
import fs from 'fs/promises'
import path from 'path'
import { runFullScan } from './analysis'
import { loadBridgeConfig } from './bridgeConfig'
import { generateScanReport } from './scanReport'

export async function runScanCommand(repoPath: string, options: {
  format: 'json' | 'human' | 'agent'
  output?: string
  gates?: boolean
  quiet?: boolean
}) {
  const resolvedRepoPath = path.resolve(repoPath)
  const config = await loadBridgeConfig(resolvedRepoPath)
  const fullScan = await runFullScan(resolvedRepoPath, { skipConsoleUpload: false })

  if (!fullScan.scanReport) {
    throw new Error('Scan report was not generated by runFullScan().')
  }

  const report = fullScan.scanReport || await generateScanReport(
    resolvedRepoPath,
    config,
    fullScan,
    fullScan.techDebtScore,
    {
      patternFindings: fullScan.securityPatterns,
      oversizedFiles: fullScan.oversizedFiles
    }
  )

  if (options.gates && !report.gates.passed) {
    const fatalGates = report.gates.results.filter(result => !result.passed && result.severity === 'error')
    if (fatalGates.length > 0) {
      throw new Error(`Gates failed: ${fatalGates.map(g => g.name).join(', ')}`)
    }
  }

  let rendered = ''

  if (options.format === 'json') {
    rendered = JSON.stringify(report, null, 2)
  } else if (options.format === 'agent') {
    rendered = JSON.stringify({
      debt_score: report.techDebt.total,
      grade: report.techDebt.grade,
      critical: report.agentDigest.critical,
      top_actions: report.agentDigest.actions.slice(0, 5).map(item => ({
        title: item.title,
        impact: item.impact,
        effort: item.effort,
        command: item.command
      })),
      policies: report.agentDigest.policies,
      conventions: report.agentDigest.conventions,
      outdated_summary: report.agentDigest.outdated_summary
    }, null, 2)
  } else {
    rendered = [
      `Bridge Scan Report: ${report.repository.name}`,
      `Debt Score: ${report.techDebt.total} (${report.techDebt.grade}, ${report.techDebt.trend})`,
      `Critical Issues: ${report.agentDigest.critical.join(' | ')}`,
      `Top Actions:`,
      ...report.agentDigest.actions.slice(0, 5).map(item => `- [${item.dimension}] ${item.title} (impact ${item.impact}, effort ${item.effort})`),
      `Gates: ${report.gates.passed ? 'PASS' : 'FAIL'}`
    ].join('\n')
  }

  if (!options.quiet) {
    console.log(rendered)
  }

  if (options.output) {
    const outputPath = path.resolve(options.output)
    await fs.mkdir(path.dirname(outputPath), { recursive: true })
    await fs.writeFile(outputPath, rendered + '\n', 'utf-8')
  }

  return report
}
````

## File: electron/services/gateEvaluator.ts
````typescript
import type { BridgeConfig } from './bridgeConfig'
import type { BridgeScanReport } from './scanReport'
import { evaluateGates as evaluateCoreGates, type GateResult } from '../../bridge-mcp/src/core/gateEvaluator.js'
import type { RepoAnalysis } from '../../bridge-mcp/src/core/repoAnalyzer.js'

export type { GateResult }

function toRepoAnalysis(config: BridgeConfig, scanData: Partial<BridgeScanReport>): RepoAnalysis {
  const vulnerabilities = scanData.security?.vulnerabilities || scanData.dependencies?.vulnerabilities || {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    total: 0
  }

  const outdated = scanData.dependencies?.outdated || []
  const dependencyNames = scanData.dependencies?.installedPackages || outdated.map(dep => dep.name)

  const hasCoverage = typeof scanData.testing?.coverage?.coveragePercentage === 'number'

  const codeHealthMetrics = scanData.techDebt?.dimensions?.codeHealth?.metrics || {}
  const todoMetric = Number(codeHealthMetrics.todoCount || 0)
  const hasLinterMetric = Number(codeHealthMetrics.hasLinter || 0)

  return {
    outdated,
    vulnerabilities,
    fileStats: {
      totalFiles: 0,
      totalLines: 0,
      largestFiles: []
    },
    hasTests: scanData.testing?.hasTests ?? Boolean(scanData.testing?.testCommand || config.gates.tests.command),
    hasTestFiles: scanData.testing?.hasTests ?? Boolean(scanData.testing?.testCommand || config.gates.tests.command),
    testCommand: scanData.testing?.testCommand || config.gates.tests.command || null,
    hasLinter: hasLinterMetric > 0,
    todoCount: Number.isFinite(todoMetric) ? todoMetric : 0,
    circularDeps: scanData.architecture?.circularDependencies?.count || scanData.circularDependencies?.count || 0,
    languages: [String(config.project.primaryLanguage || 'unknown')],
    hasCoverageData: hasCoverage,
    readmeExists: !(scanData.documentation?.readmeOutdated ?? false),
    readmeWordCount: 0,
    dependencyNames
  }
}

export function evaluateGates(
  config: BridgeConfig,
  scanData: Partial<BridgeScanReport>
): GateResult[] {
  const analysis = toRepoAnalysis(config, scanData)
  return evaluateCoreGates(config, analysis)
}
````

## File: electron/services/scanReport.ts
````typescript
import fs from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import type {
  BundleAnalysisReport,
  CircularDependencyReport,
  DeadCodeReport,
  DependencyReport,
  DocumentationDebtReport,
  FullScanResult,
  OversizedComponent,
  TestCoverageReport,
  VulnerabilitySummary
} from './analysis'
import type { BridgeConfig } from './bridgeConfig'
import type { GateResult } from './gateEvaluator'
import { evaluateGates } from './gateEvaluator'
import type { ActionItem, TechDebtScore } from './techDebtScorer'
import type { SecurityPatternFinding } from './securityPatterns'

const execAsync = promisify(exec)

export interface BridgeScanReport {
  version: 1
  generatedAt: string
  generatedBy: 'bridge-desktop' | 'bridge-cli' | 'bridge-ci'
  repository: {
    path: string
    name: string
    url?: string
    branch?: string
    commit?: string
    language: string
    packageManager?: string
  }
  durationMs: number
  config: BridgeConfig
  techDebt: TechDebtScore
  dependencies: DependencyReport
  security: {
    vulnerabilities: VulnerabilitySummary
    patternFindings: SecurityPatternFinding[]
  }
  architecture: {
    circularDependencies: CircularDependencyReport
    deadCode: DeadCodeReport
    bundleSize: BundleAnalysisReport
    oversizedFiles: OversizedComponent[]
  }
  testing: {
    coverage: TestCoverageReport
    hasTests: boolean
    testCommand?: string
  }
  documentation: DocumentationDebtReport
  gates: {
    passed: boolean
    results: GateResult[]
  }
  agentDigest: {
    debtScore: number
    grade: string
    critical: string[]
    actions: ActionItem[]
    policies: {
      banned_present: string[]
      missing_required: string[]
      update_policy: BridgeConfig['dependencies']['updatePolicy']
    }
    conventions: string[]
    context: string
    outdated_summary: {
      total: number
      patch: number
      minor: number
      major: number
    }
  }
}

async function safeGitValue(repoPath: string, command: string): Promise<string | undefined> {
  try {
    const { stdout } = await execAsync(command, {
      cwd: repoPath,
      timeout: 30000
    })
    const value = stdout.trim()
    return value || undefined
  } catch {
    return undefined
  }
}

function toOutdatedSummary(dependencies: DependencyReport) {
  const summary = {
    total: dependencies.outdated.length,
    patch: 0,
    minor: 0,
    major: 0
  }

  for (const dep of dependencies.outdated) {
    if (dep.updateType === 'patch') summary.patch += 1
    if (dep.updateType === 'minor') summary.minor += 1
    if (dep.updateType === 'major') summary.major += 1
  }

  return summary
}

function deriveCriticalStatements(
  report: FullScanResult,
  config: BridgeConfig,
  score: TechDebtScore,
  patternFindings: SecurityPatternFinding[]
): string[] {
  const statements: string[] = []

  const criticalVulns = report.dependencies.vulnerabilities.critical || 0
  if (criticalVulns > 0) {
    statements.push(`${criticalVulns} critical security vulnerabilities detected.`)
  }

  if (patternFindings.length > 0) {
    statements.push(`${patternFindings.length} risky security code patterns found.`)
  }

  if (report.circularDependencies.count > 0) {
    statements.push(`${report.circularDependencies.count} circular dependency cycles detected.`)
  }

  const minCoverage = config.gates.tests.minCoverage ?? 80
  if ((report.testCoverage.coveragePercentage ?? 100) < minCoverage) {
    statements.push(`Test coverage is ${report.testCoverage.coveragePercentage ?? 0}% (minimum ${minCoverage}%).`)
  }

  if (statements.length === 0) {
    statements.push('No critical issues detected.')
  }

  return statements.slice(0, 5)
}

function derivePolicies(
  config: BridgeConfig,
  dependencies: DependencyReport
): BridgeScanReport['agentDigest']['policies'] {
  const banned = new Set((config.dependencies.bannedPackages || []).map(pkg => pkg.toLowerCase()))
  const installed = new Set(
    (dependencies.installedPackages || dependencies.outdated.map(dep => dep.name))
      .map(dep => dep.toLowerCase())
  )
  const bannedPresent = Array.from(banned).filter(pkg => installed.has(pkg))

  const required = new Set((config.dependencies.requiredPackages || []).map(pkg => pkg.toLowerCase()))
  const missingRequired = Array.from(required).filter(pkg => !installed.has(pkg))

  return {
    banned_present: bannedPresent,
    missing_required: missingRequired,
    update_policy: config.dependencies.updatePolicy
  }
}

export async function generateScanReport(
  repoPath: string,
  config: BridgeConfig,
  scanResults: FullScanResult,
  techDebtScore: TechDebtScore,
  extras: {
    patternFindings?: SecurityPatternFinding[]
    oversizedFiles?: OversizedComponent[]
  } = {}
): Promise<BridgeScanReport> {
  const patternFindings = extras.patternFindings || []
  const oversizedFiles = extras.oversizedFiles || []
  const branch = await safeGitValue(repoPath, 'git rev-parse --abbrev-ref HEAD')
  const commit = await safeGitValue(repoPath, 'git rev-parse HEAD')

  const gatesResults = evaluateGates(config, {
    dependencies: scanResults.dependencies,
    security: {
      vulnerabilities: scanResults.dependencies.vulnerabilities,
      patternFindings
    },
    architecture: {
      circularDependencies: scanResults.circularDependencies,
      deadCode: scanResults.deadCode,
      bundleSize: scanResults.bundleSize,
      oversizedFiles
    },
    testing: {
      coverage: scanResults.testCoverage,
      hasTests: Boolean(config.gates.tests.command),
      testCommand: config.gates.tests.command
    },
    documentation: scanResults.documentation,
    techDebt: techDebtScore
  })

  const report: BridgeScanReport = {
    version: 1,
    generatedAt: new Date().toISOString(),
    generatedBy: 'bridge-desktop',
    repository: {
      path: repoPath,
      name: path.basename(path.resolve(repoPath)),
      url: scanResults.repositoryUrl || undefined,
      branch,
      commit,
      language: config.project.primaryLanguage,
      packageManager: config.project.packageManager
    },
    durationMs: scanResults.durationMs,
    config,
    techDebt: techDebtScore,
    dependencies: scanResults.dependencies,
    security: {
      vulnerabilities: scanResults.dependencies.vulnerabilities,
      patternFindings
    },
    architecture: {
      circularDependencies: scanResults.circularDependencies,
      deadCode: scanResults.deadCode,
      bundleSize: scanResults.bundleSize,
      oversizedFiles
    },
    testing: {
      coverage: scanResults.testCoverage,
      hasTests: Boolean(config.gates.tests.command),
      testCommand: config.gates.tests.command
    },
    documentation: scanResults.documentation,
    gates: {
      passed: gatesResults.every(gate => gate.passed || gate.severity !== 'error'),
      results: gatesResults
    },
    agentDigest: {
      debtScore: techDebtScore.total,
      grade: techDebtScore.grade,
      critical: deriveCriticalStatements(scanResults, config, techDebtScore, patternFindings),
      actions: techDebtScore.actionItems.slice(0, 10),
      policies: derivePolicies(config, scanResults.dependencies),
      conventions: config.agent.conventions || [],
      context: config.agent.context,
      outdated_summary: toOutdatedSummary(scanResults.dependencies)
    }
  }

  return report
}

export async function writeScanReportArtifacts(
  repoPath: string,
  report: BridgeScanReport
): Promise<{ latestReportPath: string; latestScorePath: string; archivePath: string; configSnapshotPath: string }> {
  const bridgeDir = path.join(repoPath, '.bridge')
  const reportsDir = path.join(bridgeDir, 'reports')
  await fs.mkdir(reportsDir, { recursive: true })

  const timestampSafe = report.generatedAt.replace(/[:]/g, '-')
  const latestReportPath = path.join(bridgeDir, 'latest-report.json')
  const latestScorePath = path.join(bridgeDir, 'latest-score.json')
  const archivePath = path.join(reportsDir, `${timestampSafe}.json`)
  const configSnapshotPath = path.join(bridgeDir, 'config-snapshot.json')

  await fs.writeFile(latestReportPath, JSON.stringify(report, null, 2) + '\n', 'utf-8')
  await fs.writeFile(archivePath, JSON.stringify(report, null, 2) + '\n', 'utf-8')
  await fs.writeFile(configSnapshotPath, JSON.stringify(report.config, null, 2) + '\n', 'utf-8')

  // Keep score artifact tiny for agent consumption (< 2KB target).
  const compactDimensions = Object.fromEntries(
    Object.entries(report.techDebt.dimensions).map(([key, value]) => [key, {
      score: Number(value.score.toFixed(1)),
      weight: value.weight,
      weightedScore: Number(value.weightedScore.toFixed(2))
    }])
  )

  let minimalScore: Record<string, any> = {
    total: Number(report.techDebt.total.toFixed(1)),
    grade: report.techDebt.grade,
    trend: report.techDebt.trend,
    dimensions: compactDimensions,
    topContributors: report.techDebt.topContributors.slice(0, 3).map(item => ({
      dimension: item.dimension,
      impact: item.impact,
      description: item.description.slice(0, 72)
    })),
    actionItems: report.techDebt.actionItems.slice(0, 3).map(item => ({
      priority: item.priority,
      title: item.title.slice(0, 72),
      impact: item.impact,
      effort: item.effort,
      automatable: item.automatable
    }))
  }

  let serializedScore = JSON.stringify(minimalScore)
  if (Buffer.byteLength(serializedScore, 'utf-8') > 2000) {
    minimalScore = {
      total: minimalScore.total,
      grade: minimalScore.grade,
      trend: minimalScore.trend,
      dimensions: minimalScore.dimensions,
      topContributors: (minimalScore.topContributors as any[]).slice(0, 2).map(item => ({
        dimension: item.dimension,
        impact: item.impact
      })),
      actionItems: (minimalScore.actionItems as any[]).slice(0, 2).map(item => ({
        priority: item.priority,
        impact: item.impact,
        effort: item.effort,
        automatable: item.automatable
      }))
    }
    serializedScore = JSON.stringify(minimalScore)
  }

  await fs.writeFile(latestScorePath, serializedScore + '\n', 'utf-8')

  return {
    latestReportPath,
    latestScorePath,
    archivePath,
    configSnapshotPath
  }
}
````

## File: electron/services/securityPatterns.ts
````typescript
import fs from 'fs/promises'
import path from 'path'

export interface SecurityPatternFinding {
  file: string
  line: number
  column?: number
  severity: 'critical' | 'high' | 'medium' | 'low'
  category: string
  cwe?: string
  owasp?: string
  title: string
  description: string
  suggestion: string
  snippet: string
}

interface SecurityPatternDefinition {
  id: string
  severity: SecurityPatternFinding['severity']
  category: string
  cwe: string
  owasp: string
  title: string
  description: string
  suggestion: string
  regex: RegExp
  appliesTo: string[]
}

const DEFAULT_EXCLUDES = [
  '.git',
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.next',
  '.bridge'
]

const LANGUAGE_EXTENSIONS: Record<string, string[]> = {
  javascript: ['.js', '.jsx', '.mjs', '.cjs'],
  typescript: ['.ts', '.tsx'],
  node: ['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx'],
  python: ['.py'],
  ruby: ['.rb']
}

const PATTERNS: SecurityPatternDefinition[] = [
  {
    id: 'critical-eval',
    severity: 'critical',
    category: 'eval',
    cwe: 'CWE-94',
    owasp: 'A03:2021',
    title: 'Dynamic Code Execution',
    description: 'Use of eval/new Function can execute untrusted code.',
    suggestion: 'Remove dynamic execution. Use safe parser or explicit map of allowed operations.',
    regex: /\b(eval\s*\(|new\s+Function\s*\()/,
    appliesTo: ['javascript', 'typescript']
  },
  {
    id: 'critical-exec-concat',
    severity: 'critical',
    category: 'exec-concat',
    cwe: 'CWE-78',
    owasp: 'A03:2021',
    title: 'Command Injection Risk',
    description: 'child_process.exec with concatenated input may allow command injection.',
    suggestion: 'Use execFile/spawn with explicit args; never concatenate user input into shell command strings.',
    regex: /child_process\.exec\s*\(([^)]*[+`$][^)]*)\)/,
    appliesTo: ['javascript', 'typescript']
  },
  {
    id: 'critical-hardcoded-secret',
    severity: 'critical',
    category: 'hardcoded-secret',
    cwe: 'CWE-798',
    owasp: 'A07:2021',
    title: 'Hardcoded Secret',
    description: 'Potential API key, token, or credential literal detected in code.',
    suggestion: 'Move secret to secure environment variable or secret manager and rotate the credential.',
    regex: /(AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36,}|sk_(live|test)_[A-Za-z0-9]{16,}|-----BEGIN (RSA|EC|OPENSSH|PRIVATE) KEY-----|api[_-]?key\s*[:=]\s*['\"][^'\"]{8,}['\"]|secret\s*[:=]\s*['\"][^'\"]{8,}['\"]|token\s*[:=]\s*['\"][^'\"]{8,}['\"])/,
    appliesTo: ['javascript', 'typescript', 'python', 'ruby']
  },
  {
    id: 'high-innerhtml',
    severity: 'high',
    category: 'innerhtml',
    cwe: 'CWE-79',
    owasp: 'A03:2021',
    title: 'Potential XSS Sink',
    description: 'innerHTML or dangerouslySetInnerHTML can introduce XSS when input is not sanitized.',
    suggestion: 'Use textContent or vetted sanitization library before rendering HTML.',
    regex: /(innerHTML\s*=|dangerouslySetInnerHTML)/,
    appliesTo: ['javascript', 'typescript']
  },
  {
    id: 'high-sql-concat',
    severity: 'high',
    category: 'sql-concat',
    cwe: 'CWE-89',
    owasp: 'A03:2021',
    title: 'Potential SQL Injection',
    description: 'SQL query appears built via string concatenation/interpolation.',
    suggestion: 'Use parameterized queries / prepared statements.',
    regex: /(SELECT|UPDATE|INSERT|DELETE)[\s\S]{0,80}(\+|`.*\$\{)/i,
    appliesTo: ['javascript', 'typescript', 'python', 'ruby']
  },
  {
    id: 'high-json-parse-user-input',
    severity: 'high',
    category: 'json-parse-user-input',
    cwe: 'CWE-20',
    owasp: 'A05:2021',
    title: 'Unsafe JSON.parse Input',
    description: 'JSON.parse appears to consume request/body/query input directly.',
    suggestion: 'Validate input and wrap JSON.parse in try/catch with strict schema validation.',
    regex: /JSON\.parse\s*\((req\.|request\.|ctx\.|event\.)/,
    appliesTo: ['javascript', 'typescript']
  },
  {
    id: 'high-disabled-ssl-verification',
    severity: 'high',
    category: 'disabled-ssl-verification',
    cwe: 'CWE-295',
    owasp: 'A02:2021',
    title: 'SSL Verification Disabled',
    description: 'TLS certificate verification appears disabled.',
    suggestion: 'Enable certificate verification and remove insecure TLS overrides.',
    regex: /(rejectUnauthorized\s*:\s*false|NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*['\"]?0['\"]?)/,
    appliesTo: ['javascript', 'typescript', 'python']
  },
  {
    id: 'high-insecure-http',
    severity: 'high',
    category: 'insecure-http',
    cwe: 'CWE-319',
    owasp: 'A02:2021',
    title: 'Insecure HTTP Request',
    description: 'Non-localhost HTTP URL detected in network call.',
    suggestion: 'Use HTTPS endpoints for transport security.',
    regex: /(fetch|axios\.(get|post|put|delete)|request)\s*\(\s*['\"]http:\/\/(?!localhost|127\.0\.0\.1)/,
    appliesTo: ['javascript', 'typescript']
  },
  {
    id: 'medium-weak-random',
    severity: 'medium',
    category: 'weak-random',
    cwe: 'CWE-330',
    owasp: 'A02:2021',
    title: 'Weak Random Source',
    description: 'Math.random is not suitable for security-sensitive tokens.',
    suggestion: 'Use crypto.randomBytes / Web Crypto getRandomValues for security-sensitive values.',
    regex: /Math\.random\s*\(/,
    appliesTo: ['javascript', 'typescript']
  },
  {
    id: 'medium-weak-hash',
    severity: 'medium',
    category: 'weak-hash',
    cwe: 'CWE-327',
    owasp: 'A02:2021',
    title: 'Weak Hash Algorithm',
    description: 'MD5/SHA1 usage detected.',
    suggestion: 'Prefer SHA-256/512 and modern password hashing (bcrypt/argon2/scrypt).',
    regex: /(md5\s*\(|sha1\s*\(|createHash\s*\(\s*['\"](md5|sha1)['\"])/i,
    appliesTo: ['javascript', 'typescript', 'python', 'ruby']
  },
  {
    id: 'medium-sensitive-console-log',
    severity: 'medium',
    category: 'sensitive-console-log',
    cwe: 'CWE-532',
    owasp: 'A09:2021',
    title: 'Sensitive Data Logging',
    description: 'console.log appears to log credential/token/password-like values.',
    suggestion: 'Remove sensitive logging or redact values before output.',
    regex: /console\.log\s*\([^)]*(password|secret|token|authorization|api[_-]?key)[^)]*\)/i,
    appliesTo: ['javascript', 'typescript']
  },
  {
    id: 'medium-open-redirect',
    severity: 'medium',
    category: 'open-redirect',
    cwe: 'CWE-601',
    owasp: 'A10:2021',
    title: 'Potential Open Redirect',
    description: 'Redirect target may come from user input without allowlisting.',
    suggestion: 'Validate redirect targets against an allowlist.',
    regex: /(res\.redirect|redirect\()\s*\((req\.|request\.|ctx\.)/,
    appliesTo: ['javascript', 'typescript']
  }
]

function getExtensions(languages?: string[]): string[] {
  if (!languages || languages.length === 0) {
    return Array.from(new Set(Object.values(LANGUAGE_EXTENSIONS).flat()))
  }

  const extensions = new Set<string>()
  for (const lang of languages) {
    for (const ext of LANGUAGE_EXTENSIONS[lang] || []) {
      extensions.add(ext)
    }
  }
  return Array.from(extensions)
}

function getLanguageFromExtension(ext: string): string {
  const entries = Object.entries(LANGUAGE_EXTENSIONS)
  for (const [language, extensions] of entries) {
    if (extensions.includes(ext)) {
      return language
    }
  }
  return 'unknown'
}

async function collectFiles(
  root: string,
  options: { exclude: string[]; extensions: string[] }
): Promise<string[]> {
  const files: string[] = []

  const walk = async (dir: string): Promise<void> => {
    const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => [])
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (options.exclude.includes(entry.name)) continue
        await walk(path.join(dir, entry.name))
      } else {
        const ext = path.extname(entry.name).toLowerCase()
        if (options.extensions.includes(ext)) {
          files.push(path.join(dir, entry.name))
        }
      }
    }
  }

  await walk(root)
  return files
}

export async function scanRepoForSecurityPatterns(
  repoPath: string,
  options?: {
    exclude?: string[]
    languages?: string[]
    maxFindings?: number
  }
): Promise<SecurityPatternFinding[]> {
  const exclude = Array.from(new Set([...(options?.exclude || []), ...DEFAULT_EXCLUDES]))
  const extensions = getExtensions(options?.languages)
  const maxFindings = options?.maxFindings ?? 500

  const files = await collectFiles(repoPath, { exclude, extensions })
  const findings: SecurityPatternFinding[] = []

  for (const filePath of files) {
    if (findings.length >= maxFindings) break

    const content = await fs.readFile(filePath, 'utf-8').catch(() => '')
    if (!content) continue

    const lines = content.split(/\r?\n/)
    const relPath = path.relative(repoPath, filePath)
    const fileLanguage = getLanguageFromExtension(path.extname(filePath).toLowerCase())

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
      const line = lines[lineIndex]
      if (!line || line.trim().length === 0) continue

      for (const pattern of PATTERNS) {
        if (findings.length >= maxFindings) break
        if (!pattern.appliesTo.includes(fileLanguage) && !pattern.appliesTo.includes('node')) {
          continue
        }

        const match = line.match(pattern.regex)
        if (!match || match.index === undefined) continue

        findings.push({
          file: relPath,
          line: lineIndex + 1,
          column: match.index + 1,
          severity: pattern.severity,
          category: pattern.category,
          cwe: pattern.cwe,
          owasp: pattern.owasp,
          title: pattern.title,
          description: pattern.description,
          suggestion: pattern.suggestion,
          snippet: line.trim().slice(0, 400)
        })
      }
    }
  }

  return findings
}
````

## File: electron/services/techDebtScorer.ts
````typescript
import type {
  BundleAnalysisReport,
  CircularDependencyReport,
  DeadCodeReport,
  DependencyReport,
  DocumentationDebtReport,
  OversizedComponent,
  TestCoverageReport,
  VulnerabilitySummary
} from './analysis'
import type { SecurityPatternFinding } from './securityPatterns'
import type { BridgeConfig } from './bridgeConfig'
import { analyzeRepo } from '../../bridge-mcp/src/core/repoAnalyzer.js'
import {
  calculateScore,
  type ActionItem,
  type DebtContributor,
  type DimensionScore,
  type TechDebtScore
} from '../../bridge-mcp/src/core/scorer.js'

export type {
  ActionItem,
  DebtContributor,
  DimensionScore,
  TechDebtScore
}

export interface CodeHealthMetrics {
  todoCount: number
  consoleLogCount: number
  commentedOutBlockCount: number
  mixedTabsSpaces: boolean
  inconsistentQuoteStyle: boolean
  hasLinter: boolean
  hasFormatter: boolean
  packageScriptsCount: number
  hasGitignore: boolean
}

export interface ScanData {
  dependencies: DependencyReport
  vulnerabilities: VulnerabilitySummary
  circularDependencies: CircularDependencyReport
  deadCode: DeadCodeReport
  bundleSize: BundleAnalysisReport
  testCoverage: TestCoverageReport
  documentation: DocumentationDebtReport
  oversizedComponents?: OversizedComponent[]
  securityPatterns?: SecurityPatternFinding[]
  codeHealth?: CodeHealthMetrics
  repositoryInsights?: {
    hasLockfile: boolean
    lockfileDaysSinceUpdate?: number | null
    packageManagerDetected: boolean
    hasSrcDirectory: boolean
    ciDetected: boolean
    readmeExists: boolean
    readmeWordCount: number
    readmeDaysSinceUpdate: number
    hasChangelog: boolean
    hasContributingGuide: boolean
    hasLicense: boolean
    testCommandExists: boolean
    testsPass: boolean | null
    maxNestingDepth: number
    deeplyNestedFiles: number
    nodeModulesCommitted: boolean
    avgFileComplexity?: number
    oversizedFilesCount?: number
  }
  previousScore?: number | null
}

export async function calculateTechDebtScore(
  repoPath: string,
  scanData: ScanData,
  config: BridgeConfig
): Promise<TechDebtScore> {
  void scanData
  const analysis = await analyzeRepo(repoPath)
  return calculateScore(analysis, config)
}
````

## File: .bridge.json
````json
{
  "__comment_0": "Bridge project configuration. Keep this file in source control so all engineers and agents share policy.",
  "__comment_1": "Fields named __comment_* are ignored by Bridge and safe to remove.",
  "version": 1,
  "project": {
    "name": "bridge-desktop",
    "primaryLanguage": "typescript",
    "monorepo": false,
    "workspacePatterns": [],
    "description": "Bridge runs directly against repositories that already exist on your machine. It avoids GitHub API onboarding and uses your existing local git + optional `gh` authentication.",
    "packageManager": "npm"
  },
  "dependencies": {
    "updatePolicy": {
      "patch": "auto",
      "minor": "review",
      "major": "review"
    },
    "bannedPackages": [],
    "requiredPackages": [],
    "pinnedPackages": {},
    "maxAge": {
      "patch": 7,
      "minor": 30,
      "major": 90
    },
    "securityPolicy": {
      "autoFixCritical": true,
      "autoFixHigh": true,
      "blockOnCritical": true,
      "blockOnHigh": false
    }
  },
  "gates": {
    "tests": {
      "required": true,
      "minCoverage": 80,
      "timeout": 300
    },
    "lint": {
      "required": false
    },
    "build": {
      "required": true,
      "command": "npm run build"
    },
    "bundleSize": {
      "maxDeltaPercent": 10
    },
    "circularDependencies": {
      "maxAllowed": 0,
      "failOnNew": true
    },
    "deadCode": {
      "maxDeadFiles": 5,
      "maxUnusedExports": 10,
      "failOnNew": false
    },
    "documentation": {
      "requireReadme": true,
      "requireChangelog": false,
      "maxDaysSinceReadmeUpdate": 90
    }
  },
  "agent": {
    "context": "bridge-desktop is a React project managed with npm.",
    "conventions": [
      "Use strict TypeScript - avoid any types",
      "Prefer named exports over default exports",
      "Use async/await over raw Promise chaining",
      "Use functional components with hooks",
      "Co-locate component tests with component files"
    ],
    "avoidPatterns": [
      "Do not use @ts-ignore without explanation",
      "Do not disable ESLint rules inline without justification",
      "Do not use class components"
    ],
    "preferredLibraries": {
      "dates": "date-fns",
      "validation": "zod"
    },
    "reviewChecklist": [
      "Preserve existing behavior",
      "Add or update tests for behavior changes",
      "Keep dependency and security risk low"
    ]
  },
  "scoring": {
    "weights": {
      "dependencies": 20,
      "security": 25,
      "architecture": 20,
      "testing": 20,
      "documentation": 5,
      "codeHealth": 10
    },
    "thresholds": {
      "maxOutdatedDeps": 10,
      "maxCircularDeps": 0,
      "maxDeadFiles": 5,
      "minTestCoverage": 80,
      "maxOversizedFiles": 10,
      "maxDebtScore": 70
    }
  },
  "scan": {
    "schedule": "manual",
    "exclude": [
      "node_modules",
      ".git",
      "dist",
      "build",
      ".next",
      "coverage",
      ".bridge"
    ],
    "include": [],
    "features": {
      "dependencies": true,
      "security": true,
      "circularDeps": true,
      "deadCode": true,
      "bundleSize": true,
      "testCoverage": true,
      "documentation": true,
      "codeSmells": true,
      "fileAnalysis": true
    }
  },
  "console": {
    "autoUpload": false,
    "uploadOn": [
      "scan"
    ]
  }
}
````

## File: electron/services/bridgeProjectConfig.ts
````typescript
import fs from 'fs/promises'
import path from 'path'
import { loadBridgeConfig } from './bridgeConfig'

export interface BridgePatchConfig {
  createPR?: boolean
  runTests?: boolean
  testCommand?: string
  branchPrefix?: string
  baseBranch?: string
  remoteFirst?: boolean
}

export interface BridgeProjectConfig {
  baseBranch?: string
  branchPrefix?: string
  patch?: BridgePatchConfig
}

export interface BridgeProjectConfigResult {
  exists: boolean
  path: string
  config: BridgeProjectConfig
  errors: string[]
}

const CONFIG_FILE_NAME = '.bridge.json'

function asBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined
}

function asString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : undefined
}

function sanitizeBranch(value: unknown): string | undefined {
  const branch = asString(value)
  if (!branch) return undefined
  if (!/^[A-Za-z0-9._/-]+$/.test(branch)) return undefined
  return branch
}

function normalizePatchConfig(rawPatch: unknown): BridgePatchConfig {
  const patchConfig = (rawPatch && typeof rawPatch === 'object') ? rawPatch as Record<string, unknown> : {}
  return {
    createPR: asBoolean(patchConfig.createPR),
    runTests: asBoolean(patchConfig.runTests),
    testCommand: asString(patchConfig.testCommand),
    branchPrefix: asString(patchConfig.branchPrefix),
    baseBranch: sanitizeBranch(patchConfig.baseBranch),
    remoteFirst: asBoolean(patchConfig.remoteFirst)
  }
}

export async function loadBridgeProjectConfig(repoPath: string): Promise<BridgeProjectConfigResult> {
  const configPath = path.join(repoPath, CONFIG_FILE_NAME)
  const result: BridgeProjectConfigResult = {
    exists: false,
    path: configPath,
    config: {},
    errors: []
  }

  try {
    await fs.access(configPath)
    result.exists = true
  } catch {
    return result
  }

  try {
    const fullConfig = await loadBridgeConfig(repoPath)
    result.config = {
      baseBranch: undefined,
      branchPrefix: asString((fullConfig as any).branchPrefix) || 'bridge-update-deps',
      patch: {
        createPR: asBoolean((fullConfig as any)?.patch?.createPR),
        runTests: fullConfig.gates.tests.required,
        testCommand: fullConfig.gates.tests.command,
        branchPrefix: asString((fullConfig as any)?.patch?.branchPrefix || (fullConfig as any)?.branchPrefix) || 'bridge-update-deps',
        baseBranch: sanitizeBranch((fullConfig as any)?.patch?.baseBranch || (fullConfig as any)?.baseBranch),
        remoteFirst: asBoolean((fullConfig as any)?.patch?.remoteFirst)
      }
    }

    const raw = await fs.readFile(configPath, 'utf-8')
    const parsed = JSON.parse(raw) as Record<string, unknown>
    result.config.baseBranch = sanitizeBranch(parsed.baseBranch) || result.config.patch?.baseBranch
    result.config.branchPrefix = asString(parsed.branchPrefix) || result.config.patch?.branchPrefix
    result.config.patch = {
      ...result.config.patch,
      ...normalizePatchConfig(parsed.patch)
    }
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : 'Failed to parse .bridge.json')
  }

  return result
}
````

## File: electron/services/securityScanner.ts
````typescript
import { exec, spawn, ChildProcess } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs/promises'
import { scanRepoForSecurityPatterns, type SecurityPatternFinding } from './securityPatterns'

const execAsync = promisify(exec)

export interface SecurityFinding {
  file: string
  line: number
  issue: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  code: string
  description: string
  cwe: string
  owasp: string
  solution?: string
  fixedCode?: string
}

export interface ScanResult {
  scanId: string
  repoPath: string
  totalFindings: number
  criticalCount: number
  highCount: number
  mediumCount: number
  lowCount: number
  findings: SecurityFinding[]
  scannedAt: string
  duration: number
}

export interface ScanProgress {
  status: 'scanning' | 'analyzing' | 'generating-fixes' | 'complete' | 'error'
  progress: number
  message: string
  currentFile?: string
}

// Path to the agentic_fixer module
const AGENTIC_FIXER_PATH = path.join(__dirname, '../../agentic_fixer')

let pythonProcess: ChildProcess | null = null

export async function checkAgenticFixerAvailable(): Promise<boolean> {
  try {
    await fs.access(AGENTIC_FIXER_PATH)
    // Check if Python and required modules are available
    await execAsync('python3 -c "import flask"', { timeout: 5000 })
    return true
  } catch {
    return false
  }
}

export async function runSecurityScan(
  repoPath: string,
  onProgress?: (progress: ScanProgress) => void
): Promise<ScanResult> {
  const scanId = `scan-${Date.now()}`
  const startTime = Date.now()

  onProgress?.({
    status: 'scanning',
    progress: 0,
    message: 'Initializing security scan...'
  })

  try {
    const available = await checkAgenticFixerAvailable()
    const baseResult = available
      ? await runPythonSecurityScan(repoPath, scanId, startTime, onProgress)
      : await runBasicSecurityScan(repoPath, scanId, onProgress)

    onProgress?.({
      status: 'analyzing',
      progress: 75,
      message: 'Running TypeScript security pattern scanner...'
    })

    const [tsPatternFindings, auditFindings] = await Promise.all([
      scanRepoForSecurityPatterns(repoPath, { maxFindings: 250 }),
      getNpmAuditSecurityFindings(repoPath)
    ])

    const mergedFindings = dedupeFindings([
      ...baseResult.findings,
      ...tsPatternFindings.map(mapPatternFinding),
      ...auditFindings
    ])

    const result: ScanResult = {
      ...baseResult,
      findings: mergedFindings,
      totalFindings: mergedFindings.length,
      criticalCount: mergedFindings.filter(item => item.severity === 'critical').length,
      highCount: mergedFindings.filter(item => item.severity === 'high').length,
      mediumCount: mergedFindings.filter(item => item.severity === 'medium').length,
      lowCount: mergedFindings.filter(item => item.severity === 'low').length,
      duration: Date.now() - startTime
    }

    onProgress?.({
      status: 'complete',
      progress: 100,
      message: `Found ${result.totalFindings} security issues`
    })

    return result
  } catch (error) {
    console.error('Security scan failed:', error)
    throw error
  }
}

async function runPythonSecurityScan(
  repoPath: string,
  scanId: string,
  startTime: number,
  onProgress?: (progress: ScanProgress) => void
): Promise<ScanResult> {
  return new Promise((resolve, reject) => {
    const pythonScript = `
import sys
import json
sys.path.insert(0, '${AGENTIC_FIXER_PATH}')

from code_security_auto_fixer import repo_scanner, language_detector, pattern_detector

try:
    repo_path = '${repoPath.replace(/'/g, "\\'")}'

    # Detect languages
    languages = language_detector.detect(repo_path)
    print(json.dumps({'type': 'progress', 'status': 'scanning', 'progress': 20, 'message': f'Detected languages: {", ".join(languages)}'}))
    sys.stdout.flush()

    # Scan for patterns
    print(json.dumps({'type': 'progress', 'status': 'analyzing', 'progress': 40, 'message': 'Analyzing code patterns...'}))
    sys.stdout.flush()

    findings = pattern_detector.scan(repo_path, languages)

    print(json.dumps({'type': 'progress', 'status': 'complete', 'progress': 100, 'message': f'Found {len(findings)} security issues'}))
    sys.stdout.flush()

    # Output results
    result = {
        'type': 'result',
        'findings': findings
    }
    print(json.dumps(result))
    sys.stdout.flush()

except Exception as e:
    print(json.dumps({'type': 'error', 'message': str(e)}))
    sys.stdout.flush()
    sys.exit(1)
`

    const python = spawn('python3', ['-c', pythonScript], {
      cwd: AGENTIC_FIXER_PATH,
      env: { ...process.env, PYTHONUNBUFFERED: '1' }
    })

    let output = ''
    let findings: SecurityFinding[] = []

    python.stdout.on('data', (data) => {
      const lines = data.toString().split('\n').filter((l: string) => l.trim())

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line)

          if (parsed.type === 'progress') {
            onProgress?.({
              status: parsed.status,
              progress: parsed.progress,
              message: parsed.message
            })
          } else if (parsed.type === 'result') {
            findings = parsed.findings.map((f: any) => ({
              file: f.file,
              line: f.line,
              issue: f.issue,
              severity: normalizeSeverity(f.severity),
              code: f.code,
              description: f.description || f.issue,
              cwe: f.cwe || 'CWE-Unknown',
              owasp: f.owasp || 'Unknown',
              solution: f.solution
            }))
          } else if (parsed.type === 'error') {
            reject(new Error(parsed.message))
          }
        } catch {
          output += line
        }
      }
    })

    python.stderr.on('data', (data) => {
      console.error('Python stderr:', data.toString())
    })

    python.on('close', (code) => {
      if (code === 0 || findings.length > 0) {
        const result: ScanResult = {
          scanId,
          repoPath,
          totalFindings: findings.length,
          criticalCount: findings.filter(f => f.severity === 'critical').length,
          highCount: findings.filter(f => f.severity === 'high').length,
          mediumCount: findings.filter(f => f.severity === 'medium').length,
          lowCount: findings.filter(f => f.severity === 'low').length,
          findings,
          scannedAt: new Date().toISOString(),
          duration: Date.now() - startTime
        }
        resolve(result)
      } else {
        reject(new Error('Security scan failed'))
      }
    })

    python.on('error', (error) => {
      reject(error)
    })
  })
}

// Basic pattern-based security scan (fallback when Python is not available)
async function runBasicSecurityScan(
  repoPath: string,
  scanId: string,
  onProgress?: (progress: ScanProgress) => void
): Promise<ScanResult> {
  const startTime = Date.now()
  const findings: SecurityFinding[] = []

  // Security patterns to detect
  const patterns: { pattern: RegExp; issue: string; severity: 'critical' | 'high' | 'medium' | 'low'; cwe: string; owasp: string }[] = [
    // SQL Injection
    { pattern: /execute\s*\(\s*['"`].*\$|%s|{.*}.*['"`]/i, issue: 'sql-injection', severity: 'critical', cwe: 'CWE-89', owasp: 'A03:2021' },
    { pattern: /query\s*\(\s*['"`].*\+.*['"`]/i, issue: 'sql-injection', severity: 'critical', cwe: 'CWE-89', owasp: 'A03:2021' },

    // XSS
    { pattern: /innerHTML\s*=|document\.write\s*\(/i, issue: 'xss', severity: 'high', cwe: 'CWE-79', owasp: 'A03:2021' },
    { pattern: /dangerouslySetInnerHTML/i, issue: 'xss', severity: 'medium', cwe: 'CWE-79', owasp: 'A03:2021' },

    // Command Injection
    { pattern: /exec\s*\(|system\s*\(|shell_exec\s*\(/i, issue: 'command-injection', severity: 'critical', cwe: 'CWE-78', owasp: 'A03:2021' },
    { pattern: /subprocess\.call.*shell\s*=\s*True/i, issue: 'command-injection', severity: 'critical', cwe: 'CWE-78', owasp: 'A03:2021' },

    // Hardcoded Secrets
    { pattern: /password\s*=\s*['"][^'"]+['"]/i, issue: 'hardcoded-secret', severity: 'high', cwe: 'CWE-798', owasp: 'A07:2021' },
    { pattern: /api[_-]?key\s*=\s*['"][^'"]+['"]/i, issue: 'hardcoded-secret', severity: 'high', cwe: 'CWE-798', owasp: 'A07:2021' },
    { pattern: /secret\s*=\s*['"][^'"]+['"]/i, issue: 'hardcoded-secret', severity: 'high', cwe: 'CWE-798', owasp: 'A07:2021' },

    // Path Traversal
    { pattern: /\.\.\/|\.\.\\|path\.join.*\.\./i, issue: 'path-traversal', severity: 'high', cwe: 'CWE-22', owasp: 'A01:2021' },

    // Insecure Deserialization
    { pattern: /pickle\.loads|yaml\.load\s*\([^,)]+\)/i, issue: 'insecure-deserialization', severity: 'critical', cwe: 'CWE-502', owasp: 'A08:2021' },
    { pattern: /eval\s*\(|Function\s*\(/i, issue: 'code-injection', severity: 'critical', cwe: 'CWE-94', owasp: 'A03:2021' },

    // Weak Crypto
    { pattern: /md5\s*\(|sha1\s*\(/i, issue: 'weak-crypto', severity: 'medium', cwe: 'CWE-327', owasp: 'A02:2021' },

    // SSRF
    { pattern: /requests\.get\s*\(.*request\.|fetch\s*\(.*req\./i, issue: 'ssrf', severity: 'high', cwe: 'CWE-918', owasp: 'A10:2021' }
  ]

  const codeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.rb', '.php', '.java', '.go', '.rs', '.c', '.cpp']

  async function scanDir(dir: string) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        if (['node_modules', '.git', 'vendor', 'deps', '_build', '__pycache__', 'venv', '.venv'].includes(entry.name)) {
          continue
        }

        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
          await scanDir(fullPath)
        } else {
          const ext = path.extname(entry.name).toLowerCase()
          if (codeExtensions.includes(ext)) {
            try {
              const content = await fs.readFile(fullPath, 'utf-8')
              const lines = content.split('\n')
              const relPath = path.relative(repoPath, fullPath)

              for (let i = 0; i < lines.length; i++) {
                const line = lines[i]

                for (const { pattern, issue, severity, cwe, owasp } of patterns) {
                  if (pattern.test(line)) {
                    findings.push({
                      file: relPath,
                      line: i + 1,
                      issue,
                      severity,
                      code: line.trim(),
                      description: `Potential ${issue.replace(/-/g, ' ')} vulnerability detected`,
                      cwe,
                      owasp
                    })
                  }
                }
              }
            } catch {}
          }
        }
      }
    } catch {}
  }

  onProgress?.({ status: 'scanning', progress: 10, message: 'Scanning files...' })
  await scanDir(repoPath)

  onProgress?.({ status: 'complete', progress: 100, message: `Found ${findings.length} security issues` })

  return {
    scanId,
    repoPath,
    totalFindings: findings.length,
    criticalCount: findings.filter(f => f.severity === 'critical').length,
    highCount: findings.filter(f => f.severity === 'high').length,
    mediumCount: findings.filter(f => f.severity === 'medium').length,
    lowCount: findings.filter(f => f.severity === 'low').length,
    findings,
    scannedAt: new Date().toISOString(),
    duration: Date.now() - startTime
  }
}

function normalizeSeverity(severity: string): 'critical' | 'high' | 'medium' | 'low' {
  const s = severity.toLowerCase()
  if (s === 'critical' || s === 'error') return 'critical'
  if (s === 'high' || s === 'warning') return 'high'
  if (s === 'medium' || s === 'info') return 'medium'
  return 'low'
}

function mapPatternFinding(finding: SecurityPatternFinding): SecurityFinding {
  return {
    file: finding.file,
    line: finding.line,
    issue: finding.category,
    severity: finding.severity,
    code: finding.snippet,
    description: finding.description,
    cwe: finding.cwe || 'CWE-Unknown',
    owasp: finding.owasp || 'Unknown',
    solution: finding.suggestion
  }
}

function dedupeFindings(findings: SecurityFinding[]): SecurityFinding[] {
  const seen = new Set<string>()
  const output: SecurityFinding[] = []
  for (const finding of findings) {
    const key = `${finding.file}:${finding.line}:${finding.issue}:${finding.severity}`
    if (seen.has(key)) continue
    seen.add(key)
    output.push(finding)
  }
  return output
}

async function getNpmAuditSecurityFindings(repoPath: string): Promise<SecurityFinding[]> {
  try {
    const { stdout } = await execAsync('npm audit --json', {
      cwd: repoPath,
      timeout: 120000,
      maxBuffer: 20 * 1024 * 1024
    })
    const payload = JSON.parse(stdout || '{}')
    const findings: SecurityFinding[] = []

    if (payload.vulnerabilities && typeof payload.vulnerabilities === 'object') {
      for (const [name, meta] of Object.entries(payload.vulnerabilities) as [string, any][]) {
        const severity = normalizeSeverity(String(meta?.severity || 'low'))
        findings.push({
          file: 'package-lock.json',
          line: 1,
          issue: `dependency-vulnerability:${name}`,
          severity,
          code: name,
          description: `${severity.toUpperCase()} vulnerability reported for ${name}.`,
          cwe: 'CWE-937',
          owasp: 'A06:2021'
        })
      }
    }

    if (payload.advisories && typeof payload.advisories === 'object') {
      for (const advisory of Object.values(payload.advisories) as any[]) {
        const severity = normalizeSeverity(String(advisory?.severity || 'low'))
        const moduleName = String(advisory?.module_name || 'unknown')
        findings.push({
          file: 'package-lock.json',
          line: 1,
          issue: `dependency-advisory:${moduleName}`,
          severity,
          code: moduleName,
          description: `${severity.toUpperCase()} advisory for ${moduleName}.`,
          cwe: 'CWE-937',
          owasp: 'A06:2021'
        })
      }
    }

    return dedupeFindings(findings)
  } catch {
    return []
  }
}

export async function generateSecurityFix(finding: SecurityFinding): Promise<string | null> {
  // Try to use the AI fixer from agentic_fixer if available
  const available = await checkAgenticFixerAvailable()

  if (!available) {
    return null
  }

  return new Promise((resolve) => {
    const pythonScript = `
import sys
import json
sys.path.insert(0, '${AGENTIC_FIXER_PATH}')

try:
    from code_security_auto_fixer.ai_fixer import AIFixer
    from code_security_auto_fixer.config import (
        GEMINI_API_BASE_URL, GEMINI_MODEL_NAME, GEMINI_API_KEY,
        GEMINI_ACCESS_TOKEN, GEMINI_TEMPERATURE, GEMINI_MAX_OUTPUT_TOKENS, GEMINI_CANDIDATE_COUNT
    )

    fixer = AIFixer(
        api_base_url=GEMINI_API_BASE_URL,
        model_name=GEMINI_MODEL_NAME,
        api_key=GEMINI_API_KEY,
        access_token=GEMINI_ACCESS_TOKEN,
        temperature=GEMINI_TEMPERATURE,
        max_output_tokens=GEMINI_MAX_OUTPUT_TOKENS,
        candidate_count=GEMINI_CANDIDATE_COUNT
    )

    issue_data = ${JSON.stringify(finding)}
    result = fixer.generate_secure_solution(issue_data)
    print(json.dumps({'success': True, 'fix': result.get('fixed_code', '')}))
except Exception as e:
    print(json.dumps({'success': False, 'error': str(e)}))
`

    const python = spawn('python3', ['-c', pythonScript], {
      cwd: AGENTIC_FIXER_PATH
    })

    let output = ''

    python.stdout.on('data', (data) => {
      output += data.toString()
    })

    python.on('close', () => {
      try {
        const result = JSON.parse(output.trim())
        if (result.success) {
          resolve(result.fix)
        } else {
          resolve(null)
        }
      } catch {
        resolve(null)
      }
    })

    python.on('error', () => {
      resolve(null)
    })
  })
}
````

## File: electron/services/store.ts
````typescript
import Store from 'electron-store'
import { app } from 'electron'
import os from 'os'
import path from 'path'
import fs from 'fs'

function resolveStoreCwd(): string {
  try {
    const userData = app.getPath('userData')
    if (userData) {
      fs.mkdirSync(userData, { recursive: true })
      return userData
    }
  } catch {
    // Fall through to home directory fallback.
  }

  const fallback = path.join(os.homedir(), '.bridge-desktop')
  fs.mkdirSync(fallback, { recursive: true })
  return fallback
}

export function createBridgeStore<T extends Record<string, unknown> = Record<string, unknown>>(name: string): Store<T> {
  return new Store<T>({
    name,
    cwd: resolveStoreCwd(),
    clearInvalidConfig: true
  })
}
````

## File: scripts/notarize.cjs
````
const fs = require('fs')
const path = require('path')
const { notarize } = require('@electron/notarize')

/**
 * Electron Builder afterSign hook.
 * Skips gracefully when signing/notarization credentials are not configured.
 */
module.exports = async function notarizeApp(context) {
  const { electronPlatformName, appOutDir, packager } = context

  if (electronPlatformName !== 'darwin') {
    return
  }

  const appleId = process.env.APPLE_ID
  const appleIdPassword = process.env.APPLE_APP_SPECIFIC_PASSWORD
  const teamId = process.env.APPLE_TEAM_ID

  if (!appleId || !appleIdPassword || !teamId) {
    console.log('[notarize] Skipping notarization (missing APPLE_ID / APPLE_APP_SPECIFIC_PASSWORD / APPLE_TEAM_ID).')
    return
  }

  const appName = packager.appInfo.productFilename
  const appPath = path.join(appOutDir, `${appName}.app`)

  if (!fs.existsSync(appPath)) {
    console.log(`[notarize] Skipping notarization, app not found at ${appPath}`)
    return
  }

  console.log(`[notarize] Submitting ${appName} for notarization...`)
  await notarize({
    appBundleId: packager.appInfo.id,
    appPath,
    appleId,
    appleIdPassword,
    teamId
  })
  console.log('[notarize] Notarization complete.')
}
````

## File: src/components/FileBrowser/FileBrowser.tsx
````typescript
import { useState, useEffect } from 'react'
import { useRepositories } from '../../contexts/RepositoryContext'
import type { FileEntry, FileSizeStats } from '../../types'

export default function FileBrowser() {
  const { selectedRepo } = useRepositories()
  const [currentPath, setCurrentPath] = useState<string>('')
  const [files, setFiles] = useState<FileEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [stats, setStats] = useState<FileSizeStats | null>(null)
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    if (selectedRepo) {
      setCurrentPath(selectedRepo.path)
      loadDirectory(selectedRepo.path)
      loadStats()
    }
  }, [selectedRepo])

  const loadStats = async () => {
    if (!selectedRepo) return
    try {
      const statsResult = await window.bridge.getFileStats(selectedRepo.path)
      setStats(statsResult)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const loadDirectory = async (path: string) => {
    setLoading(true)
    setFileContent(null)
    setSelectedFile(null)
    try {
      const entries = await window.bridge.readDirectory(path)
      setFiles(entries)
      setCurrentPath(path)
    } catch (error) {
      console.error('Failed to read directory:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileClick = async (file: FileEntry) => {
    if (file.isDirectory) {
      await loadDirectory(file.path)
    } else {
      try {
        const content = await window.bridge.readFile(file.path)
        setFileContent(content)
        setSelectedFile(file.name)
      } catch (error) {
        console.error('Failed to read file:', error)
      }
    }
  }

  const navigateUp = () => {
    const parent = currentPath.split('/').slice(0, -1).join('/')
    if (parent && selectedRepo && parent.startsWith(selectedRepo.path.split('/').slice(0, -1).join('/'))) {
      loadDirectory(parent)
    }
  }

  const formatSize = (bytes?: number) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getSizeColor = (bytes?: number) => {
    if (!bytes) return 'var(--text-tertiary)'
    if (bytes > 1024 * 1024) return 'var(--error)' // > 1MB
    if (bytes > 500 * 1024) return 'var(--warning)' // > 500KB
    if (bytes > 100 * 1024) return 'var(--accent)' // > 100KB
    return 'var(--text-tertiary)'
  }

  if (!selectedRepo) {
    return (
      <div className="empty-state fade-in">
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
        </svg>
        <h3 className="empty-state-title">No repository selected</h3>
        <p className="empty-state-desc">Select a repository from the sidebar to browse its files</p>
      </div>
    )
  }

  return (
    <div className="file-browser fade-in">
      <div className="file-browser-header">
        <button
          className="btn btn-secondary btn-icon"
          onClick={navigateUp}
          disabled={currentPath === selectedRepo.path}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="file-path">{currentPath}</div>
        <button
          className={`btn ${showStats ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setShowStats(!showStats)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 20V10M12 20V4M6 20v-6" />
          </svg>
          Stats
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => loadDirectory(currentPath)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          Refresh
        </button>
      </div>

      {showStats && stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
          <div className="card" style={{ padding: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Size</div>
            <div style={{ fontSize: '18px', fontWeight: 600 }}>{stats.totalSizeFormatted}</div>
          </div>
          <div className="card" style={{ padding: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Files</div>
            <div style={{ fontSize: '18px', fontWeight: 600 }}>{stats.fileCount}</div>
          </div>
          <div className="card" style={{ padding: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Largest File</div>
            <div style={{ fontSize: '14px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {stats.largestFiles[0]?.sizeFormatted || '—'}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '16px', height: showStats ? 'calc(100% - 120px)' : 'calc(100% - 60px)' }}>
        <div className="file-list" style={{ flex: 1 }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <div className="spinner" />
            </div>
          ) : files.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>
              Empty directory
            </div>
          ) : (
            files.map(file => (
              <div
                key={file.path}
                className="file-item"
                onClick={() => handleFileClick(file)}
                style={{ background: selectedFile === file.name ? 'var(--bg-secondary)' : undefined }}
              >
                {file.isDirectory ? (
                  <svg className="file-icon folder" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                  </svg>
                ) : (
                  <svg className="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                )}
                <span className="file-name">{file.name}</span>
                {!file.isDirectory && file.size && (
                  <span className="file-size" style={{ color: getSizeColor(file.size), fontWeight: file.size && file.size > 100 * 1024 ? 500 : 400 }}>
                    {formatSize(file.size)}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {fileContent !== null && (
          <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontWeight: 500, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{selectedFile}</span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { setFileContent(null); setSelectedFile(null) }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <pre style={{
              flex: 1,
              padding: '16px',
              margin: 0,
              overflow: 'auto',
              fontSize: '13px',
              lineHeight: 1.6,
              color: 'var(--text-secondary)'
            }}>
              {fileContent}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
````

## File: src/components/FullScan/CircularDepsGraph.tsx
````typescript
import { useEffect, useRef } from 'react'
import { DataSet, Network } from 'vis-network/standalone'
import type { Edge, Node } from 'vis-network'
import type { CircularDependency } from '../../types'

interface CircularDepsGraphProps {
  dependencies: CircularDependency[]
}

export default function CircularDepsGraph({ dependencies }: CircularDepsGraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const networkRef = useRef<Network | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const nodeSet = new Set<string>()
    const edges: Edge[] = []

    for (const dep of dependencies) {
      nodeSet.add(dep.from)
      nodeSet.add(dep.to)
      edges.push({
        id: `${dep.from}->${dep.to}`,
        from: dep.from,
        to: dep.to,
        arrows: 'to',
        color: { color: 'rgba(245, 167, 0, 0.6)' }
      })
    }

    const nodes = new DataSet<Node>(
      Array.from(nodeSet).map(node => ({
        id: node,
        label: node.split('/').pop() || node,
        title: node,
        shape: 'dot'
      }))
    )

    const edgeData = new DataSet<Edge>(edges)

    if (!networkRef.current) {
      networkRef.current = new Network(
        containerRef.current,
        { nodes, edges: edgeData },
        {
          autoResize: true,
          nodes: {
            color: {
              background: 'rgba(245, 167, 0, 0.2)',
              border: 'rgba(245, 167, 0, 0.7)'
            },
            font: { color: 'var(--text-primary)' },
            size: 16
          },
          edges: { smooth: true },
          physics: {
            stabilization: false,
            barnesHut: { springLength: 140, springConstant: 0.03 }
          },
          interaction: { hover: true }
        }
      )
    } else {
      networkRef.current.setData({ nodes, edges: edgeData })
    }

    return () => {
      networkRef.current?.destroy()
      networkRef.current = null
    }
  }, [dependencies])

  return <div className="graph-container" ref={containerRef} />
}
````

## File: src/contexts/AppSettingsContext.tsx
````typescript
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { AppSettings } from '../types'

interface AppSettingsContextType {
  settings: AppSettings
  loading: boolean
  saveSettings: (next: Partial<AppSettings>) => Promise<void>
}

const defaultSettings: AppSettings = {
  experimentalFeatures: false,
  onboardingCompleted: false
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined)

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await window.bridge.getAppSettings()
        setSettings(stored)
      } catch {
        setSettings(defaultSettings)
      } finally {
        setLoading(false)
      }
    }
    void loadSettings()
  }, [])

  const saveSettings = async (next: Partial<AppSettings>) => {
    const saved = await window.bridge.saveAppSettings(next)
    setSettings(saved)
  }

  const value = useMemo(() => ({
    settings,
    loading,
    saveSettings
  }), [settings, loading])

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  )
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext)
  if (!context) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider')
  }
  return context
}
````

## File: src/contexts/ScanContext.tsx
````typescript
import React, { createContext, useContext, useMemo, useState } from 'react'
import type { FullScanResult } from '../types'

export type ScanTab = 'overview' | 'circular' | 'dead-code' | 'bundle' | 'coverage' | 'docs'

interface ScanContextType {
  scanResults: Record<string, FullScanResult>
  updateScanResult: (repoPath: string, result: FullScanResult) => void
  preferredTab: ScanTab
  setPreferredTab: (tab: ScanTab) => void
  scanRequestRepo: string | null
  requestScan: (repoPath: string) => void
  clearScanRequest: () => void
}

const STORAGE_KEY = 'bridge-scan-results'

const ScanContext = createContext<ScanContextType | undefined>(undefined)

export function ScanProvider({ children }: { children: React.ReactNode }) {
  const [scanResults, setScanResults] = useState<Record<string, FullScanResult>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })
  const [preferredTab, setPreferredTab] = useState<ScanTab>('overview')
  const [scanRequestRepo, setScanRequestRepo] = useState<string | null>(null)

  const updateScanResult = (repoPath: string, result: FullScanResult) => {
    setScanResults(prev => {
      const next = { ...prev, [repoPath]: result }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // Ignore storage failures
      }
      return next
    })
  }

  const requestScan = (repoPath: string) => {
    setScanRequestRepo(repoPath)
  }

  const clearScanRequest = () => {
    setScanRequestRepo(null)
  }

  const value = useMemo(() => ({
    scanResults,
    updateScanResult,
    preferredTab,
    setPreferredTab,
    scanRequestRepo,
    requestScan,
    clearScanRequest
  }), [scanResults, preferredTab, scanRequestRepo])

  return (
    <ScanContext.Provider value={value}>
      {children}
    </ScanContext.Provider>
  )
}

export function useScanContext() {
  const context = useContext(ScanContext)
  if (!context) {
    throw new Error('useScanContext must be used within a ScanProvider')
  }
  return context
}
````

## File: src/contexts/ThemeContext.tsx
````typescript
import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('bridge-theme')
    if (saved === 'light' || saved === 'dark') {
      return saved
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('bridge-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
````

## File: DEMO.md
````markdown
# Bridge Desktop - Quick Demo

## Install & Run
1. Clone this repo
2. `npm install`
3. `npm run dev`

## Test It
1. Open Bridge Desktop
2. Click "Import Repository"
3. Point it at any repo with package.json
4. Click "Update Dependencies"
5. Select packages to update
6. Click "Run Update" (tests will run automatically)
7. Check the terminal output
8. See the PR created (if tests passed)

## What Makes This Different from Dependabot
- Runs YOUR tests in YOUR environment
- Only creates PR if tests actually pass
- Uses package lock as source of truth
- No blind automation - you see what it's doing
````

## File: index.html
````html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <title>Bridge</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
````

## File: tsconfig.node.json
````json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "outDir": "dist-electron",
    "rootDir": ".",
    "esModuleInterop": true
  },
  "include": ["vite.config.ts", "electron/**/*"]
}
````

## File: electron/services/appSettings.ts
````typescript
import { createBridgeStore } from './store'

export interface AppSettings {
  experimentalFeatures: boolean
  onboardingCompleted: boolean
}

const store = createBridgeStore('bridge-app-settings')
const SETTINGS_KEY = 'bridge-app-settings'

const defaultSettings: AppSettings = {
  experimentalFeatures: false,
  onboardingCompleted: false
}

export function getAppSettings(): AppSettings {
  return store.get(SETTINGS_KEY, defaultSettings) as AppSettings
}

export function saveAppSettings(settings: Partial<AppSettings>): AppSettings {
  const current = getAppSettings()
  const next = {
    ...current,
    ...settings
  }
  store.set(SETTINGS_KEY, next)
  return next
}

export function isExperimentalFeaturesEnabled(): boolean {
  return getAppSettings().experimentalFeatures
}
````

## File: electron/services/bridgeConsoleApi.ts
````typescript
import { createBridgeStore } from './store'

export interface BridgeConsoleSettings {
  consoleUrl: string
  apiToken: string
  githubUsername: string
  autoUpload: boolean
}

export interface ConsoleUploadResult {
  success: boolean
  tdScore?: number
  tdDelta?: number
  error?: string
}

const store = createBridgeStore('bridge-console')
const SETTINGS_KEY = 'bridge-console-settings'

export function getBridgeConsoleSettings(): BridgeConsoleSettings {
  return store.get(SETTINGS_KEY, {
    consoleUrl: 'http://localhost:3000',
    apiToken: '',
    githubUsername: '',
    autoUpload: true
  }) as BridgeConsoleSettings
}

export function saveBridgeConsoleSettings(settings: BridgeConsoleSettings): BridgeConsoleSettings {
  store.set(SETTINGS_KEY, settings)
  return settings
}

export async function testBridgeConsoleConnection(settings: BridgeConsoleSettings): Promise<{ ok: boolean; message?: string }> {
  const baseUrl = (settings.consoleUrl || 'http://localhost:3000').replace(/\/$/, '')
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(`${baseUrl}/api/health`, {
      signal: controller.signal,
      headers: settings.apiToken ? { Authorization: `Bearer ${settings.apiToken}` } : undefined
    })

    clearTimeout(timeout)

    if (response.ok) {
      return { ok: true }
    }

    return { ok: false, message: `Status ${response.status}` }
  } catch (error: any) {
    return { ok: false, message: error?.message || 'Connection failed' }
  }
}

export async function sendScanToConsole(scanResults: any, settings: BridgeConsoleSettings): Promise<ConsoleUploadResult> {
  const baseUrl = (settings.consoleUrl || 'http://localhost:3000').replace(/\/$/, '')
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const response = await fetch(`${baseUrl}/api/scans`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.apiToken}`
      },
      body: JSON.stringify({
        repository_url: scanResults.repositoryUrl || scanResults.repository,
        scan_date: scanResults.scanDate,
        metrics: {
          dependencies: {
            outdated_count: scanResults.dependencies?.outdated?.length || 0,
            critical_security_vulnerabilities: scanResults.dependencies?.vulnerabilities?.critical || 0,
            circular_dependencies: scanResults.circularDependencies?.count || 0
          },
          code_quality: {
            dead_code_files: scanResults.deadCode?.deadFiles?.length || 0,
            duplicate_code_percentage: 0,
            average_complexity: 0
          },
          testing: {
            coverage_percentage: scanResults.testCoverage?.coveragePercentage || 0,
            uncovered_critical_files: scanResults.testCoverage?.uncoveredCriticalFiles?.map((f: any) => f.file) || []
          },
          documentation: {
            missing_readme_sections: scanResults.documentation?.missingReadmeSections || [],
            undocumented_functions: scanResults.documentation?.undocumentedFunctions || 0
          }
        },
        engineer_github_username: settings.githubUsername
      })
    })

    clearTimeout(timeout)

    if (!response.ok) {
      return { success: false, error: `Console responded with ${response.status}` }
    }

    const data = await response.json().catch(() => ({}))
    return {
      success: true,
      tdScore: data?.td_score,
      tdDelta: data?.td_delta
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Failed to send scan to Bridge-Console'
    }
  }
}
````

## File: electron/services/fileSystem.ts
````typescript
import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import os from 'os'
import { detectLanguages, Language } from './languages'

export interface Repository {
  path: string
  name: string
  languages: Language[]
  hasGit: boolean
  addedAt: string
  exists: boolean
}

export interface FileEntry {
  name: string
  path: string
  isDirectory: boolean
  size?: number
  modified?: string
}

const SKIP_DIRECTORY_NAMES = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.turbo',
  '.next',
  '.nuxt'
])

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

export async function scanRepository(repoPath: string): Promise<Repository> {
  const name = path.basename(repoPath)

  let hasGit = false
  let exists = true

  try {
    await fs.access(repoPath)
  } catch {
    exists = false
  }

  try {
    await fs.access(path.join(repoPath, '.git'))
    hasGit = true
  } catch {}

  const languages = exists ? await detectLanguages(repoPath) : []

  return {
    path: repoPath,
    name,
    languages,
    hasGit,
    addedAt: new Date().toISOString(),
    exists
  }
}

export async function scanForRepos(directory: string, maxDepth = 2): Promise<Repository[]> {
  const discovered = new Set<string>()

  async function walk(currentPath: string, depth: number): Promise<void> {
    if (depth > maxDepth) {
      return
    }

    const entries = await fs.readdir(currentPath, { withFileTypes: true }).catch(() => [])

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue
      }

      if (entry.name.startsWith('.') && entry.name !== '.git') {
        continue
      }

      if (SKIP_DIRECTORY_NAMES.has(entry.name)) {
        continue
      }

      const fullPath = path.join(currentPath, entry.name)
      const gitPath = path.join(fullPath, '.git')

      if (await pathExists(gitPath)) {
        discovered.add(fullPath)
        continue
      }

      await walk(fullPath, depth + 1)
    }
  }

  await walk(directory, 0)

  const repos = await Promise.all(
    Array.from(discovered).map(repoPath => scanRepository(repoPath))
  )

  return repos.sort((a, b) => a.name.localeCompare(b.name))
}

export function getDefaultCodeDirectory(): string {
  const homeDir = os.homedir()
  const commonPaths = [
    path.join(homeDir, 'code'),
    path.join(homeDir, 'projects'),
    path.join(homeDir, 'dev'),
    path.join(homeDir, 'workspace'),
    path.join(homeDir, 'Documents', 'code')
  ]

  for (const candidate of commonPaths) {
    try {
      const stats = fsSync.statSync(candidate)
      if (stats.isDirectory()) {
        return candidate
      }
    } catch {
      // Continue
    }
  }

  return path.join(homeDir, 'code')
}

export async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(dirPath)
    return stats.isDirectory()
  } catch {
    return false
  }
}

export async function checkRepositoryExists(repoPath: string): Promise<boolean> {
  try {
    await fs.access(repoPath)
    return true
  } catch {
    return false
  }
}

export async function validateRepositories(repos: Repository[]): Promise<Repository[]> {
  const validated: Repository[] = []

  for (const repo of repos) {
    const exists = await checkRepositoryExists(repo.path)
    validated.push({ ...repo, exists })
  }

  return validated
}

export async function cleanupMissingRepositories(repos: Repository[]): Promise<Repository[]> {
  const validated = await validateRepositories(repos)
  return validated.filter(r => r.exists)
}

export async function readDirectory(dirPath: string): Promise<FileEntry[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })

  const files: FileEntry[] = []

  for (const entry of entries) {
    // Skip hidden files and node_modules
    if (entry.name.startsWith('.') || entry.name === 'node_modules') {
      continue
    }

    const fullPath = path.join(dirPath, entry.name)

    try {
      const stats = await fs.stat(fullPath)

      files.push({
        name: entry.name,
        path: fullPath,
        isDirectory: entry.isDirectory(),
        size: entry.isDirectory() ? undefined : stats.size,
        modified: stats.mtime.toISOString()
      })
    } catch {
      // Skip files we can't access
    }
  }

  // Sort: directories first, then alphabetically
  return files.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1
    if (!a.isDirectory && b.isDirectory) return 1
    return a.name.localeCompare(b.name)
  })
}

export async function readFile(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath, 'utf-8')
  return content
}

// Get total size of a directory (excluding node_modules, .git, etc.)
export async function getDirectorySize(dirPath: string): Promise<number> {
  let totalSize = 0

  async function scanDir(dir: string) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        if (['node_modules', '.git', 'vendor', 'deps', '_build'].includes(entry.name)) {
          continue
        }

        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
          await scanDir(fullPath)
        } else {
          try {
            const stats = await fs.stat(fullPath)
            totalSize += stats.size
          } catch {}
        }
      }
    } catch {}
  }

  await scanDir(dirPath)
  return totalSize
}
````

## File: electron/services/languages.ts
````typescript
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'

const execAsync = promisify(exec)

export type Language = 'javascript' | 'python' | 'ruby' | 'elixir' | 'unknown'

export interface LanguageInfo {
  language: Language
  packageManager: string
  lockFile: string | null
  configFile: string
}

export interface OutdatedPackage {
  name: string
  current: string
  wanted: string
  latest: string
  type: 'dependencies' | 'devDependencies'
  hasPatchUpdate: boolean
  isNonBreaking: boolean
  updateType: 'patch' | 'minor' | 'major' | 'unknown'
  language: Language
  vulnerabilities?: {
    critical: number
    high: number
    medium: number
    low: number
    total: number
  }
}

const LANGUAGE_CONFIG: Record<Language, LanguageInfo> = {
  javascript: {
    language: 'javascript',
    packageManager: 'npm',
    lockFile: 'package-lock.json',
    configFile: 'package.json'
  },
  python: {
    language: 'python',
    packageManager: 'pip',
    lockFile: null,
    configFile: 'requirements.txt'
  },
  ruby: {
    language: 'ruby',
    packageManager: 'bundler',
    lockFile: 'Gemfile.lock',
    configFile: 'Gemfile'
  },
  elixir: {
    language: 'elixir',
    packageManager: 'mix',
    lockFile: 'mix.lock',
    configFile: 'mix.exs'
  },
  unknown: {
    language: 'unknown',
    packageManager: '',
    lockFile: null,
    configFile: ''
  }
}

export async function detectLanguages(repoPath: string): Promise<Language[]> {
  const languages: Language[] = []

  const checks = [
    { file: 'package.json', lang: 'javascript' as Language },
    { file: 'requirements.txt', lang: 'python' as Language },
    { file: 'Pipfile', lang: 'python' as Language },
    { file: 'pyproject.toml', lang: 'python' as Language },
    { file: 'Gemfile', lang: 'ruby' as Language },
    { file: 'mix.exs', lang: 'elixir' as Language }
  ]

  for (const check of checks) {
    try {
      await fs.access(path.join(repoPath, check.file))
      if (!languages.includes(check.lang)) {
        languages.push(check.lang)
      }
    } catch {}
  }

  return languages
}

export function getLanguageConfig(lang: Language): LanguageInfo {
  return LANGUAGE_CONFIG[lang]
}

// Python: Parse requirements.txt and get outdated packages
export async function getPythonOutdated(repoPath: string): Promise<OutdatedPackage[]> {
  const packages: OutdatedPackage[] = []

  try {
    // Check for requirements.txt
    const reqPath = path.join(repoPath, 'requirements.txt')
    const content = await fs.readFile(reqPath, 'utf-8')

    // Parse requirements.txt
    const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('#'))
    const installed: Map<string, string> = new Map()

    for (const line of lines) {
      const match = line.match(/^([a-zA-Z0-9_-]+)==([0-9.]+)/)
      if (match) {
        installed.set(match[1].toLowerCase(), match[2])
      }
    }

    // Get outdated packages using pip
    try {
      const { stdout } = await execAsync('pip list --outdated --format=json', {
        cwd: repoPath,
        timeout: 60000
      })

      const outdated = JSON.parse(stdout || '[]')

      for (const pkg of outdated) {
        const name = pkg.name.toLowerCase()
        if (installed.has(name)) {
          const current = pkg.version
          const latest = pkg.latest_version

          // Parse versions for patch detection
          const currentParts = current.split('.').map(Number)
          const latestParts = latest.split('.').map(Number)

          const hasPatchUpdate =
            currentParts[0] === latestParts[0] &&
            currentParts[1] === latestParts[1] &&
            (currentParts[2] || 0) < (latestParts[2] || 0)

          packages.push({
            name: pkg.name,
            current,
            wanted: latest,
            latest,
            type: 'dependencies',
            hasPatchUpdate,
            isNonBreaking: hasPatchUpdate,
            updateType: hasPatchUpdate ? 'patch' : 'unknown',
            language: 'python'
          })
        }
      }
    } catch (e) {
      console.error('pip list failed:', e)
    }
  } catch {}

  return packages
}

// Ruby: Parse Gemfile.lock and get outdated gems
export async function getRubyOutdated(repoPath: string): Promise<OutdatedPackage[]> {
  const packages: OutdatedPackage[] = []

  try {
    await fs.access(path.join(repoPath, 'Gemfile'))

    // Run bundle outdated
    try {
      const { stdout } = await execAsync('bundle outdated --parseable', {
        cwd: repoPath,
        timeout: 120000
      })

      // Parse output: gem_name (newest x.x.x, installed x.x.x)
      const lines = stdout.split('\n').filter(l => l.trim())

      for (const line of lines) {
        const match = line.match(/^(\S+)\s+\(newest\s+([0-9.]+),\s+installed\s+([0-9.]+)/)
        if (match) {
          const [, name, latest, current] = match

          const currentParts = current.split('.').map(Number)
          const latestParts = latest.split('.').map(Number)

          const hasPatchUpdate =
            currentParts[0] === latestParts[0] &&
            currentParts[1] === latestParts[1] &&
            (currentParts[2] || 0) < (latestParts[2] || 0)

          packages.push({
            name,
            current,
            wanted: latest,
            latest,
            type: 'dependencies',
            hasPatchUpdate,
            isNonBreaking: hasPatchUpdate,
            updateType: hasPatchUpdate ? 'patch' : 'unknown',
            language: 'ruby'
          })
        }
      }
    } catch (e: any) {
      // bundle outdated exits with 1 when there are outdated gems
      if (e.stdout) {
        const lines = e.stdout.split('\n').filter((l: string) => l.trim())
        for (const line of lines) {
          const match = line.match(/^(\S+)\s+\(newest\s+([0-9.]+),\s+installed\s+([0-9.]+)/)
          if (match) {
            const [, name, latest, current] = match
            const currentParts = current.split('.').map(Number)
            const latestParts = latest.split('.').map(Number)
            const hasPatchUpdate =
              currentParts[0] === latestParts[0] &&
              currentParts[1] === latestParts[1] &&
              (currentParts[2] || 0) < (latestParts[2] || 0)

            packages.push({
              name,
              current,
              wanted: latest,
              latest,
              type: 'dependencies',
              hasPatchUpdate,
              isNonBreaking: hasPatchUpdate,
              updateType: hasPatchUpdate ? 'patch' : 'unknown',
              language: 'ruby'
            })
          }
        }
      }
    }
  } catch {}

  return packages
}

// Elixir: Parse mix.lock and get outdated deps
export async function getElixirOutdated(repoPath: string): Promise<OutdatedPackage[]> {
  const packages: OutdatedPackage[] = []

  try {
    await fs.access(path.join(repoPath, 'mix.exs'))

    // Run mix hex.outdated
    try {
      const { stdout } = await execAsync('mix hex.outdated', {
        cwd: repoPath,
        timeout: 120000
      })

      // Parse output
      const lines = stdout.split('\n').filter(l => l.trim())

      for (const line of lines) {
        // Format: dependency    current  latest
        const match = line.match(/^(\S+)\s+([0-9.]+)\s+([0-9.]+)/)
        if (match) {
          const [, name, current, latest] = match

          const currentParts = current.split('.').map(Number)
          const latestParts = latest.split('.').map(Number)

          const hasPatchUpdate =
            currentParts[0] === latestParts[0] &&
            currentParts[1] === latestParts[1] &&
            (currentParts[2] || 0) < (latestParts[2] || 0)

          packages.push({
            name,
            current,
            wanted: latest,
            latest,
            type: 'dependencies',
            hasPatchUpdate,
            isNonBreaking: hasPatchUpdate,
            updateType: hasPatchUpdate ? 'patch' : 'unknown',
            language: 'elixir'
          })
        }
      }
    } catch (e) {
      console.error('mix hex.outdated failed:', e)
    }
  } catch {}

  return packages
}

// Update functions for each language
export async function updatePythonPackages(repoPath: string, packages: string[]): Promise<{ updated: string[], failed: string[] }> {
  const updated: string[] = []
  const failed: string[] = []

  const reqPath = path.join(repoPath, 'requirements.txt')

  try {
    let content = await fs.readFile(reqPath, 'utf-8')

    for (const pkg of packages) {
      try {
        // Update single package
        await execAsync(`pip install --upgrade ${pkg}`, { cwd: repoPath, timeout: 60000 })

        // Get new version
        const { stdout } = await execAsync(`pip show ${pkg} | grep Version`, { cwd: repoPath })
        const version = stdout.match(/Version:\s*([0-9.]+)/)?.[1]

        if (version) {
          // Update requirements.txt
          const regex = new RegExp(`^${pkg}==.+$`, 'mi')
          content = content.replace(regex, `${pkg}==${version}`)
          updated.push(pkg)
        }
      } catch {
        failed.push(pkg)
      }
    }

    await fs.writeFile(reqPath, content)
  } catch (e) {
    console.error('Python update failed:', e)
  }

  return { updated, failed }
}

export async function updateRubyPackages(repoPath: string, packages: string[]): Promise<{ updated: string[], failed: string[] }> {
  const updated: string[] = []
  const failed: string[] = []

  for (const pkg of packages) {
    try {
      await execAsync(`bundle update ${pkg} --patch`, { cwd: repoPath, timeout: 120000 })
      updated.push(pkg)
    } catch {
      failed.push(pkg)
    }
  }

  return { updated, failed }
}

export async function updateElixirPackages(repoPath: string, packages: string[]): Promise<{ updated: string[], failed: string[] }> {
  const updated: string[] = []
  const failed: string[] = []

  for (const pkg of packages) {
    try {
      await execAsync(`mix deps.update ${pkg}`, { cwd: repoPath, timeout: 120000 })
      updated.push(pkg)
    } catch {
      failed.push(pkg)
    }
  }

  return { updated, failed }
}

// Get clean install command for language
export function getCleanInstallCommand(lang: Language): string {
  switch (lang) {
    case 'javascript':
      return 'rm -rf node_modules package-lock.json && npm install && npm update && rm -rf node_modules package-lock.json && npm install'
    case 'python':
      return 'pip install -r requirements.txt --upgrade'
    case 'ruby':
      return 'rm -rf .bundle vendor/bundle && bundle install'
    case 'elixir':
      return 'rm -rf deps _build && mix deps.get && mix compile'
    default:
      return ''
  }
}

// Get test command for language
export function getTestCommand(lang: Language): string | null {
  switch (lang) {
    case 'javascript':
      return 'npm test'
    case 'python':
      return 'pytest || python -m pytest || python -m unittest discover'
    case 'ruby':
      return 'bundle exec rspec || bundle exec rake test'
    case 'elixir':
      return 'mix test'
    default:
      return null
  }
}

// Get lint command for language
export function getLintCommand(lang: Language): string | null {
  switch (lang) {
    case 'javascript':
      return 'npm run lint || npx eslint .'
    case 'python':
      return 'flake8 || pylint . || ruff check .'
    case 'ruby':
      return 'bundle exec rubocop'
    case 'elixir':
      return 'mix credo'
    default:
      return null
  }
}

// Get files to commit after update
export function getFilesToCommit(lang: Language): string[] {
  switch (lang) {
    case 'javascript':
      return ['package.json', 'package-lock.json']
    case 'python':
      return ['requirements.txt', 'Pipfile.lock', 'poetry.lock']
    case 'ruby':
      return ['Gemfile', 'Gemfile.lock']
    case 'elixir':
      return ['mix.exs', 'mix.lock']
    default:
      return []
  }
}
````

## File: electron/services/smartScheduler.ts
````typescript
import { exec } from 'child_process'
import { promisify } from 'util'
import { BrowserWindow } from 'electron'
import { createBridgeStore } from './store'

const execAsync = promisify(exec)
const store = createBridgeStore('bridge-smart-scheduler')

export interface SmartScanSchedule {
  id: string
  repoPath: string
  repoName: string
  enabled: boolean
  quietHour: number
  lastRun: string | null
  nextRun: string
  createdAt: string
}

const SMART_KEY = 'smart-scan-schedules'
const smartTimers: Map<string, NodeJS.Timeout> = new Map()
let smartScanExecutor: ((repoPath: string) => Promise<void>) | null = null

export function setSmartScanExecutor(executor: (repoPath: string) => Promise<void>): void {
  smartScanExecutor = executor
}

export function getSmartScanSchedules(): SmartScanSchedule[] {
  return store.get(SMART_KEY, []) as SmartScanSchedule[]
}

export function saveSmartScanSchedules(schedules: SmartScanSchedule[]): void {
  store.set(SMART_KEY, schedules)
}

export async function analyzeCommitPatterns(repoPath: string): Promise<number> {
  try {
    const { stdout } = await execAsync('git log --pretty=format:"%ai" --since="30 days ago"', { cwd: repoPath, timeout: 30000 })
    const lines = stdout.split('\n').filter(line => line.trim())
    if (lines.length === 0) return 6

    const hourCounts = new Array(24).fill(0)
    for (const line of lines) {
      const date = new Date(line.trim())
      if (!Number.isNaN(date.getTime())) {
        hourCounts[date.getHours()] += 1
      }
    }

    const minCount = Math.min(...hourCounts)
    const quietHour = hourCounts.indexOf(minCount)
    return quietHour === -1 ? 6 : quietHour
  } catch {
    return 6
  }
}

function calculateNextRun(quietHour: number): string {
  const now = new Date()
  const next = new Date(now)
  next.setHours(quietHour, 0, 0, 0)
  if (next <= now) {
    next.setDate(next.getDate() + 1)
  }
  return next.toISOString()
}

export async function addSmartScanSchedule(repoPath: string, repoName: string): Promise<SmartScanSchedule> {
  const schedules = getSmartScanSchedules()
  const quietHour = await analyzeCommitPatterns(repoPath)

  const schedule: SmartScanSchedule = {
    id: `smart-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    repoPath,
    repoName,
    enabled: true,
    quietHour,
    lastRun: null,
    nextRun: calculateNextRun(quietHour),
    createdAt: new Date().toISOString()
  }

  schedules.push(schedule)
  saveSmartScanSchedules(schedules)
  scheduleSmartTimer(schedule)

  return schedule
}

export function updateSmartScanSchedule(id: string, updates: Partial<SmartScanSchedule>): SmartScanSchedule | null {
  const schedules = getSmartScanSchedules()
  const index = schedules.findIndex(schedule => schedule.id === id)
  if (index === -1) return null

  schedules[index] = { ...schedules[index], ...updates }
  if (updates.quietHour !== undefined) {
    schedules[index].nextRun = calculateNextRun(updates.quietHour)
  }

  saveSmartScanSchedules(schedules)
  clearSmartTimer(id)

  if (schedules[index].enabled) {
    scheduleSmartTimer(schedules[index])
  }

  return schedules[index]
}

export function deleteSmartScanSchedule(id: string): boolean {
  const schedules = getSmartScanSchedules()
  const filtered = schedules.filter(schedule => schedule.id !== id)
  if (filtered.length === schedules.length) return false

  saveSmartScanSchedules(filtered)
  clearSmartTimer(id)
  return true
}

export function initializeSmartScheduler(): void {
  const schedules = getSmartScanSchedules()
  for (const schedule of schedules) {
    if (schedule.enabled) {
      const next = new Date(schedule.nextRun)
      const now = new Date()
      if (next <= now) {
        setTimeout(() => executeSmartScan(schedule.id), 5000)
      } else {
        scheduleSmartTimer(schedule)
      }
    }
  }
}

function scheduleSmartTimer(schedule: SmartScanSchedule): void {
  if (!schedule.enabled) return
  const nextRun = new Date(schedule.nextRun)
  const now = new Date()
  const delay = Math.max(0, nextRun.getTime() - now.getTime())
  if (delay > 24 * 60 * 60 * 1000) return

  const timer = setTimeout(() => {
    executeSmartScan(schedule.id)
  }, delay)

  smartTimers.set(schedule.id, timer)
}

function clearSmartTimer(id: string): void {
  const timer = smartTimers.get(id)
  if (timer) {
    clearTimeout(timer)
    smartTimers.delete(id)
  }
}

async function executeSmartScan(id: string): Promise<void> {
  const schedules = getSmartScanSchedules()
  const schedule = schedules.find(item => item.id === id)
  if (!schedule || !schedule.enabled) return

  const windows = BrowserWindow.getAllWindows()
  for (const win of windows) {
    win.webContents.send('smart-scan-started', { id: schedule.id, repoName: schedule.repoName })
  }

  if (smartScanExecutor) {
    try {
      await smartScanExecutor(schedule.repoPath)
    } catch {
      // Swallow errors to keep schedule alive
    }
  }

  const index = schedules.findIndex(item => item.id === id)
  if (index !== -1) {
    schedules[index].lastRun = new Date().toISOString()
    schedules[index].nextRun = calculateNextRun(schedules[index].quietHour)
    saveSmartScanSchedules(schedules)
    scheduleSmartTimer(schedules[index])
  }
}

export function cleanupSmartScheduler(): void {
  for (const timer of smartTimers.values()) {
    clearTimeout(timer)
  }
  smartTimers.clear()
}
````

## File: src/components/Cleanup/Cleanup.tsx
````typescript
import { useState, useEffect } from 'react'
import { useRepositories } from '../../contexts/RepositoryContext'
import type { CleanupReport, FileSizeStats, DeadCodeReport } from '../../types'

export default function Cleanup() {
  const { selectedRepo } = useRepositories()
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<FileSizeStats | null>(null)
  const [report, setReport] = useState<CleanupReport | null>(null)
  const [activeTab, setActiveTab] = useState<'files' | 'git-history' | 'components'>('files')
  const [deadCode, setDeadCode] = useState<DeadCodeReport | null>(null)
  const [deadCodeLoading, setDeadCodeLoading] = useState(false)
  const [deadCodeMessage, setDeadCodeMessage] = useState<string | null>(null)

  useEffect(() => {
    if (selectedRepo) {
      loadStats()
    }
  }, [selectedRepo])

  const loadStats = async () => {
    if (!selectedRepo) return
    setLoading(true)
    try {
      const [statsResult, reportResult] = await Promise.all([
        window.bridge.getFileStats(selectedRepo.path),
        window.bridge.getCleanupReport(selectedRepo.path)
      ])
      setStats(statsResult)
      setReport(reportResult)
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDeadCode = async () => {
    if (!selectedRepo) return
    setDeadCodeLoading(true)
    setDeadCodeMessage(null)
    try {
      const result = await window.bridge.detectDeadCode(selectedRepo.path)
      setDeadCode(result)
    } catch (error) {
      setDeadCodeMessage(error instanceof Error ? error.message : 'Failed to detect dead code')
    } finally {
      setDeadCodeLoading(false)
    }
  }

  const cleanupAllDeadCode = async () => {
    if (!selectedRepo || !deadCode) return
    setDeadCodeLoading(true)
    setDeadCodeMessage(null)
    try {
      const result = await window.bridge.cleanupDeadCode({
        repoPath: selectedRepo.path,
        deadFiles: deadCode.deadFiles,
        unusedExports: deadCode.unusedExports,
        createPr: true
      })
      if (result.success) {
        setDeadCodeMessage('Cleanup PR created successfully.')
        setDeadCode({ ...deadCode, deadFiles: [] })
      } else {
        setDeadCodeMessage(result.error || 'Cleanup failed')
      }
    } catch (error) {
      setDeadCodeMessage(error instanceof Error ? error.message : 'Cleanup failed')
    } finally {
      setDeadCodeLoading(false)
    }
  }

  if (!selectedRepo) {
    return (
      <div className="empty-state fade-in">
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
        <h3 className="empty-state-title">No repository selected</h3>
        <p className="empty-state-desc">Select a repository from the sidebar to analyze</p>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Dead Code Cleanup</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={loadDeadCode} disabled={deadCodeLoading}>
              {deadCodeLoading ? 'Scanning...' : 'Detect Dead Code'}
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={cleanupAllDeadCode}
              disabled={deadCodeLoading || !deadCode || deadCode.deadFiles.length === 0}
            >
              Cleanup All
            </button>
          </div>
        </div>

        {deadCodeMessage && (
          <div style={{ padding: '0 16px 12px', color: 'var(--text-secondary)' }}>
            {deadCodeMessage}
          </div>
        )}

        {deadCode && (
          <div style={{ padding: '0 16px 16px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {deadCode.deadFiles.length} unused files, {deadCode.unusedExports.length} unused exports
            </div>
            {deadCode.deadFiles.length === 0 ? (
              <div style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>No unused files detected.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {deadCode.deadFiles.slice(0, 5).map(file => (
                  <div key={file} style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{file}</div>
                ))}
                {deadCode.deadFiles.length > 5 && (
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    +{deadCode.deadFiles.length - 5} more
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ marginBottom: '4px' }}>Cleanup Analysis</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Find hidden bloat, large files in git history, and oversized components.
            </p>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={loadStats}
            disabled={loading}
          >
            {loading ? <div className="spinner" style={{ width: '14px', height: '14px' }} /> : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
            )}
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div className="spinner" />
        </div>
      ) : stats && report ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="card">
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Total Size</div>
              <div style={{ fontSize: '24px', fontWeight: 600 }}>{stats.totalSizeFormatted}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{stats.fileCount} files</div>
            </div>
            <div className="card">
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Git History Bloat</div>
              <div style={{ fontSize: '24px', fontWeight: 600, color: report.totalWastedSpace > 0 ? 'var(--warning)' : 'var(--success)' }}>
                {report.totalWastedSpaceFormatted}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{report.gitHistoryFiles.length} large blobs</div>
            </div>
            <div className="card">
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Large Files</div>
              <div style={{ fontSize: '24px', fontWeight: 600 }}>{report.largeFiles.length}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>files over 500KB</div>
            </div>
            <div className="card">
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Oversized Components</div>
              <div style={{ fontSize: '24px', fontWeight: 600, color: report.oversizedComponents.length > 0 ? 'var(--warning)' : 'var(--success)' }}>
                {report.oversizedComponents.length}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>files over 150 lines</div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                className={`btn ${activeTab === 'files' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => setActiveTab('files')}
              >
                Largest Files ({stats.largestFiles.length})
              </button>
              <button
                className={`btn ${activeTab === 'git-history' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => setActiveTab('git-history')}
              >
                Git History ({report.gitHistoryFiles.length})
              </button>
              <button
                className={`btn ${activeTab === 'components' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => setActiveTab('components')}
              >
                Oversized Components ({report.oversizedComponents.length})
              </button>
            </div>

            {activeTab === 'files' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {stats.largestFiles.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    No large files found
                  </div>
                ) : (
                  stats.largestFiles.map((file, i) => (
                    <div
                      key={file.path}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)'
                      }}
                    >
                      <span style={{ color: 'var(--text-tertiary)', fontSize: '12px', width: '24px' }}>
                        #{i + 1}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {file.path}
                      </span>
                      <span style={{ fontWeight: 500, color: file.size > 1024 * 1024 ? 'var(--warning)' : 'var(--text-secondary)' }}>
                        {file.sizeFormatted}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'git-history' && (
              <div>
                {report.gitHistoryFiles.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 16px', opacity: 0.5 }}>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                    <div>No large blobs in git history!</div>
                  </div>
                ) : (
                  <>
                    <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '13px', color: 'var(--warning)' }}>
                      <strong>Tip:</strong> These files are stored in your git history even if deleted. Use <code style={{ background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '4px' }}>git filter-branch</code> or <code style={{ background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '4px' }}>BFG Repo-Cleaner</code> to remove them.
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {report.gitHistoryFiles.map((file, i) => (
                        <div
                          key={`${file.path}-${i}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 12px',
                            background: 'var(--bg-tertiary)',
                            borderRadius: 'var(--radius-md)'
                          }}
                        >
                          <span style={{ color: 'var(--text-tertiary)', fontSize: '12px', width: '24px' }}>
                            #{i + 1}
                          </span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                          </svg>
                          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {file.path}
                          </span>
                          <span style={{ fontWeight: 500, color: 'var(--warning)' }}>
                            {file.sizeFormatted}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'components' && (
              <div>
                {report.oversizedComponents.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 16px', opacity: 0.5 }}>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                    <div>All components are under 150 lines!</div>
                  </div>
                ) : (
                  <>
                    <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '13px', color: 'var(--warning)' }}>
                      <strong>Tip:</strong> Components over 150 lines are harder to maintain. Consider breaking them into smaller, focused components.
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {report.oversizedComponents.map((comp, i) => (
                        <div
                          key={comp.path}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 12px',
                            background: 'var(--bg-tertiary)',
                            borderRadius: 'var(--radius-md)'
                          }}
                        >
                          <span style={{ color: 'var(--text-tertiary)', fontSize: '12px', width: '24px' }}>
                            #{i + 1}
                          </span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <line x1="3" y1="9" x2="21" y2="9" />
                            <line x1="9" y1="21" x2="9" y2="9" />
                          </svg>
                          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {comp.path}
                          </span>
                          <span className="badge" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '10px' }}>
                            {comp.type}
                          </span>
                          <span style={{ fontWeight: 500, color: comp.lines > 300 ? 'var(--error)' : 'var(--warning)' }}>
                            {comp.lines} lines
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  )
}
````

## File: src/components/FullScan/FullScan.tsx
````typescript
import { useEffect, useMemo, useState } from 'react'
import { useRepositories } from '../../contexts/RepositoryContext'
import { useScanContext, type ScanTab } from '../../contexts/ScanContext'
import { useAppSettings } from '../../contexts/AppSettingsContext'
import type { CircularDependency, DeadCodeExport, FullScanResult } from '../../types'
import CircularDepsGraph from './CircularDepsGraph'

const TAB_LABELS: Record<ScanTab, string> = {
  overview: 'Overview',
  circular: 'Circular Dependencies',
  'dead-code': 'Dead Code',
  bundle: 'Bundle Analysis',
  coverage: 'Test Coverage',
  docs: 'Documentation'
}

const formatNumber = (value: number | null | undefined, fallback = '—') => {
  if (value === null || value === undefined || Number.isNaN(value)) return fallback
  return value.toFixed(1)
}

const formatDuration = (ms: number) => {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${Math.round(ms / 60000)}m`
}

const buildCircularSuggestion = (dep: CircularDependency) => {
  const cycle = dep.cycle.length ? dep.cycle : [dep.from, dep.to]
  const from = cycle[0]
  const to = cycle[1] || dep.to
  const fromName = from.split('/').pop() || from
  const toName = to.split('/').pop() || to

  return `Break the cycle by extracting shared types used by ${fromName} and ${toName} into a new module, or by inverting the import between them.`
}

export default function FullScan() {
  const { selectedRepo } = useRepositories()
  const { settings } = useAppSettings()
  const {
    scanResults,
    updateScanResult,
    preferredTab,
    setPreferredTab,
    scanRequestRepo,
    clearScanRequest
  } = useScanContext()

  const [activeTab, setActiveTab] = useState<ScanTab>(preferredTab)
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState<{ message: string; step: number; total: number } | null>(null)
  const [result, setResult] = useState<FullScanResult | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)
  const [selectedCycle, setSelectedCycle] = useState<CircularDependency | null>(null)
  const [cleanupState, setCleanupState] = useState<{ running: boolean; message?: string; prUrl?: string; error?: string } | null>(null)
  const [removedExports, setRemovedExports] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (selectedRepo) {
      setResult(scanResults[selectedRepo.path] || null)
    }
  }, [selectedRepo, scanResults])

  useEffect(() => {
    setActiveTab(preferredTab)
  }, [preferredTab])

  useEffect(() => {
    if (!selectedRepo || scanning) return
    if (scanRequestRepo && selectedRepo.path === scanRequestRepo) {
      void runScan()
      clearScanRequest()
    }
  }, [scanRequestRepo, selectedRepo, scanning, clearScanRequest])

  useEffect(() => {
    if (!scanning) return
    const cleanup = window.bridge.onFullScanProgress(setProgress)
    return cleanup
  }, [scanning])

  const runScan = async () => {
    if (!selectedRepo) return

    setScanning(true)
    setScanError(null)
    setProgress(null)
    setSelectedCycle(null)

    try {
      const scanResult = await window.bridge.runFullScan(selectedRepo.path)
      setResult(scanResult)
      updateScanResult(selectedRepo.path, scanResult)
    } catch (error) {
      setScanError(error instanceof Error ? error.message : 'Full scan failed')
    } finally {
      setScanning(false)
      setProgress(null)
    }
  }

  const handleTabChange = (tab: ScanTab) => {
    setActiveTab(tab)
    setPreferredTab(tab)
  }

  const handleDeleteFile = async (file: string) => {
    if (!selectedRepo || !result) return

    try {
      await window.bridge.deleteDeadFile(selectedRepo.path, file)
      const nextDeadFiles = result.deadCode.deadFiles.filter(item => item !== file)
      const nextResult = {
        ...result,
        deadCode: {
          ...result.deadCode,
          deadFiles: nextDeadFiles,
          totalDeadCodeCount: nextDeadFiles.length + result.deadCode.unusedExports.length
        }
      }
      setResult(nextResult)
      updateScanResult(selectedRepo.path, nextResult)
    } catch (error) {
      setCleanupState({ running: false, error: error instanceof Error ? error.message : 'Failed to delete file' })
    }
  }

  const handleCleanupAll = async () => {
    if (!selectedRepo || !result) return

    setCleanupState({ running: true, message: 'Removing dead code and creating PR...' })

    try {
      const response = await window.bridge.cleanupDeadCode({
        repoPath: selectedRepo.path,
        deadFiles: result.deadCode.deadFiles,
        unusedExports: result.deadCode.unusedExports,
        createPr: true
      })

      if (response.success) {
        setCleanupState({ running: false, message: 'Cleanup PR created.', prUrl: response.prUrl })
        const nextResult = {
          ...result,
          deadCode: {
            ...result.deadCode,
            deadFiles: [],
            totalDeadCodeCount: result.deadCode.unusedExports.length
          }
        }
        setResult(nextResult)
        updateScanResult(selectedRepo.path, nextResult)
      } else {
        setCleanupState({ running: false, error: response.error || 'Cleanup failed' })
      }
    } catch (error) {
      setCleanupState({ running: false, error: error instanceof Error ? error.message : 'Cleanup failed' })
    }
  }

  const handleRemoveExport = (exportEntry: DeadCodeExport) => {
    const key = `${exportEntry.file}:${exportEntry.exportName}`
    setRemovedExports(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const filteredUnusedExports = useMemo(() => {
    if (!result) return []
    return result.deadCode.unusedExports.filter(exp => !removedExports.has(`${exp.file}:${exp.exportName}`))
  }, [result, removedExports])

  if (!settings.experimentalFeatures) {
    return (
      <div className="empty-state fade-in">
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 3v18M3 12h18" />
        </svg>
        <h3 className="empty-state-title">Experimental feature disabled</h3>
        <p className="empty-state-desc">Enable Experimental Features in Settings to run Full TD Scan.</p>
      </div>
    )
  }

  if (!selectedRepo) {
    return (
      <div className="empty-state fade-in">
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 3v18M3 12h18" />
        </svg>
        <h3 className="empty-state-title">No repository selected</h3>
        <p className="empty-state-desc">Select a repository from the sidebar to run a full TD scan.</p>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="scan-header">
        <div>
          <h2 style={{ marginBottom: '6px' }}>Full TD Scan</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Run all deterministic checks to surface technical debt across the repository.
          </p>
        </div>
        <button className="btn btn-primary" onClick={runScan} disabled={scanning}>
          {scanning ? (
            <>
              <div className="spinner" style={{ width: '14px', height: '14px', borderTopColor: '#000' }} />
              Running...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Run Full TD Scan
            </>
          )}
        </button>
      </div>

      {scanning && progress && (
        <div className="card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div className="spinner" />
            <div>
              <div style={{ fontWeight: 600 }}>{progress.message}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Step {progress.step} of {progress.total}
              </div>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(progress.step / progress.total) * 100}%` }} />
          </div>
        </div>
      )}

      {scanError && (
        <div className="card" style={{ borderColor: 'var(--error)', background: 'rgba(239, 68, 68, 0.08)', marginBottom: '16px' }}>
          <div style={{ color: 'var(--error)' }}>{scanError}</div>
        </div>
      )}

      {result && (
        <>
          <div className="scan-summary-grid">
            <div className="card">
              <div className="summary-label">Last Scan</div>
              <div className="summary-value">{new Date(result.scanDate).toLocaleString()}</div>
              <div className="summary-sub">Duration {formatDuration(result.durationMs)}</div>
            </div>
            <div className="card">
              <div className="summary-label">TD Score</div>
              <div className="summary-value">
                {result.consoleUpload?.tdScore ?? '—'}
                {typeof result.consoleUpload?.tdDelta === 'number' && (
                  <span className={`delta ${result.consoleUpload.tdDelta >= 0 ? 'delta-up' : 'delta-down'}`}>
                    {result.consoleUpload.tdDelta >= 0 ? '+' : ''}{result.consoleUpload.tdDelta}
                  </span>
                )}
              </div>
              <div className="summary-sub">Bridge-Console</div>
            </div>
            <div className="card">
              <div className="summary-label">Circular Deps</div>
              <div className="summary-value">{result.circularDependencies.count}</div>
              <div className="summary-sub">dependency loops</div>
            </div>
            <div className="card">
              <div className="summary-label">Dead Code</div>
              <div className="summary-value">{result.deadCode.totalDeadCodeCount}</div>
              <div className="summary-sub">files + exports</div>
            </div>
            <div className="card">
              <div className="summary-label">Coverage</div>
              <div className="summary-value">
                {formatNumber(result.testCoverage.coveragePercentage)}%
              </div>
              <div className="summary-sub">overall lines</div>
            </div>
          </div>

          {result.consoleUpload && !result.consoleUpload.success && (
            <div className="alert error" style={{ marginBottom: '16px' }}>
              Upload failed: {result.consoleUpload.error || 'Unable to reach Bridge-Console.'}
            </div>
          )}

          <div className="scan-tabs">
            {Object.entries(TAB_LABELS).map(([key, label]) => (
              <button
                key={key}
                className={`btn ${activeTab === key ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => handleTabChange(key as ScanTab)}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="scan-overview-grid">
              <div className="card">
                <h3 style={{ marginBottom: '8px' }}>Highlights</h3>
                <div className="overview-row">
                  <span>Circular dependencies</span>
                  <strong>{result.circularDependencies.count}</strong>
                </div>
                <div className="overview-row">
                  <span>Outdated packages</span>
                  <strong>{result.dependencies.outdated.length}</strong>
                </div>
                <div className="overview-row">
                  <span>Dead files</span>
                  <strong>{result.deadCode.deadFiles.length}</strong>
                </div>
                <div className="overview-row">
                  <span>Bundle size</span>
                  <strong>{result.bundleSize.totalSizeFormatted}</strong>
                </div>
                <div className="overview-row">
                  <span>Docs missing sections</span>
                  <strong>{result.documentation.missingReadmeSections.length}</strong>
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: '8px' }}>Alerts</h3>
                {result.dependencies.error && (
                  <div className="alert warn">Dependency scan failed: {result.dependencies.error}</div>
                )}
                {result.bundleSize.warning && (
                  <div className="alert warn">Bundle size increased by {formatNumber(result.bundleSize.deltaPercent)}%.</div>
                )}
                {result.testCoverage.coveragePercentage !== null && result.testCoverage.coveragePercentage < 50 && (
                  <div className="alert error">Coverage below 50%. Add tests before shipping.</div>
                )}
                {result.dependencies.vulnerabilities.critical > 0 && (
                  <div className="alert error">{result.dependencies.vulnerabilities.critical} critical vulnerabilities detected.</div>
                )}
                {result.dependencies.vulnerabilities.high > 0 && (
                  <div className="alert warn">{result.dependencies.vulnerabilities.high} high vulnerabilities detected.</div>
                )}
                {!result.dependencies.error && !result.bundleSize.warning && result.dependencies.vulnerabilities.critical === 0 && result.dependencies.vulnerabilities.high === 0 && (
                  <div className="alert success">No major alerts detected.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'circular' && (
            <div className="scan-detail-grid">
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3>Dependency Graph</h3>
                  <span className="badge badge-accent">{result.circularDependencies.count} cycles</span>
                </div>
                {result.circularDependencies.error && (
                  <div className="alert warn" style={{ marginBottom: '12px' }}>
                    {result.circularDependencies.error}
                  </div>
                )}
                {result.circularDependencies.count === 0 ? (
                  <div className="empty-state" style={{ padding: '32px 0' }}>
                    No circular dependencies detected.
                  </div>
                ) : (
                  <CircularDepsGraph dependencies={result.circularDependencies.dependencies} />
                )}
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <div className="card-header" style={{ marginBottom: '12px' }}>
                  <h3 className="card-title">Cycles</h3>
                </div>
                {result.circularDependencies.dependencies.length === 0 ? (
                  <div className="empty-state" style={{ padding: '24px 0' }}>No cycles found.</div>
                ) : (
                  <div className="list-stack">
                    {result.circularDependencies.dependencies.map((dep, index) => (
                      <div key={`${dep.from}-${dep.to}-${index}`} className="list-item">
                        <div>
                          <div className="list-title">{dep.from} → {dep.to}</div>
                          {dep.cycle.length > 0 && (
                            <div className="list-sub">Cycle: {dep.cycle.join(' → ')}</div>
                          )}
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedCycle(dep)}>
                          Fix
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {selectedCycle && (
                  <div className="callout" style={{ marginTop: '16px' }}>
                    <div style={{ fontWeight: 600, marginBottom: '6px' }}>Suggested fix</div>
                    <p style={{ marginBottom: '10px' }}>{buildCircularSuggestion(selectedCycle)}</p>
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      Tip: Move shared types into a new module or invert the import direction.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'dead-code' && (
            <div className="scan-detail-grid">
              <div className="card" style={{ padding: '16px' }}>
                <div className="card-header" style={{ marginBottom: '12px' }}>
                  <h3 className="card-title">Unused Files</h3>
                  <button className="btn btn-primary btn-sm" onClick={handleCleanupAll} disabled={cleanupState?.running || result.deadCode.deadFiles.length === 0}>
                    {cleanupState?.running ? 'Cleaning...' : 'Cleanup All'}
                  </button>
                </div>

                {result.deadCode.error && (
                  <div className="alert warn" style={{ marginBottom: '12px' }}>
                    {result.deadCode.error}
                  </div>
                )}

                {cleanupState?.message && (
                  <div className="alert success" style={{ marginBottom: '12px' }}>{cleanupState.message} {cleanupState.prUrl && <span className="badge">PR created</span>}</div>
                )}
                {cleanupState?.error && (
                  <div className="alert error" style={{ marginBottom: '12px' }}>{cleanupState.error}</div>
                )}

                {result.deadCode.deadFiles.length === 0 ? (
                  <div className="empty-state" style={{ padding: '24px 0' }}>No unused files detected.</div>
                ) : (
                  <div className="list-stack">
                    {result.deadCode.deadFiles.map(file => (
                      <div key={file} className="list-item">
                        <div className="list-title">{file}</div>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteFile(file)}>
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <div className="card-header" style={{ marginBottom: '12px' }}>
                  <h3 className="card-title">Unused Exports</h3>
                </div>
                {filteredUnusedExports.length === 0 ? (
                  <div className="empty-state" style={{ padding: '24px 0' }}>No unused exports detected.</div>
                ) : (
                  <div className="list-stack">
                    {filteredUnusedExports.map((exp, index) => (
                      <div key={`${exp.file}-${exp.exportName}-${index}`} className="list-item">
                        <div>
                          <div className="list-title">{exp.exportName}</div>
                          <div className="list-sub">{exp.file}</div>
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleRemoveExport(exp)}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                  Export removal suggestions are included in cleanup PRs for manual review.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bundle' && (
            <div className="scan-detail-grid">
              <div className="card" style={{ padding: '16px' }}>
                <div className="card-header" style={{ marginBottom: '12px' }}>
                  <h3 className="card-title">Bundle Size</h3>
                  {typeof result.bundleSize.deltaPercent === 'number' && (
                    <span className={`badge ${result.bundleSize.deltaPercent > 0 ? 'badge-warning' : 'badge-success'}`}>
                      {result.bundleSize.deltaPercent > 0 ? '↑' : '↓'} {formatNumber(Math.abs(result.bundleSize.deltaPercent))}%
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700 }}>{result.bundleSize.totalSizeFormatted}</div>
                {result.bundleSize.error && (
                  <div className="alert warn" style={{ marginTop: '12px' }}>{result.bundleSize.error}</div>
                )}
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ marginBottom: '12px' }}>Largest Modules</h3>
                {result.bundleSize.largestModules.length === 0 ? (
                  <div className="empty-state" style={{ padding: '24px 0' }}>No module stats available.</div>
                ) : (
                  <div className="bar-list">
                    {result.bundleSize.largestModules.map(module => {
                      const maxSize = result.bundleSize.largestModules[0]?.size || 1
                      const width = Math.min(100, (module.size / maxSize) * 100)
                      return (
                        <div key={module.name} className="bar-item">
                          <div className="bar-meta">
                            <span>{module.name}</span>
                            <span>{module.sizeFormatted}</span>
                          </div>
                          <div className="bar-track">
                            <div className="bar-fill" style={{ width: `${width}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'coverage' && (
            <div className="scan-detail-grid">
              <div className="card" style={{ padding: '16px' }}>
                <div className="card-header" style={{ marginBottom: '12px' }}>
                  <h3 className="card-title">Coverage</h3>
                </div>
                <div className={`coverage-meter ${result.testCoverage.coveragePercentage === null ? '' : result.testCoverage.coveragePercentage >= 80 ? 'good' : result.testCoverage.coveragePercentage >= 50 ? 'warn' : 'bad'}`}>
                  {formatNumber(result.testCoverage.coveragePercentage)}%
                </div>
                {result.testCoverage.error && (
                  <div className="alert warn" style={{ marginTop: '12px' }}>{result.testCoverage.error}</div>
                )}
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ marginBottom: '12px' }}>Critical Files Below 70%</h3>
                {result.testCoverage.uncoveredCriticalFiles.length === 0 ? (
                  <div className="empty-state" style={{ padding: '24px 0' }}>No critical files below threshold.</div>
                ) : (
                  <div className="list-stack">
                    {result.testCoverage.uncoveredCriticalFiles.map(file => (
                      <div key={file.file} className="list-item">
                        <div className="list-title">{file.file}</div>
                        <span className="badge badge-warning">{formatNumber(file.coverage)}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="scan-detail-grid">
              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ marginBottom: '12px' }}>README Coverage</h3>
                {result.documentation.error && (
                  <div className="alert warn" style={{ marginBottom: '12px' }}>
                    {result.documentation.error}
                  </div>
                )}
                {result.documentation.missingReadmeSections.length === 0 ? (
                  <div className="alert success">All required README sections are present.</div>
                ) : (
                  <div className="list-stack">
                    {result.documentation.missingReadmeSections.map(section => (
                      <div key={section} className="list-item">
                        <div className="list-title">Missing: {section}</div>
                      </div>
                    ))}
                  </div>
                )}
                {result.documentation.readmeOutdated && (
                  <div className="alert warn" style={{ marginTop: '12px' }}>
                    README last updated {Math.round(result.documentation.daysSinceUpdate)} days ago.
                  </div>
                )}
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ marginBottom: '12px' }}>Undocumented Functions</h3>
                <div style={{ fontSize: '28px', fontWeight: 700 }}>{result.documentation.undocumentedFunctions}</div>
                <div style={{ color: 'var(--text-secondary)' }}>Functions exported without JSDoc.</div>
                <button className="btn btn-secondary btn-sm" style={{ marginTop: '12px' }} disabled>
                  Generate Docs
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
````

## File: src/components/Security/Security.tsx
````typescript
import { useState, useEffect } from 'react'
import { useRepositories } from '../../contexts/RepositoryContext'
import { useAppSettings } from '../../contexts/AppSettingsContext'
import type { ScanResult, SecurityFinding, ScanProgress } from '../../types'

const SEVERITY_COLORS = {
  critical: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' },
  high: { bg: 'rgba(249, 115, 22, 0.15)', color: '#f97316' },
  medium: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' },
  low: { bg: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }
}

export default function Security() {
  const { selectedRepo } = useRepositories()
  const { settings } = useAppSettings()
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState<ScanProgress | null>(null)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [selectedFinding, setSelectedFinding] = useState<SecurityFinding | null>(null)
  const [generatingFix, setGeneratingFix] = useState(false)
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [scannerAvailable, setScannerAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    checkScanner()
  }, [])

  useEffect(() => {
    if (scanning) {
      const cleanup = window.bridge.onSecurityScanProgress(setProgress)
      return cleanup
    }
  }, [scanning])

  const checkScanner = async () => {
    const available = await window.bridge.checkSecurityScannerAvailable()
    setScannerAvailable(available)
  }

  const runScan = async () => {
    if (!selectedRepo) return

    setScanning(true)
    setProgress(null)
    setResult(null)
    setSelectedFinding(null)

    try {
      const scanResult = await window.bridge.runSecurityScan(selectedRepo.path)
      setResult(scanResult)
    } catch (error) {
      console.error('Security scan failed:', error)
    } finally {
      setScanning(false)
      setProgress(null)
    }
  }

  const generateFix = async (finding: SecurityFinding) => {
    setGeneratingFix(true)
    try {
      const fix = await window.bridge.generateSecurityFix(finding)
      if (fix) {
        setSelectedFinding({ ...finding, fixedCode: fix })
      }
    } catch (error) {
      console.error('Failed to generate fix:', error)
    } finally {
      setGeneratingFix(false)
    }
  }

  const filteredFindings = result?.findings.filter(f =>
    filterSeverity === 'all' || f.severity === filterSeverity
  ) || []

  if (!settings.experimentalFeatures) {
    return (
      <div className="empty-state fade-in">
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <h3 className="empty-state-title">Experimental feature disabled</h3>
        <p className="empty-state-desc">Enable Experimental Features in Settings to run Security Scan.</p>
      </div>
    )
  }

  if (!selectedRepo) {
    return (
      <div className="empty-state fade-in">
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <h3 className="empty-state-title">No repository selected</h3>
        <p className="empty-state-desc">Select a repository from the sidebar to scan for security issues</p>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ marginBottom: '4px' }}>Security Scanner</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Scan for vulnerabilities: SQL injection, XSS, command injection, hardcoded secrets, and more.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={runScan}
            disabled={scanning}
          >
            {scanning ? (
              <>
                <div className="spinner" style={{ width: '14px', height: '14px', borderTopColor: '#000' }} />
                Scanning...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Scan Repository
              </>
            )}
          </button>
        </div>

        {scannerAvailable === false && (
          <div className="card" style={{ marginBottom: '16px', borderColor: 'var(--warning)', background: 'rgba(245, 158, 11, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>Using basic scanner. Install agentic_fixer dependencies for AI-powered fixes.</span>
            </div>
          </div>
        )}

        {scanning && progress && (
          <div className="card" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div className="spinner" />
              <span>{progress.message}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress.progress}%` }} />
            </div>
          </div>
        )}
      </div>

      {result && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{result.totalFindings}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Issues</div>
            </div>
            <div className="card" style={{ padding: '16px', textAlign: 'center', borderColor: SEVERITY_COLORS.critical.color }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: SEVERITY_COLORS.critical.color }}>{result.criticalCount}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Critical</div>
            </div>
            <div className="card" style={{ padding: '16px', textAlign: 'center', borderColor: SEVERITY_COLORS.high.color }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: SEVERITY_COLORS.high.color }}>{result.highCount}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>High</div>
            </div>
            <div className="card" style={{ padding: '16px', textAlign: 'center', borderColor: SEVERITY_COLORS.medium.color }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: SEVERITY_COLORS.medium.color }}>{result.mediumCount}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Medium</div>
            </div>
            <div className="card" style={{ padding: '16px', textAlign: 'center', borderColor: SEVERITY_COLORS.low.color }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: SEVERITY_COLORS.low.color }}>{result.lowCount}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Low</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Findings</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['all', 'critical', 'high', 'medium', 'low'].map(sev => (
                      <button
                        key={sev}
                        className={`btn ${filterSeverity === sev ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                        onClick={() => setFilterSeverity(sev)}
                        style={{ textTransform: 'capitalize' }}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredFindings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    {result.totalFindings === 0 ? (
                      <>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}>
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <path d="M9 12l2 2 4-4" />
                        </svg>
                        <div>No security issues found!</div>
                      </>
                    ) : (
                      <div>No issues matching this filter</div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '500px', overflow: 'auto' }}>
                    {filteredFindings.map((finding, i) => (
                      <div
                        key={`${finding.file}-${finding.line}-${i}`}
                        onClick={() => setSelectedFinding(finding)}
                        style={{
                          padding: '12px',
                          background: selectedFinding === finding ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          border: selectedFinding === finding ? '1px solid var(--accent)' : '1px solid transparent'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span
                            className="badge"
                            style={{
                              background: SEVERITY_COLORS[finding.severity].bg,
                              color: SEVERITY_COLORS[finding.severity].color,
                              textTransform: 'uppercase',
                              fontSize: '10px'
                            }}
                          >
                            {finding.severity}
                          </span>
                          <span style={{ fontWeight: 500 }}>{finding.issue.replace(/-/g, ' ')}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                          {finding.file}:{finding.line}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', display: 'flex', gap: '8px' }}>
                          <span>{finding.cwe}</span>
                          <span>•</span>
                          <span>{finding.owasp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {selectedFinding && (
              <div style={{ width: '450px' }}>
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Finding Details</h3>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setSelectedFinding(null)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Issue Type</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          className="badge"
                          style={{
                            background: SEVERITY_COLORS[selectedFinding.severity].bg,
                            color: SEVERITY_COLORS[selectedFinding.severity].color
                          }}
                        >
                          {selectedFinding.severity}
                        </span>
                        <span style={{ fontWeight: 500 }}>{selectedFinding.issue.replace(/-/g, ' ')}</span>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Location</div>
                      <div>{selectedFinding.file}:{selectedFinding.line}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Classification</div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span className="badge badge-accent">{selectedFinding.cwe}</span>
                        <span className="badge" style={{ background: 'var(--bg-tertiary)' }}>{selectedFinding.owasp}</span>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Description</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{selectedFinding.description}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Vulnerable Code</div>
                      <pre style={{
                        padding: '12px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'auto',
                        fontSize: '12px',
                        margin: 0
                      }}>
                        {selectedFinding.code}
                      </pre>
                    </div>

                    {selectedFinding.solution && (
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Solution</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{selectedFinding.solution}</div>
                      </div>
                    )}

                    {selectedFinding.fixedCode && (
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Fixed Code</div>
                        <pre style={{
                          padding: '12px',
                          background: 'rgba(34, 197, 94, 0.1)',
                          border: '1px solid var(--success)',
                          borderRadius: 'var(--radius-md)',
                          overflow: 'auto',
                          fontSize: '12px',
                          margin: 0
                        }}>
                          {selectedFinding.fixedCode}
                        </pre>
                      </div>
                    )}

                    {scannerAvailable && !selectedFinding.fixedCode && (
                      <button
                        className="btn btn-primary"
                        onClick={() => generateFix(selectedFinding)}
                        disabled={generatingFix}
                      >
                        {generatingFix ? (
                          <>
                            <div className="spinner" style={{ width: '14px', height: '14px', borderTopColor: '#000' }} />
                            Generating Fix...
                          </>
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 2a10 10 0 1010 10H12V2z" />
                            </svg>
                            Generate AI Fix
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {!result && !scanning && (
        <div className="card">
          <div className="empty-state">
            <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <h3 className="empty-state-title">Ready to scan</h3>
            <p className="empty-state-desc">Click "Scan Repository" to check for security vulnerabilities</p>
          </div>
        </div>
      )}
    </div>
  )
}
````

## File: src/components/Settings/Settings.tsx
````typescript
import { useEffect, useState } from 'react'
import { useAppSettings } from '../../contexts/AppSettingsContext'
import { useRepositories } from '../../contexts/RepositoryContext'
import type { BridgeConsoleSettings } from '../../types'

const emptySettings: BridgeConsoleSettings = {
  consoleUrl: 'http://localhost:3000',
  apiToken: '',
  githubUsername: '',
  autoUpload: true
}

export default function Settings() {
  const { settings: appSettings, saveSettings: saveAppSettings, loading: appSettingsLoading } = useAppSettings()
  const { repositories, selectedRepo } = useRepositories()
  const [settings, setSettings] = useState<BridgeConsoleSettings>(emptySettings)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [savingAppSettings, setSavingAppSettings] = useState(false)
  const [bridgeConfigRepoPath, setBridgeConfigRepoPath] = useState<string>('')
  const [bridgeConfigText, setBridgeConfigText] = useState('')
  const [bridgeConfigDirty, setBridgeConfigDirty] = useState(false)
  const [bridgeConfigLoading, setBridgeConfigLoading] = useState(false)
  const [bridgeConfigMessage, setBridgeConfigMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await window.bridge.getBridgeConsoleSettings()
        setSettings(stored)
      } catch {
        setSettings(emptySettings)
      }
    }

    void loadSettings()
  }, [])

  useEffect(() => {
    if (selectedRepo?.path) {
      setBridgeConfigRepoPath(selectedRepo.path)
      return
    }
    if (!bridgeConfigRepoPath && repositories.length > 0) {
      setBridgeConfigRepoPath(repositories[0].path)
    }
  }, [selectedRepo?.path, repositories, bridgeConfigRepoPath])

  useEffect(() => {
    const loadBridgeConfig = async () => {
      if (!bridgeConfigRepoPath) {
        setBridgeConfigText('')
        setBridgeConfigDirty(false)
        return
      }
      setBridgeConfigLoading(true)
      setBridgeConfigMessage(null)
      try {
        const config = await window.bridge.loadBridgeConfig(bridgeConfigRepoPath)
        setBridgeConfigText(`${JSON.stringify(config, null, 2)}\n`)
        setBridgeConfigDirty(false)
      } catch (error) {
        setBridgeConfigMessage(error instanceof Error ? error.message : 'Failed to load .bridge.json')
      } finally {
        setBridgeConfigLoading(false)
      }
    }

    void loadBridgeConfig()
  }, [bridgeConfigRepoPath])

  const updateField = (field: keyof BridgeConsoleSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const saveSettings = async () => {
    try {
      await window.bridge.saveBridgeConsoleSettings(settings)
      setMessage('Settings saved.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to save settings')
    }
  }

  const testConnection = async () => {
    setConnectionStatus('testing')
    setMessage(null)

    try {
      const result = await window.bridge.testBridgeConsoleConnection(settings)
      if (result.ok) {
        setConnectionStatus('success')
        await window.bridge.saveBridgeConsoleSettings(settings)
      } else {
        setConnectionStatus('error')
        setMessage(result.message || 'Connection failed')
      }
    } catch (error) {
      setConnectionStatus('error')
      setMessage(error instanceof Error ? error.message : 'Connection failed')
    }
  }

  const toggleExperimentalFeatures = async (enabled: boolean) => {
    setSavingAppSettings(true)
    try {
      await saveAppSettings({ experimentalFeatures: enabled })
      setMessage('App settings saved.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to save app settings')
    } finally {
      setSavingAppSettings(false)
    }
  }

  const saveBridgeConfig = async () => {
    if (!bridgeConfigRepoPath) return
    setBridgeConfigMessage(null)
    let parsed: unknown
    try {
      parsed = JSON.parse(bridgeConfigText)
    } catch (error) {
      setBridgeConfigMessage(`Invalid JSON: ${error instanceof Error ? error.message : 'parse error'}`)
      return
    }

    try {
      const saved = await window.bridge.saveBridgeConfig(bridgeConfigRepoPath, parsed as any)
      setBridgeConfigText(`${JSON.stringify(saved, null, 2)}\n`)
      setBridgeConfigDirty(false)
      setBridgeConfigMessage('Saved .bridge.json')
    } catch (error) {
      setBridgeConfigMessage(error instanceof Error ? error.message : 'Failed to save .bridge.json')
    }
  }

  const initializeBridgeConfig = async () => {
    if (!bridgeConfigRepoPath) return
    setBridgeConfigLoading(true)
    setBridgeConfigMessage(null)
    try {
      const generated = await window.bridge.generateBridgeConfig(bridgeConfigRepoPath)
      setBridgeConfigText(`${JSON.stringify(generated, null, 2)}\n`)
      setBridgeConfigDirty(false)
      setBridgeConfigMessage('Generated .bridge.json for this repository')
    } catch (error) {
      setBridgeConfigMessage(error instanceof Error ? error.message : 'Failed to generate .bridge.json')
    } finally {
      setBridgeConfigLoading(false)
    }
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ marginBottom: '6px' }}>Settings</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Configure Bridge-Console integration and upload preferences.
        </p>
      </div>

      <div className="settings-grid">
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '12px' }}>Bridge-Console Connection</h3>

          <div className="form-group">
            <label>Console URL</label>
            <input
              type="text"
              value={settings.consoleUrl}
              onChange={(e) => updateField('consoleUrl', e.target.value)}
              placeholder="https://bridge-console.your-org.com"
            />
          </div>

          <div className="form-group">
            <label>API Token</label>
            <input
              type="password"
              value={settings.apiToken}
              onChange={(e) => updateField('apiToken', e.target.value)}
              placeholder="Paste your Bridge-Console token"
            />
          </div>

          <div className="form-group">
            <label>GitHub Username</label>
            <input
              type="text"
              value={settings.githubUsername}
              onChange={(e) => updateField('githubUsername', e.target.value)}
              placeholder="cmccoy02"
            />
          </div>

          <label className="simple-checkbox">
            <input
              type="checkbox"
              checked={settings.autoUpload}
              onChange={(e) => updateField('autoUpload', e.target.checked)}
            />
            <span className="checkbox-label">Auto-upload scans after each run</span>
          </label>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button className="btn btn-secondary" onClick={saveSettings}>
              Save Settings
            </button>
            <button className="btn btn-primary" onClick={testConnection}>
              {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
            </button>
          </div>

          {connectionStatus === 'success' && (
            <div className="alert success" style={{ marginTop: '16px' }}>Connected to Bridge-Console.</div>
          )}
          {connectionStatus === 'error' && (
            <div className="alert error" style={{ marginTop: '16px' }}>Connection failed. {message}</div>
          )}
          {message && connectionStatus === 'idle' && (
            <div className="alert" style={{ marginTop: '16px' }}>{message}</div>
          )}
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '12px' }}>Automation Notes</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
            Scheduled scans will upload automatically when auto-upload is enabled. Configure smart scheduling from the Scheduler view.
          </p>
          <div className="alert warn">
            For security, tokens are stored locally on this machine using Electron Store.
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '12px' }}>Feature Flags</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
            Experimental features include Security Scan and Full TD Scan. Keep disabled for a simplified out-of-the-box workflow.
          </p>
          <label className="simple-checkbox">
            <input
              type="checkbox"
              checked={appSettings.experimentalFeatures}
              onChange={(e) => toggleExperimentalFeatures(e.target.checked)}
              disabled={appSettingsLoading || savingAppSettings}
            />
            <span className="checkbox-label">
              Enable experimental features
            </span>
          </label>
          <div style={{ marginTop: '10px', color: 'var(--text-tertiary)', fontSize: '12px' }}>
            Default: disabled
          </div>
          <div style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
            First-run checklist: {appSettings.onboardingCompleted ? 'completed' : 'pending'}
          </div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginTop: '8px' }}
            onClick={async () => {
              await saveAppSettings({ onboardingCompleted: false })
              setMessage('First-run checklist reset.')
            }}
          >
            Reset First-Run Checklist
          </button>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '12px' }}>.bridge.json Editor</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
            Scope: one <code>.bridge.json</code> per repository. Bridge reads and writes this file at each repo root.
          </p>

          <div className="form-group">
            <label>Repository</label>
            <select
              value={bridgeConfigRepoPath}
              onChange={e => setBridgeConfigRepoPath(e.target.value)}
              disabled={repositories.length === 0}
            >
              {repositories.length === 0 && (
                <option value="">No repositories available</option>
              )}
              {repositories.map(repo => (
                <option key={repo.path} value={repo.path}>
                  {repo.name} — {repo.path}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Config JSON</label>
            <textarea
              value={bridgeConfigText}
              onChange={e => {
                setBridgeConfigText(e.target.value)
                setBridgeConfigDirty(true)
              }}
              rows={18}
              placeholder={bridgeConfigLoading ? 'Loading...' : 'Select a repository to edit .bridge.json'}
              disabled={!bridgeConfigRepoPath || bridgeConfigLoading}
              style={{ fontFamily: 'monospace', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={initializeBridgeConfig} disabled={!bridgeConfigRepoPath || bridgeConfigLoading}>
              Generate
            </button>
            <button className="btn btn-primary" onClick={saveBridgeConfig} disabled={!bridgeConfigRepoPath || bridgeConfigLoading || !bridgeConfigDirty}>
              Save .bridge.json
            </button>
          </div>

          {bridgeConfigMessage && (
            <div className="alert" style={{ marginTop: '12px' }}>
              {bridgeConfigMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
````

## File: README.md
````markdown
# Bridge-Desktop

Local-first technical debt automation for engineers.

Bridge runs directly against repositories that already exist on your machine. It avoids GitHub API onboarding and uses your existing local git + optional `gh` authentication.

## 5-Minute Onboarding

1. Install and open Bridge.
2. Select your code directory (for example `~/code`).
3. Pick a repository.
4. Run **Update Dependencies**:
   - **Non-Breaking Updates**: one click for patch + minor updates.
   - **Major Updates**: manual per-package selection.
5. Optional: turn on PR creation (off by default) if `gh` is installed and authenticated.

The Dashboard includes a first-run checklist and preflight checks.

## Current Capabilities

- Local repository discovery (no GitHub API required).
- One-click non-breaking dependency update workflow using:
  - `rm -rf node_modules package-lock.json; npm install; npm update; rm -rf node_modules package-lock.json; npm install;`
- Major-version package updates with explicit selection.
- Isolated update workspaces via `git worktree` so local unstaged changes stay untouched.
- Optional test and lint verification before commit/PR.
- Optional PR creation through GitHub CLI (`gh`).
- Merge conflict risk prediction based on branch divergence.
- Scheduled dependency updates.
- Optional Bridge-Console metrics upload.

## Experimental Features

Default: **disabled**.

When enabled in Settings:
- Full TD Scan
- Security Scan
- Smart TD Scans

## Development

```bash
npm install
npm run dev
```

Build app + DMG:

```bash
npm run build
```

Unsigned local build:

```bash
npm run build:unsigned
```

## macOS Signing + Notarization

Bridge is configured for hardened runtime, entitlements, and an `afterSign` notarization hook.

Set these environment variables in CI or your release shell:

- `APPLE_ID`
- `APPLE_APP_SPECIFIC_PASSWORD`
- `APPLE_TEAM_ID`
- `CSC_LINK` (certificate)
- `CSC_KEY_PASSWORD`

If Apple notarization variables are missing, build still succeeds but notarization is skipped.

## Requirements

- macOS
- Node.js 18+
- Git
- Optional for PR creation: GitHub CLI (`gh`) authenticated with `gh auth login`
````

## File: vite.config.ts
````typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: 'electron/main.ts',
        onstart(args) {
          args.startup()
        },
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: {
              external: ['electron', 'electron-store', 'dependency-cruiser']
            }
          }
        }
      },
      {
        entry: 'electron/preload.ts',
        onstart(args) {
          args.reload()
        },
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: {
              external: ['electron']
            }
          }
        }
      }
    ]),
    renderer()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
````

## File: src/components/Layout/Header.tsx
````typescript
import { useTheme } from '../../contexts/ThemeContext'
import { useRepositories } from '../../contexts/RepositoryContext'
import type { View } from '../../types'

interface HeaderProps {
  currentView: View
}

const viewTitles: Partial<Record<View, string>> = {
  dashboard: 'Dashboard',
  'patch-batch': 'Update Dependencies',
  'full-scan': 'Full TD Scan',
  cleanup: 'Cleanup',
  scheduler: 'Scheduler',
  security: 'Security Scanner',
  files: 'File Browser',
  settings: 'Settings'
}

export default function Header({ currentView }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const { selectedRepo } = useRepositories()

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 600 }}>
          {viewTitles[currentView] || 'Bridge'}
        </h1>
        <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', fontSize: '11px' }}>
          v0.1.0-demo
        </span>
        {selectedRepo && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="badge badge-accent">{selectedRepo.name}</span>
            {(selectedRepo.languages ?? []).map(lang => (
              <span key={lang} className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', fontSize: '10px' }}>
                {lang}
              </span>
            ))}
          </div>
        )}
      </div>

      <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
        {theme === 'dark' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        )}
      </button>
    </header>
  )
}
````

## File: src/index.css
````css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --bg-tertiary: #ebebeb;
  --text-primary: #000000;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  --border-color: #e0e0e0;
  --accent: #F5A700;
  --accent-hover: #d99200;
  --accent-light: rgba(245, 167, 0, 0.1);
  --success: #22c55e;
  --error: #ef4444;
  --warning: #f59e0b;

  --font-sans: 'Space Grotesk', 'Avenir Next', 'Segoe UI', sans-serif;
  --font-mono: 'IBM Plex Mono', 'SF Mono', Consolas, monospace;

  --bg-gradient: radial-gradient(circle at 20% 20%, rgba(245, 167, 0, 0.15), transparent 45%),
    radial-gradient(circle at 80% 10%, rgba(34, 197, 94, 0.12), transparent 40%),
    linear-gradient(140deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 245, 245, 0.95) 100%);

  --sidebar-width: 260px;
  --header-height: 60px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
  --bg-primary: #0a0a0a;
  --bg-secondary: #141414;
  --bg-tertiary: #1f1f1f;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --text-tertiary: #666666;
  --border-color: #2a2a2a;
  --accent-light: rgba(245, 167, 0, 0.15);

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.3);

  --bg-gradient: radial-gradient(circle at 20% 20%, rgba(245, 167, 0, 0.12), transparent 45%),
    radial-gradient(circle at 80% 10%, rgba(34, 197, 94, 0.08), transparent 40%),
    linear-gradient(140deg, rgba(10, 10, 10, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%);
}

html, body {
  height: 100%;
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.5;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: var(--bg-gradient);
  z-index: -1;
  opacity: 0.7;
  pointer-events: none;
}

#root {
  height: 100%;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-sans);
  font-weight: 600;
  letter-spacing: -0.02em;
}

h1 {
  font-size: 28px;
  line-height: 1.2;
}

h2 {
  font-size: 22px;
  line-height: 1.3;
}

h3 {
  font-size: 18px;
  line-height: 1.4;
}

button {
  font-family: var(--font-sans);
  cursor: pointer;
  border: none;
  background: none;
  font-size: inherit;
}

input, textarea {
  font-family: var(--font-sans);
  font-size: inherit;
}

a {
  color: var(--accent);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

code, pre {
  font-family: var(--font-mono);
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}

/* Selection */
::selection {
  background: var(--accent);
  color: #000;
}

/* App Layout */
.app-layout {
  display: flex;
  height: 100%;
}

.app-sidebar {
  width: var(--sidebar-width);
  height: 100%;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-header {
  height: var(--header-height);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-primary);
  -webkit-app-region: drag;
}

.app-header > * {
  -webkit-app-region: no-drag;
}

.app-content {
  flex: 1;
  overflow: auto;
  padding: 24px;
}

/* Sidebar */
.sidebar-header {
  padding: 20px;
  padding-top: 52px; /* Account for traffic lights */
}

.sidebar-logo {
  font-family: var(--font-sans);
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-logo-icon {
  width: 28px;
  height: 28px;
  background: var(--accent);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-weight: 700;
  font-size: 16px;
}

.sidebar-nav {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 24px;
}

.nav-section-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-tertiary);
  padding: 0 12px;
  margin-bottom: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: all 0.15s ease;
  width: 100%;
  text-align: left;
}

.nav-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.repo-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.repo-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: all 0.15s ease;
  width: 100%;
  text-align: left;
}

.repo-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.repo-remove {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: var(--bg-tertiary);
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.repo-item:hover .repo-remove {
  opacity: 1;
}

.repo-remove:hover {
  color: var(--error);
  background: rgba(239, 68, 68, 0.15);
}

.nav-item.active {
  background: var(--accent-light);
  color: var(--accent);
}

.nav-icon {
  width: 18px;
  height: 18px;
  opacity: 0.7;
}

.nav-item.active .nav-icon {
  opacity: 1;
}

/* Repository List */
.repo-list {
  margin-top: 8px;
}

.repo-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.repo-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.repo-item.active {
  background: var(--accent-light);
  color: var(--accent);
}

.repo-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-tertiary);
}

.repo-item.active .repo-dot {
  background: var(--accent);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all 0.15s ease;
}

.btn-primary {
  background: var(--accent);
  color: #000;
}

.btn-primary:hover {
  background: var(--accent-hover);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--border-color);
}

.btn-ghost {
  color: var(--text-secondary);
}

.btn-ghost:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

.btn-icon {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: var(--radius-md);
}

/* Cards */
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
}

/* Patch Batch */
.patch-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.step-guide {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: var(--accent-light);
  color: var(--accent);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
}

.config-grid {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.table-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.package-table-wrapper {
  overflow-x: auto;
}

.package-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.package-table th {
  text-align: left;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-tertiary);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.package-table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border-color);
}

.package-table tbody tr {
  cursor: pointer;
}

.package-table tbody tr:hover {
  background: var(--bg-tertiary);
}

.package-table tbody tr.selected {
  background: var(--accent-light);
}

.package-table tbody tr.selected:hover {
  background: var(--accent-light);
}

.package-table tbody tr.disabled {
  opacity: 0.5;
  cursor: default;
}

.package-table tbody tr.disabled:hover {
  background: transparent;
}

.package-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-footer {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.output-panel {
  background: #0f0f0f;
  color: #e5e5e5;
  border: 1px solid #1f1f1f;
  border-radius: var(--radius-md);
  padding: 12px;
  font-size: 12px;
  line-height: 1.5;
  min-height: 160px;
  max-height: 320px;
  overflow: auto;
  font-family: var(--font-mono);
}

.output-line {
  white-space: pre-wrap;
}

/* Input */
.input {
  width: 100%;
  padding: 10px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  transition: all 0.15s ease;
}

.input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-light);
}

.input::placeholder {
  color: var(--text-tertiary);
}

/* Checkbox */
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.checkbox.checked {
  background: var(--accent);
  border-color: var(--accent);
}

.checkbox-label {
  color: var(--text-secondary);
}

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
}

.badge-warning {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.badge-success {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.badge-accent {
  background: var(--accent-light);
  color: var(--accent);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.empty-state-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  opacity: 0.3;
}

.empty-state-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.empty-state-desc {
  margin-bottom: 24px;
}

/* Progress */
.progress-bar {
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent);
  transition: width 0.3s ease;
}

/* File Browser */
.file-browser {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.file-browser-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 16px;
}

.file-path {
  flex: 1;
  font-size: 13px;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 8px 12px;
  border-radius: var(--radius-md);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-list {
  flex: 1;
  overflow: auto;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.15s ease;
}

.file-item:hover {
  background: var(--bg-secondary);
}

.file-icon {
  width: 20px;
  height: 20px;
  color: var(--text-tertiary);
}

.file-icon.folder {
  color: var(--accent);
}

.file-name {
  flex: 1;
}

.file-size {
  font-size: 12px;
  color: var(--text-tertiary);
}

/* Package List */
.package-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.package-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.15s ease;
}

.package-item:hover {
  border-color: var(--accent);
}

.package-item.selected {
  border-color: var(--accent);
  background: var(--accent-light);
}

.package-info {
  flex: 1;
}

.package-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.package-versions {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.version-arrow {
  color: var(--text-tertiary);
}

.version-new {
  color: var(--success);
}

/* Theme Toggle */
.theme-toggle {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.15s ease;
}

.theme-toggle:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

/* Animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease;
}

/* Dashboard & Scan */
.dashboard-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dashboard-hero h2 {
  margin-bottom: 6px;
}

.dashboard-hero p {
  color: var(--text-secondary);
}

.dashboard-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.dashboard-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.issue-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
}

.issue-item {
  padding: 10px 12px;
  border-radius: var(--radius-md);
  background: var(--bg-tertiary);
  font-size: 13px;
}

.repo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.repo-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  background: var(--bg-tertiary);
  cursor: pointer;
  transition: border 0.2s ease, transform 0.2s ease;
}

.repo-card:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}

.repo-card.active {
  border-color: var(--accent);
  background: var(--accent-light);
}

.repo-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.repo-path {
  font-size: 12px;
  color: var(--text-tertiary);
}

.scan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.scan-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.scan-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.scan-detail-grid,
.scan-overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.summary-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.summary-value {
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-sub {
  font-size: 12px;
  color: var(--text-tertiary);
}

.delta {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 999px;
}

.delta-up {
  background: rgba(34, 197, 94, 0.15);
  color: var(--success);
}

.delta-down {
  background: rgba(239, 68, 68, 0.15);
  color: var(--error);
}

.list-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
}

.list-title {
  font-weight: 500;
  font-size: 13px;
}

.list-sub {
  font-size: 12px;
  color: var(--text-tertiary);
}

.graph-container {
  height: 320px;
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
}

.callout {
  padding: 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: rgba(245, 167, 0, 0.08);
}

.alert {
  padding: 10px 12px;
  border-radius: var(--radius-md);
  background: var(--bg-tertiary);
  font-size: 13px;
}

.alert.success {
  background: rgba(34, 197, 94, 0.12);
  color: var(--success);
}

.alert.warn {
  background: rgba(245, 158, 11, 0.12);
  color: var(--warning);
}

.alert.error {
  background: rgba(239, 68, 68, 0.12);
  color: var(--error);
}

.bar-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bar-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
}

.bar-track {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: var(--bg-tertiary);
}

.bar-fill {
  height: 100%;
  border-radius: 999px;
  background: var(--accent);
}

.coverage-meter {
  font-size: 32px;
  font-weight: 700;
  padding: 16px;
  border-radius: var(--radius-md);
  background: var(--bg-tertiary);
  text-align: center;
}

.coverage-meter.good {
  color: var(--success);
  background: rgba(34, 197, 94, 0.1);
}

.coverage-meter.warn {
  color: var(--warning);
  background: rgba(245, 158, 11, 0.1);
}

.coverage-meter.bad {
  color: var(--error);
  background: rgba(239, 68, 68, 0.1);
}

/* Settings */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.form-group label {
  font-size: 12px;
  color: var(--text-secondary);
}

.form-group input {
  padding: 10px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.simple-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  margin-top: 6px;
}

.simple-checkbox input {
  accent-color: var(--accent);
}

/* New helper styles */
.overview-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
  font-size: 13px;
}

.overview-row:last-child {
  border-bottom: none;
}
````

## File: src/main.tsx
````typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider } from './contexts/ThemeContext'
import { RepositoryProvider } from './contexts/RepositoryContext'
import { ScanProvider } from './contexts/ScanContext'
import { AppSettingsProvider } from './contexts/AppSettingsContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AppSettingsProvider>
        <RepositoryProvider>
          <ScanProvider>
            <App />
          </ScanProvider>
        </RepositoryProvider>
      </AppSettingsProvider>
    </ThemeProvider>
  </React.StrictMode>
)
````

## File: package.json
````json
{
  "name": "bridge-desktop",
  "version": "0.1.0",
  "description": "Tech debt management tool for developers",
  "main": "dist-electron/main.js",
  "scripts": {
    "dev": "vite --host 127.0.0.1 --port 5173",
    "build": "tsc && vite build && electron-builder",
    "build:unsigned": "tsc && vite build && electron-builder --config.mac.identity=null",
    "build:mac": "electron-builder --mac dmg",
    "preview": "vite preview",
    "electron:dev": "vite --host 127.0.0.1 --port 5173"
  },
  "dependencies": {
    "dependency-cruiser": "^16.7.0",
    "electron-store": "^8.1.0",
    "knip": "^5.26.0",
    "nyc": "^15.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "remark": "^15.0.0",
    "remark-lint": "^9.1.2",
    "semver": "^7.5.4",
    "unimported": "^1.29.0",
    "vis-network": "^9.1.9",
    "webpack-bundle-analyzer": "^4.10.2"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@types/semver": "^7.5.6",
    "@vitejs/plugin-react": "^4.2.1",
    "@electron/notarize": "^2.2.1",
    "electron": "^28.1.0",
    "electron-builder": "^24.9.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.10",
    "vite-plugin-electron": "^0.28.0",
    "vite-plugin-electron-renderer": "^0.14.5"
  },
  "build": {
    "appId": "com.bridge.desktop",
    "productName": "Bridge",
    "afterSign": "scripts/notarize.cjs",
    "mac": {
      "category": "public.app-category.developer-tools",
      "target": "dmg",
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "build/entitlements.mac.plist",
      "entitlementsInherit": "build/entitlements.mac.inherit.plist"
    }
  }
}
````

## File: electron/services/analysis.ts
````typescript
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'
import { app } from 'electron'
import { createBridgeStore } from './store'
import {
  detectLanguages,
  getPythonOutdated,
  getRubyOutdated,
  getElixirOutdated,
  type OutdatedPackage
} from './languages'
import { getJsOutdatedPackages } from './patchBatch'
import {
  getRepoInfo,
  createBranch,
  commitChanges,
  pushBranch,
  createPullRequest,
  abortChanges,
  deleteBranch,
  ensureSafeBranch
} from './git'
import {
  getBridgeConsoleSettings,
  sendScanToConsole,
  type ConsoleUploadResult
} from './bridgeConsoleApi'
import {
  loadBridgeConfig,
  generateDefaultConfig,
  writeBridgeConfig,
  type BridgeConfig
} from './bridgeConfig'
import {
  calculateTechDebtScore,
  type CodeHealthMetrics,
  type ScanData,
  type TechDebtScore
} from './techDebtScorer'
import {
  generateScanReport,
  writeScanReportArtifacts,
  type BridgeScanReport
} from './scanReport'
import {
  scanRepoForSecurityPatterns,
  type SecurityPatternFinding
} from './securityPatterns'

const execAsync = promisify(exec)
const scanStore = createBridgeStore('bridge-analysis')
const SCAN_HISTORY_KEY = 'td-scan-history'
const DEFAULT_SCAN_TIMEOUT_MS = 10 * 60 * 1000

export interface VulnerabilitySummary {
  critical: number
  high: number
  medium: number
  low: number
  total: number
}

export interface DependencyReport {
  outdated: OutdatedPackage[]
  vulnerabilities: VulnerabilitySummary
  installedPackages?: string[]
  error?: string
}

export interface CircularDependency {
  from: string
  to: string
  cycle: string[]
}

export interface CircularDependencyReport {
  count: number
  dependencies: CircularDependency[]
  error?: string
}

export interface DeadCodeExport {
  file: string
  exportName: string
}

export interface DeadCodeReport {
  deadFiles: string[]
  unusedExports: DeadCodeExport[]
  totalDeadCodeCount: number
  raw?: {
    knip?: string
    unimported?: string
  }
  error?: string
}

export interface BundleModule {
  name: string
  size: number
  sizeFormatted: string
}

export interface BundleAnalysisReport {
  totalSize: number
  totalSizeFormatted: string
  largestModules: BundleModule[]
  previousSize?: number
  delta?: number
  deltaPercent?: number
  warning?: boolean
  statsPath?: string
  error?: string
}

export interface TestCoverageReport {
  coveragePercentage: number | null
  uncoveredCriticalFiles: { file: string; coverage: number }[]
  summaryPath?: string
  error?: string
}

export interface DocumentationDebtReport {
  missingReadmeSections: string[]
  readmeOutdated: boolean
  daysSinceUpdate: number
  undocumentedFunctions: number
  error?: string
}

export interface FullScanResult {
  scanDate: string
  repository: string
  repositoryUrl?: string | null
  config: BridgeConfig
  dependencies: DependencyReport
  circularDependencies: CircularDependencyReport
  deadCode: DeadCodeReport
  bundleSize: BundleAnalysisReport
  testCoverage: TestCoverageReport
  documentation: DocumentationDebtReport
  securityPatterns: SecurityPatternFinding[]
  oversizedFiles: OversizedComponent[]
  codeHealth: CodeHealthMetrics
  techDebtScore: TechDebtScore
  scanReport?: BridgeScanReport
  reportPaths?: {
    latestReportPath: string
    latestScorePath: string
    archivePath: string
    configSnapshotPath: string
  }
  consoleUpload?: ConsoleUploadResult
  durationMs: number
}

export interface LargeFile {
  path: string
  size: number
  sizeFormatted: string
  type: 'current' | 'git-history'
}

export interface OversizedComponent {
  path: string
  lines: number
  type: string
}

export interface CleanupReport {
  largeFiles: LargeFile[]
  gitHistoryFiles: LargeFile[]
  oversizedComponents: OversizedComponent[]
  totalWastedSpace: number
  totalWastedSpaceFormatted: string
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function getBridgeRoot(): string {
  try {
    const appPath = app.getAppPath()
    return appPath
  } catch {
    return path.resolve(__dirname, '..', '..')
  }
}

function buildToolEnv(): NodeJS.ProcessEnv {
  const root = getBridgeRoot()
  const binPath = path.join(root, 'node_modules', '.bin')
  const existingPath = process.env.PATH || ''
  return {
    ...process.env,
    PATH: `${binPath}${path.delimiter}${existingPath}`
  }
}

async function resolveCommandEnv(cwd: string): Promise<NodeJS.ProcessEnv> {
  const env = buildToolEnv()
  const localNpmrc = path.join(cwd, '.npmrc')
  try {
    await fs.access(localNpmrc)
    env.NPM_CONFIG_USERCONFIG = localNpmrc
    env.npm_config_userconfig = localNpmrc
  } catch {
    // Keep defaults when repository does not define .npmrc.
  }
  return env
}

async function detectPackageManager(repoPath: string): Promise<'npm' | 'yarn' | 'pnpm'> {
  try {
    await fs.access(path.join(repoPath, 'pnpm-lock.yaml'))
    return 'pnpm'
  } catch {}
  try {
    await fs.access(path.join(repoPath, 'yarn.lock'))
    return 'yarn'
  } catch {}
  return 'npm'
}

function extractJsonPayload(output: string): any | null {
  const trimmed = output.trim()
  if (!trimmed) return null

  const jsonMatch = trimmed.match(/(\{[\s\S]*\}|\[[\s\S]*\])$/)
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1])
    } catch {}
  }

  const firstBrace = trimmed.indexOf('{')
  const firstBracket = trimmed.indexOf('[')
  const start = firstBrace === -1 ? firstBracket : firstBracket === -1 ? firstBrace : Math.min(firstBrace, firstBracket)
  if (start >= 0) {
    try {
      return JSON.parse(trimmed.slice(start))
    } catch {}
  }

  return null
}

async function runCli(command: string, args: string[], cwd: string, timeoutMs = DEFAULT_SCAN_TIMEOUT_MS) {
  const cmd = `${command} ${args.join(' ')}`.trim()
  try {
    const env = await resolveCommandEnv(cwd)
    const { stdout, stderr } = await execAsync(cmd, {
      cwd,
      timeout: timeoutMs,
      maxBuffer: 20 * 1024 * 1024,
      env
    })
    return { stdout: stdout || '', stderr: stderr || '', success: true }
  } catch (error: any) {
    return {
      stdout: error?.stdout || '',
      stderr: error?.stderr || error?.message || '',
      success: false
    }
  }
}

function getScanHistory(repoPath: string): { bundleSize?: number; techDebtScore?: number } {
  const history = scanStore.get(SCAN_HISTORY_KEY, {}) as Record<string, { bundleSize?: number; techDebtScore?: number }>
  return history[repoPath] || {}
}

function saveScanHistory(repoPath: string, data: { bundleSize?: number; techDebtScore?: number }): void {
  const history = scanStore.get(SCAN_HISTORY_KEY, {}) as Record<string, { bundleSize?: number; techDebtScore?: number }>
  history[repoPath] = { ...(history[repoPath] || {}), ...data }
  scanStore.set(SCAN_HISTORY_KEY, history)
}

async function getReadmeStats(repoPath: string): Promise<{ exists: boolean; wordCount: number; daysSinceUpdate: number }> {
  const readmePath = path.join(repoPath, 'README.md')
  try {
    const [content, stats] = await Promise.all([
      fs.readFile(readmePath, 'utf-8'),
      fs.stat(readmePath)
    ])
    const words = content.trim().split(/\s+/).filter(Boolean).length
    const daysSinceUpdate = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24)
    return { exists: true, wordCount: words, daysSinceUpdate }
  } catch {
    return { exists: false, wordCount: 0, daysSinceUpdate: 999 }
  }
}

async function getLockfileAgeDays(repoPath: string): Promise<number | null> {
  const candidates = [
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    'poetry.lock',
    'Pipfile.lock',
    'Gemfile.lock',
    'mix.lock',
    'Cargo.lock'
  ]

  for (const candidate of candidates) {
    try {
      const stats = await fs.stat(path.join(repoPath, candidate))
      return (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24)
    } catch {
      // Keep scanning candidates.
    }
  }

  return null
}

async function getInstalledDependencyNames(repoPath: string): Promise<string[]> {
  try {
    const packageJsonPath = path.join(repoPath, 'package.json')
    const raw = await fs.readFile(packageJsonPath, 'utf-8')
    const pkg = JSON.parse(raw)
    const names = new Set<string>()

    for (const key of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
      const section = pkg?.[key]
      if (section && typeof section === 'object') {
        for (const name of Object.keys(section)) {
          names.add(name)
        }
      }
    }

    return Array.from(names)
  } catch {
    return []
  }
}

async function existsAt(repoPath: string, relativePath: string): Promise<boolean> {
  try {
    await fs.access(path.join(repoPath, relativePath))
    return true
  } catch {
    return false
  }
}

async function detectTestScript(repoPath: string): Promise<boolean> {
  try {
    const raw = await fs.readFile(path.join(repoPath, 'package.json'), 'utf-8')
    const pkg = JSON.parse(raw)
    return Boolean(pkg?.scripts?.test && String(pkg.scripts.test).trim())
  } catch {
    return false
  }
}

async function detectCiConfig(repoPath: string): Promise<boolean> {
  const candidates = [
    '.github/workflows',
    '.gitlab-ci.yml',
    'circle.yml',
    '.circleci/config.yml',
    'azure-pipelines.yml',
    'Jenkinsfile'
  ]
  for (const candidate of candidates) {
    if (await existsAt(repoPath, candidate)) {
      return true
    }
  }
  return false
}

async function detectNodeModulesCommitted(repoPath: string): Promise<boolean> {
  try {
    const { stdout } = await execAsync('git ls-files node_modules', {
      cwd: repoPath,
      timeout: 20000
    })
    return stdout.trim().length > 0
  } catch {
    return false
  }
}

async function collectPathDepthSignals(repoPath: string): Promise<{ maxNestingDepth: number; deeplyNestedFiles: number }> {
  let maxNestingDepth = 0
  let deeplyNestedFiles = 0
  const ignoredDirs = new Set(['.git', 'node_modules', 'dist', 'build', '.next', 'coverage', '.bridge'])

  const walk = async (dir: string, depth: number): Promise<void> => {
    const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => [])
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (ignoredDirs.has(entry.name)) continue
        await walk(fullPath, depth + 1)
      } else {
        maxNestingDepth = Math.max(maxNestingDepth, depth)
        if (depth > 6) {
          deeplyNestedFiles += 1
        }
      }
    }
  }

  await walk(repoPath, 0)
  return { maxNestingDepth, deeplyNestedFiles }
}

async function computeCodeHealthMetrics(repoPath: string): Promise<CodeHealthMetrics> {
  const metrics: CodeHealthMetrics = {
    todoCount: 0,
    consoleLogCount: 0,
    commentedOutBlockCount: 0,
    mixedTabsSpaces: false,
    inconsistentQuoteStyle: false,
    hasLinter: false,
    hasFormatter: false,
    packageScriptsCount: 0,
    hasGitignore: false
  }

  const extensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.rb', '.go', '.java', '.rs', '.ex', '.exs']
  const ignoredDirs = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', '.next', '.bridge'])
  let singleQuoteCount = 0
  let doubleQuoteCount = 0

  metrics.hasGitignore = await existsAt(repoPath, '.gitignore')

  try {
    const packageJsonRaw = await fs.readFile(path.join(repoPath, 'package.json'), 'utf-8')
    const packageJson = JSON.parse(packageJsonRaw)
    metrics.packageScriptsCount = Object.keys(packageJson?.scripts || {}).length
    const deps = { ...(packageJson?.dependencies || {}), ...(packageJson?.devDependencies || {}) }
    metrics.hasLinter = Boolean(deps.eslint || deps['@typescript-eslint/eslint-plugin'] || packageJson?.scripts?.lint)
    metrics.hasFormatter = Boolean(deps.prettier || deps.rome || packageJson?.scripts?.format)
  } catch {
    // non-node repos or unreadable package.json
  }

  const walk = async (dir: string): Promise<void> => {
    const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => [])
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (ignoredDirs.has(entry.name)) continue
        await walk(fullPath)
      } else if (extensions.includes(path.extname(entry.name).toLowerCase())) {
        const content = await fs.readFile(fullPath, 'utf-8').catch(() => '')
        if (!content) continue

        const todoMatches = content.match(/\b(TODO|FIXME|HACK)\b/g)
        const consoleMatches = content.match(/console\.log\s*\(/g)
        const commentedOutMatches = content.match(/^\s*\/\/\s*(if|for|while|function|class|const|let|var)\b/gm)
        metrics.todoCount += todoMatches?.length || 0
        metrics.consoleLogCount += consoleMatches?.length || 0
        metrics.commentedOutBlockCount += commentedOutMatches?.length || 0

        const hasTabs = /^\t+/m.test(content)
        const hasSpaces = /^ {2,}/m.test(content)
        if (hasTabs && hasSpaces) {
          metrics.mixedTabsSpaces = true
        }

        singleQuoteCount += (content.match(/'[^'\n]*'/g) || []).length
        doubleQuoteCount += (content.match(/"[^"\n]*"/g) || []).length
      }
    }
  }

  await walk(repoPath)
  const quoteTotal = singleQuoteCount + doubleQuoteCount
  if (quoteTotal > 0) {
    const ratio = Math.abs(singleQuoteCount - doubleQuoteCount) / quoteTotal
    metrics.inconsistentQuoteStyle = ratio < 0.6
  }

  return metrics
}

async function collectRepositoryInsights(
  repoPath: string,
  config: BridgeConfig
): Promise<ScanData['repositoryInsights']> {
  const existsAny = async (targets: string[]): Promise<boolean> => {
    for (const target of targets) {
      if (await existsAt(repoPath, target)) {
        return true
      }
    }
    return false
  }

  const [readmeStats, ciDetected, hasTestScript, pathSignals, nodeModulesCommitted, lockfileAgeDays] = await Promise.all([
    getReadmeStats(repoPath),
    detectCiConfig(repoPath),
    detectTestScript(repoPath),
    collectPathDepthSignals(repoPath),
    detectNodeModulesCommitted(repoPath),
    getLockfileAgeDays(repoPath)
  ])

  const hasLockfile = await existsAny([
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    'poetry.lock',
    'Pipfile.lock',
    'Gemfile.lock',
    'mix.lock',
    'Cargo.lock'
  ])

  const hasSrcDirectory = await existsAt(repoPath, 'src')
  const hasChangelog = await existsAny(['CHANGELOG.md', 'changelog.md', 'CHANGELOG'])
  const hasContributingGuide = await existsAny(['CONTRIBUTING.md', '.github/CONTRIBUTING.md'])
  const hasLicense = await existsAny(['LICENSE', 'LICENSE.md', 'LICENSE.txt'])

  return {
    hasLockfile,
    lockfileDaysSinceUpdate: lockfileAgeDays,
    packageManagerDetected: Boolean(config.project.packageManager),
    hasSrcDirectory,
    ciDetected,
    readmeExists: readmeStats.exists,
    readmeWordCount: readmeStats.wordCount,
    readmeDaysSinceUpdate: readmeStats.daysSinceUpdate,
    hasChangelog,
    hasContributingGuide,
    hasLicense,
    testCommandExists: Boolean(config.gates.tests.command || hasTestScript),
    testsPass: null,
    maxNestingDepth: pathSignals.maxNestingDepth,
    deeplyNestedFiles: pathSignals.deeplyNestedFiles,
    nodeModulesCommitted
  }
}

// Find largest files in the repository
export async function findLargeFiles(repoPath: string, minSizeBytes: number = 1024 * 1024): Promise<LargeFile[]> {
  const largeFiles: LargeFile[] = []

  async function scanDir(dir: string) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        // Skip node_modules, .git, vendor, deps, etc.
        if (['node_modules', '.git', 'vendor', 'deps', '_build', '.bundle', '__pycache__', '.venv', 'venv'].includes(entry.name)) {
          continue
        }

        if (entry.isDirectory()) {
          await scanDir(fullPath)
        } else {
          try {
            const stats = await fs.stat(fullPath)
            if (stats.size >= minSizeBytes) {
              largeFiles.push({
                path: path.relative(repoPath, fullPath),
                size: stats.size,
                sizeFormatted: formatSize(stats.size),
                type: 'current'
              })
            }
          } catch {}
        }
      }
    } catch {}
  }

  await scanDir(repoPath)

  return largeFiles.sort((a, b) => b.size - a.size)
}

// Find large files in git history (blobs that are large but may have been deleted)
export async function findGitHistoryBlobs(repoPath: string, minSizeBytes: number = 5 * 1024 * 1024): Promise<LargeFile[]> {
  const largeFiles: LargeFile[] = []

  try {
    // Get all blobs with their sizes
    const { stdout } = await execAsync(
      `git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | awk '/^blob/ {print $2, $3, $4}'`,
      { cwd: repoPath, timeout: 60000, maxBuffer: 50 * 1024 * 1024 }
    )

    const lines = stdout.split('\n').filter(l => l.trim())

    for (const line of lines) {
      const parts = line.split(' ')
      if (parts.length >= 2) {
        const size = parseInt(parts[1], 10)
        const filePath = parts.slice(2).join(' ') || parts[0]

        if (size >= minSizeBytes) {
          largeFiles.push({
            path: filePath,
            size,
            sizeFormatted: formatSize(size),
            type: 'git-history'
          })
        }
      }
    }
  } catch (e) {
    console.error('Git history scan failed:', e)
  }

  return largeFiles.sort((a, b) => b.size - a.size).slice(0, 50)
}

// Find oversized components (files with too many lines)
export async function findOversizedComponents(repoPath: string, maxLines: number = 150): Promise<OversizedComponent[]> {
  const oversized: OversizedComponent[] = []

  const codeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.py', '.rb', '.ex', '.exs', '.go', '.rs', '.java', '.kt', '.swift']

  async function scanDir(dir: string) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        if (['node_modules', '.git', 'vendor', 'deps', '_build', '.bundle', '__pycache__', '.venv', 'venv', 'dist', 'build'].includes(entry.name)) {
          continue
        }

        if (entry.isDirectory()) {
          await scanDir(fullPath)
        } else {
          const ext = path.extname(entry.name).toLowerCase()

          if (codeExtensions.includes(ext)) {
            try {
              const content = await fs.readFile(fullPath, 'utf-8')
              const lines = content.split('\n').length

              if (lines > maxLines) {
                let type = 'file'

                // Try to detect component type
                if (ext === '.tsx' || ext === '.jsx') {
                  type = 'React Component'
                } else if (ext === '.vue') {
                  type = 'Vue Component'
                } else if (ext === '.svelte') {
                  type = 'Svelte Component'
                } else if (content.includes('class ') && content.includes('def ')) {
                  type = 'Class'
                }

                oversized.push({
                  path: path.relative(repoPath, fullPath),
                  lines,
                  type
                })
              }
            } catch {}
          }
        }
      }
    } catch {}
  }

  await scanDir(repoPath)

  return oversized.sort((a, b) => b.lines - a.lines)
}

// Get file size statistics for a repository
export async function getFileSizeStats(repoPath: string): Promise<{
  totalSize: number
  totalSizeFormatted: string
  fileCount: number
  largestFiles: LargeFile[]
}> {
  let totalSize = 0
  let fileCount = 0
  const files: LargeFile[] = []

  async function scanDir(dir: string) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        if (['node_modules', '.git', 'vendor', 'deps', '_build', '.bundle'].includes(entry.name)) {
          continue
        }

        if (entry.isDirectory()) {
          await scanDir(fullPath)
        } else {
          try {
            const stats = await fs.stat(fullPath)
            totalSize += stats.size
            fileCount++

            files.push({
              path: path.relative(repoPath, fullPath),
              size: stats.size,
              sizeFormatted: formatSize(stats.size),
              type: 'current'
            })
          } catch {}
        }
      }
    } catch {}
  }

  await scanDir(repoPath)

  // Sort and get top 20
  files.sort((a, b) => b.size - a.size)

  return {
    totalSize,
    totalSizeFormatted: formatSize(totalSize),
    fileCount,
    largestFiles: files.slice(0, 20)
  }
}

// Generate full cleanup report
export async function generateCleanupReport(repoPath: string): Promise<CleanupReport> {
  const [largeFiles, gitHistoryFiles, oversizedComponents] = await Promise.all([
    findLargeFiles(repoPath, 500 * 1024), // 500KB+
    findGitHistoryBlobs(repoPath, 5 * 1024 * 1024), // 5MB+ in git history
    findOversizedComponents(repoPath, 150)
  ])

  const totalWastedSpace = gitHistoryFiles.reduce((sum, f) => sum + f.size, 0)

  return {
    largeFiles,
    gitHistoryFiles,
    oversizedComponents,
    totalWastedSpace,
    totalWastedSpaceFormatted: formatSize(totalWastedSpace)
  }
}

async function getNpmAuditSummary(repoPath: string): Promise<VulnerabilitySummary> {
  const empty: VulnerabilitySummary = { critical: 0, high: 0, medium: 0, low: 0, total: 0 }
  const manager = await detectPackageManager(repoPath)
  const auditArgs = manager === 'npm'
    ? ['audit', '--json']
    : ['audit', '--json']

  const result = await runCli(manager, auditArgs, repoPath, DEFAULT_SCAN_TIMEOUT_MS)
  const payload = extractJsonPayload(result.stdout || result.stderr)
  if (!payload) {
    return empty
  }

  if (payload.metadata?.vulnerabilities) {
    const meta = payload.metadata.vulnerabilities
    const critical = Number(meta.critical || 0)
    const high = Number(meta.high || 0)
    const medium = Number(meta.moderate || meta.medium || 0)
    const low = Number(meta.low || 0)
    const total = critical + high + medium + low
    return { critical, high, medium, low, total }
  }

  if (payload.vulnerabilities && typeof payload.vulnerabilities === 'object' && !Array.isArray(payload.vulnerabilities)) {
    const counts = payload.vulnerabilities as Record<string, any>
    if (typeof counts.critical === 'number') {
      const critical = Number(counts.critical || 0)
      const high = Number(counts.high || 0)
      const medium = Number(counts.moderate || counts.medium || 0)
      const low = Number(counts.low || 0)
      const total = critical + high + medium + low
      return { critical, high, medium, low, total }
    }
  }

  if (payload.advisories && typeof payload.advisories === 'object') {
    const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 }
    for (const advisory of Object.values(payload.advisories) as any[]) {
      const severity = String(advisory.severity || '').toLowerCase()
      if (severity === 'critical') severityCounts.critical += 1
      else if (severity === 'high') severityCounts.high += 1
      else if (severity === 'moderate' || severity === 'medium') severityCounts.medium += 1
      else if (severity === 'low') severityCounts.low += 1
    }
    const total = severityCounts.critical + severityCounts.high + severityCounts.medium + severityCounts.low
    return { ...severityCounts, total }
  }

  return empty
}

export async function analyzeDependencies(repoPath: string): Promise<DependencyReport> {
  try {
    const languages = await detectLanguages(repoPath)
    const outdated: OutdatedPackage[] = []

    for (const lang of languages) {
      switch (lang) {
        case 'javascript':
          outdated.push(...await getJsOutdatedPackages(repoPath))
          break
        case 'python':
          outdated.push(...await getPythonOutdated(repoPath))
          break
        case 'ruby':
          outdated.push(...await getRubyOutdated(repoPath))
          break
        case 'elixir':
          outdated.push(...await getElixirOutdated(repoPath))
          break
      }
    }

    const vulnerabilities = languages.includes('javascript')
      ? await getNpmAuditSummary(repoPath)
      : { critical: 0, high: 0, medium: 0, low: 0, total: 0 }

    const installedPackages = await getInstalledDependencyNames(repoPath)
    return { outdated, vulnerabilities, installedPackages }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Dependency analysis failed'
    return {
      outdated: [],
      vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0, total: 0 },
      installedPackages: [],
      error: message
    }
  }
}

export async function detectCircularDependencies(repoPath: string): Promise<CircularDependencyReport> {
  const tempConfigPath = path.join(repoPath, '.bridge-depcruise.tmp.json')
  try {
    const tempConfig = {
      forbidden: [
        {
          name: 'no-circular',
          severity: 'error',
          from: {},
          to: { circular: true }
        }
      ]
    }
    await fs.writeFile(tempConfigPath, JSON.stringify(tempConfig), 'utf-8')

    const result = await runCli(
      'depcruise',
      [
        '--config', tempConfigPath,
        '--include-only', '^src',
        '--exclude', 'node_modules',
        '--output-type', 'json',
        '.'
      ],
      repoPath,
      DEFAULT_SCAN_TIMEOUT_MS
    )
    const payload = extractJsonPayload(result.stdout || result.stderr)
    if (!payload) {
      return {
        count: 0,
        dependencies: [],
        error: 'dependency-cruiser did not produce parseable output.'
      }
    }

    const violations = payload.output?.violations || []
    const dependencies: CircularDependency[] = violations.map((violation: any) => ({
      from: violation.from,
      to: violation.to,
      cycle: Array.isArray(violation.cycle) ? violation.cycle : []
    }))

    return {
      count: dependencies.length,
      dependencies
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Circular dependency scan failed'
    return { count: 0, dependencies: [], error: message }
  } finally {
    await fs.unlink(tempConfigPath).catch(() => {})
  }
}

function normalizeReportedPath(repoPath: string, target: string): string {
  const cleaned = target.replace(/^(\.\/|\\)/, '').trim()
  if (!cleaned) return target
  if (path.isAbsolute(cleaned)) {
    return path.relative(repoPath, cleaned)
  }
  return cleaned
}

function parseDeadCodeExports(payload: any, repoPath: string): DeadCodeExport[] {
  const exports: DeadCodeExport[] = []
  if (!payload) return exports

  if (Array.isArray(payload.exports)) {
    for (const entry of payload.exports) {
      const file = normalizeReportedPath(repoPath, entry.file || entry.path || '')
      const list = entry.exports || entry.unusedExports || []
      if (Array.isArray(list)) {
        for (const exp of list) {
          exports.push({ file, exportName: String(exp) })
        }
      }
    }
  }

  if (Array.isArray(payload.unusedExports)) {
    for (const entry of payload.unusedExports) {
      if (typeof entry === 'string') {
        exports.push({ file: 'unknown', exportName: entry })
      } else if (entry && typeof entry === 'object') {
        exports.push({
          file: normalizeReportedPath(repoPath, entry.file || entry.path || 'unknown'),
          exportName: String(entry.export || entry.name || '')
        })
      }
    }
  }

  return exports
}

function parseDeadFiles(payload: any, repoPath: string): string[] {
  if (!payload) return []
  const candidates =
    payload.unusedFiles ||
    payload.unimported ||
    payload.unused ||
    payload.files ||
    payload.unusedModules ||
    []

  if (Array.isArray(candidates)) {
    return candidates
      .map((entry: any) => typeof entry === 'string' ? entry : entry?.file || entry?.path)
      .filter(Boolean)
      .map((file: string) => normalizeReportedPath(repoPath, file))
  }

  return []
}

export async function detectDeadCode(repoPath: string): Promise<DeadCodeReport> {
  const report: DeadCodeReport = {
    deadFiles: [],
    unusedExports: [],
    totalDeadCodeCount: 0,
    raw: {}
  }

  const knipResult = await runCli('knip', ['--reporter', 'json'], repoPath, DEFAULT_SCAN_TIMEOUT_MS)
  report.raw!.knip = knipResult.stdout || knipResult.stderr
  const knipPayload = extractJsonPayload(knipResult.stdout || knipResult.stderr)
  report.unusedExports = parseDeadCodeExports(knipPayload, repoPath)

  const unimportedResult = await runCli('unimported', ['--json'], repoPath, DEFAULT_SCAN_TIMEOUT_MS)
  report.raw!.unimported = unimportedResult.stdout || unimportedResult.stderr
  const unimportedPayload = extractJsonPayload(unimportedResult.stdout || unimportedResult.stderr)
  report.deadFiles = parseDeadFiles(unimportedPayload, repoPath)

  report.totalDeadCodeCount = report.deadFiles.length + report.unusedExports.length

  if (!knipResult.success && !unimportedResult.success) {
    report.error = 'Dead code tooling failed to run. Ensure knip and unimported are installed.'
  }

  return report
}

async function locateStatsFile(repoPath: string): Promise<string | null> {
  const candidates = [
    path.join(repoPath, 'dist', 'stats.json'),
    path.join(repoPath, 'build', 'stats.json'),
    path.join(repoPath, 'stats.json')
  ]

  for (const candidate of candidates) {
    try {
      await fs.access(candidate)
      return candidate
    } catch {}
  }

  return null
}

export async function analyzeBundleSize(repoPath: string): Promise<BundleAnalysisReport> {
  try {
    let statsPath = await locateStatsFile(repoPath)
    if (!statsPath) {
      const manager = await detectPackageManager(repoPath)
      const buildArgs = manager === 'yarn'
        ? ['run', 'build', '--stats-json']
        : ['run', 'build', '--', '--stats-json']
      await runCli(manager, buildArgs, repoPath, DEFAULT_SCAN_TIMEOUT_MS)
      statsPath = await locateStatsFile(repoPath)
    }

    if (!statsPath) {
      return {
        totalSize: 0,
        totalSizeFormatted: formatSize(0),
        largestModules: [],
        error: 'Bundle stats not found. Ensure your build outputs stats.json.'
      }
    }

    const raw = await fs.readFile(statsPath, 'utf-8')
    const stats = JSON.parse(raw)
    const assets = stats.assets || stats.children?.flatMap((child: any) => child.assets || []) || []
    const modules = stats.modules || stats.children?.flatMap((child: any) => child.modules || []) || []

    const totalSize = assets.reduce((sum: number, asset: any) => sum + (asset?.size || 0), 0)
    const largestModules = modules
      .filter((mod: any) => typeof mod?.size === 'number')
      .sort((a: any, b: any) => b.size - a.size)
      .slice(0, 10)
      .map((mod: any) => ({
        name: String(mod.name || mod.identifier || mod.moduleName || 'unknown'),
        size: mod.size,
        sizeFormatted: formatSize(mod.size)
      }))

    const history = getScanHistory(repoPath)
    const previousSize = history.bundleSize
    const delta = previousSize ? totalSize - previousSize : undefined
    const deltaPercent = previousSize ? (delta! / previousSize) * 100 : undefined
    const warning = typeof deltaPercent === 'number' ? deltaPercent > 10 : false

    saveScanHistory(repoPath, { bundleSize: totalSize })

    return {
      totalSize,
      totalSizeFormatted: formatSize(totalSize),
      largestModules,
      previousSize,
      delta,
      deltaPercent,
      warning,
      statsPath
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Bundle analysis failed'
    return {
      totalSize: 0,
      totalSizeFormatted: formatSize(0),
      largestModules: [],
      error: message
    }
  }
}

export async function analyzeTestCoverage(repoPath: string): Promise<TestCoverageReport> {
  const report: TestCoverageReport = {
    coveragePercentage: null,
    uncoveredCriticalFiles: []
  }

  try {
    await fs.access(path.join(repoPath, 'package.json'))
  } catch {
    report.error = 'No package.json found for test coverage'
    return report
  }

  const manager = await detectPackageManager(repoPath)
  const testArgs = manager === 'yarn'
    ? ['test', '--coverage']
    : manager === 'pnpm'
      ? ['test', '--', '--coverage']
      : ['test', '--', '--coverage']

  await runCli(manager, testArgs, repoPath, DEFAULT_SCAN_TIMEOUT_MS)

  try {
    const summaryPath = path.join(repoPath, 'coverage', 'coverage-summary.json')
    const summaryRaw = await fs.readFile(summaryPath, 'utf-8')
    const summary = JSON.parse(summaryRaw)
    const total = summary.total
    report.coveragePercentage = total?.lines?.pct ?? null
    report.summaryPath = summaryPath

    const criticalEntries = Object.entries(summary)
      .filter(([key]) => key !== 'total')
      .filter(([file]) => file.includes('/auth/') || file.includes('/payments/') || file.includes('/api/'))
      .map(([file, data]: any) => ({
        file,
        coverage: data?.lines?.pct ?? 0
      }))
      .filter(entry => entry.coverage < 70)

    report.uncoveredCriticalFiles = criticalEntries
  } catch (error) {
    report.error = error instanceof Error ? error.message : 'Coverage summary not found'
  }

  return report
}

async function findSourceFiles(dir: string, extensions: string[]): Promise<string[]> {
  const results: string[] = []
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => [])

  for (const entry of entries) {
    if (entry.name.startsWith('.') || ['node_modules', 'dist', 'build', 'coverage'].includes(entry.name)) {
      continue
    }
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...await findSourceFiles(fullPath, extensions))
    } else if (extensions.includes(path.extname(entry.name))) {
      results.push(fullPath)
    }
  }

  return results
}

export async function detectDocumentationDebt(repoPath: string): Promise<DocumentationDebtReport> {
  const requiredSections = ['Installation', 'Usage', 'API', 'Contributing', 'License']

  try {
    const readmePath = path.join(repoPath, 'README.md')
    const readme = await fs.readFile(readmePath, 'utf-8')

    const missingSections = requiredSections.filter(section => {
      const pattern = new RegExp(`^#{1,6}\\s+${section}\\b`, 'm')
      return !pattern.test(readme)
    })

    const lastUpdateMatch = readme.match(/Last updated:\s*(.+)/i)
    const lastUpdate = lastUpdateMatch ? new Date(lastUpdateMatch[1]) : null
    const validLastUpdate = lastUpdate && !Number.isNaN(lastUpdate.getTime())
    const daysSinceUpdate = validLastUpdate
      ? (Date.now() - lastUpdate!.getTime()) / (1000 * 60 * 60 * 24)
      : 999

    const srcDir = path.join(repoPath, 'src')
    const srcFiles = await findSourceFiles(srcDir, ['.ts', '.tsx', '.js', '.jsx'])
    let undocumentedFunctions = 0

    for (const file of srcFiles) {
      const content = await fs.readFile(file, 'utf-8')
      const matches = content.match(/^export\s+(async\s+)?function/gm)
      const jsDocMatches = content.match(/\/\*\*[\s\S]*?\*\/\s*export\s+(async\s+)?function/gm)
      undocumentedFunctions += Math.max(0, (matches?.length || 0) - (jsDocMatches?.length || 0))
    }

    return {
      missingReadmeSections: missingSections,
      readmeOutdated: daysSinceUpdate > 90,
      daysSinceUpdate,
      undocumentedFunctions
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Documentation scan failed'
    return {
      missingReadmeSections: requiredSections,
      readmeOutdated: true,
      daysSinceUpdate: 999,
      undocumentedFunctions: 0,
      error: message
    }
  }
}

export async function runFullScan(
  repoPath: string,
  options: { onProgress?: (message: string, step: number, total: number) => void; skipConsoleUpload?: boolean } = {}
): Promise<FullScanResult> {
  const startTime = Date.now()
  const configPath = path.join(repoPath, '.bridge.json')
  let config = await loadBridgeConfig(repoPath)
  try {
    await fs.access(configPath)
  } catch {
    // First scan for this repository: generate and persist starter config.
    const generated = await generateDefaultConfig(repoPath)
    await writeBridgeConfig(repoPath, generated)
    config = generated
  }

  const featureFlags = config.scan.features
  const steps: string[] = []
  if (featureFlags.dependencies) steps.push('Analyzing dependencies')
  if (featureFlags.circularDeps) steps.push('Detecting circular dependencies')
  if (featureFlags.deadCode) steps.push('Detecting dead code')
  if (featureFlags.bundleSize) steps.push('Analyzing bundle size')
  if (featureFlags.testCoverage) steps.push('Running test coverage')
  if (featureFlags.documentation) steps.push('Checking documentation')
  if (featureFlags.security) steps.push('Scanning security code patterns')
  if (featureFlags.fileAnalysis) steps.push('Collecting file architecture signals')
  if (featureFlags.codeSmells) steps.push('Analyzing code health metrics')
  if (steps.length === 0) {
    steps.push('No enabled scan features; returning baseline report')
  }

  let stepIndex = 0
  const progress = (message: string) => {
    stepIndex += 1
    options.onProgress?.(message, stepIndex, steps.length)
  }

  let dependencies: DependencyReport = {
    outdated: [],
    vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0, total: 0 },
    installedPackages: []
  }
  if (featureFlags.dependencies) {
    progress('Analyzing dependencies')
    dependencies = await analyzeDependencies(repoPath)
  }

  let circularDependencies: CircularDependencyReport = { count: 0, dependencies: [] }
  if (featureFlags.circularDeps) {
    progress('Detecting circular dependencies')
    circularDependencies = await detectCircularDependencies(repoPath)
  }

  let deadCode: DeadCodeReport = { deadFiles: [], unusedExports: [], totalDeadCodeCount: 0 }
  if (featureFlags.deadCode) {
    progress('Detecting dead code')
    deadCode = await detectDeadCode(repoPath)
  }

  let bundleSize: BundleAnalysisReport = { totalSize: 0, totalSizeFormatted: formatSize(0), largestModules: [] }
  if (featureFlags.bundleSize) {
    progress('Analyzing bundle size')
    bundleSize = await analyzeBundleSize(repoPath)
  }

  let testCoverage: TestCoverageReport = { coveragePercentage: null, uncoveredCriticalFiles: [] }
  if (featureFlags.testCoverage) {
    progress('Running test coverage')
    testCoverage = await analyzeTestCoverage(repoPath)
  }

  let documentation: DocumentationDebtReport = {
    missingReadmeSections: [],
    readmeOutdated: false,
    daysSinceUpdate: 0,
    undocumentedFunctions: 0
  }
  if (featureFlags.documentation) {
    progress('Checking documentation')
    documentation = await detectDocumentationDebt(repoPath)
  }

  let securityPatterns: SecurityPatternFinding[] = []
  if (featureFlags.security) {
    progress('Scanning security code patterns')
    securityPatterns = await scanRepoForSecurityPatterns(repoPath, {
      exclude: config.scan.exclude,
      maxFindings: 300
    })
  }

  let oversizedFiles: OversizedComponent[] = []
  if (featureFlags.fileAnalysis) {
    progress('Collecting file architecture signals')
    oversizedFiles = await findOversizedComponents(repoPath, 150)
  }

  let codeHealth: CodeHealthMetrics = {
    todoCount: 0,
    consoleLogCount: 0,
    commentedOutBlockCount: 0,
    mixedTabsSpaces: false,
    inconsistentQuoteStyle: false,
    hasLinter: false,
    hasFormatter: false,
    packageScriptsCount: 0,
    hasGitignore: false
  }
  if (featureFlags.codeSmells) {
    progress('Analyzing code health metrics')
    codeHealth = await computeCodeHealthMetrics(repoPath)
  }

  const repositoryInsights = await collectRepositoryInsights(repoPath, config)
  repositoryInsights.testsPass = null
  repositoryInsights.oversizedFilesCount = oversizedFiles.length

  const history = getScanHistory(repoPath)
  const scanData: ScanData = {
    dependencies,
    vulnerabilities: dependencies.vulnerabilities,
    circularDependencies,
    deadCode,
    bundleSize,
    testCoverage,
    documentation,
    oversizedComponents: oversizedFiles,
    securityPatterns,
    codeHealth,
    repositoryInsights,
    previousScore: history.techDebtScore
  }

  const techDebtScore = await calculateTechDebtScore(repoPath, scanData, config)
  saveScanHistory(repoPath, {
    bundleSize: bundleSize.totalSize || history.bundleSize,
    techDebtScore: techDebtScore.total
  })

  let repositoryUrl: string | null | undefined = undefined
  try {
    const repoInfo = await getRepoInfo(repoPath)
    repositoryUrl = repoInfo.remote
  } catch {}

  const result: FullScanResult = {
    scanDate: new Date().toISOString(),
    repository: repoPath,
    repositoryUrl,
    config,
    dependencies,
    circularDependencies,
    deadCode,
    bundleSize,
    testCoverage,
    documentation,
    securityPatterns,
    oversizedFiles,
    codeHealth,
    techDebtScore,
    durationMs: Date.now() - startTime
  }

  const scanReport = await generateScanReport(repoPath, config, result, techDebtScore, {
    patternFindings: securityPatterns,
    oversizedFiles
  })
  result.scanReport = scanReport
  result.reportPaths = await writeScanReportArtifacts(repoPath, scanReport)

  if (!options.skipConsoleUpload) {
    const settings = getBridgeConsoleSettings()
    if (settings.autoUpload && settings.consoleUrl && settings.apiToken && settings.githubUsername) {
      result.consoleUpload = await sendScanToConsole(result, settings)
    }
  }

  try {
    const gitignoreRaw = await fs.readFile(path.join(repoPath, '.gitignore'), 'utf-8')
    if (!gitignoreRaw.split(/\r?\n/).some(line => line.trim() === '.bridge/' || line.trim() === '.bridge')) {
      console.log(`[Bridge] Consider adding '.bridge/' to ${repoPath}/.gitignore`) // eslint-disable-line no-console
    }
  } catch {
    console.log(`[Bridge] Consider adding '.bridge/' to ${repoPath}/.gitignore`) // eslint-disable-line no-console
  }

  return result
}

export async function loadRepositoryBridgeConfig(repoPath: string): Promise<BridgeConfig> {
  return loadBridgeConfig(repoPath)
}

export async function generateRepositoryBridgeConfig(repoPath: string): Promise<BridgeConfig> {
  const config = await generateDefaultConfig(repoPath)
  await writeBridgeConfig(repoPath, config)
  return config
}

export async function saveRepositoryBridgeConfig(repoPath: string, config: BridgeConfig): Promise<BridgeConfig> {
  await writeBridgeConfig(repoPath, config)
  return loadBridgeConfig(repoPath)
}

export async function getLatestTechDebtScore(repoPath: string): Promise<TechDebtScore> {
  const scorePath = path.join(repoPath, '.bridge', 'latest-score.json')
  try {
    const raw = await fs.readFile(scorePath, 'utf-8')
    const parsed = JSON.parse(raw)
    if (typeof parsed?.total === 'number' && parsed?.dimensions) {
      return parsed as TechDebtScore
    }
  } catch {
    // Fallback to fresh scan below.
  }

  const scan = await runFullScan(repoPath, { skipConsoleUpload: true })
  return scan.techDebtScore
}

export async function deleteDeadFile(repoPath: string, relativePath: string): Promise<boolean> {
  const target = path.resolve(repoPath, relativePath)
  const root = path.resolve(repoPath) + path.sep
  if (!target.startsWith(root)) {
    throw new Error('Invalid file path')
  }
  await fs.unlink(target)
  return true
}

export async function cleanupDeadCode(
  repoPath: string,
  deadFiles: string[],
  unusedExports: DeadCodeExport[],
  options: { createPr?: boolean } = {}
): Promise<{ success: boolean; deletedFiles: string[]; skippedFiles: string[]; prUrl?: string; error?: string }> {
  const deletedFiles: string[] = []
  const skippedFiles: string[] = []
  const branchName = `bridge-remove-dead-code-${Date.now()}`
  let originalBranch = ''
  let branchCreated = false

  try {
    await ensureSafeBranch(repoPath, branchName)
    const repoInfo = await getRepoInfo(repoPath)
    originalBranch = repoInfo.branch
    await createBranch(repoPath, branchName)
    branchCreated = true

    for (const file of deadFiles) {
      try {
        await deleteDeadFile(repoPath, file)
        deletedFiles.push(file)
      } catch {
        skippedFiles.push(file)
      }
    }

    if (deletedFiles.length === 0) {
      throw new Error('No dead files were deleted.')
    }

    await commitChanges(repoPath, `chore: remove ${deletedFiles.length} dead code files (Bridge auto-cleanup)`, deletedFiles)

    let prUrl: string | undefined
    if (options.createPr !== false) {
      await pushBranch(repoPath, branchName)
      const exportLines = unusedExports.map(exp => `- ${exp.exportName} (${exp.file})`)
      const prBody = [
        '## Summary',
        `Removed ${deletedFiles.length} unused files via Bridge auto-cleanup.`,
        '',
        '### Files removed',
        ...deletedFiles.map(file => `- ${file}`),
        '',
        '### Unused exports (manual follow-up)',
        exportLines.length ? exportLines : ['- None detected']
      ].join('\n')
      prUrl = await createPullRequest(
        repoPath,
        'Remove dead code (Bridge auto-cleanup)',
        prBody
      )
    }

    return { success: true, deletedFiles, skippedFiles, prUrl }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Dead code cleanup failed'
    if (branchCreated && originalBranch) {
      await abortChanges(repoPath, originalBranch)
      await deleteBranch(repoPath, branchName)
    }
    return { success: false, deletedFiles, skippedFiles, error: message }
  }
}
````

## File: electron/services/git.ts
````typescript
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface RepoInfo {
  branch: string
  remote: string | null
  hasChanges: boolean
  isProtectedBranch: boolean
  defaultBranch: string
  ahead: number
  behind: number
}

export interface ConflictWarning {
  severity: 'high' | 'medium'
  message: string
  recommendation: string
  conflictingFiles: string[]
  behindBy: number
}

export interface GitHubCliStatus {
  installed: boolean
  authenticated: boolean
  account?: string
  message?: string
}

const PROTECTED_BRANCHES = ['main', 'master', 'develop', 'production', 'staging']

async function runGitCommand(repoPath: string, command: string): Promise<string> {
  const { stdout } = await execAsync(command, { cwd: repoPath, timeout: 30000 })
  return stdout.trim()
}

export async function getRepoInfo(repoPath: string): Promise<RepoInfo> {
  try {
    const branch = await runGitCommand(repoPath, 'git rev-parse --abbrev-ref HEAD')

    let remote: string | null = null
    try {
      remote = await runGitCommand(repoPath, 'git remote get-url origin')
    } catch {}

    let hasChanges = false
    try {
      const status = await runGitCommand(repoPath, 'git status --porcelain')
      hasChanges = status.length > 0
    } catch {}

    // Detect default branch
    let defaultBranch = 'main'
    try {
      const remoteInfo = await runGitCommand(repoPath, 'git remote show origin 2>/dev/null | grep "HEAD branch"')
      const match = remoteInfo.match(/HEAD branch:\s*(\S+)/)
      if (match) {
        defaultBranch = match[1]
      }
    } catch {
      // Check if main or master exists
      try {
        await runGitCommand(repoPath, 'git rev-parse --verify main')
        defaultBranch = 'main'
      } catch {
        try {
          await runGitCommand(repoPath, 'git rev-parse --verify master')
          defaultBranch = 'master'
        } catch {}
      }
    }

    const isProtectedBranch = PROTECTED_BRANCHES.includes(branch.toLowerCase())

    // Get ahead/behind counts relative to remote tracking branch
    let ahead = 0
    let behind = 0
    try {
      // First try to get upstream tracking branch
      const upstream = await runGitCommand(repoPath, `git rev-parse --abbrev-ref ${branch}@{upstream} 2>/dev/null`)
      if (upstream) {
        const counts = await runGitCommand(repoPath, `git rev-list --left-right --count ${upstream}...HEAD`)
        const [behindStr, aheadStr] = counts.split(/\s+/)
        behind = parseInt(behindStr, 10) || 0
        ahead = parseInt(aheadStr, 10) || 0
      }
    } catch {
      // No upstream configured or other error - leave as 0
    }

    return { branch, remote, hasChanges, isProtectedBranch, defaultBranch, ahead, behind }
  } catch (error) {
    return {
      branch: 'unknown',
      remote: null,
      hasChanges: false,
      isProtectedBranch: false,
      defaultBranch: 'main',
      ahead: 0,
      behind: 0
    }
  }
}

export async function isOnProtectedBranch(repoPath: string): Promise<boolean> {
  const info = await getRepoInfo(repoPath)
  return info.isProtectedBranch
}

export async function ensureSafeBranch(repoPath: string, targetBranch: string): Promise<void> {
  const info = await getRepoInfo(repoPath)

  if (info.isProtectedBranch) {
    throw new Error(`Cannot work on protected branch '${info.branch}'. Bridge will create a new branch.`)
  }

  if (info.hasChanges) {
    throw new Error('Repository has uncommitted changes. Please commit or stash them first.')
  }
}

export async function createBranch(repoPath: string, branchName: string): Promise<void> {
  const info = await getRepoInfo(repoPath)

  // If on protected branch, switch to default first
  if (info.isProtectedBranch) {
    try {
      await runGitCommand(repoPath, 'git fetch origin')
    } catch {}

    // Make sure we're up to date with default branch
    await runGitCommand(repoPath, `git checkout ${info.defaultBranch}`)
    try {
      await runGitCommand(repoPath, `git pull origin ${info.defaultBranch}`)
    } catch {}
  }

  // Create and checkout new branch
  await runGitCommand(repoPath, `git checkout -b ${branchName}`)
}

export async function commitChanges(repoPath: string, message: string, files?: string[]): Promise<void> {
  if (files && files.length > 0) {
    // Add specific files
    for (const file of files) {
      try {
        await runGitCommand(repoPath, `git add "${file}"`)
      } catch {}
    }
  } else {
    // Add common dependency files
    const commonFiles = [
      'package.json', 'package-lock.json',
      'requirements.txt', 'Pipfile.lock',
      'Gemfile', 'Gemfile.lock',
      'mix.exs', 'mix.lock'
    ]
    for (const file of commonFiles) {
      try {
        await runGitCommand(repoPath, `git add "${file}"`)
      } catch {}
    }
  }

  await runGitCommand(repoPath, `git commit -m "${message.replace(/"/g, '\\"')}"`)
}

export async function pushBranch(repoPath: string, branchName: string): Promise<void> {
  await runGitCommand(repoPath, `git push -u origin ${branchName}`)
}

export async function createPullRequest(
  repoPath: string,
  title: string,
  body: string
): Promise<string> {
  try {
    await runGitCommand(repoPath, 'command -v gh')
  } catch {
    throw new Error('GitHub CLI (`gh`) is required to create PRs. Install it and run `gh auth login`.')
  }

  try {
    const result = await runGitCommand(
      repoPath,
      `gh pr create --title "${title.replace(/"/g, '\\"')}" --body "${body.replace(/"/g, '\\"')}"`
    )
    return result
  } catch (error: any) {
    const output = `${error?.stdout || ''}${error?.stderr || ''}`.trim()
    if (output.includes('not logged in')) {
      throw new Error('GitHub CLI is not authenticated. Run `gh auth login` and retry.')
    }
    throw new Error(output || 'Failed to create pull request with gh CLI.')
  }
}

export async function predictMergeConflicts(
  repoPath: string,
  options: { baseBranch?: string; minBehindCommits?: number } = {}
): Promise<ConflictWarning[]> {
  const warnings: ConflictWarning[] = []

  try {
    const info = await getRepoInfo(repoPath)
    const currentBranch = info.branch
    const baseBranch = options.baseBranch || info.defaultBranch || 'main'
    const minBehindCommits = options.minBehindCommits ?? 10

    if (!currentBranch || currentBranch === 'HEAD' || currentBranch === baseBranch) {
      return warnings
    }

    try {
      await runGitCommand(repoPath, 'git fetch origin --prune')
    } catch {
      // Continue with local refs if fetch fails.
    }

    const behindRaw = await runGitCommand(
      repoPath,
      `git rev-list --count ${currentBranch}..origin/${baseBranch} 2>/dev/null || echo 0`
    )
    const behindBy = Number.parseInt(behindRaw, 10) || 0
    if (behindBy < minBehindCommits) {
      return warnings
    }

    const oursRaw = await runGitCommand(
      repoPath,
      `git diff --name-only origin/${baseBranch}...${currentBranch}`
    )
    const theirsRaw = await runGitCommand(
      repoPath,
      `git diff --name-only ${currentBranch}...origin/${baseBranch}`
    )

    const ours = new Set(oursRaw.split('\n').map(line => line.trim()).filter(Boolean))
    const theirs = new Set(theirsRaw.split('\n').map(line => line.trim()).filter(Boolean))
    const overlapping = Array.from(ours).filter(file => theirs.has(file))

    if (overlapping.length === 0) {
      return warnings
    }

    const severity: ConflictWarning['severity'] = behindBy >= 25 ? 'high' : 'medium'
    warnings.push({
      severity,
      behindBy,
      message: `Branch is ${behindBy} commits behind ${baseBranch}; ${overlapping.length} files overlap with ${baseBranch}.`,
      recommendation: `Run \`git fetch origin && git rebase origin/${baseBranch}\` before opening a PR.`,
      conflictingFiles: overlapping.slice(0, 30)
    })

    return warnings
  } catch {
    return warnings
  }
}

export async function getGitHubCliStatus(repoPath: string): Promise<GitHubCliStatus> {
  try {
    await runGitCommand(repoPath, 'command -v gh')
  } catch {
    return {
      installed: false,
      authenticated: false,
      message: 'GitHub CLI not installed. Install with `brew install gh`.'
    }
  }

  try {
    const output = await runGitCommand(repoPath, 'gh auth status -h github.com')
    const accountMatch = output.match(/Logged in to github\.com account\s+([^\s]+)/i)
    return {
      installed: true,
      authenticated: true,
      account: accountMatch?.[1]
    }
  } catch (error: any) {
    const stderr = `${error?.stderr || ''}${error?.stdout || ''}`.trim()
    return {
      installed: true,
      authenticated: false,
      message: stderr || 'GitHub CLI installed but not authenticated. Run `gh auth login`.'
    }
  }
}

function hasPositiveTestSignal(output: string): boolean {
  const patterns = [
    /\b\d+\s+passing\b/i,
    /\btests?\s*:\s*\d+\s+passed\b/i,
    /\bpassed\s+\d+\s+tests?\b/i,
    /\ball\s+tests\s+passed\b/i,
    /\bPASS\b/
  ]
  return patterns.some(pattern => pattern.test(output))
}

function hasFailureSignal(output: string): boolean {
  const countPatterns = [
    /\b(\d+)\s+failing\b/i,
    /\b(\d+)\s+failed\b/i
  ]
  for (const pattern of countPatterns) {
    const match = output.match(pattern)
    if (match && parseInt(match[1], 10) > 0) {
      return true
    }
  }

  return /\bFAIL\b/.test(output)
}

export async function runTests(
  repoPath: string,
  command: string,
  options: { timeoutMs?: number } = {}
): Promise<{ success: boolean; output: string; reason?: string; timedOut?: boolean }> {
  const timeoutMs = options.timeoutMs ?? 300000

  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: repoPath,
      timeout: timeoutMs,
      maxBuffer: 10 * 1024 * 1024
    })
    const output = `${stdout}${stderr}`
    const hasFailure = hasFailureSignal(output)
    const hasPass = hasPositiveTestSignal(output)
    const success = !hasFailure && hasPass
    return {
      success,
      output,
      reason: success ? undefined : 'Tests did not report a passing result.'
    }
  } catch (error: any) {
    const output = `${error.stdout || ''}${error.stderr || ''}` || error.message
    const timedOut = Boolean(error.killed || error.signal === 'SIGTERM')
    return {
      success: false,
      output,
      timedOut,
      reason: timedOut ? 'Test command timed out.' : 'Test command failed.'
    }
  }
}

export async function runLint(repoPath: string, command: string): Promise<{ success: boolean; output: string }> {
  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: repoPath,
      timeout: 120000,
      maxBuffer: 10 * 1024 * 1024
    })
    return { success: true, output: stdout + stderr }
  } catch (error: any) {
    return { success: false, output: error.stdout + error.stderr || error.message }
  }
}

// Stash changes temporarily
export async function stashChanges(repoPath: string): Promise<boolean> {
  try {
    await runGitCommand(repoPath, 'git stash')
    return true
  } catch {
    return false
  }
}

// Pop stashed changes
export async function popStash(repoPath: string): Promise<boolean> {
  try {
    await runGitCommand(repoPath, 'git stash pop')
    return true
  } catch {
    return false
  }
}

// Abort and cleanup on failure
export async function abortChanges(repoPath: string, originalBranch: string): Promise<void> {
  try {
    // Discard all changes
    await runGitCommand(repoPath, 'git checkout -- .')
    await runGitCommand(repoPath, 'git clean -fd')

    // Go back to original branch
    await runGitCommand(repoPath, `git checkout ${originalBranch}`)
  } catch (e) {
    console.error('Failed to abort changes:', e)
  }
}

// Delete a branch
export async function deleteBranch(repoPath: string, branchName: string): Promise<void> {
  try {
    await runGitCommand(repoPath, `git branch -D ${branchName}`)
  } catch {}
}
````

## File: electron/services/scheduler.ts
````typescript
import { BrowserWindow } from 'electron'
import { createBridgeStore } from './store'

const store = createBridgeStore('bridge-scheduler')

export type ScheduleFrequency = 'hourly' | 'daily' | 'weekly' | 'monthly'

export interface ScheduledJob {
  id: string
  repoPath: string
  repoName: string
  frequency: ScheduleFrequency
  intervalHours: number
  daysOfWeek: number[]
  dayOfMonth: number
  timeOfDay: string
  startAt: string
  enabled: boolean
  lastRun: string | null
  nextRun: string
  language: string
  createPR: boolean
  runTests: boolean
  createdAt: string
}

export interface JobResult {
  jobId: string
  success: boolean
  timestamp: string
  updatedPackages: string[]
  prUrl?: string
  error?: string
  testsPassed?: boolean
}

export interface ScheduleJobInput {
  repoPath: string
  repoName: string
  frequency: ScheduleFrequency
  intervalHours?: number
  daysOfWeek?: number[]
  dayOfMonth?: number
  timeOfDay?: string
  startAt?: string
  enabled: boolean
  language: string
  createPR: boolean
  runTests: boolean
}

const JOBS_KEY = 'scheduled-jobs'
const RESULTS_KEY = 'job-results'
const MAX_TIMER_DELAY_MS = 24 * 60 * 60 * 1000

// Timer references for cleanup
const jobTimers: Map<string, NodeJS.Timeout> = new Map()
const runningJobs: Set<string> = new Set()
let jobExecutor: ((job: ScheduledJob) => Promise<JobResult | null>) | null = null

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function isValidIsoDate(value: string | null | undefined): boolean {
  if (!value) return false
  return !Number.isNaN(new Date(value).getTime())
}

function normalizeTimeOfDay(value?: string): string {
  const match = (value || '').match(/^(\d{1,2}):(\d{2})$/)
  if (!match) {
    return '03:00'
  }
  const hours = clamp(Number(match[1]), 0, 23)
  const minutes = clamp(Number(match[2]), 0, 59)
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function getTimeParts(timeOfDay: string): { hour: number; minute: number } {
  const [hour, minute] = normalizeTimeOfDay(timeOfDay).split(':').map(Number)
  return { hour, minute }
}

function normalizeDaysOfWeek(days: number[] | undefined, fallbackDay: number): number[] {
  const normalized = Array.from(new Set((days || []).map(day => clamp(Math.floor(day), 0, 6))))
    .sort((a, b) => a - b)
  if (normalized.length > 0) {
    return normalized
  }
  return [clamp(fallbackDay, 0, 6)]
}

function lastDayOfMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate()
}

function normalizeScheduleInput(input: ScheduleJobInput): Required<Pick<ScheduledJob, 'intervalHours' | 'daysOfWeek' | 'dayOfMonth' | 'timeOfDay' | 'startAt'>> {
  const startAtDate = isValidIsoDate(input.startAt) ? new Date(input.startAt as string) : new Date()
  const timeOfDay = normalizeTimeOfDay(input.timeOfDay)
  const { hour, minute } = getTimeParts(timeOfDay)
  startAtDate.setHours(hour, minute, 0, 0)

  return {
    intervalHours: clamp(Math.floor(input.intervalHours || 1), 1, 24),
    daysOfWeek: normalizeDaysOfWeek(input.daysOfWeek, startAtDate.getDay()),
    dayOfMonth: clamp(Math.floor(input.dayOfMonth || startAtDate.getDate()), 1, 31),
    timeOfDay,
    startAt: startAtDate.toISOString()
  }
}

export function setSchedulerExecutor(executor: (job: ScheduledJob) => Promise<JobResult | null>): void {
  jobExecutor = executor
}

export function getScheduledJobs(): ScheduledJob[] {
  return store.get(JOBS_KEY, []) as ScheduledJob[]
}

export function saveScheduledJobs(jobs: ScheduledJob[]): void {
  store.set(JOBS_KEY, jobs)
}

function createScheduledJob(job: ScheduleJobInput, nextRun?: string): ScheduledJob {
  const schedule = normalizeScheduleInput(job)
  return {
    ...job,
    ...schedule,
    id: `job-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    createdAt: new Date().toISOString(),
    lastRun: null,
    nextRun: nextRun || calculateNextRun(job.frequency, schedule)
  }
}

export function addScheduledJob(job: ScheduleJobInput): ScheduledJob {
  const jobs = getScheduledJobs()
  const newJob = createScheduledJob(job)

  jobs.push(newJob)
  saveScheduledJobs(jobs)

  // Start timer for this job
  scheduleJobTimer(newJob)

  return newJob
}

export function addScheduledJobsBatch(batch: ScheduleJobInput[]): ScheduledJob[] {
  if (batch.length === 0) return []
  const jobs = getScheduledJobs()
  const created = batch.map(input => createScheduledJob(input))

  jobs.push(...created)
  saveScheduledJobs(jobs)

  for (const job of created) {
    scheduleJobTimer(job)
  }

  return created
}

export function updateScheduledJob(jobId: string, updates: Partial<ScheduledJob>): ScheduledJob | null {
  const jobs = getScheduledJobs()
  const index = jobs.findIndex(j => j.id === jobId)

  if (index === -1) return null

  jobs[index] = { ...jobs[index], ...updates }

  const scheduleFieldsChanged = (
    updates.frequency !== undefined ||
    updates.intervalHours !== undefined ||
    updates.daysOfWeek !== undefined ||
    updates.dayOfMonth !== undefined ||
    updates.timeOfDay !== undefined ||
    updates.startAt !== undefined
  )

  if (scheduleFieldsChanged) {
    const normalized = normalizeScheduleInput({
      repoPath: jobs[index].repoPath,
      repoName: jobs[index].repoName,
      frequency: jobs[index].frequency,
      intervalHours: jobs[index].intervalHours,
      daysOfWeek: jobs[index].daysOfWeek,
      dayOfMonth: jobs[index].dayOfMonth,
      timeOfDay: jobs[index].timeOfDay,
      startAt: jobs[index].startAt,
      enabled: jobs[index].enabled,
      language: jobs[index].language,
      createPR: jobs[index].createPR,
      runTests: jobs[index].runTests
    })
    jobs[index] = { ...jobs[index], ...normalized }
    jobs[index].nextRun = calculateNextRun(jobs[index].frequency, normalized)
  }

  saveScheduledJobs(jobs)

  // Reschedule timer
  clearJobTimer(jobId)
  if (jobs[index].enabled) {
    scheduleJobTimer(jobs[index])
  }

  return jobs[index]
}

export function deleteScheduledJob(jobId: string): boolean {
  const jobs = getScheduledJobs()
  const filtered = jobs.filter(j => j.id !== jobId)

  if (filtered.length === jobs.length) return false

  saveScheduledJobs(filtered)
  clearJobTimer(jobId)

  return true
}

export function getJobResults(jobId?: string): JobResult[] {
  const results = store.get(RESULTS_KEY, []) as JobResult[]

  if (jobId) {
    return results.filter(r => r.jobId === jobId)
  }

  return results
}

export function addJobResult(result: JobResult): void {
  const results = getJobResults()
  results.unshift(result)

  // Keep only last 100 results
  if (results.length > 100) {
    results.splice(100)
  }

  store.set(RESULTS_KEY, results)
}

function calculateNextRun(
  frequency: ScheduleFrequency,
  options: Pick<ScheduledJob, 'intervalHours' | 'daysOfWeek' | 'dayOfMonth' | 'timeOfDay' | 'startAt'>,
  fromDate: Date = new Date()
): string {
  const now = new Date(fromDate)
  const start = isValidIsoDate(options.startAt) ? new Date(options.startAt) : new Date()
  const { hour, minute } = getTimeParts(options.timeOfDay)
  const intervalHours = clamp(options.intervalHours || 1, 1, 24)
  const daysOfWeek = normalizeDaysOfWeek(options.daysOfWeek, start.getDay())
  const dayOfMonth = clamp(options.dayOfMonth || start.getDate(), 1, 31)

  let next: Date

  switch (frequency) {
    case 'hourly': {
      const anchor = new Date(start)
      anchor.setMinutes(minute, 0, 0)
      if (anchor > now) {
        next = anchor
        break
      }
      const intervalMs = intervalHours * 60 * 60 * 1000
      const elapsed = now.getTime() - anchor.getTime()
      const periods = Math.floor(elapsed / intervalMs) + 1
      next = new Date(anchor.getTime() + periods * intervalMs)
      break
    }
    case 'daily': {
      next = new Date(now)
      next.setHours(hour, minute, 0, 0)
      if (next <= now) {
        next.setDate(next.getDate() + 1)
      }
      if (next < start) {
        next = new Date(start)
        next.setHours(hour, minute, 0, 0)
      }
      break
    }
    case 'weekly': {
      next = new Date(now)
      next.setHours(hour, minute, 0, 0)
      let best: Date | null = null

      for (const day of daysOfWeek) {
        const candidate = new Date(next)
        const distance = (day - candidate.getDay() + 7) % 7
        candidate.setDate(candidate.getDate() + distance)
        if (candidate <= now) {
          candidate.setDate(candidate.getDate() + 7)
        }
        if (candidate < start) {
          continue
        }
        if (!best || candidate < best) {
          best = candidate
        }
      }

      next = best || new Date(start)
      next.setHours(hour, minute, 0, 0)
      if (next <= now) {
        next.setDate(next.getDate() + 7)
      }
      break
    }
    case 'monthly': {
      next = new Date(now.getFullYear(), now.getMonth(), 1, hour, minute, 0, 0)
      const targetDay = Math.min(dayOfMonth, lastDayOfMonth(next.getFullYear(), next.getMonth()))
      next.setDate(targetDay)
      if (next <= now) {
        next = new Date(now.getFullYear(), now.getMonth() + 1, 1, hour, minute, 0, 0)
        const nextTargetDay = Math.min(dayOfMonth, lastDayOfMonth(next.getFullYear(), next.getMonth()))
        next.setDate(nextTargetDay)
      }
      if (next < start) {
        next = new Date(start.getFullYear(), start.getMonth(), 1, hour, minute, 0, 0)
        const startTargetDay = Math.min(dayOfMonth, lastDayOfMonth(next.getFullYear(), next.getMonth()))
        next.setDate(startTargetDay)
        if (next <= now) {
          next = new Date(next.getFullYear(), next.getMonth() + 1, 1, hour, minute, 0, 0)
          const shiftedTargetDay = Math.min(dayOfMonth, lastDayOfMonth(next.getFullYear(), next.getMonth()))
          next.setDate(shiftedTargetDay)
        }
      }
      break
    }
    default:
      next = new Date(now.getTime() + 60 * 60 * 1000)
      break
  }

  return next.toISOString()
}

function scheduleJobTimer(job: ScheduledJob): void {
  if (!job.enabled) return

  clearJobTimer(job.id)

  const nextRun = new Date(job.nextRun)
  const now = new Date()
  const delay = Math.max(0, nextRun.getTime() - now.getTime())
  const timerDelay = Math.min(delay, MAX_TIMER_DELAY_MS)

  const timer = setTimeout(() => {
    const latest = getScheduledJobs().find(scheduled => scheduled.id === job.id)
    if (!latest || !latest.enabled) {
      clearJobTimer(job.id)
      return
    }

    const isDue = new Date(latest.nextRun).getTime() <= Date.now()
    if (isDue) {
      void executeJob(job.id)
      return
    }

    scheduleJobTimer(latest)
  }, timerDelay)

  jobTimers.set(job.id, timer)
}

function clearJobTimer(jobId: string): void {
  const timer = jobTimers.get(jobId)
  if (timer) {
    clearTimeout(timer)
    jobTimers.delete(jobId)
  }
}

// Called on app startup to initialize all job timers
export function initializeScheduler(): void {
  const jobs = getScheduledJobs()
  let changed = false

  const normalizedJobs = jobs.map(job => {
    const schedule = normalizeScheduleInput({
      repoPath: job.repoPath,
      repoName: job.repoName,
      frequency: job.frequency,
      intervalHours: job.intervalHours,
      daysOfWeek: job.daysOfWeek,
      dayOfMonth: job.dayOfMonth,
      timeOfDay: job.timeOfDay,
      startAt: job.startAt,
      enabled: job.enabled,
      language: job.language,
      createPR: job.createPR,
      runTests: job.runTests
    })
    const nextRun = isValidIsoDate(job.nextRun)
      ? job.nextRun
      : calculateNextRun(job.frequency, schedule)
    const normalized = {
      ...job,
      ...schedule,
      nextRun,
      createPR: false,
      runTests: true
    }
    if (
      normalized.createPR !== job.createPR ||
      normalized.runTests !== job.runTests ||
      normalized.intervalHours !== job.intervalHours ||
      normalized.dayOfMonth !== job.dayOfMonth ||
      normalized.timeOfDay !== job.timeOfDay ||
      normalized.startAt !== job.startAt ||
      JSON.stringify(normalized.daysOfWeek) !== JSON.stringify(job.daysOfWeek) ||
      normalized.nextRun !== job.nextRun
    ) {
      changed = true
    }
    return normalized
  })

  if (changed) {
    saveScheduledJobs(normalizedJobs)
  }

  for (const job of normalizedJobs) {
    if (job.enabled) {
      scheduleJobTimer(job)
    }
  }
}

// Main job execution function
async function executeJob(jobId: string): Promise<void> {
  if (runningJobs.has(jobId)) return
  runningJobs.add(jobId)

  const jobs = getScheduledJobs()
  const job = jobs.find(j => j.id === jobId)

  if (!job || !job.enabled) {
    runningJobs.delete(jobId)
    return
  }

  // Notify renderer that job is starting
  const windows = BrowserWindow.getAllWindows()
  for (const win of windows) {
    win.webContents.send('scheduler-job-started', { jobId, repoName: job.repoName })
  }

  try {
    if (jobExecutor) {
      try {
        const result = await jobExecutor(job)
        if (result) {
          addJobResult(result)
        }
      } catch (error) {
        addJobResult({
          jobId: job.id,
          success: false,
          timestamp: new Date().toISOString(),
          updatedPackages: [],
          error: error instanceof Error ? error.message : 'Scheduled job failed'
        })
      }
    }

    // Update job with new next run time
    const index = jobs.findIndex(j => j.id === jobId)
    if (index !== -1) {
      jobs[index].lastRun = new Date().toISOString()
      jobs[index].nextRun = calculateNextRun(job.frequency, jobs[index])
      saveScheduledJobs(jobs)

      // Schedule next run
      scheduleJobTimer(jobs[index])
    }
  } finally {
    runningJobs.delete(jobId)
  }
}

// Check if any jobs are due (called periodically)
export function checkDueJobs(): ScheduledJob[] {
  const jobs = getScheduledJobs()
  const now = new Date()
  const dueJobs: ScheduledJob[] = []

  for (const job of jobs) {
    if (job.enabled) {
      const nextRun = new Date(job.nextRun)
      if (nextRun <= now) {
        dueJobs.push(job)
      }
    }
  }

  return dueJobs
}

// Get next scheduled job
export function getNextScheduledJob(): ScheduledJob | null {
  const jobs = getScheduledJobs().filter(j => j.enabled)

  if (jobs.length === 0) return null

  jobs.sort((a, b) => new Date(a.nextRun).getTime() - new Date(b.nextRun).getTime())

  return jobs[0]
}

// Cleanup on app quit
export function cleanupScheduler(): void {
  for (const timer of jobTimers.values()) {
    clearTimeout(timer)
  }
  jobTimers.clear()
}
````

## File: src/components/Dashboard/Dashboard.tsx
````typescript
import { useEffect, useMemo, useState } from 'react'
import { useRepositories } from '../../contexts/RepositoryContext'
import { useScanContext, type ScanTab } from '../../contexts/ScanContext'
import { useAppSettings } from '../../contexts/AppSettingsContext'
import type { ActionItem, BridgeProjectConfigResult, TechDebtScore, View } from '../../types'

interface DashboardProps {
  onNavigate: (view: View) => void
}

const formatRelativeTime = (iso?: string | null) => {
  if (!iso) return 'Never'
  const date = new Date(iso)
  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const gradeColorMap: Record<TechDebtScore['grade'], string> = {
  A: '#22c55e',
  B: '#14b8a6',
  C: '#f59e0b',
  D: '#f97316',
  F: '#ef4444'
}

const trendMeta: Record<TechDebtScore['trend'], { arrow: string; label: string; color: string }> = {
  improving: { arrow: '↓', label: 'improving', color: 'var(--success)' },
  stable: { arrow: '→', label: 'stable', color: 'var(--text-secondary)' },
  declining: { arrow: '↑', label: 'declining', color: 'var(--error)' },
  unknown: { arrow: '•', label: 'unknown', color: 'var(--text-tertiary)' }
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const {
    repositories,
    selectedRepo,
    codeDirectory,
    selectRepository,
    selectAndScanCodeDirectory,
    scanCodeDirectory
  } = useRepositories()
  const { scanResults, requestScan, setPreferredTab } = useScanContext()
  const { settings, saveSettings } = useAppSettings()
  const [repoRemote, setRepoRemote] = useState<string | null>(null)
  const [projectConfig, setProjectConfig] = useState<BridgeProjectConfigResult | null>(null)
  const [initializingConfig, setInitializingConfig] = useState(false)

  const scanResult = selectedRepo ? scanResults[selectedRepo.path] : null
  const lastScan = scanResult ? formatRelativeTime(scanResult.scanDate) : 'Never'
  const debtScore = scanResult?.techDebtScore
  const grade = debtScore?.grade
  const trend = debtScore?.trend || 'unknown'

  const navigateToScan = (tab: ScanTab, autoRun = false) => {
    setPreferredTab(tab)
    if (autoRun && selectedRepo) {
      requestScan(selectedRepo.path)
    }
    onNavigate('full-scan')
  }

  useEffect(() => {
    const loadRepoInfo = async () => {
      if (!selectedRepo?.path) {
        setRepoRemote(null)
        setProjectConfig(null)
        return
      }
      try {
        const [info, config] = await Promise.all([
          window.bridge.getRepoInfo(selectedRepo.path),
          window.bridge.getBridgeProjectConfig(selectedRepo.path)
        ])
        setRepoRemote(info.remote)
        setProjectConfig(config)
      } catch {
        setRepoRemote(null)
        setProjectConfig(null)
      }
    }
    void loadRepoInfo()
  }, [selectedRepo?.path])

  const handleSelectCodeDirectory = async () => {
    await selectAndScanCodeDirectory()
  }

  const initializeBridgeConfig = async () => {
    if (!selectedRepo) return
    setInitializingConfig(true)
    try {
      await window.bridge.generateBridgeConfig(selectedRepo.path)
      const config = await window.bridge.getBridgeProjectConfig(selectedRepo.path)
      setProjectConfig(config)
    } finally {
      setInitializingConfig(false)
    }
  }

  const firstRunReady = Boolean(codeDirectory && repositories.length > 0 && selectedRepo?.hasGit)

  const completeOnboarding = async () => {
    await saveSettings({ onboardingCompleted: true })
  }

  const dimensionBars = useMemo(() => {
    if (!debtScore) return []
    return Object.entries(debtScore.dimensions).map(([name, dimension]) => ({
      name,
      score: dimension.score,
      weighted: dimension.weightedScore
    }))
  }, [debtScore])

  const handleActionFix = (item: ActionItem) => {
    if (item.dimension === 'dependencies' || item.command?.includes('npm')) {
      onNavigate('patch-batch')
      return
    }
    setPreferredTab('overview')
    onNavigate('full-scan')
  }

  return (
    <div className="fade-in">
      <div className="dashboard-hero">
        <div>
          <h2>Bridge-Desktop</h2>
          <p>Technical debt orchestration and agent-ready scan intelligence.</p>
        </div>
        <button className="btn btn-secondary" onClick={() => onNavigate('settings')}>
          Settings
        </button>
      </div>

      <div className="dashboard-summary">
        <div className="card">
          <div className="summary-label">Selected Repo</div>
          <div className="summary-value">{selectedRepo?.name || 'None selected'}</div>
          <div className="summary-sub">{selectedRepo?.path || 'Select a code directory to begin.'}</div>
        </div>
        <div className="card">
          <div className="summary-label">Last Scan</div>
          <div className="summary-value">{lastScan}</div>
          <div className="summary-sub">Run full scan to refresh debt model.</div>
        </div>
        <div className="card">
          <div className="summary-label">Tech Debt Score</div>
          <div className="summary-value" style={{ color: grade ? gradeColorMap[grade] : 'var(--text-primary)' }}>
            {debtScore ? debtScore.total.toFixed(1) : '—'}
            {grade && <span className="badge" style={{ marginLeft: '8px' }}>{grade}</span>}
          </div>
          <div className="summary-sub" style={{ color: trendMeta[trend].color }}>
            {trendMeta[trend].arrow} {trendMeta[trend].label}
          </div>
        </div>
      </div>

      {!settings.onboardingCompleted && (
        <div className="card" style={{ marginTop: '24px' }}>
          <div className="card-header">
            <h3 className="card-title">First-Run Checklist</h3>
            <button
              className="btn btn-primary btn-sm"
              disabled={!firstRunReady}
              onClick={completeOnboarding}
            >
              Mark Complete
            </button>
          </div>
          <div className="issue-list">
            <div className="issue-item">{codeDirectory ? '1. Code directory selected.' : '1. Select your code directory.'}</div>
            <div className="issue-item">{repositories.length > 0 ? '2. Repositories discovered.' : '2. Scan for repositories.'}</div>
            <div className="issue-item">{selectedRepo?.hasGit ? '3. Git repository selected.' : '3. Select a git repository.'}</div>
            <div className="issue-item">4. Run full scan and review the debt score and top contributors.</div>
            <div className="issue-item">5. Run one-click dependency patching and verify tests pass.</div>
          </div>
        </div>
      )}

      {selectedRepo && projectConfig && !projectConfig.exists && (
        <div className="card" style={{ marginTop: '24px', borderColor: 'var(--accent)' }}>
          <div className="card-header">
            <h3 className="card-title">Initialize Bridge</h3>
            <button className="btn btn-primary btn-sm" onClick={initializeBridgeConfig} disabled={initializingConfig}>
              {initializingConfig ? 'Generating...' : 'Create .bridge.json'}
            </button>
          </div>
          <div className="issue-list">
            <div className="issue-item">No `.bridge.json` detected in this repo.</div>
            <div className="issue-item">Initialize config to define update policy, gates, scan features, and agent context.</div>
          </div>
        </div>
      )}

      {!scanResult && selectedRepo && (
        <div className="card" style={{ marginTop: '24px', borderColor: 'var(--accent)' }}>
          <div className="card-header">
            <h3 className="card-title">Run First Scan</h3>
            <button className="btn btn-primary btn-sm" onClick={() => navigateToScan('overview', true)}>
              Run Full Scan
            </button>
          </div>
          <div className="issue-list">
            <div className="issue-item">This repository has no scan report yet.</div>
            <div className="issue-item">Run a full scan to generate score, top contributors, and action items.</div>
          </div>
        </div>
      )}

      {scanResult && debtScore && (
        <div className="dashboard-actions" style={{ marginTop: '24px' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Dimension Breakdown</h3>
            </div>
            <div className="bar-list">
              {dimensionBars.map(item => (
                <div key={item.name} className="bar-item">
                  <div className="bar-meta">
                    <span>{item.name}</span>
                    <span>{item.score.toFixed(1)}</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${Math.min(100, Math.max(0, item.score))}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Top Contributors</h3>
            </div>
            <div className="issue-list">
              {debtScore.topContributors.slice(0, 5).map((item, index) => (
                <div key={`${item.dimension}-${index}`} className="issue-item" style={{ justifyContent: 'space-between' }}>
                  <span>{item.description}</span>
                  <strong>+{item.impact}</strong>
                </div>
              ))}
              {debtScore.topContributors.length === 0 && (
                <div className="issue-item">No major contributors detected.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {scanResult && debtScore && (
        <div className="card" style={{ marginTop: '24px' }}>
          <div className="card-header">
            <h3 className="card-title">Prioritized Action Items</h3>
          </div>
          <div className="issue-list">
            {debtScore.actionItems.slice(0, 8).map(item => (
              <div key={`${item.priority}-${item.title}`} className="issue-item" style={{ alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>
                    #{item.priority} {item.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {item.dimension} · impact {item.impact} · effort {item.effort}
                  </div>
                </div>
                {item.automatable && (
                  <button className="btn btn-secondary btn-sm" onClick={() => handleActionFix(item)}>
                    Fix
                  </button>
                )}
              </div>
            ))}
            {debtScore.actionItems.length === 0 && (
              <div className="issue-item">No action items generated yet.</div>
            )}
          </div>
        </div>
      )}

      <div className="dashboard-actions" style={{ marginTop: '24px' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="action-grid">
            {settings.experimentalFeatures && (
              <button className="btn btn-primary" onClick={() => navigateToScan('overview', true)} disabled={!selectedRepo}>
                Run Full Scan
              </button>
            )}
            {settings.experimentalFeatures && (
              <button className="btn btn-secondary" onClick={() => navigateToScan('dead-code')} disabled={!selectedRepo}>
                Remove Dead Code
              </button>
            )}
            <button className="btn btn-secondary" onClick={() => onNavigate('patch-batch')}>
              Update Dependencies
            </button>
            {settings.experimentalFeatures && (
              <button className="btn btn-secondary" onClick={() => navigateToScan('circular')} disabled={!selectedRepo}>
                Fix Circular Deps
              </button>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top Issues</h3>
          </div>
          {settings.experimentalFeatures ? (
            <>
              <div className="issue-list">
                <div className="issue-item">
                  <span>🔴 {scanResult?.circularDependencies.count ?? 0} circular dependencies</span>
                </div>
                <div className="issue-item">
                  <span>🟡 {scanResult?.dependencies.outdated.length ?? 0} outdated packages</span>
                </div>
                <div className="issue-item">
                  <span>🟡 {scanResult?.deadCode.deadFiles.length ?? 0} dead code files</span>
                </div>
                <div className="issue-item">
                  <span>🟢 Test coverage: {scanResult?.testCoverage.coveragePercentage ?? '—'}%</span>
                </div>
              </div>
              <button className="btn btn-ghost" onClick={() => navigateToScan('overview')} disabled={!selectedRepo}>
                View Details →
              </button>
            </>
          ) : (
            <div className="issue-list">
              <div className="issue-item">
                <span>Experimental scans are disabled.</span>
              </div>
              <div className="issue-item">
                <span>Enable them in Settings to unlock TD/security scanning.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Preflight</h3>
        </div>
        {!selectedRepo ? (
          <div className="issue-list">
            <div className="issue-item">Select a repository to run environment checks.</div>
          </div>
        ) : (
          <div className="issue-list">
            <div className="issue-item">
              {selectedRepo.hasGit ? 'Git repository detected.' : 'Repository is not a git repo.'}
            </div>
            <div className="issue-item">
              {repoRemote ? `Remote detected: ${repoRemote}` : 'No git remote configured.'}
            </div>
            <div className="issue-item">
              Bridge updates are executed from remote-first source-of-truth when configured.
            </div>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Repositories</h3>
          <button className="btn btn-primary btn-sm" onClick={handleSelectCodeDirectory}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {codeDirectory ? 'Change Code Directory' : 'Select Code Directory'}
          </button>
        </div>

        {codeDirectory && (
          <div className="alert" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Code directory: {codeDirectory}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => scanCodeDirectory()}>
              Refresh
            </button>
          </div>
        )}

        {repositories.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
            <h3 className="empty-state-title">No repositories yet</h3>
            <p className="empty-state-desc">Select a code directory to discover git repositories.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-primary" onClick={handleSelectCodeDirectory}>
                Select Code Directory
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="repo-grid">
              {repositories.map(repo => (
                <div
                  key={repo.path}
                  className={`repo-card ${selectedRepo?.path === repo.path ? 'active' : ''}`}
                  onClick={() => { selectRepository(repo); onNavigate(settings.experimentalFeatures ? 'full-scan' : 'patch-batch') }}
                >
                  <div>
                    <div className="repo-title">{repo.name}</div>
                    <div className="repo-path">{repo.path}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
````

## File: src/components/Scheduler/Scheduler.tsx
````typescript
import { useState, useEffect, useMemo } from 'react'
import { useRepositories } from '../../contexts/RepositoryContext'
import { useAppSettings } from '../../contexts/AppSettingsContext'
import type { ScheduledJob, ScheduleFrequency, JobResult, SmartScanSchedule, ScheduledJobCreateInput } from '../../types'

const FREQUENCY_LABELS: Record<ScheduleFrequency, string> = {
  hourly: 'Hourly',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly'
}

const WEEKDAY_OPTIONS = [
  { value: 0, short: 'Sun', long: 'Sunday' },
  { value: 1, short: 'Mon', long: 'Monday' },
  { value: 2, short: 'Tue', long: 'Tuesday' },
  { value: 3, short: 'Wed', long: 'Wednesday' },
  { value: 4, short: 'Thu', long: 'Thursday' },
  { value: 5, short: 'Fri', long: 'Friday' },
  { value: 6, short: 'Sat', long: 'Saturday' }
] as const

function getDefaultStartDate(): string {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().slice(0, 10)
}

function getDefaultTimeOfDay(): string {
  return '06:00'
}

function buildStartAtIso(startDate: string, timeOfDay: string): string {
  const dateTime = new Date(`${startDate}T${timeOfDay}:00`)
  if (Number.isNaN(dateTime.getTime())) {
    return new Date().toISOString()
  }
  return dateTime.toISOString()
}

function formatTimeOfDay(timeOfDay: string): string {
  const [hourRaw, minuteRaw] = timeOfDay.split(':').map(Number)
  const date = new Date()
  date.setHours(Number.isFinite(hourRaw) ? hourRaw : 0, Number.isFinite(minuteRaw) ? minuteRaw : 0, 0, 0)
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function formatJobRecurrence(job: ScheduledJob): string {
  const formattedTime = formatTimeOfDay(job.timeOfDay)

  switch (job.frequency) {
    case 'hourly':
      return `Every ${job.intervalHours} hour${job.intervalHours === 1 ? '' : 's'}`
    case 'daily':
      return `Every day at ${formattedTime}`
    case 'weekly': {
      const days = (job.daysOfWeek || [])
        .map(day => WEEKDAY_OPTIONS.find(option => option.value === day)?.short)
        .filter(Boolean)
      return `Weekly on ${days.length ? days.join(', ') : 'selected days'} at ${formattedTime}`
    }
    case 'monthly':
      return `Monthly on day ${job.dayOfMonth} at ${formattedTime}`
    default:
      return 'Custom recurrence'
  }
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'Never'
  const date = new Date(dateStr)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function Scheduler() {
  const { repositories } = useRepositories()
  const { settings } = useAppSettings()
  const [jobs, setJobs] = useState<ScheduledJob[]>([])
  const [results, setResults] = useState<JobResult[]>([])
  const [smartSchedules, setSmartSchedules] = useState<SmartScanSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [smartMessage, setSmartMessage] = useState<string | null>(null)

  // New job form state
  const [selectedRepos, setSelectedRepos] = useState<Set<string>>(new Set())
  const [frequency, setFrequency] = useState<ScheduleFrequency>('weekly')
  const runTests = true
  const [startDate, setStartDate] = useState(getDefaultStartDate())
  const [timeOfDay, setTimeOfDay] = useState(getDefaultTimeOfDay())
  const [intervalHours, setIntervalHours] = useState(24)
  const [weeklyDays, setWeeklyDays] = useState<Set<number>>(new Set([new Date().getDay()]))
  const [monthlyDay, setMonthlyDay] = useState(new Date().getDate())
  const [smartRepo, setSmartRepo] = useState('')

  const availableRepos = useMemo(
    () => repositories.filter(repo => repo.exists && repo.hasGit),
    [repositories]
  )

  const recurrenceSummary = useMemo(() => {
    const formattedTime = formatTimeOfDay(timeOfDay)
    switch (frequency) {
      case 'hourly':
        return `Runs every ${intervalHours} hour${intervalHours === 1 ? '' : 's'}, starting ${formattedTime}`
      case 'daily':
        return `Runs every day at ${formattedTime}`
      case 'weekly': {
        const labels = Array.from(weeklyDays)
          .sort((a, b) => a - b)
          .map(day => WEEKDAY_OPTIONS.find(option => option.value === day)?.long)
          .filter(Boolean)
        return `Runs every week on ${labels.length ? labels.join(', ') : 'selected days'} at ${formattedTime}`
      }
      case 'monthly':
        return `Runs every month on day ${monthlyDay} at ${formattedTime}`
      default:
        return 'Runs on a recurring schedule'
    }
  }, [frequency, intervalHours, monthlyDay, timeOfDay, weeklyDays])

  useEffect(() => {
    loadJobs()
    loadSmartSchedules()
  }, [])

  useEffect(() => {
    const cleanup = window.bridge.onSmartScanStarted(({ repoName }) => {
      setSmartMessage(`Smart scan started for ${repoName}`)
      setTimeout(() => setSmartMessage(null), 4000)
    })
    return cleanup
  }, [])

  const loadJobs = async () => {
    setLoading(true)
    try {
      const [jobsData, resultsData] = await Promise.all([
        window.bridge.getScheduledJobs(),
        window.bridge.getJobResults()
      ])
      setJobs(jobsData)
      setResults(resultsData)
    } catch (error) {
      console.error('Failed to load jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSmartSchedules = async () => {
    try {
      const schedules = await window.bridge.getSmartScanSchedules()
      setSmartSchedules(schedules)
    } catch (error) {
      console.error('Failed to load smart schedules:', error)
    }
  }

  const resetForm = () => {
    setSelectedRepos(new Set())
    setFrequency('weekly')
    setStartDate(getDefaultStartDate())
    setTimeOfDay(getDefaultTimeOfDay())
    setIntervalHours(24)
    setWeeklyDays(new Set([new Date().getDay()]))
    setMonthlyDay(new Date().getDate())
  }

  const addJob = async () => {
    if (selectedRepos.size === 0) return

    const selectedWeeklyDays = Array.from(weeklyDays).sort((a, b) => a - b)
    const startAt = buildStartAtIso(startDate, timeOfDay)

    const batchInputs: ScheduledJobCreateInput[] = availableRepos
      .filter(repo => selectedRepos.has(repo.path))
      .map(repo => ({
        repoPath: repo.path,
        repoName: repo.name,
        frequency,
        intervalHours: frequency === 'hourly' ? Math.max(1, Math.min(24, intervalHours)) : undefined,
        daysOfWeek: frequency === 'weekly' ? (selectedWeeklyDays.length ? selectedWeeklyDays : [new Date(startAt).getDay()]) : undefined,
        dayOfMonth: frequency === 'monthly' ? Math.max(1, Math.min(31, monthlyDay)) : undefined,
        timeOfDay,
        startAt,
        enabled: true,
        language: repo.languages?.[0] || 'javascript',
        createPR: false,
        runTests
      }))

    if (batchInputs.length === 0) return

    try {
      await window.bridge.addScheduledJobsBatch(batchInputs)
      await loadJobs()
      setShowAddModal(false)
      resetForm()
    } catch (error) {
      console.error('Failed to add job:', error)
    }
  }

  const toggleSelectedRepo = (repoPath: string) => {
    setSelectedRepos(prev => {
      const next = new Set(prev)
      if (next.has(repoPath)) {
        next.delete(repoPath)
      } else {
        next.add(repoPath)
      }
      return next
    })
  }

  const toggleWeeklyDay = (day: number) => {
    setWeeklyDays(prev => {
      const next = new Set(prev)
      if (next.has(day)) {
        if (next.size === 1) {
          return next
        }
        next.delete(day)
      } else {
        next.add(day)
      }
      return next
    })
  }

  const toggleJob = async (jobId: string, enabled: boolean) => {
    try {
      await window.bridge.updateScheduledJob(jobId, { enabled })
      await loadJobs()
    } catch (error) {
      console.error('Failed to toggle job:', error)
    }
  }

  const deleteJob = async (jobId: string) => {
    try {
      await window.bridge.deleteScheduledJob(jobId)
      await loadJobs()
    } catch (error) {
      console.error('Failed to delete job:', error)
    }
  }

  const addSmartSchedule = async () => {
    if (!smartRepo) return
    const repo = repositories.find(r => r.path === smartRepo)
    if (!repo) return
    try {
      await window.bridge.addSmartScanSchedule({ repoPath: repo.path, repoName: repo.name })
      setSmartRepo('')
      await loadSmartSchedules()
    } catch (error) {
      console.error('Failed to add smart schedule:', error)
    }
  }

  const toggleSmartSchedule = async (id: string, enabled: boolean) => {
    try {
      await window.bridge.updateSmartScanSchedule(id, { enabled })
      await loadSmartSchedules()
    } catch (error) {
      console.error('Failed to update smart schedule:', error)
    }
  }

  const deleteSmartSchedule = async (id: string) => {
    try {
      await window.bridge.deleteSmartScanSchedule(id)
      await loadSmartSchedules()
    } catch (error) {
      console.error('Failed to delete smart schedule:', error)
    }
  }

  const getJobResults = (jobId: string) => {
    return results.filter(r => r.jobId === jobId).slice(0, 5)
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ marginBottom: '4px' }}>Scheduler</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Set it and forget it. Automate package updates on a schedule.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Recurring Update
          </button>
        </div>
      </div>

      {settings.experimentalFeatures && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <h3 className="card-title">Smart TD Scans</h3>
          </div>
          <div style={{ padding: '0 16px 16px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '12px' }}>
              Bridge analyzes commit patterns and schedules scans during low-activity hours.
            </p>

            {smartMessage && <div className="alert success" style={{ marginBottom: '12px' }}>{smartMessage}</div>}

            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <select
                className="input"
                value={smartRepo}
                onChange={e => setSmartRepo(e.target.value)}
                style={{ minWidth: '220px' }}
              >
                <option value="">Select repository...</option>
                {availableRepos.map(repo => (
                  <option key={repo.path} value={repo.path}>
                    {repo.name}
                  </option>
                ))}
              </select>
              <button className="btn btn-primary btn-sm" onClick={addSmartSchedule} disabled={!smartRepo}>
                Enable Smart Scan
              </button>
            </div>

            {smartSchedules.length === 0 ? (
              <div style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>No smart scans configured.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {smartSchedules.map(schedule => (
                  <div key={schedule.id} className="list-item">
                    <div>
                      <div className="list-title">{schedule.repoName}</div>
                      <div className="list-sub">Quiet hour: {schedule.quietHour}:00 · Next run: {formatDate(schedule.nextRun)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => toggleSmartSchedule(schedule.id, !schedule.enabled)}>
                        {schedule.enabled ? 'Pause' : 'Resume'}
                      </button>
                      <button className="btn btn-ghost btn-icon" onClick={() => deleteSmartSchedule(schedule.id)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div className="spinner" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <h3 className="empty-state-title">No scheduled jobs</h3>
            <p className="empty-state-desc">Create a recurring event to automate non-breaking dependency updates.</p>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              Create First Schedule
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {jobs.map(job => (
            <div key={job.id} className="card">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: job.enabled ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={job.enabled ? 'var(--accent)' : 'var(--text-tertiary)'} strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{job.repoName}</h3>
                    <span className={`badge ${job.enabled ? 'badge-success' : ''}`} style={{ background: job.enabled ? undefined : 'var(--bg-tertiary)', color: job.enabled ? undefined : 'var(--text-tertiary)' }}>
                      {job.enabled ? 'Active' : 'Paused'}
                    </span>
                    <span className="badge badge-accent">{FREQUENCY_LABELS[job.frequency]}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {job.repoPath}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    {formatJobRecurrence(job)}
                  </div>

                  <div style={{ display: 'flex', gap: '24px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Last run:</span> {formatDate(job.lastRun)}
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Next run:</span> {formatDate(job.nextRun)}
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Options:</span>{' '}
                      Local commit only, {job.runTests ? 'run tests' : 'skip tests'}
                    </div>
                  </div>

                  {getJobResults(job.id).length > 0 && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Recent runs:</div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {getJobResults(job.id).map((result, i) => (
                          <div
                            key={i}
                            title={result.success ? `Updated ${result.updatedPackages.length} packages` : result.error}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '4px',
                              background: result.success ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {result.success ? (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="3">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => toggleJob(job.id, !job.enabled)}
                  >
                    {job.enabled ? 'Pause' : 'Resume'}
                  </button>
                  <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => deleteJob(job.id)}
                    title="Delete schedule"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(2, 6, 23, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => {
            setShowAddModal(false)
            resetForm()
          }}
        >
          <div
            className="card"
            style={{ width: '100%', maxWidth: '760px', margin: '20px', maxHeight: '90vh', overflow: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ marginBottom: '6px' }}>Create Recurring Update</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Configure this like a calendar event. Bridge will run non-breaking dependency updates on the schedule.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Repositories
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setSelectedRepos(new Set(availableRepos.map(r => r.path)))}
                  >
                    Select All
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelectedRepos(new Set())}>
                    Clear
                  </button>
                </div>
                <div style={{ maxHeight: '300px', overflow: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '8px' }}>
                  {availableRepos.length === 0 && (
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', padding: '8px' }}>
                      No git repositories available in your current code directory.
                    </div>
                  )}
                  {availableRepos.map(repo => {
                    const checked = selectedRepos.has(repo.path)
                    return (
                      <label key={repo.path} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 6px', borderRadius: '8px', background: checked ? 'var(--accent-light)' : 'transparent', cursor: 'pointer' }}>
                        <input type="checkbox" checked={checked} onChange={() => toggleSelectedRepo(repo.path)} />
                        <span style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '13px', fontWeight: 500 }}>{repo.name}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{repo.path}</span>
                        </span>
                      </label>
                    )
                  })}
                </div>
                <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                  Selected repositories: {selectedRepos.size}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Repeat
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px', marginBottom: '12px' }}>
                  {(['hourly', 'daily', 'weekly', 'monthly'] as ScheduleFrequency[]).map(freq => (
                    <button
                      key={freq}
                      className={`btn ${frequency === freq ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      onClick={() => setFrequency(freq)}
                    >
                      {FREQUENCY_LABELS[freq]}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>Start date</label>
                    <input type="date" className="input" value={startDate} onChange={e => setStartDate(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>Time</label>
                    <input type="time" className="input" value={timeOfDay} onChange={e => setTimeOfDay(e.target.value)} />
                  </div>
                </div>

                {frequency === 'hourly' && (
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Repeat every (hours)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={24}
                      className="input"
                      value={intervalHours}
                      onChange={e => setIntervalHours(Math.max(1, Math.min(24, Number(e.target.value) || 1)))}
                    />
                  </div>
                )}

                {frequency === 'weekly' && (
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Repeat on
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '6px' }}>
                      {WEEKDAY_OPTIONS.map(day => {
                        const selected = weeklyDays.has(day.value)
                        return (
                          <button
                            key={day.value}
                            className={`btn ${selected ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                            onClick={() => toggleWeeklyDay(day.value)}
                            title={day.long}
                          >
                            {day.short}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {frequency === 'monthly' && (
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Day of month
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      className="input"
                      value={monthlyDay}
                      onChange={e => setMonthlyDay(Math.max(1, Math.min(31, Number(e.target.value) || 1)))}
                    />
                  </div>
                )}

                <div className="alert" style={{ fontSize: '12px', marginTop: '4px' }}>
                  <div style={{ marginBottom: '4px', color: 'var(--text-secondary)' }}>Summary</div>
                  <div>{recurrenceSummary}</div>
                </div>

                <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Scheduled updates always run tests before and after dependency changes.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={addJob}
                disabled={selectedRepos.size === 0}
              >
                Create {selectedRepos.size || ''} Schedule{selectedRepos.size === 1 ? '' : 's'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
````

## File: src/App.tsx
````typescript
import { useMemo, useState } from 'react'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import PatchBatch from './components/PatchBatch/PatchBatch'
import Dashboard from './components/Dashboard/Dashboard'
import Cleanup from './components/Cleanup/Cleanup'
import Scheduler from './components/Scheduler/Scheduler'
import Security from './components/Security/Security'
import FileBrowser from './components/FileBrowser/FileBrowser'
import FullScan from './components/FullScan/FullScan'
import Settings from './components/Settings/Settings'
import { useAppSettings } from './contexts/AppSettingsContext'
import type { View } from './types'

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const { settings } = useAppSettings()

  const content = useMemo(() => {
    if (!settings.experimentalFeatures && (currentView === 'full-scan' || currentView === 'security')) {
      return <Dashboard onNavigate={setCurrentView} />
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />
      case 'full-scan':
        return <FullScan />
      case 'cleanup':
        return <Cleanup />
      case 'scheduler':
        return <Scheduler />
      case 'security':
        return <Security />
      case 'files':
        return <FileBrowser />
      case 'settings':
        return <Settings />
      case 'patch-batch':
      default:
        return <PatchBatch />
    }
  }, [currentView, settings.experimentalFeatures])

  const normalizedView: View = (!settings.experimentalFeatures && (currentView === 'full-scan' || currentView === 'security'))
    ? 'dashboard'
    : currentView

  return (
    <div className="app-layout">
      <Sidebar currentView={normalizedView} onNavigate={setCurrentView} />
      <main className="app-main">
        <Header currentView={normalizedView} />
        <div className="app-content">
          {content}
        </div>
      </main>
    </div>
  )
}
````

## File: .gitignore
````
# Dependencies
node_modules/

# Build intermediates (not final releases)
dist-electron/
out/
build/

# Keep dist/ for releases but ignore intermediate files
dist/
!dist/*.dmg
!dist/*.zip

# Releases folder is tracked
!releases/

# macOS
.DS_Store
._*

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# Release artifacts
*.dmg
*.blockmap

# TypeScript
*.tsbuildinfo

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Environment
.env
.env.local
.env.*.local

# Python (for agentic_fixer if used)
__pycache__/
*.py[cod]
venv/
.venv/

# Temp
*.tmp
*.temp
.cache/

# Local sandbox repo (not committed)
sandbox/

# Local learning notes
LEARN.md
````

## File: src/contexts/RepositoryContext.tsx
````typescript
import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Repository } from '../types'

interface RepositoryContextType {
  repositories: Repository[]
  selectedRepo: Repository | null
  codeDirectory: string | null
  loading: boolean
  addRepository: (path: string) => Promise<void>
  removeRepository: (path: string) => Promise<void>
  selectRepository: (repo: Repository | null) => void
  setCodeDirectory: (directory: string | null) => Promise<void>
  scanCodeDirectory: (directory?: string) => Promise<void>
  selectAndScanCodeDirectory: () => Promise<void>
  refreshRepositories: () => Promise<void>
  cleanupMissingRepos: () => Promise<void>
}

const RepositoryContext = createContext<RepositoryContextType | undefined>(undefined)

export function RepositoryProvider({ children }: { children: React.ReactNode }) {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const [codeDirectory, setCodeDirectoryState] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const savedCodeDirectory = await window.bridge.getCodeDirectory()
        if (savedCodeDirectory && await window.bridge.directoryExists(savedCodeDirectory)) {
          setCodeDirectoryState(savedCodeDirectory)
          await scanCodeDirectory(savedCodeDirectory)
          return
        }

        const defaultDirectory = await window.bridge.getDefaultCodeDirectory()
        if (defaultDirectory && await window.bridge.directoryExists(defaultDirectory)) {
          await window.bridge.saveCodeDirectory(defaultDirectory)
          setCodeDirectoryState(defaultDirectory)
          await scanCodeDirectory(defaultDirectory)
          return
        }

        setCodeDirectoryState(savedCodeDirectory || null)
        setRepositories([])
      } catch (error) {
        console.error('Failed to initialize repositories:', error)
      } finally {
        setLoading(false)
      }
    }

    void bootstrap()
  }, [])

  const addRepository = async (path: string) => {
    const repo = await window.bridge.scanRepository(path)

    if (!repo.exists) {
      throw new Error('Repository path does not exist')
    }

    const exists = repositories.find(r => r.path === repo.path)
    if (exists) {
      setSelectedRepo(exists)
      return
    }

    setRepositories(prev => [...prev, repo])
    setSelectedRepo(repo)
  }

  const removeRepository = async (path: string) => {
    setRepositories(prev => prev.filter(r => r.path !== path))

    if (selectedRepo?.path === path) {
      setSelectedRepo(null)
    }
  }

  const selectRepository = (repo: Repository | null) => {
    setSelectedRepo(repo)
  }

  const setCodeDirectory = async (directory: string | null) => {
    if (!directory) {
      setCodeDirectoryState(null)
      return
    }
    await window.bridge.saveCodeDirectory(directory)
    setCodeDirectoryState(directory)
  }

  const scanCodeDirectory = async (directory?: string) => {
    const targetDirectory = directory || codeDirectory
    if (!targetDirectory) {
      return
    }

    const scannedRepos = await window.bridge.scanForRepos(targetDirectory)
    setRepositories(scannedRepos)

    if (selectedRepo && !scannedRepos.find(repo => repo.path === selectedRepo.path)) {
      setSelectedRepo(null)
    }
  }

  const selectAndScanCodeDirectory = async () => {
    const directory = await window.bridge.selectCodeDirectory()
    if (!directory) {
      return
    }

    await setCodeDirectory(directory)
    await scanCodeDirectory(directory)
  }

  const refreshRepositories = async () => {
    setLoading(true)
    try {
      await scanCodeDirectory()
    } finally {
      setLoading(false)
    }
  }

  const cleanupMissingRepos = async () => {
    await scanCodeDirectory()
  }

  return (
    <RepositoryContext.Provider value={{
      repositories,
      selectedRepo,
      codeDirectory,
      loading,
      addRepository,
      removeRepository,
      selectRepository,
      setCodeDirectory,
      scanCodeDirectory,
      selectAndScanCodeDirectory,
      refreshRepositories,
      cleanupMissingRepos
    }}>
      {children}
    </RepositoryContext.Provider>
  )
}

export function useRepositories() {
  const context = useContext(RepositoryContext)
  if (!context) {
    throw new Error('useRepositories must be used within a RepositoryProvider')
  }
  return context
}
````

## File: electron/services/patchBatch.ts
````typescript
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'
import * as semver from 'semver'
import {
  updatePythonPackages,
  updateRubyPackages,
  updateElixirPackages,
  getCleanInstallCommand,
  getTestCommand,
  getLintCommand,
  getFilesToCommit,
  Language,
  OutdatedPackage
} from './languages'
import { loadBridgeConfig } from './bridgeConfig'
import { evaluateGates } from './gateEvaluator'
import {
  commitChanges,
  pushBranch,
  createPullRequest,
  getGitHubCliStatus,
  runTests,
  runLint,
} from './git'

const execAsync = promisify(exec)
const DEFAULT_TEST_TIMEOUT_MS = 300000
const DEFAULT_MAX_BUFFER = 20 * 1024 * 1024

export interface PatchBatchConfig {
  repoPath: string
  branchName: string
  packages: { name: string; language: Language }[]
  createPR: boolean
  runTests: boolean
  baseBranch?: string
  remoteFirst?: boolean
  updateStrategy?: 'wanted' | 'latest'
  testCommand?: string
  testTimeoutMs?: number
  prTitle?: string
  prBody?: string
}

export interface NonBreakingUpdateConfig {
  repoPath: string
  branchName: string
  createPR: boolean
  runTests: boolean
  baseBranch?: string
  remoteFirst?: boolean
  pinnedPackages?: Record<string, string>
  selectedMajorPackages?: string[]
  testCommand?: string
  testTimeoutMs?: number
  prTitle?: string
  prBody?: string
}

export interface PatchBatchResult {
  success: boolean
  updatedPackages?: string[]
  failedPackages?: string[]
  prUrl?: string | null
  branchName?: string
  branchPushed?: boolean
  error?: string
  testsPassed?: boolean
  testOutput?: string
}

export interface PatchBatchHandlers {
  onProgress?: (message: string, step: number, total: number) => void
  onLog?: (message: string) => void
  onWarning?: (warning: { message: string; output: string }) => void
}

export interface SecurityPatchConfig {
  repoPath: string
  branchName: string
  createPR: boolean
  runTests: boolean
  baseBranch?: string
  remoteFirst?: boolean
  testCommand?: string
}

export interface SecurityPatchResult {
  success: boolean
  updatedPackages: string[]
  failedPackages: string[]
  prUrl?: string | null
  error?: string
  testsPassed?: boolean
}

export interface SecurityPatchHandlers {
  onProgress?: (message: string, step: number, total: number) => void
  onLog?: (message: string) => void
}

function formatError(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message
  }
  if (typeof error === 'string' && error.trim().length > 0) {
    return error
  }
  return fallback
}

function splitOutputLines(output: string): string[] {
  return output
    .split(/\r?\n/)
    .map(line => line.trimEnd())
    .filter(line => line.length > 0)
}

async function fileExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function getPackageManagerEnv(repoPath: string): Promise<NodeJS.ProcessEnv> {
  const env: NodeJS.ProcessEnv = { ...process.env, INIT_CWD: repoPath, PWD: repoPath }
  const localNpmrc = path.join(repoPath, '.npmrc')
  if (await fileExists(localNpmrc)) {
    env.NPM_CONFIG_USERCONFIG = localNpmrc
    env.npm_config_userconfig = localNpmrc
  }
  return env
}

async function runCommand(
  command: string,
  cwd: string,
  options: { timeout?: number; maxBuffer?: number } = {}
) {
  const env = await getPackageManagerEnv(cwd)
  return execAsync(command, {
    cwd,
    env,
    timeout: options.timeout ?? DEFAULT_TEST_TIMEOUT_MS,
    maxBuffer: options.maxBuffer ?? DEFAULT_MAX_BUFFER
  })
}

type PackageManager = 'npm' | 'yarn' | 'pnpm'
type ValidationStage = 'test' | 'lint' | 'build'

interface ValidationStep {
  command: string
  relativeCwd: string
  stage: ValidationStage
  label: string
}

async function detectNodePackageManager(repoPath: string): Promise<PackageManager> {
  if (await fileExists(path.join(repoPath, 'pnpm-lock.yaml'))) {
    return 'pnpm'
  }
  if (await fileExists(path.join(repoPath, 'yarn.lock'))) {
    return 'yarn'
  }
  return 'npm'
}

function isMissingCommandOutput(output: string): boolean {
  return (
    /command not found/i.test(output) ||
    /is not recognized as an internal or external command/i.test(output) ||
    /missing script/i.test(output) ||
    /npm ERR! Missing script/i.test(output) ||
    /ERR_PNPM_NO_SCRIPT/i.test(output) ||
    /Couldn't find a script named/i.test(output)
  )
}

function getScriptCommand(packageManager: PackageManager, scriptName: ValidationStage): string {
  if (packageManager === 'yarn') {
    return scriptName === 'test' ? 'yarn test' : `yarn ${scriptName}`
  }
  if (packageManager === 'pnpm') {
    return scriptName === 'test' ? 'pnpm test' : `pnpm run ${scriptName}`
  }
  return scriptName === 'test' ? 'npm test' : `npm run ${scriptName}`
}

function normalizePathForMatch(value: string): string {
  return value.replace(/\\/g, '/').replace(/\/+$/, '')
}

function globToRegExp(pattern: string): RegExp {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '__DOUBLE_STAR__')
    .replace(/\*/g, '[^/]+')
    .replace(/__DOUBLE_STAR__/g, '.*')
  return new RegExp(`^${escaped}$`)
}

async function collectPackageJsonDirectories(
  repoPath: string,
  maxDepth = 6
): Promise<string[]> {
  const results: string[] = []
  const skipDirs = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', '.next', 'out'])

  const walk = async (absoluteDir: string, relativeDir: string, depth: number): Promise<void> => {
    if (depth > maxDepth) return

    const packageJsonPath = path.join(absoluteDir, 'package.json')
    if (relativeDir !== '.' && await fileExists(packageJsonPath)) {
      results.push(relativeDir)
    }

    if (depth === maxDepth) return

    let entries: import('fs').Dirent[]
    try {
      entries = await fs.readdir(absoluteDir, { withFileTypes: true })
    } catch {
      return
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      if (skipDirs.has(entry.name)) continue
      const nextAbsolute = path.join(absoluteDir, entry.name)
      const nextRelative = relativeDir === '.' ? entry.name : path.join(relativeDir, entry.name)
      await walk(nextAbsolute, normalizePathForMatch(nextRelative), depth + 1)
    }
  }

  await walk(repoPath, '.', 0)
  return results
}

async function getWorkspacePatterns(repoPath: string, packageJson: any): Promise<string[]> {
  const patterns = new Set<string>()
  const rawWorkspaces = packageJson?.workspaces

  if (Array.isArray(rawWorkspaces)) {
    rawWorkspaces.forEach(value => {
      if (typeof value === 'string' && value.trim()) {
        patterns.add(normalizePathForMatch(value.trim()))
      }
    })
  } else if (rawWorkspaces && Array.isArray(rawWorkspaces.packages)) {
    rawWorkspaces.packages.forEach((value: unknown) => {
      if (typeof value === 'string' && value.trim()) {
        patterns.add(normalizePathForMatch(value.trim()))
      }
    })
  }

  const pnpmWorkspacePath = path.join(repoPath, 'pnpm-workspace.yaml')
  if (await fileExists(pnpmWorkspacePath)) {
    try {
      const yaml = await fs.readFile(pnpmWorkspacePath, 'utf-8')
      for (const line of yaml.split(/\r?\n/)) {
        const match = line.match(/^\s*-\s*['"]?([^'"]+)['"]?\s*$/)
        if (match?.[1]) {
          patterns.add(normalizePathForMatch(match[1]))
        }
      }
    } catch {
      // Ignore malformed workspace yaml; fallback to package.json workspaces.
    }
  }

  return Array.from(patterns)
}

async function resolveWorkspaceValidationSteps(
  repoPath: string,
  packageManager: PackageManager,
  workspacePatterns: string[],
  rootHasStage: Record<ValidationStage, boolean>
): Promise<ValidationStep[]> {
  if (workspacePatterns.length === 0) {
    return []
  }

  const patternMatchers = workspacePatterns.map(pattern => globToRegExp(pattern))
  const allPackageDirs = await collectPackageJsonDirectories(repoPath)
  const matchedPackageDirs = allPackageDirs
    .map(normalizePathForMatch)
    .filter(relativeDir => patternMatchers.some(pattern => pattern.test(relativeDir)))

  const stages: ValidationStage[] = ['test', 'lint', 'build']
  const byStage: Record<ValidationStage, ValidationStep[]> = {
    test: [],
    lint: [],
    build: []
  }
  const seen = new Set<string>()

  for (const relativeDir of matchedPackageDirs) {
    const packageJsonPath = path.join(repoPath, relativeDir, 'package.json')
    let workspaceJson: any
    try {
      workspaceJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
    } catch {
      continue
    }
    const scripts = workspaceJson?.scripts || {}

    for (const stage of stages) {
      if (rootHasStage[stage]) {
        continue
      }
      const hasScript = typeof scripts[stage] === 'string' && scripts[stage].trim().length > 0
      if (!hasScript) {
        continue
      }
      const command = getScriptCommand(packageManager, stage)
      const step: ValidationStep = {
        command,
        relativeCwd: relativeDir,
        stage,
        label: `${relativeDir} (${stage})`
      }
      const dedupeKey = `${step.relativeCwd}::${step.command}`
      if (seen.has(dedupeKey)) {
        continue
      }
      seen.add(dedupeKey)
      byStage[stage].push(step)
    }
  }

  return [...byStage.test, ...byStage.lint, ...byStage.build]
}

async function resolveJavascriptValidationCommands(
  repoPath: string,
  overrideCommand?: string
): Promise<ValidationStep[]> {
  if (overrideCommand?.trim()) {
    return [{
      command: overrideCommand.trim(),
      relativeCwd: '.',
      stage: 'test',
      label: 'custom'
    }]
  }

  const packageManager = await detectNodePackageManager(repoPath)
  const packageJsonPath = path.join(repoPath, 'package.json')
  if (!(await fileExists(packageJsonPath))) {
    return []
  }

  const packageJsonRaw = await fs.readFile(packageJsonPath, 'utf-8')
  const packageJson = JSON.parse(packageJsonRaw)
  const scripts = packageJson?.scripts || {}
  const hasScript = (name: string) => typeof scripts[name] === 'string' && scripts[name].trim().length > 0

  const stages: ValidationStage[] = ['test', 'lint', 'build']
  const rootHasStage: Record<ValidationStage, boolean> = {
    test: hasScript('test'),
    lint: hasScript('lint'),
    build: hasScript('build')
  }

  const rootSteps: ValidationStep[] = stages
    .filter(stage => rootHasStage[stage])
    .map(stage => ({
      command: getScriptCommand(packageManager, stage),
      relativeCwd: '.',
      stage,
      label: `root (${stage})`
    }))

  const workspacePatterns = await getWorkspacePatterns(repoPath, packageJson)
  const workspaceSteps = await resolveWorkspaceValidationSteps(
    repoPath,
    packageManager,
    workspacePatterns,
    rootHasStage
  )

  return [...rootSteps, ...workspaceSteps]
}

async function runValidationSteps(
  steps: ValidationStep[],
  repoRoot: string,
  onLog: (message: string) => void,
  onWarning: (warning: { message: string; output: string }) => void,
  options: { timeoutMs: number; stageLabel: string }
): Promise<{ success: boolean; output: string }> {
  const allOutput: string[] = []

  for (const step of steps) {
    const command = step.command
    const stepCwd = step.relativeCwd === '.'
      ? repoRoot
      : path.join(repoRoot, step.relativeCwd)
    onLog(`${step.relativeCwd === '.' ? '[root]' : `[${step.relativeCwd}]`} > ${command}`)
    try {
      const { stdout, stderr } = await runCommand(command, stepCwd, {
        timeout: options.timeoutMs,
        maxBuffer: DEFAULT_MAX_BUFFER
      })
      const output = `${stdout}${stderr}`.trim()
      if (output) {
        splitOutputLines(output).forEach(line => onLog(line))
        allOutput.push(output)
      }
    } catch (error: any) {
      const output = `${error?.stdout || ''}${error?.stderr || ''}`.trim() || String(error?.message || '')
      if (output) {
        splitOutputLines(output).forEach(line => onLog(line))
        allOutput.push(output)
      }

      if (isMissingCommandOutput(output)) {
        onWarning({
          message: `${options.stageLabel}: command not found, skipping '${command}' in ${step.relativeCwd}`,
          output
        })
        continue
      }

      return {
        success: false,
        output: allOutput.join('\n\n')
      }
    }
  }

  return {
    success: true,
    output: allOutput.join('\n\n')
  }
}

function sanitizeGitRef(value: string): string | null {
  const normalized = value.trim()
  if (!normalized) return null
  if (!/^[A-Za-z0-9._/-]+$/.test(normalized)) {
    return null
  }
  return normalized
}

async function gitRefExists(repoPath: string, ref: string): Promise<boolean> {
  const safeRef = sanitizeGitRef(ref)
  if (!safeRef) return false
  try {
    await execAsync(`git rev-parse --verify --quiet "${safeRef}"`, {
      cwd: repoPath,
      timeout: 30000
    })
    return true
  } catch {
    return false
  }
}

async function resolveBaseRef(
  repoPath: string,
  preferredBaseBranch?: string,
  onLog?: (message: string) => void
): Promise<string> {
  try {
    await execAsync('git fetch origin --prune', {
      cwd: repoPath,
      timeout: 120000,
      maxBuffer: DEFAULT_MAX_BUFFER
    })
  } catch (error) {
    onLog?.(`WARN: Unable to fetch origin before update. Falling back to local refs (${formatError(error, 'fetch failed')}).`)
  }

  const candidates: string[] = []
  const preferred = sanitizeGitRef(preferredBaseBranch || '')
  if (preferred) {
    candidates.push(`origin/${preferred}`, preferred)
  }

  try {
    const { stdout } = await execAsync('git symbolic-ref --short refs/remotes/origin/HEAD', {
      cwd: repoPath,
      timeout: 30000
    })
    const originHead = stdout.trim()
    if (originHead) {
      candidates.push(originHead)
      if (originHead.startsWith('origin/')) {
        candidates.push(originHead.slice('origin/'.length))
      }
    }
  } catch {}

  candidates.push('origin/main', 'origin/master', 'main', 'master')
  const uniqueCandidates = Array.from(new Set(candidates.map(candidate => candidate.trim()).filter(Boolean)))

  for (const candidate of uniqueCandidates) {
    if (await gitRefExists(repoPath, candidate)) {
      return candidate
    }
  }

  return 'HEAD'
}

async function createIsolatedWorkspace(
  repoPath: string,
  branchName: string,
  options: { baseBranch?: string; remoteFirst?: boolean; onLog?: (message: string) => void } = {}
): Promise<string> {
  const worktreeRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bridge-worktree-'))
  const useRemoteFirst = options.remoteFirst !== false
  const baseRef = useRemoteFirst
    ? await resolveBaseRef(repoPath, options.baseBranch, options.onLog)
    : 'HEAD'
  options.onLog?.(`Creating branch '${branchName}' from ${baseRef}.`)

  await execAsync(`git worktree add -b "${branchName}" "${worktreeRoot}" "${baseRef}"`, {
    cwd: repoPath,
    timeout: DEFAULT_TEST_TIMEOUT_MS,
    maxBuffer: DEFAULT_MAX_BUFFER
  })
  return worktreeRoot
}

async function cleanupIsolatedWorkspace(
  repoPath: string,
  worktreePath: string,
  branchName: string,
  options: { deleteBranch?: boolean } = {}
): Promise<void> {
  try {
    await execAsync(`git worktree remove --force "${worktreePath}"`, {
      cwd: repoPath,
      timeout: DEFAULT_TEST_TIMEOUT_MS
    })
  } catch {}

  if (options.deleteBranch) {
    try {
      await execAsync(`git branch -D ${branchName}`, {
        cwd: repoPath,
        timeout: 30000
      })
    } catch {}
  }
}

interface BridgeUpdateLogEntry {
  timestamp: string
  workflow: 'patch-batch' | 'non-breaking' | 'security'
  branchName: string
  updatedPackages: string[]
  failedPackages?: string[]
  createPR: boolean
  prUrl?: string | null
  testsPassed?: boolean
  gatesPassed?: boolean
}

async function appendBridgeUpdateLog(repoPath: string, entry: BridgeUpdateLogEntry): Promise<void> {
  const bridgeDir = path.join(repoPath, '.bridge')
  const logPath = path.join(bridgeDir, 'update-log.json')
  await fs.mkdir(bridgeDir, { recursive: true })

  let existing: BridgeUpdateLogEntry[] = []
  try {
    const raw = await fs.readFile(logPath, 'utf-8')
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      existing = parsed as BridgeUpdateLogEntry[]
    }
  } catch {
    existing = []
  }

  existing.unshift(entry)
  if (existing.length > 200) {
    existing = existing.slice(0, 200)
  }

  await fs.writeFile(logPath, JSON.stringify(existing, null, 2) + '\n', 'utf-8')
}

function normalizeBranchName(branchName: string): string {
  const normalized = branchName.trim().replace(/[^a-zA-Z0-9/_-]+/g, '-')
  if (!normalized) {
    return `bridge-update-${Date.now()}`
  }
  return normalized
}

function classifyUpdateType(current: string, latest: string): OutdatedPackage['updateType'] {
  const currentParsed = semver.parse(current)
  const latestParsed = semver.parse(latest)
  if (!currentParsed || !latestParsed) {
    return 'unknown'
  }
  if (latestParsed.major > currentParsed.major) {
    return 'major'
  }
  if (latestParsed.minor > currentParsed.minor) {
    return 'minor'
  }
  if (latestParsed.patch > currentParsed.patch) {
    return 'patch'
  }
  return 'unknown'
}

interface PackageVulnerabilityCount {
  critical: number
  high: number
  medium: number
  low: number
  total: number
}

async function getInstalledDependencyNames(repoPath: string): Promise<string[]> {
  try {
    const raw = await fs.readFile(path.join(repoPath, 'package.json'), 'utf-8')
    const pkg = JSON.parse(raw)
    const names = new Set<string>()
    for (const key of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
      const section = pkg?.[key]
      if (section && typeof section === 'object') {
        for (const depName of Object.keys(section)) {
          names.add(depName)
        }
      }
    }
    return Array.from(names)
  } catch {
    return []
  }
}

async function getJavascriptAuditVulnerabilityMap(repoPath: string): Promise<Map<string, PackageVulnerabilityCount>> {
  const map = new Map<string, PackageVulnerabilityCount>()
  try {
    const { stdout } = await runCommand('npm audit --json', repoPath, {
      timeout: 120000,
      maxBuffer: 20 * 1024 * 1024
    })
    const payload = JSON.parse(stdout || '{}')

    if (payload.vulnerabilities && typeof payload.vulnerabilities === 'object') {
      for (const [name, meta] of Object.entries(payload.vulnerabilities) as [string, any][]) {
        const severity = String(meta?.severity || '').toLowerCase()
        const existing = map.get(name) || { critical: 0, high: 0, medium: 0, low: 0, total: 0 }
        if (severity === 'critical') existing.critical += 1
        else if (severity === 'high') existing.high += 1
        else if (severity === 'moderate' || severity === 'medium') existing.medium += 1
        else if (severity === 'low') existing.low += 1
        existing.total = existing.critical + existing.high + existing.medium + existing.low
        map.set(name, existing)
      }
    }

    if (payload.advisories && typeof payload.advisories === 'object') {
      for (const advisory of Object.values(payload.advisories) as any[]) {
        const name = String(advisory?.module_name || '')
        if (!name) continue
        const severity = String(advisory?.severity || '').toLowerCase()
        const existing = map.get(name) || { critical: 0, high: 0, medium: 0, low: 0, total: 0 }
        if (severity === 'critical') existing.critical += 1
        else if (severity === 'high') existing.high += 1
        else if (severity === 'moderate' || severity === 'medium') existing.medium += 1
        else if (severity === 'low') existing.low += 1
        existing.total = existing.critical + existing.high + existing.medium + existing.low
        map.set(name, existing)
      }
    }
  } catch {
    // Best effort: vulnerability metadata is optional for package listing.
  }

  return map
}

async function warnOnGateFailures(
  repoPath: string,
  onLog: (message: string) => void,
  onWarning: (warning: { message: string; output: string }) => void,
  fallbackCoverage: number | null
): Promise<{ passed: boolean; failingGateNames: string[] }> {
  try {
    const [config, outdated, vulnerabilityMap, installedPackages] = await Promise.all([
      loadBridgeConfig(repoPath),
      getJsOutdatedPackages(repoPath),
      getJavascriptAuditVulnerabilityMap(repoPath),
      getInstalledDependencyNames(repoPath)
    ])

    const vulnerabilitySummary = { critical: 0, high: 0, medium: 0, low: 0, total: 0 }
    for (const counts of vulnerabilityMap.values()) {
      vulnerabilitySummary.critical += counts.critical
      vulnerabilitySummary.high += counts.high
      vulnerabilitySummary.medium += counts.medium
      vulnerabilitySummary.low += counts.low
      vulnerabilitySummary.total += counts.total
    }

    const gateResults = evaluateGates(config, {
      dependencies: {
        outdated,
        vulnerabilities: vulnerabilitySummary,
        installedPackages
      },
      deadCode: {
        deadFiles: [],
        unusedExports: [],
        totalDeadCodeCount: 0
      },
      circularDependencies: {
        count: 0,
        dependencies: []
      },
      bundleSize: {
        totalSize: 0,
        totalSizeFormatted: '0 B',
        largestModules: []
      },
      testCoverage: {
        coveragePercentage: fallbackCoverage,
        uncoveredCriticalFiles: []
      },
      documentation: {
        missingReadmeSections: [],
        readmeOutdated: false,
        daysSinceUpdate: 0,
        undocumentedFunctions: 0
      },
      techDebt: {
        total: 0
      } as any
    } as any)

    const failing = gateResults.filter(gate => !gate.passed)
    if (failing.length > 0) {
      for (const gate of failing) {
        onWarning({
          message: `Gate ${gate.name} failed (${gate.severity}): ${gate.message}`,
          output: ''
        })
      }
      return {
        passed: false,
        failingGateNames: failing.map(gate => gate.name)
      }
    } else {
      onLog('✓ Post-update gate evaluation passed')
      return {
        passed: true,
        failingGateNames: []
      }
    }
  } catch (error) {
    onWarning({
      message: 'Post-update gate evaluation failed to run',
      output: error instanceof Error ? error.message : String(error)
    })
    return {
      passed: false,
      failingGateNames: ['gate-evaluation-error']
    }
  }
}

export async function getJsOutdatedPackages(repoPath: string): Promise<OutdatedPackage[]> {
  const packageJsonPath = path.join(repoPath, 'package.json')
  try {
    await fs.access(packageJsonPath)
  } catch {
    throw new Error('No package.json found - is this a Node.js project?')
  }
  try {
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8')
    const packageJson = JSON.parse(packageJsonContent)
    const vulnerabilityMap = await getJavascriptAuditVulnerabilityMap(repoPath)

    const devDeps = new Set(Object.keys(packageJson.devDependencies || {}))

    let outdatedJson = '{}'
    try {
      const { stdout } = await runCommand('npm outdated --json', repoPath, { timeout: 60000 })
      outdatedJson = stdout
    } catch (error: any) {
      outdatedJson = error.stdout || '{}'
    }

    const outdated = JSON.parse(outdatedJson || '{}')
    const packages: OutdatedPackage[] = []

    for (const [name, info] of Object.entries(outdated) as [string, any][]) {
      const current = info.current || '0.0.0'
      const wanted = info.wanted || current
      const latest = info.latest || wanted
      const updateType = classifyUpdateType(current, latest)

      const currentParsed = semver.parse(current)
      const wantedParsed = semver.parse(wanted)

      let hasPatchUpdate = false
      if (currentParsed && wantedParsed) {
        hasPatchUpdate = currentParsed.major === wantedParsed.major &&
                         currentParsed.minor === wantedParsed.minor &&
                         currentParsed.patch < wantedParsed.patch
      }

      packages.push({
        name,
        current,
        wanted,
        latest,
        type: devDeps.has(name) ? 'devDependencies' : 'dependencies',
        hasPatchUpdate,
        isNonBreaking: updateType === 'patch' || updateType === 'minor',
        updateType,
        language: 'javascript',
        vulnerabilities: vulnerabilityMap.get(name) || { critical: 0, high: 0, medium: 0, low: 0, total: 0 }
      })
    }

    const order: Record<OutdatedPackage['updateType'], number> = {
      patch: 0,
      minor: 1,
      major: 2,
      unknown: 3
    }

    return packages.sort((a, b) => {
      if (order[a.updateType] !== order[b.updateType]) {
        return order[a.updateType] - order[b.updateType]
      }
      return a.name.localeCompare(b.name)
    })
  } catch (error) {
    const message = formatError(error, 'Failed to read package.json')
    throw new Error(message)
  }
}

async function updateJsPackages(
  repoPath: string,
  packages: string[],
  options: { updateStrategy?: 'wanted' | 'latest' } = {}
) {
  const updated: string[] = []
  const failed: string[] = []
  const updateStrategy = options.updateStrategy || 'wanted'

  const packageJsonPath = path.join(repoPath, 'package.json')
  const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8')
  const packageJson = JSON.parse(packageJsonContent)

  const outdated = await getJsOutdatedPackages(repoPath)
  const outdatedMap = new Map(outdated.map(p => [p.name, p]))

  for (const pkgName of packages) {
    const pkg = outdatedMap.get(pkgName)
    if (!pkg) {
      failed.push(pkgName)
      continue
    }
    const targetVersion = updateStrategy === 'latest' ? pkg.latest : pkg.wanted
    if (!targetVersion || targetVersion === pkg.current) {
      failed.push(pkgName)
      continue
    }

    if (packageJson.dependencies?.[pkgName]) {
      const currentVersion = packageJson.dependencies[pkgName]
      const prefix = currentVersion.match(/^[^0-9]*/)?.[0] || '^'
      packageJson.dependencies[pkgName] = `${prefix}${targetVersion}`
      updated.push(pkgName)
    } else if (packageJson.devDependencies?.[pkgName]) {
      const currentVersion = packageJson.devDependencies[pkgName]
      const prefix = currentVersion.match(/^[^0-9]*/)?.[0] || '^'
      packageJson.devDependencies[pkgName] = `${prefix}${targetVersion}`
      updated.push(pkgName)
    } else {
      failed.push(pkgName)
    }
  }

  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')

  return { updated, failed }
}

export async function runPatchBatchPipeline(
  config: PatchBatchConfig,
  handlers: PatchBatchHandlers = {}
): Promise<PatchBatchResult> {
  const {
    repoPath,
    branchName,
    packages,
    createPR,
    runTests: shouldRunTests,
    baseBranch,
    remoteFirst,
    updateStrategy,
    prTitle,
    prBody,
    testCommand,
    testTimeoutMs
  } = config

  const onProgress = handlers.onProgress || (() => {})
  const onLog = handlers.onLog || (() => {})
  const onWarning = handlers.onWarning || (() => {})
  const safeBranchName = normalizeBranchName(branchName)

  const totalSteps = 5 + (shouldRunTests ? 1 : 0) + (createPR ? 1 : 0)
  let currentStep = 0

  const primaryLang = packages[0]?.language || 'javascript'
  const resolvedTestCommand = shouldRunTests
    ? (testCommand?.trim() || getTestCommand(primaryLang))
    : null

  let workspacePath = repoPath
  let workspaceCreated = false
  let changesCommitted = false
  let deleteBranchOnCleanup = true

  const fail = async (message: string, extra?: Partial<PatchBatchResult>): Promise<PatchBatchResult> => {
    onLog(`✗ ${message}`)
    return {
      success: false,
      error: message,
      branchName: safeBranchName,
      ...extra
    }
  }

  if (!packages.length) {
    return fail('No packages selected for update.')
  }

  if (shouldRunTests && (!resolvedTestCommand || resolvedTestCommand.length === 0)) {
    return fail("No test script found - add one to package.json or uncheck 'Run tests'.")
  }

  if (createPR) {
    const ghStatus = await getGitHubCliStatus(repoPath)
    if (!ghStatus.installed || !ghStatus.authenticated) {
      return fail(ghStatus.message || 'GitHub CLI is required and must be authenticated before creating PRs.')
    }
  }

  try {
    await fs.access(path.join(repoPath, '.git'))
  } catch {
    return fail("Git not initialized - run 'git init' first.")
  }

  if (packages.some(pkg => pkg.language === 'javascript')) {
    try {
      await fs.access(path.join(repoPath, 'package.json'))
    } catch {
      return fail('No package.json found - is this a Node.js project?')
    }
  }

  try {
    onProgress('Preparing isolated update workspace...', ++currentStep, totalSteps)
    workspacePath = await createIsolatedWorkspace(repoPath, safeBranchName, {
      baseBranch,
      remoteFirst,
      onLog
    })
    workspaceCreated = true
    onLog(`Using isolated workspace: ${workspacePath}`)
    onLog('Local repository changes are left untouched.')

    if (packages.some(pkg => pkg.language === 'javascript')) {
      if (await fileExists(path.join(workspacePath, '.npmrc'))) {
        onLog('Using repository-local .npmrc for package operations.')
      } else {
        onWarning({
          message: 'No repository .npmrc found. Falling back to global npm config.',
          output: 'Create a local .npmrc if you need repository-scoped registry/auth settings.'
        })
      }
    }

    onProgress('Updating packages...', ++currentStep, totalSteps)
    onLog('[1/3] Updating packages...')

    const byLanguage = new Map<Language, string[]>()
    for (const pkg of packages) {
      const list = byLanguage.get(pkg.language) || []
      list.push(pkg.name)
      byLanguage.set(pkg.language, list)
    }

    const allUpdated: string[] = []
    const allFailed: string[] = []

    for (const [lang, pkgNames] of byLanguage) {
      let result: { updated: string[]; failed: string[] }

      switch (lang) {
        case 'javascript':
          result = await updateJsPackages(workspacePath, pkgNames, { updateStrategy })
          break
        case 'python':
          result = await updatePythonPackages(workspacePath, pkgNames)
          break
        case 'ruby':
          result = await updateRubyPackages(workspacePath, pkgNames)
          break
        case 'elixir':
          result = await updateElixirPackages(workspacePath, pkgNames)
          break
        default:
          result = { updated: [], failed: pkgNames }
      }

      allUpdated.push(...result.updated)
      allFailed.push(...result.failed)
    }

    allUpdated.forEach(name => onLog(`✓ Updated ${name}`))
    allFailed.forEach(name => onLog(`✗ Skipped ${name}`))

    if (allUpdated.length === 0) {
      return fail('No packages were updated. Check selections and try again.')
    }

    onProgress('Running clean install...', ++currentStep, totalSteps)
    const cleanCmd = getCleanInstallCommand(primaryLang)
    if (cleanCmd) {
      try {
        const { stdout, stderr } = await runCommand(cleanCmd, workspacePath, {
          timeout: 300000,
          maxBuffer: 10 * 1024 * 1024
        })
        splitOutputLines(`${stdout}${stderr}`).forEach(line => onLog(line))
      } catch (error: any) {
        const output = `${error.stdout || ''}${error.stderr || ''}` || error.message
        splitOutputLines(output).forEach(line => onLog(line))
        return fail('Install failed. Please check your package manager output.')
      }
    }

    let testsPassed = true
    let testOutput = ''

    if (shouldRunTests && resolvedTestCommand) {
      onProgress('Running tests...', ++currentStep, totalSteps)
      onLog('[2/3] Running tests...')
      onLog(`> ${resolvedTestCommand}`)

      const testResult = await runTests(workspacePath, resolvedTestCommand, {
        timeoutMs: testTimeoutMs ?? DEFAULT_TEST_TIMEOUT_MS
      })

      testOutput = testResult.output
      splitOutputLines(testResult.output).forEach(line => onLog(line))
      testsPassed = testResult.success

      if (!testsPassed) {
        return fail('Tests failed - no PR created.', {
          testsPassed: false,
          testOutput
        })
      }

      onLog('✓ All tests passed')

      const lintCommand = getLintCommand(primaryLang)
      if (lintCommand) {
        const lintResult = await runLint(workspacePath, lintCommand)
        if (!lintResult.success) {
          onWarning({ message: 'Linter found issues', output: lintResult.output })
        }
      }
    } else if (!shouldRunTests) {
      onLog('[2/3] Tests skipped (disabled)')
    }

    onProgress('Committing changes...', ++currentStep, totalSteps)
    const files = getFilesToCommit(primaryLang)
    await commitChanges(
      workspacePath,
      `chore(deps): update ${allUpdated.length} selected dependencies\n\nUpdated packages:\n${allUpdated.map(p => `- ${p}`).join('\n')}`,
      files
    )
    changesCommitted = true
    deleteBranchOnCleanup = false

    if (!createPR) {
      onLog('[3/3] Committing updates...')
      onLog(`✓ Updates committed to branch '${safeBranchName}'`)
      onProgress('Pushing branch...', ++currentStep, totalSteps)
      await pushBranch(workspacePath, safeBranchName)
      onLog(`✓ Branch pushed: ${safeBranchName}`)
      const gateCheck = await warnOnGateFailures(
        workspacePath,
        onLog,
        onWarning,
        shouldRunTests ? 100 : null
      )
      await appendBridgeUpdateLog(repoPath, {
        timestamp: new Date().toISOString(),
        workflow: 'patch-batch',
        branchName: safeBranchName,
        updatedPackages: allUpdated,
        failedPackages: allFailed,
        createPR: false,
        testsPassed: shouldRunTests ? testsPassed : undefined,
        gatesPassed: gateCheck.passed
      })
      return {
        success: true,
        updatedPackages: allUpdated,
        failedPackages: allFailed,
        branchName: safeBranchName,
        branchPushed: true,
        testsPassed: shouldRunTests ? testsPassed : undefined,
        testOutput
      }
    }

    onProgress('Pushing branch...', ++currentStep, totalSteps)
    try {
      await pushBranch(workspacePath, safeBranchName)
    } catch (error) {
      const message = formatError(error, 'Push failed. Please check your git remote configuration.')
      onLog(`✗ ${message}`)
      return {
        success: false,
        updatedPackages: allUpdated,
        failedPackages: allFailed,
        branchName: safeBranchName,
        error: message,
        testsPassed: shouldRunTests ? testsPassed : undefined,
        testOutput
      }
    }

    onProgress('Creating pull request...', ++currentStep, totalSteps)
    onLog('[3/3] Creating PR...')

    let prUrl: string | null = null
    try {
      prUrl = await createPullRequest(
        workspacePath,
        prTitle || `chore(deps): update ${allUpdated.length} packages`,
        prBody || `## Summary\nAutomated dependency updates via Bridge.\n\n### Updated packages\n${allUpdated.map(p => `- ${p}`).join('\n')}\n\n${shouldRunTests ? '### Checks\n- [x] Tests passed\n- [x] Lint checked' : ''}`
      )
    } catch (error) {
      const message = formatError(error, 'PR creation failed. Please open a PR manually.')
      onLog(`✗ ${message}`)
      return {
        success: false,
        updatedPackages: allUpdated,
        failedPackages: allFailed,
        branchName: safeBranchName,
        error: message,
        testsPassed: shouldRunTests ? testsPassed : undefined,
        testOutput
      }
    }

    onLog(`✓ PR created: ${prUrl}`)
    deleteBranchOnCleanup = true
    const gateCheck = await warnOnGateFailures(
      workspacePath,
      onLog,
      onWarning,
      shouldRunTests ? 100 : null
    )
    await appendBridgeUpdateLog(repoPath, {
      timestamp: new Date().toISOString(),
      workflow: 'patch-batch',
      branchName: safeBranchName,
      updatedPackages: allUpdated,
      failedPackages: allFailed,
      createPR: true,
      prUrl,
      testsPassed: shouldRunTests ? testsPassed : undefined,
      gatesPassed: gateCheck.passed
    })

    return {
      success: true,
      updatedPackages: allUpdated,
      failedPackages: allFailed,
      prUrl,
      branchName: safeBranchName,
      testsPassed: shouldRunTests ? testsPassed : undefined,
      testOutput
    }
  } catch (error) {
    return fail(formatError(error, 'Update failed. Please try again.'))
  } finally {
    if (workspaceCreated) {
      await cleanupIsolatedWorkspace(repoPath, workspacePath, safeBranchName, {
        deleteBranch: deleteBranchOnCleanup
      })
    }
  }
}

async function hasGitChanges(repoPath: string): Promise<boolean> {
  try {
    const { stdout } = await execAsync('git status --porcelain', { cwd: repoPath, timeout: 30000 })
    return stdout.trim().length > 0
  } catch {
    return false
  }
}

export async function runNonBreakingUpdatePipeline(
  config: NonBreakingUpdateConfig,
  handlers: PatchBatchHandlers = {}
): Promise<PatchBatchResult> {
  const {
    repoPath,
    branchName,
    createPR,
    runTests: shouldRunTests,
    baseBranch,
    remoteFirst,
    pinnedPackages = {},
    selectedMajorPackages = [],
    testCommand,
    testTimeoutMs,
    prTitle,
    prBody
  } = config

  const onProgress = handlers.onProgress || (() => {})
  const onLog = handlers.onLog || (() => {})
  const onWarning = handlers.onWarning || (() => {})
  const safeBranchName = normalizeBranchName(branchName)

  const totalSteps = 5 + (shouldRunTests ? 2 : 0) + (selectedMajorPackages.length > 0 ? 1 : 0) + (createPR ? 1 : 0)
  let currentStep = 0
  let workspacePath = repoPath
  let workspaceCreated = false
  let deleteBranchOnCleanup = true
  const validationOutput: string[] = []
  let validationCommands: ValidationStep[] = []
  let effectivePinnedPackages: Record<string, string> = { ...pinnedPackages }
  let effectiveSelectedMajorPackages: string[] = []
  let effectiveTestCommand = testCommand
  let effectiveTimeoutMs = testTimeoutMs ?? DEFAULT_TEST_TIMEOUT_MS
  let updatePolicy: { patch: 'auto' | 'review' | 'ignore'; minor: 'auto' | 'review' | 'ignore'; major: 'review' | 'ignore' } = {
    patch: 'auto',
    minor: 'review',
    major: 'review'
  }
  let policyAutoNonBreaking: string[] = []
  let policyReviewNonBreaking: string[] = []
  let policyIgnoredNonBreaking: string[] = []
  let policyPinnedNonBreaking: string[] = []
  let policyBannedSelected: string[] = []

  const fail = async (message: string, extra?: Partial<PatchBatchResult>): Promise<PatchBatchResult> => {
    onLog(`✗ ${message}`)
    return {
      success: false,
      error: message,
      branchName: safeBranchName,
      ...extra
    }
  }

  try {
    await fs.access(path.join(repoPath, '.git'))
    await fs.access(path.join(repoPath, 'package.json'))
  } catch {
    return fail("Git and package.json are required for non-breaking updates.")
  }

  try {
    const bridgeConfig = await loadBridgeConfig(repoPath)
    updatePolicy = bridgeConfig.dependencies.updatePolicy
    effectivePinnedPackages = {
      ...(bridgeConfig.dependencies.pinnedPackages || {}),
      ...pinnedPackages
    }
    effectiveTestCommand = testCommand || bridgeConfig.gates?.tests?.command || undefined
    if (!testTimeoutMs && bridgeConfig.gates?.tests?.timeout) {
      effectiveTimeoutMs = bridgeConfig.gates.tests.timeout * 1000
    }

    if (shouldRunTests) {
      validationCommands = await resolveJavascriptValidationCommands(repoPath, effectiveTestCommand)
    }

    const beforeOutdated = await getJsOutdatedPackages(repoPath)
    const nonBreakingBefore = beforeOutdated.filter(pkg => pkg.isNonBreaking)
    for (const pkg of nonBreakingBefore) {
      if (effectivePinnedPackages[pkg.name]) {
        policyPinnedNonBreaking.push(pkg.name)
        continue
      }

      if (pkg.updateType === 'patch') {
        if (updatePolicy.patch === 'ignore') {
          policyIgnoredNonBreaking.push(pkg.name)
        } else if (updatePolicy.patch === 'auto') {
          policyAutoNonBreaking.push(pkg.name)
        } else {
          policyReviewNonBreaking.push(pkg.name)
        }
      } else if (pkg.updateType === 'minor') {
        if (updatePolicy.minor === 'ignore') {
          policyIgnoredNonBreaking.push(pkg.name)
        } else if (updatePolicy.minor === 'auto') {
          policyAutoNonBreaking.push(pkg.name)
        } else {
          policyReviewNonBreaking.push(pkg.name)
        }
      } else {
        policyReviewNonBreaking.push(pkg.name)
      }
    }

    const bannedPackages = new Set((bridgeConfig.dependencies.bannedPackages || []).map(name => name.toLowerCase()))
    const normalizedMajorSelection = new Set<string>()
    for (const pkgName of selectedMajorPackages) {
      if (normalizedMajorSelection.has(pkgName)) continue
      normalizedMajorSelection.add(pkgName)

      if (effectivePinnedPackages[pkgName]) {
        onLog(`Skipping ${pkgName} - pinned to ${effectivePinnedPackages[pkgName]} in .bridge.json`)
        continue
      }
      if (updatePolicy.major === 'ignore') {
        onLog(`Skipping ${pkgName} - major updates are ignored by .bridge.json policy`)
        continue
      }
      if (bannedPackages.has(pkgName.toLowerCase())) {
        policyBannedSelected.push(pkgName)
      }
      effectiveSelectedMajorPackages.push(pkgName)
    }
    effectiveSelectedMajorPackages = Array.from(new Set(effectiveSelectedMajorPackages))

    const selectedPackageNames = new Set<string>([
      ...policyAutoNonBreaking,
      ...effectiveSelectedMajorPackages
    ])
    for (const pkgName of selectedPackageNames) {
      if (bannedPackages.has(pkgName.toLowerCase())) {
        onLog(`WARNING: ${pkgName} is in the banned packages list in .bridge.json`)
      }
    }
  } catch (error) {
    onWarning({
      message: `Bridge config integration failed, using pipeline defaults: ${formatError(error, 'Unknown config error')}`,
      output: ''
    })
    if (shouldRunTests) {
      validationCommands = await resolveJavascriptValidationCommands(repoPath, testCommand)
    }
  }

  if (createPR) {
    const ghStatus = await getGitHubCliStatus(repoPath)
    if (!ghStatus.installed || !ghStatus.authenticated) {
      return fail(ghStatus.message || 'GitHub CLI is required and must be authenticated before creating PRs.')
    }
  }

  try {
    const beforeOutdated = await getJsOutdatedPackages(repoPath)
    const allNonBreakingBefore = beforeOutdated.filter(pkg => pkg.isNonBreaking)
    const policyDrivenSelectionActive =
      policyAutoNonBreaking.length > 0 ||
      policyReviewNonBreaking.length > 0 ||
      policyIgnoredNonBreaking.length > 0 ||
      policyPinnedNonBreaking.length > 0
    const nonBreakingBefore = policyDrivenSelectionActive
      ? allNonBreakingBefore.filter(pkg => policyAutoNonBreaking.includes(pkg.name))
      : allNonBreakingBefore

    if (policyReviewNonBreaking.length > 0) {
      onLog(`Review required by update policy (not auto-updating): ${policyReviewNonBreaking.join(', ')}`)
    }
    if (policyIgnoredNonBreaking.length > 0) {
      onLog(`Ignored by update policy: ${policyIgnoredNonBreaking.join(', ')}`)
    }
    if (policyPinnedNonBreaking.length > 0) {
      onLog(`Pinned in .bridge.json (not auto-updating): ${policyPinnedNonBreaking.join(', ')}`)
    }
    if (policyBannedSelected.length > 0) {
      onLog(`WARNING: Selected packages also appear in bannedPackages: ${policyBannedSelected.join(', ')}`)
    }

    if (nonBreakingBefore.length === 0 && effectiveSelectedMajorPackages.length === 0) {
      return fail('No policy-approved non-breaking updates available and no allowed major packages selected.')
    }

    onProgress('Preparing isolated update workspace...', ++currentStep, totalSteps)
    workspacePath = await createIsolatedWorkspace(repoPath, safeBranchName, {
      baseBranch,
      remoteFirst,
      onLog
    })
    workspaceCreated = true
    onLog(`Using isolated workspace: ${workspacePath}`)
    onLog('Local repository changes are left untouched.')

    if (await fileExists(path.join(workspacePath, '.npmrc'))) {
      onLog('Using repository-local .npmrc for npm commands.')
    } else {
      onWarning({
        message: 'No repository .npmrc found. Falling back to global npm config.',
        output: 'Create a local .npmrc if you need repository-scoped registry/auth settings.'
      })
    }

    if (shouldRunTests) {
      if (validationCommands.length === 0) {
        onWarning({
          message: 'No validation scripts found (test/lint/build). Continuing without pre/post validation checks.',
          output: 'Define scripts in package.json to enable automated validation.'
        })
      } else {
        onProgress('Running pre-update validation...', ++currentStep, totalSteps)
        onLog('[1/5] Running validation on latest remote baseline...')
        const baselineValidation = await runValidationSteps(
          validationCommands,
          workspacePath,
          onLog,
          onWarning,
          { timeoutMs: effectiveTimeoutMs, stageLabel: 'Pre-update validation' }
        )
        validationOutput.push(baselineValidation.output)
        if (!baselineValidation.success) {
          return fail('Pre-update validation failed on latest remote baseline. Update aborted.', {
            testsPassed: false,
            testOutput: baselineValidation.output
          })
        }
        onLog('✓ Pre-update validation passed')
      }
    }

    onProgress('Running non-breaking update sequence...', ++currentStep, totalSteps)
    onLog('[2/5] Running update script:')
    const nonBreakingTargets = nonBreakingBefore.map(pkg => pkg.name)
    const nonBreakingUpdateCommand = nonBreakingTargets.length > 0
      ? `npm update ${nonBreakingTargets.join(' ')}`
      : 'echo \"No auto-approved non-breaking updates\"'
    onLog(`rm -rf node_modules package-lock.json; npm install; ${nonBreakingUpdateCommand}; rm -rf node_modules package-lock.json; npm install;`)
    try {
      const { stdout, stderr } = await runCommand(
        `rm -rf node_modules package-lock.json; npm install; ${nonBreakingUpdateCommand}; rm -rf node_modules package-lock.json; npm install;`,
        workspacePath,
        {
          timeout: 15 * 60 * 1000,
          maxBuffer: 50 * 1024 * 1024
        }
      )
      splitOutputLines(`${stdout}${stderr}`).forEach(line => onLog(line))
    } catch (error: any) {
      const output = `${error.stdout || ''}${error.stderr || ''}` || error.message
      splitOutputLines(output).forEach(line => onLog(line))
      return fail('Non-breaking update script failed. Check npm output.')
    }

    const majorUpdated: string[] = []
    if (effectiveSelectedMajorPackages.length > 0) {
      onProgress('Applying selected major updates...', ++currentStep, totalSteps)
      onLog('[3/5] Applying selected major updates...')
      for (const pkg of effectiveSelectedMajorPackages) {
        if (effectivePinnedPackages[pkg]) {
          onWarning({
            message: `Skipping pinned package '${pkg}' (${effectivePinnedPackages[pkg]})`,
            output: ''
          })
          continue
        }
        try {
          onLog(`> npm install ${pkg}@latest`)
          const { stdout, stderr } = await runCommand(`npm install ${pkg}@latest`, workspacePath, {
            timeout: DEFAULT_TEST_TIMEOUT_MS,
            maxBuffer: DEFAULT_MAX_BUFFER
          })
          splitOutputLines(`${stdout}${stderr}`).forEach(line => onLog(line))
          majorUpdated.push(pkg)
        } catch (error: any) {
          const output = `${error?.stdout || ''}${error?.stderr || ''}`.trim() || String(error?.message || '')
          splitOutputLines(output).forEach(line => onLog(line))
          return fail(`Failed to apply selected major update: ${pkg}`, {
            testOutput: output
          })
        }
      }
    }

    const afterOutdated = await getJsOutdatedPackages(workspacePath)
    const remainingNonBreaking = new Set(afterOutdated.filter(pkg => pkg.isNonBreaking).map(pkg => pkg.name))
    const updatedPackages = nonBreakingBefore
      .map(pkg => pkg.name)
      .filter(name => !remainingNonBreaking.has(name))
    for (const pkg of majorUpdated) {
      if (!updatedPackages.includes(pkg)) {
        updatedPackages.push(pkg)
      }
    }

    onProgress('Evaluating changes...', ++currentStep, totalSteps)
    const changed = await hasGitChanges(workspacePath)
    if (!changed) {
      return fail('No dependency changes were produced by the update process.')
    }

    if (shouldRunTests && validationCommands.length > 0) {
      onProgress('Running post-update validation...', ++currentStep, totalSteps)
      onLog('[4/5] Running validation after dependency changes...')
      const postValidation = await runValidationSteps(
        validationCommands,
        workspacePath,
        onLog,
        onWarning,
        { timeoutMs: effectiveTimeoutMs, stageLabel: 'Post-update validation' }
      )
      validationOutput.push(postValidation.output)
      if (!postValidation.success) {
        return fail('Post-update validation failed. No commit was created.', {
          testsPassed: false,
          testOutput: postValidation.output
        })
      }
      onLog('✓ Post-update validation passed')
    }

    onProgress('Committing changes...', ++currentStep, totalSteps)
    await commitChanges(
      workspacePath,
      `chore(deps): apply non-breaking dependency updates\n\nUpdated packages:\n${updatedPackages.map(p => `- ${p}`).join('\n') || '- lockfile/package graph changes'}`,
      getFilesToCommit('javascript')
    )
    deleteBranchOnCleanup = false

    if (!createPR) {
      onLog('[5/5] Committing updates locally...')
      onLog(`✓ Changes committed on '${safeBranchName}'`)
      onProgress('Pushing branch...', ++currentStep, totalSteps)
      await pushBranch(workspacePath, safeBranchName)
      onLog(`✓ Branch pushed: ${safeBranchName}`)
      const gateCheck = await warnOnGateFailures(
        workspacePath,
        onLog,
        onWarning,
        shouldRunTests ? 100 : null
      )
      await appendBridgeUpdateLog(repoPath, {
        timestamp: new Date().toISOString(),
        workflow: 'non-breaking',
        branchName: safeBranchName,
        updatedPackages,
        createPR: false,
        testsPassed: shouldRunTests ? true : undefined,
        gatesPassed: gateCheck.passed
      })
      return {
        success: true,
        branchName: safeBranchName,
        branchPushed: true,
        updatedPackages,
        testsPassed: shouldRunTests ? true : undefined,
        testOutput: validationOutput.filter(Boolean).join('\n\n')
      }
    }

    onProgress('Pushing branch...', ++currentStep, totalSteps)
    await pushBranch(workspacePath, safeBranchName)

    onProgress('Creating pull request...', ++currentStep, totalSteps)
    const prUrl = await createPullRequest(
      workspacePath,
      prTitle || 'chore(deps): apply non-breaking dependency updates',
      prBody || [
        '## Summary',
        'Automated non-breaking dependency updates (patch + minor) via Bridge.',
        '',
        '### Updated packages',
        ...(updatedPackages.length ? updatedPackages.map(pkg => `- ${pkg}`) : ['- lockfile/package graph changes'])
      ].join('\n')
    )
    deleteBranchOnCleanup = true
    const gateCheck = await warnOnGateFailures(
      workspacePath,
      onLog,
      onWarning,
      shouldRunTests ? 100 : null
    )
    await appendBridgeUpdateLog(repoPath, {
      timestamp: new Date().toISOString(),
      workflow: 'non-breaking',
      branchName: safeBranchName,
      updatedPackages,
      createPR: true,
      prUrl,
      testsPassed: shouldRunTests ? true : undefined,
      gatesPassed: gateCheck.passed
    })

    return {
      success: true,
      branchName: safeBranchName,
      prUrl,
      updatedPackages,
      testsPassed: shouldRunTests ? true : undefined,
      testOutput: validationOutput.filter(Boolean).join('\n\n')
    }
  } catch (error) {
    return fail(formatError(error, 'Non-breaking update failed.'))
  } finally {
    if (workspaceCreated) {
      await cleanupIsolatedWorkspace(repoPath, workspacePath, safeBranchName, {
        deleteBranch: deleteBranchOnCleanup
      })
    }
  }
}

interface AuditTarget {
  name: string
  severity: 'high' | 'critical'
  fixVersion?: string
}

async function getAuditTargets(repoPath: string): Promise<AuditTarget[]> {
  const targets: AuditTarget[] = []
  try {
    const { stdout } = await runCommand('npm audit --json', repoPath, {
      timeout: 120000,
      maxBuffer: 20 * 1024 * 1024
    })
    const payload = JSON.parse(stdout || '{}')

    if (payload.vulnerabilities) {
      for (const [name, data] of Object.entries(payload.vulnerabilities) as [string, any][]) {
        const severity = String(data.severity || '').toLowerCase()
        if (severity !== 'critical' && severity !== 'high') continue
        const fixAvailable = data.fixAvailable
        let fixVersion: string | undefined
        if (fixAvailable && typeof fixAvailable === 'object') {
          if (fixAvailable.isSemVerMajor) {
            continue
          }
          fixVersion = fixAvailable.version
        }
        targets.push({ name, severity: severity as 'high' | 'critical', fixVersion })
      }
    }

    if (payload.advisories) {
      for (const advisory of Object.values(payload.advisories) as any[]) {
        const severity = String(advisory.severity || '').toLowerCase()
        if (severity !== 'critical' && severity !== 'high') continue
        const name = advisory.module_name
        const fixVersion = advisory.fix_available && advisory.fix_available.name
          ? advisory.fix_available.version
          : advisory.fix_available && typeof advisory.fix_available === 'string'
            ? advisory.fix_available
            : undefined
        targets.push({ name, severity: severity as 'high' | 'critical', fixVersion })
      }
    }
  } catch (error) {
    console.error('npm audit failed:', error)
  }

  return targets
}

async function discardWorkingTree(repoPath: string): Promise<void> {
  try {
    await execAsync('git reset --hard HEAD', { cwd: repoPath })
    await execAsync('git clean -fd', { cwd: repoPath })
  } catch {}
}

async function createIssue(repoPath: string, title: string, body: string): Promise<void> {
  const safeTitle = title.replace(/\"/g, '\\\"')
  const safeBody = body.replace(/\"/g, '\\\"')
  try {
    await execAsync(`gh issue create --title \"${safeTitle}\" --body \"${safeBody}\"`, { cwd: repoPath })
  } catch {}
}

export async function runSecurityPatchPipeline(
  config: SecurityPatchConfig,
  handlers: SecurityPatchHandlers = {}
): Promise<SecurityPatchResult> {
  const { repoPath, branchName, createPR, runTests: shouldRunTests, baseBranch, remoteFirst, testCommand } = config
  const safeBranchName = normalizeBranchName(branchName)
  const onProgress = handlers.onProgress || (() => {})
  const onLog = handlers.onLog || (() => {})
  const updatedPackages: string[] = []
  const failedPackages: string[] = []
  let workspacePath = repoPath
  let workspaceCreated = false
  let deleteBranchOnCleanup = true

  try {
    await fs.access(path.join(repoPath, '.git'))
  } catch {
    return { success: false, updatedPackages: [], failedPackages: [], error: 'Git not initialized.' }
  }

  try {
    workspacePath = await createIsolatedWorkspace(repoPath, safeBranchName, {
      baseBranch,
      remoteFirst,
      onLog
    })
    workspaceCreated = true
    onLog(`Using isolated workspace: ${workspacePath}`)

    const targets = await getAuditTargets(workspacePath)
    const uniqueTargets = Array.from(
      new Map(targets.filter(target => target.fixVersion).map(target => [target.name, target])).values()
    )

    if (uniqueTargets.length === 0) {
      return { success: false, updatedPackages: [], failedPackages: [], error: 'No critical/high vulnerabilities with safe fixes found.' }
    }

    const totalSteps = uniqueTargets.length
    let step = 0
    let testsPassed = true

    for (const target of uniqueTargets) {
      step += 1
      onProgress(`Patching ${target.name} (${target.severity})`, step, totalSteps)
      onLog(`Updating ${target.name} to ${target.fixVersion}`)

      try {
        await runCommand(`npm install ${target.name}@${target.fixVersion}`, workspacePath, {
          timeout: DEFAULT_TEST_TIMEOUT_MS,
          maxBuffer: 20 * 1024 * 1024
        })

        if (shouldRunTests) {
          const cmd = testCommand?.trim() || getTestCommand('javascript')
          if (!cmd) {
            throw new Error('No test command found')
          }
          const result = await runTests(workspacePath, cmd, { timeoutMs: DEFAULT_TEST_TIMEOUT_MS })
          if (!result.success) {
            testsPassed = false
            failedPackages.push(target.name)
            await createIssue(
              workspacePath,
              `Manual fix needed: ${target.name} vulnerability`,
              `Bridge attempted to patch ${target.name} but tests failed.\\n\\nTest output:\\n${result.output}`
            )
            await discardWorkingTree(workspacePath)
            continue
          }
        }

        await commitChanges(workspacePath, `chore(security): patch ${target.name}`)
        deleteBranchOnCleanup = false
        updatedPackages.push(target.name)
      } catch {
        failedPackages.push(target.name)
        await discardWorkingTree(workspacePath)
      }
    }

    let prUrl: string | null | undefined = null
    if (createPR && updatedPackages.length > 0) {
      await pushBranch(workspacePath, safeBranchName)
      prUrl = await createPullRequest(
        workspacePath,
        `chore(security): patch ${updatedPackages.length} vulnerable packages`,
        `## Summary\\nBridge patched ${updatedPackages.length} vulnerable packages.\\n\\n### Updated packages\\n${updatedPackages.map(pkg => `- ${pkg}`).join('\\n')}`
      )
      deleteBranchOnCleanup = true
    }

    if (updatedPackages.length === 0) {
      return {
        success: false,
        updatedPackages,
        failedPackages,
        error: 'No packages were successfully patched.',
        testsPassed
      }
    }

    await appendBridgeUpdateLog(repoPath, {
      timestamp: new Date().toISOString(),
      workflow: 'security',
      branchName: safeBranchName,
      updatedPackages,
      failedPackages,
      createPR,
      prUrl,
      testsPassed
    })

    return {
      success: failedPackages.length === 0,
      updatedPackages,
      failedPackages,
      prUrl,
      testsPassed
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Security patch failed'
    return { success: false, updatedPackages, failedPackages, error: message }
  } finally {
    if (workspaceCreated) {
      await cleanupIsolatedWorkspace(repoPath, workspacePath, safeBranchName, {
        deleteBranch: deleteBranchOnCleanup
      })
    }
  }
}
````

## File: src/components/Layout/Sidebar.tsx
````typescript
import { useState, useEffect } from 'react'
import { useRepositories } from '../../contexts/RepositoryContext'
import { useAppSettings } from '../../contexts/AppSettingsContext'
import type { View, Language, RepoInfo } from '../../types'

interface SidebarProps {
  currentView: View
  onNavigate: (view: View) => void
}

const LANGUAGE_COLORS: Record<Language, string> = {
  javascript: '#f7df1e',
  python: '#3776ab',
  ruby: '#cc342d',
  elixir: '#6e4a7e',
  unknown: '#666666'
}

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const {
    repositories,
    selectedRepo,
    codeDirectory,
    selectRepository,
    selectAndScanCodeDirectory,
    scanCodeDirectory
  } = useRepositories()
  const { settings } = useAppSettings()
  const [repoInfoMap, setRepoInfoMap] = useState<Record<string, RepoInfo>>({})

  useEffect(() => {
    const fetchRepoInfo = async () => {
      const newInfoMap: Record<string, RepoInfo> = {}
      for (const repo of repositories) {
        if (repo.hasGit && repo.exists) {
          try {
            const info = await window.bridge.getRepoInfo(repo.path)
            newInfoMap[repo.path] = info
          } catch {
            // Ignore errors
          }
        }
      }
      setRepoInfoMap(newInfoMap)
    }
    fetchRepoInfo()
  }, [repositories])

  const handleSelectCodeDirectory = async () => {
    await selectAndScanCodeDirectory()
  }

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">B</span>
          Bridge
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">Navigation</div>
          <button
            className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => onNavigate('dashboard')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
            </svg>
            Dashboard
          </button>
          {settings.experimentalFeatures && (
            <button
              className={`nav-item ${currentView === 'full-scan' ? 'active' : ''}`}
              onClick={() => onNavigate('full-scan')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Full TD Scan
            </button>
          )}
          <button
            className={`nav-item ${currentView === 'patch-batch' ? 'active' : ''}`}
            onClick={() => onNavigate('patch-batch')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 11-9-9" />
              <path d="M21 3v6h-6" />
            </svg>
            Update Dependencies
          </button>
          <button
            className={`nav-item ${currentView === 'cleanup' ? 'active' : ''}`}
            onClick={() => onNavigate('cleanup')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
            Cleanup
          </button>
          {settings.experimentalFeatures && (
            <button
              className={`nav-item ${currentView === 'security' ? 'active' : ''}`}
              onClick={() => onNavigate('security')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Security Scan
            </button>
          )}
          <button
            className={`nav-item ${currentView === 'scheduler' ? 'active' : ''}`}
            onClick={() => onNavigate('scheduler')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Scheduler
          </button>
          <button
            className={`nav-item ${currentView === 'files' ? 'active' : ''}`}
            onClick={() => onNavigate('files')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
            File Browser
          </button>
          <button
            className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}
            onClick={() => onNavigate('settings')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2h-2a2 2 0 01-2-2v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2v-2a2 2 0 012-2h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2h2a2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2v2a2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
            Settings
          </button>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Repositories</div>
          <button className="nav-item" onClick={handleSelectCodeDirectory}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {codeDirectory ? 'Change Code Directory' : 'Select Code Directory'}
          </button>
          {codeDirectory && (
            <button className="nav-item" onClick={() => scanCodeDirectory()}>
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Refresh Repos
            </button>
          )}

          <div className="repo-list">
            {repositories.map(repo => {
              const info = repoInfoMap[repo.path]
              const hasSync = info && (info.ahead > 0 || info.behind > 0)
              return (
                <button
                  key={repo.path}
                  className={`repo-item ${selectedRepo?.path === repo.path ? 'active' : ''}`}
                  onClick={() => selectRepository(repo)}
                  style={{ opacity: repo.exists ? 1 : 0.5 }}
                >
                  <span
                    className="repo-dot"
                    style={{
                      background: repo.languages?.[0] ? LANGUAGE_COLORS[repo.languages[0]] : LANGUAGE_COLORS.unknown
                    }}
                  />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{repo.name}</span>
                  {hasSync && (
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', display: 'flex', gap: '4px' }}>
                      {info.behind > 0 && <span title={`${info.behind} behind`}>↓{info.behind}</span>}
                      {info.ahead > 0 && <span title={`${info.ahead} ahead`}>↑{info.ahead}</span>}
                    </span>
                  )}
                  {(repo.languages?.length ?? 0) > 1 && (
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>+{repo.languages!.length - 1}</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </aside>
  )
}
````

## File: src/types/global.d.ts
````typescript
import type {
  Repository,
  FileEntry,
  Language,
  FileSizeStats,
  CleanupReport,
  OutdatedPackage,
  PatchBatchConfig,
  PatchBatchResult,
  NonBreakingUpdateConfig,
  SecurityPatchConfig,
  SecurityPatchResult,
  PushBranchResult,
  RepoInfo,
  ScheduledJob,
  ScheduledJobCreateInput,
  SmartScanSchedule,
  JobResult,
  ScanResult,
  ScanProgress,
  SecurityFinding,
  FullScanResult,
  DeadCodeReport,
  DeadCodeExport,
  BridgeConsoleSettings,
  ConflictWarning,
  AppSettings,
  GitHubCliStatus,
  BridgeProjectConfigResult,
  BridgeConfig,
  TechDebtScore
} from './index'

declare global {
  interface Window {
    bridge: {
      selectDirectory: () => Promise<string | null>
      selectCodeDirectory: () => Promise<string | null>
      getDefaultCodeDirectory: () => Promise<string>
      getCodeDirectory: () => Promise<string | null>
      saveCodeDirectory: (directory: string) => Promise<boolean>
      directoryExists: (directory: string) => Promise<boolean>
      scanForRepos: (directory: string) => Promise<Repository[]>
      scanRepository: (path: string) => Promise<Repository>
      readDirectory: (path: string) => Promise<FileEntry[]>
      readFile: (path: string) => Promise<string>
      getBridgeProjectConfig: (repoPath: string) => Promise<BridgeProjectConfigResult>
      loadBridgeConfig: (repoPath: string) => Promise<BridgeConfig>
      generateBridgeConfig: (repoPath: string) => Promise<BridgeConfig>
      saveBridgeConfig: (repoPath: string, config: BridgeConfig) => Promise<BridgeConfig>
      getTechDebtScore: (repoPath: string) => Promise<TechDebtScore>
      detectLanguages: (path: string) => Promise<Language[]>
      getRepositories: () => Promise<Repository[]>
      saveRepositories: (repos: Repository[]) => Promise<boolean>
      removeRepository: (path: string) => Promise<Repository[]>
      cleanupMissingRepos: () => Promise<Repository[]>
      getFileStats: (repoPath: string) => Promise<FileSizeStats>
      getCleanupReport: (repoPath: string) => Promise<CleanupReport>
      detectDeadCode: (repoPath: string) => Promise<DeadCodeReport>
      runFullScan: (repoPath: string) => Promise<FullScanResult>
      onFullScanProgress: (callback: (progress: { message: string; step: number; total: number }) => void) => () => void
      deleteDeadFile: (repoPath: string, relativePath: string) => Promise<boolean>
      cleanupDeadCode: (payload: { repoPath: string; deadFiles: string[]; unusedExports: DeadCodeExport[]; createPr?: boolean }) => Promise<any>
      getOutdatedPackages: (repoPath: string, language?: Language) => Promise<OutdatedPackage[]>
      runPatchBatch: (config: PatchBatchConfig) => Promise<PatchBatchResult>
      runNonBreakingUpdate: (config: NonBreakingUpdateConfig) => Promise<PatchBatchResult>
      runSecurityPatch: (config: SecurityPatchConfig) => Promise<SecurityPatchResult>
      pushBranch: (repoPath: string, branchName: string) => Promise<PushBranchResult>
      onPatchBatchProgress: (callback: (progress: { message: string; step: number; total: number }) => void) => () => void
      onPatchBatchWarning: (callback: (warning: { message: string; output: string }) => void) => () => void
      onPatchBatchLog: (callback: (entry: { message: string }) => void) => () => void
      onSecurityPatchProgress: (callback: (progress: { message: string; step: number; total: number }) => void) => () => void
      onSecurityPatchLog: (callback: (entry: { message: string }) => void) => () => void
      getRepoInfo: (repoPath: string) => Promise<RepoInfo>
      checkProtectedBranch: (repoPath: string) => Promise<boolean>
      predictMergeConflicts: (repoPath: string) => Promise<ConflictWarning[]>
      getGitHubCliStatus: (repoPath: string) => Promise<GitHubCliStatus>
      getScheduledJobs: () => Promise<ScheduledJob[]>
      addScheduledJob: (job: ScheduledJobCreateInput) => Promise<ScheduledJob>
      addScheduledJobsBatch: (jobs: ScheduledJobCreateInput[]) => Promise<ScheduledJob[]>
      updateScheduledJob: (jobId: string, updates: Partial<ScheduledJob>) => Promise<ScheduledJob | null>
      deleteScheduledJob: (jobId: string) => Promise<boolean>
      getJobResults: (jobId?: string) => Promise<JobResult[]>
      onSchedulerJobStarted: (callback: (data: { jobId: string; repoName: string }) => void) => () => void
      getSmartScanSchedules: () => Promise<SmartScanSchedule[]>
      addSmartScanSchedule: (payload: { repoPath: string; repoName: string }) => Promise<SmartScanSchedule>
      updateSmartScanSchedule: (id: string, updates: Partial<SmartScanSchedule>) => Promise<SmartScanSchedule | null>
      deleteSmartScanSchedule: (id: string) => Promise<boolean>
      onSmartScanStarted: (callback: (data: { id: string; repoName: string }) => void) => () => void
      checkSecurityScannerAvailable: () => Promise<boolean>
      runSecurityScan: (repoPath: string) => Promise<ScanResult>
      generateSecurityFix: (finding: SecurityFinding) => Promise<string | null>
      onSecurityScanProgress: (callback: (progress: ScanProgress) => void) => () => void
      getBridgeConsoleSettings: () => Promise<BridgeConsoleSettings>
      saveBridgeConsoleSettings: (settings: BridgeConsoleSettings) => Promise<BridgeConsoleSettings>
      testBridgeConsoleConnection: (settings: BridgeConsoleSettings) => Promise<{ ok: boolean; message?: string }>
      getAppSettings: () => Promise<AppSettings>
      saveAppSettings: (settings: Partial<AppSettings>) => Promise<AppSettings>
    }
  }
}

export {}
````

## File: electron/main.ts
````typescript
import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import { createBridgeStore } from './services/store'
import {
  scanRepository,
  scanForRepos,
  readDirectory,
  readFile,
  getDefaultCodeDirectory,
  directoryExists
} from './services/fileSystem'
import {
  getFileSizeStats,
  generateCleanupReport,
  runFullScan,
  deleteDeadFile,
  cleanupDeadCode,
  detectDeadCode,
  loadRepositoryBridgeConfig,
  generateRepositoryBridgeConfig,
  saveRepositoryBridgeConfig,
  getLatestTechDebtScore
} from './services/analysis'
import {
  getBridgeConsoleSettings,
  saveBridgeConsoleSettings,
  testBridgeConsoleConnection
} from './services/bridgeConsoleApi'
import { loadBridgeProjectConfig } from './services/bridgeProjectConfig'
import {
  detectLanguages,
  getPythonOutdated,
  getRubyOutdated,
  getElixirOutdated,
  Language
} from './services/languages'
import {
  getJsOutdatedPackages,
  runPatchBatchPipeline,
  runNonBreakingUpdatePipeline,
  runSecurityPatchPipeline
} from './services/patchBatch'
import {
  getScheduledJobs,
  addScheduledJob,
  addScheduledJobsBatch,
  updateScheduledJob,
  deleteScheduledJob,
  getJobResults,
  addJobResult,
  initializeScheduler,
  cleanupScheduler,
  setSchedulerExecutor,
  JobResult
} from './services/scheduler'
import {
  initializeSmartScheduler,
  setSmartScanExecutor,
  cleanupSmartScheduler,
  getSmartScanSchedules,
  addSmartScanSchedule,
  updateSmartScanSchedule,
  deleteSmartScanSchedule
} from './services/smartScheduler'
import {
  getRepoInfo,
  isOnProtectedBranch,
  predictMergeConflicts,
  getGitHubCliStatus,
  pushBranch
} from './services/git'
import {
  runSecurityScan,
  generateSecurityFix,
  checkAgenticFixerAvailable
} from './services/securityScanner'
import {
  getAppSettings,
  saveAppSettings,
  isExperimentalFeaturesEnabled
} from './services/appSettings'

const store = createBridgeStore('bridge-main')
const CODE_DIRECTORY_KEY = 'bridge-code-directory'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 20, y: 20 },
    backgroundColor: '#0a0a0a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  const devServerUrl = app.isPackaged
    ? null
    : (process.env.VITE_DEV_SERVER_URL || process.env['VITE_DEV_SERVER_URL'] || 'http://localhost:5173')

  if (devServerUrl) {
    console.log('Loading dev server:', devServerUrl)
    mainWindow.loadURL(devServerUrl)
    mainWindow.webContents.openDevTools()

    mainWindow.webContents.on('did-fail-load', (_, errorCode, errorDesc) => {
      console.error('Failed to load:', errorCode, errorDesc)
      setTimeout(() => {
        mainWindow?.loadURL(devServerUrl)
      }, 1000)
    })
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
  initializeScheduler()
  initializeSmartScheduler()

  setSchedulerExecutor(async (job): Promise<JobResult | null> => {
    try {
      const outdated = await collectOutdatedPackages(job.repoPath)
      const nonBreakingPackages = outdated.filter(p => p.isNonBreaking)

      if (nonBreakingPackages.length === 0) {
        return {
          jobId: job.id,
          success: true,
          timestamp: new Date().toISOString(),
          updatedPackages: []
        }
      }

      const result = await runNonBreakingUpdatePipeline({
        repoPath: job.repoPath,
        branchName: `bridge-scheduled-${Date.now()}`,
        createPR: false,
        runTests: true,
        prTitle: 'chore(deps): scheduled non-breaking dependency update',
        prBody: '## Summary\nScheduled non-breaking updates (patch + minor) via Bridge.'
      })

      return {
        jobId: job.id,
        success: result.success,
        timestamp: new Date().toISOString(),
        updatedPackages: result.updatedPackages || [],
        prUrl: result.prUrl || undefined,
        error: result.success ? undefined : result.error,
        testsPassed: result.testsPassed
      }
    } catch (error) {
      return {
        jobId: job.id,
        success: false,
        timestamp: new Date().toISOString(),
        updatedPackages: [],
        error: error instanceof Error ? error.message : 'Scheduled job failed'
      }
    }
  })

  setSmartScanExecutor(async (repoPath: string) => {
    if (!isExperimentalFeaturesEnabled()) {
      return
    }
    await runFullScan(repoPath, { skipConsoleUpload: false })
  })

  // Legacy migration: repo lists are no longer persisted.
  if (store.has('repositories')) {
    store.delete('repositories')
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  cleanupScheduler()
  cleanupSmartScheduler()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  cleanupScheduler()
  cleanupSmartScheduler()
})

// Repository management
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openDirectory'],
    title: 'Select Repository'
  })

  if (result.canceled || result.filePaths.length === 0) {
    return null
  }

  return result.filePaths[0]
})

ipcMain.handle('get-default-code-directory', () => {
  return getDefaultCodeDirectory()
})

ipcMain.handle('get-code-directory', () => {
  return (store.get(CODE_DIRECTORY_KEY, '') as string) || null
})

ipcMain.handle('save-code-directory', (_, directory: string) => {
  store.set(CODE_DIRECTORY_KEY, directory)
  return true
})

ipcMain.handle('directory-exists', async (_, dirPath: string) => {
  return await directoryExists(dirPath)
})

ipcMain.handle('select-code-directory', async () => {
  const fallbackPath = (store.get(CODE_DIRECTORY_KEY, '') as string) || getDefaultCodeDirectory()
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openDirectory'],
    title: 'Select code directory',
    defaultPath: fallbackPath
  })

  if (result.canceled || result.filePaths.length === 0) {
    return null
  }

  const selected = result.filePaths[0]
  store.set(CODE_DIRECTORY_KEY, selected)
  return selected
})

ipcMain.handle('scan-for-repos', async (_, directory: string) => {
  return await scanForRepos(directory)
})

ipcMain.handle('scan-repository', async (_, repoPath: string) => {
  return await scanRepository(repoPath)
})

ipcMain.handle('read-directory', async (_, dirPath: string) => {
  return await readDirectory(dirPath)
})

ipcMain.handle('read-file', async (_, filePath: string) => {
  return await readFile(filePath)
})

ipcMain.handle('get-bridge-project-config', async (_, repoPath: string) => {
  return await loadBridgeProjectConfig(repoPath)
})

ipcMain.handle('load-bridge-config', async (_, repoPath: string) => {
  return await loadRepositoryBridgeConfig(repoPath)
})

ipcMain.handle('generate-bridge-config', async (_, repoPath: string) => {
  return await generateRepositoryBridgeConfig(repoPath)
})

ipcMain.handle('save-bridge-config', async (_, repoPath: string, config: any) => {
  return await saveRepositoryBridgeConfig(repoPath, config)
})

ipcMain.handle('get-tech-debt-score', async (_, repoPath: string) => {
  return await getLatestTechDebtScore(repoPath)
})

ipcMain.handle('detect-languages', async (_, repoPath: string) => {
  return await detectLanguages(repoPath)
})

// Legacy compatibility for renderer APIs that still call these methods.
ipcMain.handle('get-repositories', async () => {
  const codeDirectory = (store.get(CODE_DIRECTORY_KEY, '') as string) || ''
  if (!codeDirectory || !(await directoryExists(codeDirectory))) {
    return []
  }
  return await scanForRepos(codeDirectory)
})

ipcMain.handle('save-repositories', (_, repositories: any[]) => {
  void repositories
  return true
})

ipcMain.handle('remove-repository', (_, repoPath: string) => {
  void repoPath
  return []
})

ipcMain.handle('cleanup-missing-repos', async () => {
  const codeDirectory = (store.get(CODE_DIRECTORY_KEY, '') as string) || ''
  if (!codeDirectory || !(await directoryExists(codeDirectory))) {
    return []
  }
  return await scanForRepos(codeDirectory)
})

// Bridge Console settings
ipcMain.handle('get-bridge-console-settings', () => {
  return getBridgeConsoleSettings()
})

ipcMain.handle('save-bridge-console-settings', (_, settings: any) => {
  return saveBridgeConsoleSettings(settings)
})

ipcMain.handle('test-bridge-console-connection', async (_, settings: any) => {
  return await testBridgeConsoleConnection(settings)
})

ipcMain.handle('get-app-settings', () => {
  return getAppSettings()
})

ipcMain.handle('save-app-settings', (_, settings: any) => {
  return saveAppSettings(settings)
})

// Analysis
ipcMain.handle('get-file-stats', async (_, repoPath: string) => {
  return await getFileSizeStats(repoPath)
})

ipcMain.handle('get-cleanup-report', async (_, repoPath: string) => {
  return await generateCleanupReport(repoPath)
})

ipcMain.handle('detect-dead-code', async (_, repoPath: string) => {
  return await detectDeadCode(repoPath)
})

ipcMain.handle('run-full-scan', async (event, repoPath: string) => {
  if (!isExperimentalFeaturesEnabled()) {
    throw new Error('Full TD Scan is disabled. Enable Experimental Features in Settings.')
  }
  return await runFullScan(repoPath, {
    onProgress: (message, step, total) => {
      event.sender.send('full-scan-progress', { message, step, total })
    }
  })
})

ipcMain.handle('delete-dead-file', async (_, repoPath: string, relativePath: string) => {
  return await deleteDeadFile(repoPath, relativePath)
})

ipcMain.handle('cleanup-dead-code', async (_, payload: { repoPath: string; deadFiles: string[]; unusedExports: any[]; createPr?: boolean }) => {
  return await cleanupDeadCode(payload.repoPath, payload.deadFiles, payload.unusedExports, { createPr: payload.createPr })
})

// Get outdated packages for any language
ipcMain.handle('get-outdated-packages', async (_, repoPath: string, language?: Language) => {
  const languages = language ? [language] : await detectLanguages(repoPath)
  const allPackages: any[] = []

  if (languages.length === 0) {
    throw new Error('No package.json found - is this a Node.js project?')
  }

  for (const lang of languages) {
    switch (lang) {
      case 'javascript':
        allPackages.push(...await getJsOutdatedPackages(repoPath))
        break
      case 'python':
        allPackages.push(...await getPythonOutdated(repoPath))
        break
      case 'ruby':
        allPackages.push(...await getRubyOutdated(repoPath))
        break
      case 'elixir':
        allPackages.push(...await getElixirOutdated(repoPath))
        break
    }
  }

  return allPackages
})

async function collectOutdatedPackages(repoPath: string) {
  const languages = await detectLanguages(repoPath)
  const allPackages: any[] = []

  for (const lang of languages) {
    switch (lang) {
      case 'javascript':
        allPackages.push(...await getJsOutdatedPackages(repoPath))
        break
      case 'python':
        allPackages.push(...await getPythonOutdated(repoPath))
        break
      case 'ruby':
        allPackages.push(...await getRubyOutdated(repoPath))
        break
      case 'elixir':
        allPackages.push(...await getElixirOutdated(repoPath))
        break
    }
  }

  return allPackages
}

// Run patch batch with full pipeline
ipcMain.handle('run-patch-batch', async (event, config: {
  repoPath: string
  branchName: string
  packages: { name: string; language: Language }[]
  createPR: boolean
  runTests: boolean
  baseBranch?: string
  remoteFirst?: boolean
  updateStrategy?: 'wanted' | 'latest'
  testCommand?: string
  testTimeoutMs?: number
  prTitle?: string
  prBody?: string
}) => {
  const {
    repoPath,
    branchName,
    packages,
    createPR,
    runTests: shouldRunTests,
    updateStrategy,
    prTitle,
    prBody,
    testCommand,
    testTimeoutMs
  } = config

  const bridgeConfig = await loadRepositoryBridgeConfig(repoPath)
  const projectConfig = await loadBridgeProjectConfig(repoPath)
  const updatePolicy = bridgeConfig.dependencies.updatePolicy
  const pinnedPackages = bridgeConfig.dependencies.pinnedPackages || {}
  const outdatedPackages = await collectOutdatedPackages(repoPath)
  const outdatedIndex = new Map(outdatedPackages.map(pkg => [`${pkg.language}:${pkg.name}`, pkg]))

  const skippedPinned: string[] = []
  const filteredPackages = packages.filter(pkg => {
    if (pinnedPackages[pkg.name]) {
      skippedPinned.push(pkg.name)
      return false
    }

    const lookup = outdatedIndex.get(`${pkg.language}:${pkg.name}`)
    if (!lookup || pkg.language !== 'javascript') {
      return true
    }

    if (lookup.updateType === 'patch' && updatePolicy.patch === 'ignore') return false
    if (lookup.updateType === 'minor' && updatePolicy.minor === 'ignore') return false
    if (lookup.updateType === 'major' && updatePolicy.major === 'ignore') return false
    return true
  })

  if (skippedPinned.length > 0) {
    event.sender.send('patch-batch-warning', {
      message: `Skipped pinned packages from .bridge.json: ${Array.from(new Set(skippedPinned)).join(', ')}`,
      output: ''
    })
  }

  if (filteredPackages.length === 0) {
    return {
      success: false,
      error: 'No packages remain after applying .bridge.json policy and pinned package constraints.'
    }
  }

  return runPatchBatchPipeline(
    {
      repoPath,
      branchName,
      packages: filteredPackages,
      createPR,
      runTests: shouldRunTests ?? bridgeConfig.gates.tests.required,
      baseBranch: config.baseBranch,
      remoteFirst: config.remoteFirst,
      updateStrategy,
      prTitle,
      prBody,
      testCommand: testCommand?.trim() || bridgeConfig.gates.tests.command || projectConfig.config.patch?.testCommand,
      testTimeoutMs: testTimeoutMs ?? bridgeConfig.gates.tests.timeout
    },
    {
      onProgress: (message, step, total) => event.sender.send('patch-batch-progress', { message, step, total }),
      onLog: (message) => event.sender.send('patch-batch-log', { message }),
      onWarning: (warning) => event.sender.send('patch-batch-warning', warning)
    }
  )
})

ipcMain.handle('run-non-breaking-update', async (event, config: {
  repoPath: string
  branchName: string
  createPR: boolean
  runTests: boolean
  baseBranch?: string
  remoteFirst?: boolean
  selectedMajorPackages?: string[]
  testCommand?: string
  testTimeoutMs?: number
  prTitle?: string
  prBody?: string
}) => {
  const bridgeConfig = await loadRepositoryBridgeConfig(config.repoPath)
  const projectConfig = await loadBridgeProjectConfig(config.repoPath)
  const patchConfig = projectConfig.config.patch || {}
  const branchPrefix = patchConfig.branchPrefix || projectConfig.config.branchPrefix || 'bridge-update-deps'
  const branchName = config.branchName?.trim() || `${branchPrefix}-${Date.now()}`
  const updatePolicy = bridgeConfig.dependencies.updatePolicy
  const pinnedPackages = bridgeConfig.dependencies.pinnedPackages || {}
  const selectedMajor = updatePolicy.major === 'ignore'
    ? []
    : (config.selectedMajorPackages || []).filter(pkg => !pinnedPackages[pkg])
  const skippedPinned = (config.selectedMajorPackages || []).filter(pkg => Boolean(pinnedPackages[pkg]))

  if (skippedPinned.length > 0) {
    event.sender.send('patch-batch-warning', {
      message: `Skipped pinned major packages from .bridge.json: ${Array.from(new Set(skippedPinned)).join(', ')}`,
      output: ''
    })
  }

  return runNonBreakingUpdatePipeline(
    {
      ...config,
      branchName,
      createPR: config.createPR ?? patchConfig.createPR ?? false,
      runTests: config.runTests ?? patchConfig.runTests ?? bridgeConfig.gates.tests.required,
      selectedMajorPackages: selectedMajor,
      testCommand: config.testCommand?.trim() || bridgeConfig.gates.tests.command || patchConfig.testCommand,
      testTimeoutMs: config.testTimeoutMs ?? bridgeConfig.gates.tests.timeout,
      baseBranch: config.baseBranch || patchConfig.baseBranch || projectConfig.config.baseBranch,
      remoteFirst: config.remoteFirst ?? patchConfig.remoteFirst ?? true
    },
    {
      onProgress: (message, step, total) => event.sender.send('patch-batch-progress', { message, step, total }),
      onLog: (message) => event.sender.send('patch-batch-log', { message }),
      onWarning: (warning) => event.sender.send('patch-batch-warning', warning)
    }
  )
})

ipcMain.handle('run-security-patch', async (event, config: {
  repoPath: string
  branchName: string
  createPR: boolean
  runTests: boolean
  baseBranch?: string
  remoteFirst?: boolean
  testCommand?: string
}) => {
  const bridgeConfig = await loadRepositoryBridgeConfig(config.repoPath)
  const projectConfig = await loadBridgeProjectConfig(config.repoPath)
  const patchConfig = projectConfig.config.patch || {}

  return runSecurityPatchPipeline(
    {
      ...config,
      runTests: config.runTests ?? patchConfig.runTests ?? bridgeConfig.gates.tests.required,
      testCommand: config.testCommand?.trim() || bridgeConfig.gates.tests.command || patchConfig.testCommand,
      baseBranch: config.baseBranch || patchConfig.baseBranch || projectConfig.config.baseBranch,
      remoteFirst: config.remoteFirst ?? patchConfig.remoteFirst ?? true
    },
    {
      onProgress: (message, step, total) => event.sender.send('security-patch-progress', { message, step, total }),
      onLog: (message) => event.sender.send('security-patch-log', { message })
    }
  )
})

ipcMain.handle('push-branch', async (_, repoPath: string, branchName: string) => {
  try {
    await pushBranch(repoPath, branchName)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to push branch'
    }
  }
})

// Git info
ipcMain.handle('get-repo-info', async (_, repoPath: string) => {
  return await getRepoInfo(repoPath)
})

ipcMain.handle('check-protected-branch', async (_, repoPath: string) => {
  return await isOnProtectedBranch(repoPath)
})

ipcMain.handle('predict-merge-conflicts', async (_, repoPath: string) => {
  return await predictMergeConflicts(repoPath)
})

ipcMain.handle('get-github-cli-status', async (_, repoPath: string) => {
  return await getGitHubCliStatus(repoPath)
})

// Scheduler
ipcMain.handle('get-scheduled-jobs', () => {
  return getScheduledJobs()
})

ipcMain.handle('add-scheduled-job', (_, job: any) => {
  return addScheduledJob(job)
})

ipcMain.handle('add-scheduled-jobs-batch', (_, jobs: any[]) => {
  return addScheduledJobsBatch(jobs)
})

ipcMain.handle('update-scheduled-job', (_, jobId: string, updates: any) => {
  return updateScheduledJob(jobId, updates)
})

ipcMain.handle('delete-scheduled-job', (_, jobId: string) => {
  return deleteScheduledJob(jobId)
})

ipcMain.handle('get-job-results', (_, jobId?: string) => {
  return getJobResults(jobId)
})

// Smart scheduling
ipcMain.handle('get-smart-scan-schedules', () => {
  return getSmartScanSchedules()
})

ipcMain.handle('add-smart-scan-schedule', async (_, payload: { repoPath: string; repoName: string }) => {
  if (!isExperimentalFeaturesEnabled()) {
    throw new Error('Smart TD Scans are disabled. Enable Experimental Features in Settings.')
  }
  return await addSmartScanSchedule(payload.repoPath, payload.repoName)
})

ipcMain.handle('update-smart-scan-schedule', async (_, id: string, updates: any) => {
  return updateSmartScanSchedule(id, updates)
})

ipcMain.handle('delete-smart-scan-schedule', async (_, id: string) => {
  return deleteSmartScanSchedule(id)
})

// Handle scheduler job execution
ipcMain.on('scheduler-job-complete', (_, result: any) => {
  addJobResult(result)
})

// Security Scanner
ipcMain.handle('check-security-scanner-available', async () => {
  return await checkAgenticFixerAvailable()
})

ipcMain.handle('run-security-scan', async (event, repoPath: string) => {
  if (!isExperimentalFeaturesEnabled()) {
    throw new Error('Security Scan is disabled. Enable Experimental Features in Settings.')
  }
  return await runSecurityScan(repoPath, (progress) => {
    event.sender.send('security-scan-progress', progress)
  })
})

ipcMain.handle('generate-security-fix', async (_, finding: any) => {
  if (!isExperimentalFeaturesEnabled()) {
    throw new Error('Security Scan is disabled. Enable Experimental Features in Settings.')
  }
  return await generateSecurityFix(finding)
})
````

## File: electron/preload.ts
````typescript
import { contextBridge, ipcRenderer } from 'electron'

export type Language = 'javascript' | 'python' | 'ruby' | 'elixir' | 'unknown'
export type ScheduleFrequency = 'hourly' | 'daily' | 'weekly' | 'monthly'

export interface Repository {
  path: string
  name: string
  languages: Language[]
  hasGit: boolean
  addedAt: string
  exists: boolean
}

export interface OutdatedPackage {
  name: string
  current: string
  wanted: string
  latest: string
  type: 'dependencies' | 'devDependencies'
  hasPatchUpdate: boolean
  isNonBreaking: boolean
  updateType: 'patch' | 'minor' | 'major' | 'unknown'
  language: Language
  vulnerabilities?: {
    critical: number
    high: number
    medium: number
    low: number
    total: number
  }
}

export interface FileEntry {
  name: string
  path: string
  isDirectory: boolean
  size?: number
  modified?: string
}

export interface RepoInfo {
  branch: string
  remote: string | null
  hasChanges: boolean
  isProtectedBranch: boolean
  defaultBranch: string
  ahead: number
  behind: number
}

export interface ConflictWarning {
  severity: 'high' | 'medium'
  message: string
  recommendation: string
  conflictingFiles: string[]
  behindBy: number
}

export interface GitHubCliStatus {
  installed: boolean
  authenticated: boolean
  account?: string
  message?: string
}

export interface PatchBatchConfig {
  repoPath: string
  branchName: string
  packages: { name: string; language: Language }[]
  createPR: boolean
  runTests: boolean
  baseBranch?: string
  remoteFirst?: boolean
  updateStrategy?: 'wanted' | 'latest'
  testCommand?: string
  testTimeoutMs?: number
  prTitle?: string
  prBody?: string
}

export interface NonBreakingUpdateConfig {
  repoPath: string
  branchName: string
  createPR: boolean
  runTests: boolean
  baseBranch?: string
  remoteFirst?: boolean
  pinnedPackages?: Record<string, string>
  selectedMajorPackages?: string[]
  testCommand?: string
  testTimeoutMs?: number
  prTitle?: string
  prBody?: string
}

export interface PatchBatchResult {
  success: boolean
  updatedPackages?: string[]
  failedPackages?: string[]
  prUrl?: string | null
  branchName?: string
  branchPushed?: boolean
  error?: string
  testsPassed?: boolean
  testOutput?: string
}

export interface SecurityPatchConfig {
  repoPath: string
  branchName: string
  createPR: boolean
  runTests: boolean
  baseBranch?: string
  remoteFirst?: boolean
  testCommand?: string
}

export interface BridgePatchConfig {
  createPR?: boolean
  runTests?: boolean
  testCommand?: string
  branchPrefix?: string
  baseBranch?: string
  remoteFirst?: boolean
}

export interface BridgeProjectConfig {
  baseBranch?: string
  branchPrefix?: string
  patch?: BridgePatchConfig
}

export interface BridgeProjectConfigResult {
  exists: boolean
  path: string
  config: BridgeProjectConfig
  errors: string[]
}

export interface SecurityPatchResult {
  success: boolean
  updatedPackages: string[]
  failedPackages: string[]
  prUrl?: string | null
  error?: string
  testsPassed?: boolean
}

export interface PushBranchResult {
  success: boolean
  error?: string
}

export interface LargeFile {
  path: string
  size: number
  sizeFormatted: string
  type: 'current' | 'git-history'
}

export interface OversizedComponent {
  path: string
  lines: number
  type: string
}

export interface CleanupReport {
  largeFiles: LargeFile[]
  gitHistoryFiles: LargeFile[]
  oversizedComponents: OversizedComponent[]
  totalWastedSpace: number
  totalWastedSpaceFormatted: string
}

export interface FileSizeStats {
  totalSize: number
  totalSizeFormatted: string
  fileCount: number
  largestFiles: LargeFile[]
}

export interface ScheduledJob {
  id: string
  repoPath: string
  repoName: string
  frequency: ScheduleFrequency
  intervalHours: number
  daysOfWeek: number[]
  dayOfMonth: number
  timeOfDay: string
  startAt: string
  enabled: boolean
  lastRun: string | null
  nextRun: string
  language: string
  createPR: boolean
  runTests: boolean
  createdAt: string
}

export interface ScheduledJobCreateInput {
  repoPath: string
  repoName: string
  frequency: ScheduleFrequency
  intervalHours?: number
  daysOfWeek?: number[]
  dayOfMonth?: number
  timeOfDay?: string
  startAt?: string
  enabled: boolean
  language: string
  createPR: boolean
  runTests: boolean
}

export interface SmartScanSchedule {
  id: string
  repoPath: string
  repoName: string
  enabled: boolean
  quietHour: number
  lastRun: string | null
  nextRun: string
  createdAt: string
}

export interface JobResult {
  jobId: string
  success: boolean
  timestamp: string
  updatedPackages: string[]
  prUrl?: string
  error?: string
  testsPassed?: boolean
}

export interface SecurityFinding {
  file: string
  line: number
  issue: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  code: string
  description: string
  cwe: string
  owasp: string
  solution?: string
  fixedCode?: string
}

export interface ScanResult {
  scanId: string
  repoPath: string
  totalFindings: number
  criticalCount: number
  highCount: number
  mediumCount: number
  lowCount: number
  findings: SecurityFinding[]
  scannedAt: string
  duration: number
}

export interface ScanProgress {
  status: 'scanning' | 'analyzing' | 'generating-fixes' | 'complete' | 'error'
  progress: number
  message: string
  currentFile?: string
}

export interface VulnerabilitySummary {
  critical: number
  high: number
  medium: number
  low: number
  total: number
}

export interface DependencyReport {
  outdated: OutdatedPackage[]
  vulnerabilities: VulnerabilitySummary
  installedPackages?: string[]
  error?: string
}

export interface CircularDependency {
  from: string
  to: string
  cycle: string[]
}

export interface CircularDependencyReport {
  count: number
  dependencies: CircularDependency[]
  error?: string
}

export interface DeadCodeExport {
  file: string
  exportName: string
}

export interface DeadCodeReport {
  deadFiles: string[]
  unusedExports: DeadCodeExport[]
  totalDeadCodeCount: number
  raw?: {
    knip?: string
    unimported?: string
  }
  error?: string
}

export interface BundleModule {
  name: string
  size: number
  sizeFormatted: string
}

export interface BundleAnalysisReport {
  totalSize: number
  totalSizeFormatted: string
  largestModules: BundleModule[]
  previousSize?: number
  delta?: number
  deltaPercent?: number
  warning?: boolean
  statsPath?: string
  error?: string
}

export interface TestCoverageReport {
  coveragePercentage: number | null
  uncoveredCriticalFiles: { file: string; coverage: number }[]
  summaryPath?: string
  error?: string
}

export interface DocumentationDebtReport {
  missingReadmeSections: string[]
  readmeOutdated: boolean
  daysSinceUpdate: number
  undocumentedFunctions: number
  error?: string
}

export interface BridgeConfig {
  version: 1
  project: {
    name: string
    description?: string
    primaryLanguage: 'javascript' | 'typescript' | 'python' | 'ruby' | 'elixir' | 'go' | 'rust' | 'java' | 'multi'
    packageManager?: 'npm' | 'yarn' | 'pnpm' | 'pip' | 'poetry' | 'bundler' | 'mix' | 'cargo' | 'maven' | 'gradle'
    monorepo?: boolean
    workspacePatterns?: string[]
  }
  dependencies: {
    updatePolicy: {
      patch: 'auto' | 'review' | 'ignore'
      minor: 'auto' | 'review' | 'ignore'
      major: 'review' | 'ignore'
    }
    bannedPackages?: string[]
    requiredPackages?: string[]
    pinnedPackages?: Record<string, string>
    maxAge?: {
      patch: number
      minor: number
      major: number
    }
    securityPolicy: {
      autoFixCritical: boolean
      autoFixHigh: boolean
      blockOnCritical: boolean
      blockOnHigh: boolean
    }
  }
  gates: {
    tests: {
      required: boolean
      command?: string
      minCoverage?: number
      timeout?: number
    }
    lint: {
      required: boolean
      command?: string
    }
    build: {
      required: boolean
      command?: string
    }
    bundleSize?: {
      maxBytes?: number
      maxDeltaPercent?: number
    }
    circularDependencies: {
      maxAllowed: number
      failOnNew: boolean
    }
    deadCode: {
      maxUnusedExports: number
      maxDeadFiles: number
      failOnNew: boolean
    }
    documentation: {
      requireReadme: boolean
      requireChangelog: boolean
      maxDaysSinceReadmeUpdate?: number
    }
  }
  agent: {
    context: string
    conventions?: string[]
    avoidPatterns?: string[]
    preferredLibraries?: Record<string, string>
    reviewChecklist?: string[]
  }
  scoring?: {
    weights?: {
      dependencies?: number
      security?: number
      architecture?: number
      testing?: number
      documentation?: number
      codeHealth?: number
    }
    thresholds?: {
      maxOutdatedDeps?: number
      maxCircularDeps?: number
      maxDeadFiles?: number
      minTestCoverage?: number
      maxOversizedFiles?: number
      maxAvgFileComplexity?: number
      maxDebtScore?: number
    }
  }
  scan: {
    schedule?: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'manual'
    exclude?: string[]
    include?: string[]
    features: {
      dependencies: boolean
      security: boolean
      circularDeps: boolean
      deadCode: boolean
      bundleSize: boolean
      testCoverage: boolean
      documentation: boolean
      codeSmells: boolean
      fileAnalysis: boolean
    }
  }
  console?: {
    projectId?: string
    autoUpload: boolean
    uploadOn?: ('scan' | 'update' | 'schedule')[]
  }
}

export interface SecurityPatternFinding {
  file: string
  line: number
  column?: number
  severity: 'critical' | 'high' | 'medium' | 'low'
  category: string
  cwe?: string
  owasp?: string
  title: string
  description: string
  suggestion: string
  snippet: string
}

export interface DimensionScore {
  score: number
  weight: number
  weightedScore: number
  findings: string[]
  metrics: Record<string, number | string>
}

export interface DebtContributor {
  dimension: string
  description: string
  impact: number
  fixable: boolean
  effort: 'trivial' | 'small' | 'medium' | 'large'
}

export interface ActionItem {
  priority: number
  title: string
  description: string
  dimension: string
  impact: number
  effort: 'trivial' | 'small' | 'medium' | 'large'
  automatable: boolean
  command?: string
}

export interface TechDebtScore {
  total: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  trend: 'improving' | 'stable' | 'declining' | 'unknown'
  dimensions: {
    dependencies: DimensionScore
    security: DimensionScore
    architecture: DimensionScore
    testing: DimensionScore
    documentation: DimensionScore
    codeHealth: DimensionScore
  }
  topContributors: DebtContributor[]
  actionItems: ActionItem[]
}

export interface GateResult {
  name: string
  passed: boolean
  message: string
  severity: 'error' | 'warning' | 'info'
  details?: Record<string, any>
}

export interface BridgeScanReport {
  version: 1
  generatedAt: string
  generatedBy: 'bridge-desktop' | 'bridge-cli' | 'bridge-ci'
  repository: {
    path: string
    name: string
    url?: string
    branch?: string
    commit?: string
    language: string
    packageManager?: string
  }
  durationMs: number
  config: BridgeConfig
  techDebt: TechDebtScore
  dependencies: DependencyReport
  security: {
    vulnerabilities: VulnerabilitySummary
    patternFindings: SecurityPatternFinding[]
  }
  architecture: {
    circularDependencies: CircularDependencyReport
    deadCode: DeadCodeReport
    bundleSize: BundleAnalysisReport
    oversizedFiles: OversizedComponent[]
  }
  testing: {
    coverage: TestCoverageReport
    hasTests: boolean
    testCommand?: string
  }
  documentation: DocumentationDebtReport
  gates: {
    passed: boolean
    results: GateResult[]
  }
  agentDigest: {
    debtScore: number
    grade: string
    critical: string[]
    actions: ActionItem[]
    policies: {
      banned_present: string[]
      missing_required: string[]
      update_policy: BridgeConfig['dependencies']['updatePolicy']
    }
    conventions: string[]
    context: string
    outdated_summary: {
      total: number
      patch: number
      minor: number
      major: number
    }
  }
}

export interface ConsoleUploadResult {
  success: boolean
  tdScore?: number
  tdDelta?: number
  error?: string
}

export interface FullScanResult {
  scanDate: string
  repository: string
  repositoryUrl?: string | null
  config: BridgeConfig
  dependencies: DependencyReport
  circularDependencies: CircularDependencyReport
  deadCode: DeadCodeReport
  bundleSize: BundleAnalysisReport
  testCoverage: TestCoverageReport
  documentation: DocumentationDebtReport
  securityPatterns: SecurityPatternFinding[]
  oversizedFiles: OversizedComponent[]
  codeHealth: {
    todoCount: number
    consoleLogCount: number
    commentedOutBlockCount: number
    mixedTabsSpaces: boolean
    inconsistentQuoteStyle: boolean
    hasLinter: boolean
    hasFormatter: boolean
    packageScriptsCount: number
    hasGitignore: boolean
  }
  techDebtScore: TechDebtScore
  scanReport?: BridgeScanReport
  reportPaths?: {
    latestReportPath: string
    latestScorePath: string
    archivePath: string
    configSnapshotPath: string
  }
  consoleUpload?: ConsoleUploadResult
  durationMs: number
}

export interface BridgeConsoleSettings {
  consoleUrl: string
  apiToken: string
  githubUsername: string
  autoUpload: boolean
}

export interface AppSettings {
  experimentalFeatures: boolean
  onboardingCompleted: boolean
}

contextBridge.exposeInMainWorld('bridge', {
  // Repository management
  selectDirectory: (): Promise<string | null> =>
    ipcRenderer.invoke('select-directory'),

  selectCodeDirectory: (): Promise<string | null> =>
    ipcRenderer.invoke('select-code-directory'),

  getDefaultCodeDirectory: (): Promise<string> =>
    ipcRenderer.invoke('get-default-code-directory'),

  getCodeDirectory: (): Promise<string | null> =>
    ipcRenderer.invoke('get-code-directory'),

  saveCodeDirectory: (directory: string): Promise<boolean> =>
    ipcRenderer.invoke('save-code-directory', directory),

  directoryExists: (directory: string): Promise<boolean> =>
    ipcRenderer.invoke('directory-exists', directory),

  scanForRepos: (directory: string): Promise<Repository[]> =>
    ipcRenderer.invoke('scan-for-repos', directory),

  scanRepository: (path: string): Promise<Repository> =>
    ipcRenderer.invoke('scan-repository', path),

  readDirectory: (path: string): Promise<FileEntry[]> =>
    ipcRenderer.invoke('read-directory', path),

  readFile: (path: string): Promise<string> =>
    ipcRenderer.invoke('read-file', path),

  getBridgeProjectConfig: (repoPath: string): Promise<BridgeProjectConfigResult> =>
    ipcRenderer.invoke('get-bridge-project-config', repoPath),

  loadBridgeConfig: (repoPath: string): Promise<BridgeConfig> =>
    ipcRenderer.invoke('load-bridge-config', repoPath),

  generateBridgeConfig: (repoPath: string): Promise<BridgeConfig> =>
    ipcRenderer.invoke('generate-bridge-config', repoPath),

  saveBridgeConfig: (repoPath: string, config: BridgeConfig): Promise<BridgeConfig> =>
    ipcRenderer.invoke('save-bridge-config', repoPath, config),

  getTechDebtScore: (repoPath: string): Promise<TechDebtScore> =>
    ipcRenderer.invoke('get-tech-debt-score', repoPath),

  detectLanguages: (path: string): Promise<Language[]> =>
    ipcRenderer.invoke('detect-languages', path),

  // Persistence
  getRepositories: (): Promise<Repository[]> =>
    ipcRenderer.invoke('get-repositories'),

  saveRepositories: (repos: Repository[]): Promise<boolean> =>
    ipcRenderer.invoke('save-repositories', repos),

  removeRepository: (path: string): Promise<Repository[]> =>
    ipcRenderer.invoke('remove-repository', path),

  cleanupMissingRepos: (): Promise<Repository[]> =>
    ipcRenderer.invoke('cleanup-missing-repos'),

  // Analysis
  getFileStats: (repoPath: string): Promise<FileSizeStats> =>
    ipcRenderer.invoke('get-file-stats', repoPath),

  getCleanupReport: (repoPath: string): Promise<CleanupReport> =>
    ipcRenderer.invoke('get-cleanup-report', repoPath),

  detectDeadCode: (repoPath: string): Promise<DeadCodeReport> =>
    ipcRenderer.invoke('detect-dead-code', repoPath),

  runFullScan: (repoPath: string): Promise<FullScanResult> =>
    ipcRenderer.invoke('run-full-scan', repoPath),

  onFullScanProgress: (callback: (progress: { message: string; step: number; total: number }) => void) => {
    ipcRenderer.on('full-scan-progress', (_, progress) => callback(progress))
    return () => ipcRenderer.removeAllListeners('full-scan-progress')
  },

  deleteDeadFile: (repoPath: string, relativePath: string): Promise<boolean> =>
    ipcRenderer.invoke('delete-dead-file', repoPath, relativePath),

  cleanupDeadCode: (payload: { repoPath: string; deadFiles: string[]; unusedExports: DeadCodeExport[]; createPr?: boolean }): Promise<any> =>
    ipcRenderer.invoke('cleanup-dead-code', payload),

  // Patch Batch
  getOutdatedPackages: (repoPath: string, language?: Language): Promise<OutdatedPackage[]> =>
    ipcRenderer.invoke('get-outdated-packages', repoPath, language),

  runPatchBatch: (config: PatchBatchConfig): Promise<PatchBatchResult> =>
    ipcRenderer.invoke('run-patch-batch', config),

  runNonBreakingUpdate: (config: NonBreakingUpdateConfig): Promise<PatchBatchResult> =>
    ipcRenderer.invoke('run-non-breaking-update', config),

  runSecurityPatch: (config: SecurityPatchConfig): Promise<SecurityPatchResult> =>
    ipcRenderer.invoke('run-security-patch', config),

  pushBranch: (repoPath: string, branchName: string): Promise<PushBranchResult> =>
    ipcRenderer.invoke('push-branch', repoPath, branchName),

  onPatchBatchProgress: (callback: (progress: { message: string; step: number; total: number }) => void) => {
    ipcRenderer.on('patch-batch-progress', (_, progress) => callback(progress))
    return () => ipcRenderer.removeAllListeners('patch-batch-progress')
  },

  onPatchBatchWarning: (callback: (warning: { message: string; output: string }) => void) => {
    ipcRenderer.on('patch-batch-warning', (_, warning) => callback(warning))
    return () => ipcRenderer.removeAllListeners('patch-batch-warning')
  },

  onPatchBatchLog: (callback: (entry: { message: string }) => void) => {
    ipcRenderer.on('patch-batch-log', (_, entry) => callback(entry))
    return () => ipcRenderer.removeAllListeners('patch-batch-log')
  },

  onSecurityPatchProgress: (callback: (progress: { message: string; step: number; total: number }) => void) => {
    ipcRenderer.on('security-patch-progress', (_, progress) => callback(progress))
    return () => ipcRenderer.removeAllListeners('security-patch-progress')
  },

  onSecurityPatchLog: (callback: (entry: { message: string }) => void) => {
    ipcRenderer.on('security-patch-log', (_, entry) => callback(entry))
    return () => ipcRenderer.removeAllListeners('security-patch-log')
  },

  // Git
  getRepoInfo: (repoPath: string): Promise<RepoInfo> =>
    ipcRenderer.invoke('get-repo-info', repoPath),

  checkProtectedBranch: (repoPath: string): Promise<boolean> =>
    ipcRenderer.invoke('check-protected-branch', repoPath),

  predictMergeConflicts: (repoPath: string): Promise<ConflictWarning[]> =>
    ipcRenderer.invoke('predict-merge-conflicts', repoPath),

  getGitHubCliStatus: (repoPath: string): Promise<GitHubCliStatus> =>
    ipcRenderer.invoke('get-github-cli-status', repoPath),

  // Scheduler
  getScheduledJobs: (): Promise<ScheduledJob[]> =>
    ipcRenderer.invoke('get-scheduled-jobs'),

  addScheduledJob: (job: ScheduledJobCreateInput): Promise<ScheduledJob> =>
    ipcRenderer.invoke('add-scheduled-job', job),

  addScheduledJobsBatch: (jobs: ScheduledJobCreateInput[]): Promise<ScheduledJob[]> =>
    ipcRenderer.invoke('add-scheduled-jobs-batch', jobs),

  updateScheduledJob: (jobId: string, updates: Partial<ScheduledJob>): Promise<ScheduledJob | null> =>
    ipcRenderer.invoke('update-scheduled-job', jobId, updates),

  deleteScheduledJob: (jobId: string): Promise<boolean> =>
    ipcRenderer.invoke('delete-scheduled-job', jobId),

  getJobResults: (jobId?: string): Promise<JobResult[]> =>
    ipcRenderer.invoke('get-job-results', jobId),

  onSchedulerJobStarted: (callback: (data: { jobId: string; repoName: string }) => void) => {
    ipcRenderer.on('scheduler-job-started', (_, data) => callback(data))
    return () => ipcRenderer.removeAllListeners('scheduler-job-started')
  },

  getSmartScanSchedules: (): Promise<SmartScanSchedule[]> =>
    ipcRenderer.invoke('get-smart-scan-schedules'),

  addSmartScanSchedule: (payload: { repoPath: string; repoName: string }): Promise<SmartScanSchedule> =>
    ipcRenderer.invoke('add-smart-scan-schedule', payload),

  updateSmartScanSchedule: (id: string, updates: Partial<SmartScanSchedule>): Promise<SmartScanSchedule | null> =>
    ipcRenderer.invoke('update-smart-scan-schedule', id, updates),

  deleteSmartScanSchedule: (id: string): Promise<boolean> =>
    ipcRenderer.invoke('delete-smart-scan-schedule', id),

  onSmartScanStarted: (callback: (data: { id: string; repoName: string }) => void) => {
    ipcRenderer.on('smart-scan-started', (_, data) => callback(data))
    return () => ipcRenderer.removeAllListeners('smart-scan-started')
  },

  // Security Scanner
  checkSecurityScannerAvailable: (): Promise<boolean> =>
    ipcRenderer.invoke('check-security-scanner-available'),

  runSecurityScan: (repoPath: string): Promise<ScanResult> =>
    ipcRenderer.invoke('run-security-scan', repoPath),

  generateSecurityFix: (finding: SecurityFinding): Promise<string | null> =>
    ipcRenderer.invoke('generate-security-fix', finding),

  onSecurityScanProgress: (callback: (progress: ScanProgress) => void) => {
    ipcRenderer.on('security-scan-progress', (_, progress) => callback(progress))
    return () => ipcRenderer.removeAllListeners('security-scan-progress')
  },

  // Bridge Console settings
  getBridgeConsoleSettings: (): Promise<BridgeConsoleSettings> =>
    ipcRenderer.invoke('get-bridge-console-settings'),

  saveBridgeConsoleSettings: (settings: BridgeConsoleSettings): Promise<BridgeConsoleSettings> =>
    ipcRenderer.invoke('save-bridge-console-settings', settings),

  testBridgeConsoleConnection: (settings: BridgeConsoleSettings): Promise<{ ok: boolean; message?: string }> =>
    ipcRenderer.invoke('test-bridge-console-connection', settings),

  getAppSettings: (): Promise<AppSettings> =>
    ipcRenderer.invoke('get-app-settings'),

  saveAppSettings: (settings: Partial<AppSettings>): Promise<AppSettings> =>
    ipcRenderer.invoke('save-app-settings', settings)
})

declare global {
  interface Window {
    bridge: {
      selectDirectory: () => Promise<string | null>
      selectCodeDirectory: () => Promise<string | null>
      getDefaultCodeDirectory: () => Promise<string>
      getCodeDirectory: () => Promise<string | null>
      saveCodeDirectory: (directory: string) => Promise<boolean>
      directoryExists: (directory: string) => Promise<boolean>
      scanForRepos: (directory: string) => Promise<Repository[]>
      scanRepository: (path: string) => Promise<Repository>
      readDirectory: (path: string) => Promise<FileEntry[]>
      readFile: (path: string) => Promise<string>
      getBridgeProjectConfig: (repoPath: string) => Promise<BridgeProjectConfigResult>
      loadBridgeConfig: (repoPath: string) => Promise<BridgeConfig>
      generateBridgeConfig: (repoPath: string) => Promise<BridgeConfig>
      saveBridgeConfig: (repoPath: string, config: BridgeConfig) => Promise<BridgeConfig>
      getTechDebtScore: (repoPath: string) => Promise<TechDebtScore>
      detectLanguages: (path: string) => Promise<Language[]>
      getRepositories: () => Promise<Repository[]>
      saveRepositories: (repos: Repository[]) => Promise<boolean>
      removeRepository: (path: string) => Promise<Repository[]>
      cleanupMissingRepos: () => Promise<Repository[]>
      getFileStats: (repoPath: string) => Promise<FileSizeStats>
      getCleanupReport: (repoPath: string) => Promise<CleanupReport>
      detectDeadCode: (repoPath: string) => Promise<DeadCodeReport>
      runFullScan: (repoPath: string) => Promise<FullScanResult>
      onFullScanProgress: (callback: (progress: { message: string; step: number; total: number }) => void) => () => void
      deleteDeadFile: (repoPath: string, relativePath: string) => Promise<boolean>
      cleanupDeadCode: (payload: { repoPath: string; deadFiles: string[]; unusedExports: DeadCodeExport[]; createPr?: boolean }) => Promise<any>
      getOutdatedPackages: (repoPath: string, language?: Language) => Promise<OutdatedPackage[]>
      runPatchBatch: (config: PatchBatchConfig) => Promise<PatchBatchResult>
      runNonBreakingUpdate: (config: NonBreakingUpdateConfig) => Promise<PatchBatchResult>
      runSecurityPatch: (config: SecurityPatchConfig) => Promise<SecurityPatchResult>
      pushBranch: (repoPath: string, branchName: string) => Promise<PushBranchResult>
      onPatchBatchProgress: (callback: (progress: { message: string; step: number; total: number }) => void) => () => void
      onPatchBatchWarning: (callback: (warning: { message: string; output: string }) => void) => () => void
      onPatchBatchLog: (callback: (entry: { message: string }) => void) => () => void
      onSecurityPatchProgress: (callback: (progress: { message: string; step: number; total: number }) => void) => () => void
      onSecurityPatchLog: (callback: (entry: { message: string }) => void) => () => void
      getRepoInfo: (repoPath: string) => Promise<RepoInfo>
      checkProtectedBranch: (repoPath: string) => Promise<boolean>
      predictMergeConflicts: (repoPath: string) => Promise<ConflictWarning[]>
      getGitHubCliStatus: (repoPath: string) => Promise<GitHubCliStatus>
      getScheduledJobs: () => Promise<ScheduledJob[]>
      addScheduledJob: (job: ScheduledJobCreateInput) => Promise<ScheduledJob>
      addScheduledJobsBatch: (jobs: ScheduledJobCreateInput[]) => Promise<ScheduledJob[]>
      updateScheduledJob: (jobId: string, updates: Partial<ScheduledJob>) => Promise<ScheduledJob | null>
      deleteScheduledJob: (jobId: string) => Promise<boolean>
      getJobResults: (jobId?: string) => Promise<JobResult[]>
      onSchedulerJobStarted: (callback: (data: { jobId: string; repoName: string }) => void) => () => void
      getSmartScanSchedules: () => Promise<SmartScanSchedule[]>
      addSmartScanSchedule: (payload: { repoPath: string; repoName: string }) => Promise<SmartScanSchedule>
      updateSmartScanSchedule: (id: string, updates: Partial<SmartScanSchedule>) => Promise<SmartScanSchedule | null>
      deleteSmartScanSchedule: (id: string) => Promise<boolean>
      onSmartScanStarted: (callback: (data: { id: string; repoName: string }) => void) => () => void
      checkSecurityScannerAvailable: () => Promise<boolean>
      runSecurityScan: (repoPath: string) => Promise<ScanResult>
      generateSecurityFix: (finding: SecurityFinding) => Promise<string | null>
      onSecurityScanProgress: (callback: (progress: ScanProgress) => void) => () => void
      getBridgeConsoleSettings: () => Promise<BridgeConsoleSettings>
      saveBridgeConsoleSettings: (settings: BridgeConsoleSettings) => Promise<BridgeConsoleSettings>
      testBridgeConsoleConnection: (settings: BridgeConsoleSettings) => Promise<{ ok: boolean; message?: string }>
      getAppSettings: () => Promise<AppSettings>
      saveAppSettings: (settings: Partial<AppSettings>) => Promise<AppSettings>
    }
  }
}
````

## File: src/types/index.ts
````typescript
export type Language = 'javascript' | 'python' | 'ruby' | 'elixir' | 'unknown'
export type ScheduleFrequency = 'hourly' | 'daily' | 'weekly' | 'monthly'

export interface Repository {
  path: string
  name: string
  languages: Language[]
  hasGit: boolean
  addedAt: string
  exists: boolean
}

export interface OutdatedPackage {
  name: string
  current: string
  wanted: string
  latest: string
  type: 'dependencies' | 'devDependencies'
  hasPatchUpdate: boolean
  isNonBreaking: boolean
  updateType: 'patch' | 'minor' | 'major' | 'unknown'
  language: Language
  vulnerabilities?: {
    critical: number
    high: number
    medium: number
    low: number
    total: number
  }
}

export interface FileEntry {
  name: string
  path: string
  isDirectory: boolean
  size?: number
  modified?: string
}

export interface RepoInfo {
  branch: string
  remote: string | null
  hasChanges: boolean
  isProtectedBranch: boolean
  defaultBranch: string
  ahead: number
  behind: number
}

export interface ConflictWarning {
  severity: 'high' | 'medium'
  message: string
  recommendation: string
  conflictingFiles: string[]
  behindBy: number
}

export interface GitHubCliStatus {
  installed: boolean
  authenticated: boolean
  account?: string
  message?: string
}

export interface PatchBatchConfig {
  repoPath: string
  branchName: string
  packages: { name: string; language: Language }[]
  createPR: boolean
  runTests: boolean
  baseBranch?: string
  remoteFirst?: boolean
  updateStrategy?: 'wanted' | 'latest'
  testCommand?: string
  testTimeoutMs?: number
  prTitle?: string
  prBody?: string
}

export interface NonBreakingUpdateConfig {
  repoPath: string
  branchName: string
  createPR: boolean
  runTests: boolean
  baseBranch?: string
  remoteFirst?: boolean
  pinnedPackages?: Record<string, string>
  selectedMajorPackages?: string[]
  testCommand?: string
  testTimeoutMs?: number
  prTitle?: string
  prBody?: string
}

export interface PatchBatchResult {
  success: boolean
  updatedPackages?: string[]
  failedPackages?: string[]
  prUrl?: string | null
  branchName?: string
  branchPushed?: boolean
  error?: string
  testsPassed?: boolean
  testOutput?: string
}

export interface SecurityPatchConfig {
  repoPath: string
  branchName: string
  createPR: boolean
  runTests: boolean
  baseBranch?: string
  remoteFirst?: boolean
  testCommand?: string
}

export interface BridgePatchConfig {
  createPR?: boolean
  runTests?: boolean
  testCommand?: string
  branchPrefix?: string
  baseBranch?: string
  remoteFirst?: boolean
}

export interface BridgeProjectConfig {
  baseBranch?: string
  branchPrefix?: string
  patch?: BridgePatchConfig
}

export interface BridgeProjectConfigResult {
  exists: boolean
  path: string
  config: BridgeProjectConfig
  errors: string[]
}

export interface SecurityPatchResult {
  success: boolean
  updatedPackages: string[]
  failedPackages: string[]
  prUrl?: string | null
  error?: string
  testsPassed?: boolean
}

export interface PushBranchResult {
  success: boolean
  error?: string
}

export interface LargeFile {
  path: string
  size: number
  sizeFormatted: string
  type: 'current' | 'git-history'
}

export interface OversizedComponent {
  path: string
  lines: number
  type: string
}

export interface CleanupReport {
  largeFiles: LargeFile[]
  gitHistoryFiles: LargeFile[]
  oversizedComponents: OversizedComponent[]
  totalWastedSpace: number
  totalWastedSpaceFormatted: string
}

export interface FileSizeStats {
  totalSize: number
  totalSizeFormatted: string
  fileCount: number
  largestFiles: LargeFile[]
}

export interface ScheduledJob {
  id: string
  repoPath: string
  repoName: string
  frequency: ScheduleFrequency
  intervalHours: number
  daysOfWeek: number[]
  dayOfMonth: number
  timeOfDay: string
  startAt: string
  enabled: boolean
  lastRun: string | null
  nextRun: string
  language: string
  createPR: boolean
  runTests: boolean
  createdAt: string
}

export interface ScheduledJobCreateInput {
  repoPath: string
  repoName: string
  frequency: ScheduleFrequency
  intervalHours?: number
  daysOfWeek?: number[]
  dayOfMonth?: number
  timeOfDay?: string
  startAt?: string
  enabled: boolean
  language: string
  createPR: boolean
  runTests: boolean
}

export interface SmartScanSchedule {
  id: string
  repoPath: string
  repoName: string
  enabled: boolean
  quietHour: number
  lastRun: string | null
  nextRun: string
  createdAt: string
}

export interface JobResult {
  jobId: string
  success: boolean
  timestamp: string
  updatedPackages: string[]
  prUrl?: string
  error?: string
  testsPassed?: boolean
}

export interface SecurityFinding {
  file: string
  line: number
  issue: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  code: string
  description: string
  cwe: string
  owasp: string
  solution?: string
  fixedCode?: string
}

export interface ScanResult {
  scanId: string
  repoPath: string
  totalFindings: number
  criticalCount: number
  highCount: number
  mediumCount: number
  lowCount: number
  findings: SecurityFinding[]
  scannedAt: string
  duration: number
}

export interface ScanProgress {
  status: 'scanning' | 'analyzing' | 'generating-fixes' | 'complete' | 'error'
  progress: number
  message: string
  currentFile?: string
}

export interface VulnerabilitySummary {
  critical: number
  high: number
  medium: number
  low: number
  total: number
}

export interface DependencyReport {
  outdated: OutdatedPackage[]
  vulnerabilities: VulnerabilitySummary
  installedPackages?: string[]
  error?: string
}

export interface CircularDependency {
  from: string
  to: string
  cycle: string[]
}

export interface CircularDependencyReport {
  count: number
  dependencies: CircularDependency[]
  error?: string
}

export interface DeadCodeExport {
  file: string
  exportName: string
}

export interface DeadCodeReport {
  deadFiles: string[]
  unusedExports: DeadCodeExport[]
  totalDeadCodeCount: number
  raw?: {
    knip?: string
    unimported?: string
  }
  error?: string
}

export interface BundleModule {
  name: string
  size: number
  sizeFormatted: string
}

export interface BundleAnalysisReport {
  totalSize: number
  totalSizeFormatted: string
  largestModules: BundleModule[]
  previousSize?: number
  delta?: number
  deltaPercent?: number
  warning?: boolean
  statsPath?: string
  error?: string
}

export interface TestCoverageReport {
  coveragePercentage: number | null
  uncoveredCriticalFiles: { file: string; coverage: number }[]
  summaryPath?: string
  error?: string
}

export interface DocumentationDebtReport {
  missingReadmeSections: string[]
  readmeOutdated: boolean
  daysSinceUpdate: number
  undocumentedFunctions: number
  error?: string
}

export interface ConsoleUploadResult {
  success: boolean
  tdScore?: number
  tdDelta?: number
  error?: string
}

export interface BridgeConfig {
  version: 1
  project: {
    name: string
    description?: string
    primaryLanguage: 'javascript' | 'typescript' | 'python' | 'ruby' | 'elixir' | 'go' | 'rust' | 'java' | 'multi'
    packageManager?: 'npm' | 'yarn' | 'pnpm' | 'pip' | 'poetry' | 'bundler' | 'mix' | 'cargo' | 'maven' | 'gradle'
    monorepo?: boolean
    workspacePatterns?: string[]
  }
  dependencies: {
    updatePolicy: {
      patch: 'auto' | 'review' | 'ignore'
      minor: 'auto' | 'review' | 'ignore'
      major: 'review' | 'ignore'
    }
    bannedPackages?: string[]
    requiredPackages?: string[]
    pinnedPackages?: Record<string, string>
    maxAge?: {
      patch: number
      minor: number
      major: number
    }
    securityPolicy: {
      autoFixCritical: boolean
      autoFixHigh: boolean
      blockOnCritical: boolean
      blockOnHigh: boolean
    }
  }
  gates: {
    tests: {
      required: boolean
      command?: string
      minCoverage?: number
      timeout?: number
    }
    lint: {
      required: boolean
      command?: string
    }
    build: {
      required: boolean
      command?: string
    }
    bundleSize?: {
      maxBytes?: number
      maxDeltaPercent?: number
    }
    circularDependencies: {
      maxAllowed: number
      failOnNew: boolean
    }
    deadCode: {
      maxUnusedExports: number
      maxDeadFiles: number
      failOnNew: boolean
    }
    documentation: {
      requireReadme: boolean
      requireChangelog: boolean
      maxDaysSinceReadmeUpdate?: number
    }
  }
  agent: {
    context: string
    conventions?: string[]
    avoidPatterns?: string[]
    preferredLibraries?: Record<string, string>
    reviewChecklist?: string[]
  }
  scoring?: {
    weights?: {
      dependencies?: number
      security?: number
      architecture?: number
      testing?: number
      documentation?: number
      codeHealth?: number
    }
    thresholds?: {
      maxOutdatedDeps?: number
      maxCircularDeps?: number
      maxDeadFiles?: number
      minTestCoverage?: number
      maxOversizedFiles?: number
      maxAvgFileComplexity?: number
      maxDebtScore?: number
    }
  }
  scan: {
    schedule?: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'manual'
    exclude?: string[]
    include?: string[]
    features: {
      dependencies: boolean
      security: boolean
      circularDeps: boolean
      deadCode: boolean
      bundleSize: boolean
      testCoverage: boolean
      documentation: boolean
      codeSmells: boolean
      fileAnalysis: boolean
    }
  }
  console?: {
    projectId?: string
    autoUpload: boolean
    uploadOn?: ('scan' | 'update' | 'schedule')[]
  }
}

export interface SecurityPatternFinding {
  file: string
  line: number
  column?: number
  severity: 'critical' | 'high' | 'medium' | 'low'
  category: string
  cwe?: string
  owasp?: string
  title: string
  description: string
  suggestion: string
  snippet: string
}

export interface DimensionScore {
  score: number
  weight: number
  weightedScore: number
  findings: string[]
  metrics: Record<string, number | string>
}

export interface DebtContributor {
  dimension: string
  description: string
  impact: number
  fixable: boolean
  effort: 'trivial' | 'small' | 'medium' | 'large'
}

export interface ActionItem {
  priority: number
  title: string
  description: string
  dimension: string
  impact: number
  effort: 'trivial' | 'small' | 'medium' | 'large'
  automatable: boolean
  command?: string
}

export interface TechDebtScore {
  total: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  trend: 'improving' | 'stable' | 'declining' | 'unknown'
  dimensions: {
    dependencies: DimensionScore
    security: DimensionScore
    architecture: DimensionScore
    testing: DimensionScore
    documentation: DimensionScore
    codeHealth: DimensionScore
  }
  topContributors: DebtContributor[]
  actionItems: ActionItem[]
}

export interface GateResult {
  name: string
  passed: boolean
  message: string
  severity: 'error' | 'warning' | 'info'
  details?: Record<string, any>
}

export interface BridgeScanReport {
  version: 1
  generatedAt: string
  generatedBy: 'bridge-desktop' | 'bridge-cli' | 'bridge-ci'
  repository: {
    path: string
    name: string
    url?: string
    branch?: string
    commit?: string
    language: string
    packageManager?: string
  }
  durationMs: number
  config: BridgeConfig
  techDebt: TechDebtScore
  dependencies: DependencyReport
  security: {
    vulnerabilities: VulnerabilitySummary
    patternFindings: SecurityPatternFinding[]
  }
  architecture: {
    circularDependencies: CircularDependencyReport
    deadCode: DeadCodeReport
    bundleSize: BundleAnalysisReport
    oversizedFiles: OversizedComponent[]
  }
  testing: {
    coverage: TestCoverageReport
    hasTests: boolean
    testCommand?: string
  }
  documentation: DocumentationDebtReport
  gates: {
    passed: boolean
    results: GateResult[]
  }
  agentDigest: {
    debtScore: number
    grade: string
    critical: string[]
    actions: ActionItem[]
    policies: {
      banned_present: string[]
      missing_required: string[]
      update_policy: BridgeConfig['dependencies']['updatePolicy']
    }
    conventions: string[]
    context: string
    outdated_summary: {
      total: number
      patch: number
      minor: number
      major: number
    }
  }
}

export interface FullScanResult {
  scanDate: string
  repository: string
  repositoryUrl?: string | null
  config: BridgeConfig
  dependencies: DependencyReport
  circularDependencies: CircularDependencyReport
  deadCode: DeadCodeReport
  bundleSize: BundleAnalysisReport
  testCoverage: TestCoverageReport
  documentation: DocumentationDebtReport
  securityPatterns: SecurityPatternFinding[]
  oversizedFiles: OversizedComponent[]
  codeHealth: {
    todoCount: number
    consoleLogCount: number
    commentedOutBlockCount: number
    mixedTabsSpaces: boolean
    inconsistentQuoteStyle: boolean
    hasLinter: boolean
    hasFormatter: boolean
    packageScriptsCount: number
    hasGitignore: boolean
  }
  techDebtScore: TechDebtScore
  scanReport?: BridgeScanReport
  reportPaths?: {
    latestReportPath: string
    latestScorePath: string
    archivePath: string
    configSnapshotPath: string
  }
  consoleUpload?: ConsoleUploadResult
  durationMs: number
}

export interface BridgeConsoleSettings {
  consoleUrl: string
  apiToken: string
  githubUsername: string
  autoUpload: boolean
}

export interface AppSettings {
  experimentalFeatures: boolean
  onboardingCompleted: boolean
}

export type View = 'dashboard' | 'files' | 'patch-batch' | 'cleanup' | 'scheduler' | 'security' | 'full-scan' | 'settings'
````

## File: src/components/PatchBatch/PatchBatch.tsx
````typescript
import { useEffect, useMemo, useState } from 'react'
import { useRepositories } from '../../contexts/RepositoryContext'
import type { BridgeConfig, BridgeProjectConfigResult, ConflictWarning, OutdatedPackage, PatchBatchResult, SecurityPatchResult } from '../../types'
import Scheduler from '../Scheduler/Scheduler'

export default function PatchBatch() {
  const { selectedRepo } = useRepositories()
  const [packages, setPackages] = useState<OutdatedPackage[]>([])
  const [selectedMajorPackages, setSelectedMajorPackages] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<{ message: string; step: number; total: number } | null>(null)
  const [result, setResult] = useState<PatchBatchResult | null>(null)
  const [projectConfig, setProjectConfig] = useState<BridgeProjectConfigResult | null>(null)
  const [bridgeConfig, setBridgeConfig] = useState<BridgeConfig | null>(null)

  const [branchName, setBranchName] = useState('bridge-update-deps')
  const [repoInfo, setRepoInfo] = useState<{ branch: string; isProtectedBranch: boolean } | null>(null)
  const [conflictWarnings, setConflictWarnings] = useState<ConflictWarning[]>([])
  const [outputLines, setOutputLines] = useState<string[]>([])
  const [testCommand, setTestCommand] = useState('')
  const [testCommandDetected, setTestCommandDetected] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [showScheduler, setShowScheduler] = useState(false)
  const [createPrEnabled, setCreatePrEnabled] = useState(false)

  const [securityRunning, setSecurityRunning] = useState(false)
  const [securityProgress, setSecurityProgress] = useState<{ message: string; step: number; total: number } | null>(null)
  const [securityResult, setSecurityResult] = useState<SecurityPatchResult | null>(null)
  const [securityLogs, setSecurityLogs] = useState<string[]>([])
  const [pushingBranch, setPushingBranch] = useState(false)
  const [pushMessage, setPushMessage] = useState<string | null>(null)
  const [dependencyDebtDelta, setDependencyDebtDelta] = useState<{ before: number; after: number; delta: number } | null>(null)

  const patchConfig = projectConfig?.config.patch
  const runTestsOnRun = patchConfig?.runTests ?? true
  const configuredBaseBranch = patchConfig?.baseBranch || projectConfig?.config.baseBranch
  const remoteFirst = patchConfig?.remoteFirst ?? true
  const runTests = runTestsOnRun
  const updatePolicy = bridgeConfig?.dependencies.updatePolicy || { patch: 'auto', minor: 'auto', major: 'review' }

  const getPackageKey = (pkg: OutdatedPackage) => `${pkg.language}:${pkg.name}`
  const estimateDependencyDebt = (list: OutdatedPackage[]) => {
    return list.reduce((sum, pkg) => {
      const updatePoints = pkg.updateType === 'patch' ? 1 : pkg.updateType === 'minor' ? 2 : pkg.updateType === 'major' ? 5 : 0
      const vulnPoints = (pkg.vulnerabilities?.critical || 0) * 2 + (pkg.vulnerabilities?.high || 0)
      return sum + updatePoints + vulnPoints
    }, 0)
  }

  const nonBreakingPackages = useMemo(
    () => packages.filter(pkg => pkg.isNonBreaking),
    [packages]
  )
  const majorPackages = useMemo(
    () => packages.filter(pkg => pkg.updateType === 'major'),
    [packages]
  )
  const sortedPackages = useMemo(() => {
    const order: Record<OutdatedPackage['updateType'], number> = {
      patch: 0,
      minor: 1,
      major: 2,
      unknown: 3
    }
    return [...packages].sort((a, b) => {
      const aAuto = a.isNonBreaking ? 0 : 1
      const bAuto = b.isNonBreaking ? 0 : 1
      if (aAuto !== bAuto) return aAuto - bAuto
      if (order[a.updateType] !== order[b.updateType]) {
        return order[a.updateType] - order[b.updateType]
      }
      return a.name.localeCompare(b.name)
    })
  }, [packages])

  const getUpdateTypeBadgeClass = (updateType: OutdatedPackage['updateType']) => {
    switch (updateType) {
      case 'major':
        return 'badge-warning'
      case 'minor':
        return 'badge-accent'
      case 'patch':
        return 'badge-success'
      default:
        return 'badge'
    }
  }

  useEffect(() => {
    if (selectedRepo) {
      void loadProjectConfig()
      void loadOutdatedPackages()
      void loadRepoInfo()
      void detectTestCommand()
      void loadMergeConflictWarnings()
    }
  }, [selectedRepo])

  useEffect(() => {
    const cleanupProgress = window.bridge.onPatchBatchProgress(setProgress)
    const cleanupLog = window.bridge.onPatchBatchLog(({ message }) => {
      setOutputLines(prev => [...prev, message])
    })
    const cleanupWarning = window.bridge.onPatchBatchWarning(({ message, output }) => {
      const lines = output ? output.split(/\r?\n/).filter(line => line.trim()) : []
      setOutputLines(prev => [...prev, `WARN: ${message}`, ...lines])
    })
    const cleanupSecurityProgress = window.bridge.onSecurityPatchProgress(setSecurityProgress)
    const cleanupSecurityLog = window.bridge.onSecurityPatchLog(({ message }) => {
      setSecurityLogs(prev => [...prev, message])
    })

    return () => {
      cleanupProgress()
      cleanupLog()
      cleanupWarning()
      cleanupSecurityProgress()
      cleanupSecurityLog()
    }
  }, [])

  const loadRepoInfo = async () => {
    if (!selectedRepo) return
    try {
      const info = await window.bridge.getRepoInfo(selectedRepo.path)
      setRepoInfo(info)
    } catch {
      setRepoInfo(null)
    }
  }

  const loadProjectConfig = async () => {
    if (!selectedRepo) return
    try {
      const [config, fullConfig] = await Promise.all([
        window.bridge.getBridgeProjectConfig(selectedRepo.path),
        window.bridge.loadBridgeConfig(selectedRepo.path)
      ])
      setProjectConfig(config)
      setBridgeConfig(fullConfig)
      setCreatePrEnabled(config.config.patch?.createPR ?? false)
      const configuredBranchPrefix = config.config.patch?.branchPrefix || config.config.branchPrefix
      if (configuredBranchPrefix) {
        setBranchName(configuredBranchPrefix)
      }
      const configuredTestCommand = config.config.patch?.testCommand || fullConfig.gates.tests.command
      if (configuredTestCommand) {
        setTestCommand(configuredTestCommand)
        setTestCommandDetected(false)
      }
    } catch {
      setProjectConfig(null)
      setBridgeConfig(null)
      setCreatePrEnabled(false)
    }
  }

  const detectTestCommand = async () => {
    if (!selectedRepo) return
    try {
      const [project, full] = await Promise.all([
        window.bridge.getBridgeProjectConfig(selectedRepo.path),
        window.bridge.loadBridgeConfig(selectedRepo.path)
      ])
      const configuredCommand = project.config.patch?.testCommand || full.gates.tests.command
      if (configuredCommand) {
        setTestCommand(configuredCommand)
        setTestCommandDetected(false)
        return
      }
    } catch {}

    const primaryLang = selectedRepo.languages?.[0] || 'javascript'
    const defaultTestCommands: Record<string, string> = {
      python: 'pytest',
      ruby: 'bundle exec rspec',
      elixir: 'mix test'
    }

    try {
      const [packageJsonRaw, files] = await Promise.all([
        window.bridge.readFile(`${selectedRepo.path}/package.json`),
        window.bridge.readDirectory(selectedRepo.path)
      ])

      const packageJson = JSON.parse(packageJsonRaw)
      const hasTestScript = Boolean(packageJson?.scripts?.test && String(packageJson.scripts.test).trim())

      if (!hasTestScript) {
        setTestCommand('')
        setTestCommandDetected(false)
        return
      }

      const fileNames = new Set(files.map(file => file.name))
      let packageManager = 'npm'
      if (fileNames.has('pnpm-lock.yaml')) {
        packageManager = 'pnpm'
      } else if (fileNames.has('yarn.lock')) {
        packageManager = 'yarn'
      }

      setTestCommand(`${packageManager} test`)
      setTestCommandDetected(true)
    } catch {
      if (defaultTestCommands[primaryLang]) {
        setTestCommand(defaultTestCommands[primaryLang])
        setTestCommandDetected(true)
      } else {
        setTestCommand('')
        setTestCommandDetected(false)
      }
    }
  }

  const loadMergeConflictWarnings = async () => {
    if (!selectedRepo || !selectedRepo.hasGit) {
      setConflictWarnings([])
      return
    }

    try {
      const warnings = await window.bridge.predictMergeConflicts(selectedRepo.path)
      setConflictWarnings(warnings)
    } catch {
      setConflictWarnings([])
    }
  }

  const loadOutdatedPackages = async (options?: { preserveResult?: boolean }): Promise<OutdatedPackage[] | null> => {
    if (!selectedRepo) return null

    setLoading(true)
    if (!options?.preserveResult) {
      setResult(null)
    }
    setLoadError(null)

    try {
      const [outdated, fullConfig] = await Promise.all([
        window.bridge.getOutdatedPackages(selectedRepo.path),
        window.bridge.loadBridgeConfig(selectedRepo.path)
      ])

      setBridgeConfig(fullConfig)
      const policy = fullConfig.dependencies.updatePolicy
      const filtered = outdated.filter(pkg => {
        if (pkg.updateType === 'patch' && policy.patch === 'ignore') return false
        if (pkg.updateType === 'minor' && policy.minor === 'ignore') return false
        if (pkg.updateType === 'major' && policy.major === 'ignore') return false
        return true
      })

      setPackages(filtered)

      const autoSelectedMajors = filtered
        .filter(pkg => pkg.updateType === 'major')
        .filter(pkg => (pkg.vulnerabilities?.critical || 0) > 0 || (pkg.vulnerabilities?.high || 0) > 0)
        .map(getPackageKey)
      setSelectedMajorPackages(new Set(autoSelectedMajors))
      return filtered
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load outdated packages'
      setLoadError(message)
      setPackages([])
      setSelectedMajorPackages(new Set())
      return null
    } finally {
      setLoading(false)
    }
  }

  const toggleMajorPackage = (pkg: OutdatedPackage) => {
    if (pkg.updateType !== 'major') return
    const key = getPackageKey(pkg)
    const next = new Set(selectedMajorPackages)
    if (next.has(key)) {
      next.delete(key)
    } else {
      next.add(key)
    }
    setSelectedMajorPackages(next)
  }

  const runSelectedUpdates = async () => {
    if (!selectedRepo) return

    if (!selectedRepo.hasGit) {
      setResult({ success: false, error: "Git not initialized - run 'git init' first." })
      return
    }

    if (nonBreakingPackages.length === 0 && selectedMajorPackages.size === 0) {
      setResult({ success: false, error: 'No dependency updates selected.' })
      return
    }

    if (createPrEnabled) {
      const ghStatus = await window.bridge.getGitHubCliStatus(selectedRepo.path)
      if (!ghStatus.installed || !ghStatus.authenticated) {
        setResult({
          success: false,
          error: ghStatus.message || 'PR creation requires GitHub CLI. Install with `brew install gh` and run `gh auth login`.'
        })
        return
      }
    }

    setRunning(true)
    setProgress(null)
    setResult(null)
    setDependencyDebtDelta(null)
    setOutputLines([])
    const beforeDependencyDebt = estimateDependencyDebt(packages)

    try {
      const nextResult = await window.bridge.runNonBreakingUpdate({
        repoPath: selectedRepo.path,
        branchName: `${branchName}-non-breaking-${Date.now()}`,
        createPR: createPrEnabled,
        runTests: runTestsOnRun,
        baseBranch: configuredBaseBranch,
        remoteFirst,
        selectedMajorPackages: majorPackages
          .filter(pkg => selectedMajorPackages.has(getPackageKey(pkg)))
          .map(pkg => pkg.name),
        testCommand: testCommand.trim() || undefined,
        prTitle: 'chore(deps): apply non-breaking dependency updates',
        prBody: 'Automated patch/minor dependency updates via Bridge.'
      })

      setResult(nextResult)

      if (nextResult.success) {
        const refreshedPackages = await loadOutdatedPackages({ preserveResult: true })
        await loadRepoInfo()
        await loadMergeConflictWarnings()
        if (refreshedPackages) {
          const afterDependencyDebt = estimateDependencyDebt(refreshedPackages)
          setDependencyDebtDelta({
            before: beforeDependencyDebt,
            after: afterDependencyDebt,
            delta: afterDependencyDebt - beforeDependencyDebt
          })
        }
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Non-breaking update failed'
      })
    } finally {
      setRunning(false)
      setProgress(null)
    }
  }

  const runSecurityPatch = async () => {
    if (!selectedRepo) return

    setSecurityRunning(true)
    setSecurityProgress(null)
    setSecurityResult(null)
    setSecurityLogs([])

    try {
      const nextResult = await window.bridge.runSecurityPatch({
        repoPath: selectedRepo.path,
        branchName: `bridge-security-patch-${Date.now()}`,
        createPR: false,
        runTests,
        baseBranch: configuredBaseBranch,
        remoteFirst,
        testCommand: testCommand.trim() || undefined
      })

      setSecurityResult(nextResult)

      if (nextResult.success) {
        await loadOutdatedPackages({ preserveResult: true })
        await loadRepoInfo()
        await loadMergeConflictWarnings()
      }
    } catch (error) {
      setSecurityResult({
        success: false,
        updatedPackages: [],
        failedPackages: [],
        error: error instanceof Error ? error.message : 'Security patch failed'
      })
    } finally {
      setSecurityRunning(false)
      setSecurityProgress(null)
    }
  }

  if (!selectedRepo) {
    return (
      <div className="empty-state fade-in">
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 12a9 9 0 11-9-9" />
          <path d="M21 3v6h-6" />
        </svg>
        <h3 className="empty-state-title">No repository selected</h3>
        <p className="empty-state-desc">Select a repository from the sidebar to update packages</p>
      </div>
    )
  }

  if ((selectedRepo.languages?.length ?? 0) === 0) {
    return (
      <div className="empty-state fade-in">
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h3 className="empty-state-title">No package manager detected</h3>
        <p className="empty-state-desc">This repository does not have a supported dependency manifest.</p>
      </div>
    )
  }

  const isJavascriptRepo = (selectedRepo.languages ?? []).includes('javascript')
  const canPushResultBranch = Boolean(result?.success && result?.branchName && !result?.prUrl && !result?.branchPushed)

  const pushResultBranch = async () => {
    if (!selectedRepo || !result?.branchName || pushingBranch) return

    setPushingBranch(true)
    setPushMessage(null)
    try {
      const response = await window.bridge.pushBranch(selectedRepo.path, result.branchName)
      if (response.success) {
        setPushMessage(`Branch '${result.branchName}' pushed successfully.`)
        setOutputLines(prev => [...prev, `✓ Pushed ${result.branchName} to origin`])
      } else {
        const message = response.error || 'Failed to push branch'
        setPushMessage(message)
        setOutputLines(prev => [...prev, `✗ ${message}`])
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to push branch'
      setPushMessage(message)
      setOutputLines(prev => [...prev, `✗ ${message}`])
    } finally {
      setPushingBranch(false)
    }
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <div className="patch-header">
          <div>
            <h2 style={{ marginBottom: '4px' }}>Update Dependencies</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              One click runs pull latest, test, clean install script, test, commit, and push from remote source-of-truth.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => void loadOutdatedPackages()} disabled={loading}>
            {loading ? <div className="spinner" style={{ width: '14px', height: '14px' }} /> : 'Refresh'}
          </button>
        </div>

        {!selectedRepo.hasGit && (
          <div className="card" style={{ marginBottom: '16px', borderColor: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)' }}>
            <div style={{ color: 'var(--error)', fontWeight: 500 }}>
              Git not initialized - run 'git init' first.
            </div>
          </div>
        )}

        {repoInfo?.isProtectedBranch && (
          <div className="card" style={{ marginBottom: '16px', borderColor: 'var(--warning)', background: 'rgba(245, 158, 11, 0.1)' }}>
            <div style={{ color: 'var(--warning)' }}>
              You're on <strong>{repoInfo.branch}</strong> (protected). Bridge will create a new branch automatically.
            </div>
          </div>
        )}

        {conflictWarnings.map((warning, index) => (
          <div
            key={`${warning.message}-${index}`}
            className="card"
            style={{
              marginBottom: '16px',
              borderColor: warning.severity === 'high' ? 'var(--error)' : 'var(--warning)',
              background: warning.severity === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)'
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: '8px' }}>Merge conflict risk</div>
            <div style={{ marginBottom: '8px' }}>{warning.message}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{warning.recommendation}</div>
          </div>
        ))}

        {loadError && (
          <div className="card" style={{ marginBottom: '16px', borderColor: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)' }}>
            <div style={{ color: 'var(--error)' }}>{loadError}</div>
          </div>
        )}

        {projectConfig?.exists && (
          <div className="card" style={{ marginBottom: '16px', borderColor: 'var(--accent)' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Using config: <code>{projectConfig.path}</code>
            </div>
            <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
              Base branch: {configuredBaseBranch || 'origin HEAD'} · Remote-first: {remoteFirst ? 'enabled' : 'disabled'} · Mode: {createPrEnabled ? 'Push + PR' : 'Push only'}
            </div>
            {bridgeConfig && (
              <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                Update policy: patch {updatePolicy.patch}, minor {updatePolicy.minor}, major {updatePolicy.major}
              </div>
            )}
            {projectConfig.errors.length > 0 && (
              <div style={{ marginTop: '6px', color: 'var(--warning)', fontSize: '12px' }}>
                Config warning: {projectConfig.errors.join('; ')}
              </div>
            )}
          </div>
        )}

        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="card-header">
            <h3 className="card-title">All Outdated Dependencies</h3>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => void runSelectedUpdates()}
              disabled={running || (!selectedRepo.hasGit) || (nonBreakingPackages.length === 0 && selectedMajorPackages.size === 0)}
            >
              {running
                ? 'Running...'
                : createPrEnabled
                  ? `One Click Update + PR (${selectedMajorPackages.size} Major Selected)`
                  : `Update/Test/Commit/Push (${selectedMajorPackages.size} Major Selected)`}
            </button>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '10px' }}>
            Patch/minor updates follow `.bridge.json` policy. Major updates remain manual, except packages with critical/high vulnerabilities.
          </p>
          {packages.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              No outdated dependencies detected.
            </div>
          ) : (
            <div className="package-table-wrapper">
              <table className="package-table">
                <thead>
                  <tr>
                    <th />
                    <th>Package Name</th>
                    <th>Current</th>
                    <th>Wanted</th>
                    <th>Latest</th>
                    <th>Update Type</th>
                    <th>Type</th>
                    <th>Vulns</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPackages.map(pkg => {
                    const key = getPackageKey(pkg)
                    const isMajor = pkg.updateType === 'major'
                    const isChecked = pkg.isNonBreaking || selectedMajorPackages.has(key)
                    const isDisabled = !isMajor
                    return (
                      <tr
                        key={`all-${key}`}
                        className={isChecked ? 'selected' : ''}
                        onClick={() => {
                          if (isMajor) {
                            toggleMajorPackage(pkg)
                          }
                        }}
                      >
                        <td>
                          <div className={`checkbox ${isChecked ? 'checked' : ''}`} style={isDisabled ? { opacity: 0.6 } : undefined}>
                            {isChecked && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="package-name-cell">
                            <div className="package-name">{pkg.name}</div>
                          </div>
                        </td>
                        <td>{pkg.current}</td>
                        <td>{pkg.wanted}</td>
                        <td className="version-new">{pkg.latest}</td>
                        <td>
                          <span className={`badge ${getUpdateTypeBadgeClass(pkg.updateType)}`}>
                            {pkg.updateType}
                          </span>
                        </td>
                        <td>{pkg.type === 'devDependencies' ? 'devDep' : 'dep'}</td>
                        <td>
                          {(pkg.vulnerabilities?.total || 0) > 0 ? (
                            <span className="badge badge-warning">
                              C{pkg.vulnerabilities?.critical || 0} H{pkg.vulnerabilities?.high || 0} M{pkg.vulnerabilities?.medium || 0} L{pkg.vulnerabilities?.low || 0}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-tertiary)' }}>0</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="card-header">
            <h3 className="card-title">Security Vulnerability Auto-Patcher</h3>
            <button className="btn btn-primary btn-sm" onClick={() => void runSecurityPatch()} disabled={securityRunning || !selectedRepo.hasGit}>
              {securityRunning ? 'Patching...' : 'Patch High/Critical'}
            </button>
          </div>
          {securityProgress && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', marginBottom: '6px' }}>{securityProgress.message}</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(securityProgress.step / securityProgress.total) * 100}%` }} />
              </div>
            </div>
          )}
          {securityResult && (
            <div className="card" style={{
              borderColor: securityResult.success ? 'var(--success)' : 'var(--error)',
              background: securityResult.success ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              padding: '12px'
            }}>
              {securityResult.success ? 'Security patch run succeeded.' : securityResult.error || 'Security patch failed.'}
            </div>
          )}
          {securityLogs.length > 0 && (
            <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
              {securityLogs.slice(-4).map((line, i) => <div key={`${line}-${i}`}>{line}</div>)}
            </div>
          )}
        </div>

        {result && (
          <div
            className="card"
            style={{
              marginBottom: '16px',
              borderColor: result.success ? 'var(--success)' : 'var(--error)',
              background: result.success ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'
            }}
          >
            {result.success ? (
              <div>
                <div style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--success)' }}>
                  {result.prUrl
                    ? 'PR created successfully.'
                    : result.branchPushed
                      ? `Changes committed and pushed on '${result.branchName}'.`
                      : `Changes committed locally on '${result.branchName}' and ready to push.`}
                </div>
                {result.prUrl && (
                  <div style={{ fontSize: '13px' }}>
                    PR: <a href={result.prUrl} target="_blank" rel="noopener noreferrer">{result.prUrl}</a>
                  </div>
                )}
                {dependencyDebtDelta && (
                  <div style={{ fontSize: '13px', marginTop: '6px' }}>
                    Dependency debt: {dependencyDebtDelta.before} → {dependencyDebtDelta.after}{' '}
                    <strong style={{ color: dependencyDebtDelta.delta <= 0 ? 'var(--success)' : 'var(--error)' }}>
                      ({dependencyDebtDelta.delta >= 0 ? '+' : ''}{dependencyDebtDelta.delta})
                    </strong>
                  </div>
                )}
                {canPushResultBranch && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => void pushResultBranch()} disabled={pushingBranch}>
                      {pushingBranch ? 'Pushing...' : 'Push Branch'}
                    </button>
                    {pushMessage && (
                      <span style={{ fontSize: '12px', color: pushMessage.includes('successfully') ? 'var(--success)' : 'var(--error)' }}>
                        {pushMessage}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ color: 'var(--error)' }}>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                  {result.testsPassed === false ? 'Tests failed - no PR created' : 'Update failed'}
                </div>
                <div style={{ fontSize: '13px' }}>{result.error}</div>
              </div>
            )}
          </div>
        )}

        {running && progress && (
          <div className="card" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div className="spinner" />
              <span>{progress.message}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(progress.step / progress.total) * 100}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Configuration</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label className="simple-checkbox">
            <input
              type="checkbox"
              checked={createPrEnabled}
              onChange={e => setCreatePrEnabled(e.target.checked)}
            />
            <span className="checkbox-label">Create Pull Request (requires GitHub CLI)</span>
          </label>
          {createPrEnabled && (
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              If needed: <code>brew install gh</code> then <code>gh auth login</code>.
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Branch name prefix
            </label>
            <input
              type="text"
              className="input"
              value={branchName}
              onChange={e => setBranchName(e.target.value)}
              placeholder="bridge-update-deps"
              style={{ maxWidth: '320px' }}
            />
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {runTests ? 'Tests run before and after updates.' : 'Tests are disabled via .bridge.json for this repo.'}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Test command
            </label>
            <input
              type="text"
              className="input"
              value={testCommand}
              onChange={e => {
                setTestCommand(e.target.value)
                if (testCommandDetected) {
                  setTestCommandDetected(false)
                }
              }}
              placeholder="npm test"
            />
            {runTests && testCommandDetected && (
              <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                Detected command: {testCommand}
              </div>
            )}
            {runTests && isJavascriptRepo && !testCommandDetected && (
              <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--warning)' }}>
                No root test script found. Bridge will still attempt workspace validation scripts.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Live Output</h3>
        </div>
        <div className="output-panel">
          {outputLines.length === 0 ? (
            <div style={{ color: 'var(--text-tertiary)' }}>No output yet. Run an update to see progress here.</div>
          ) : (
            outputLines.map((line, index) => (
              <div key={`${line}-${index}`} className="output-line">{line}</div>
            ))
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">Scheduler</h3>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Set it and forget it. Schedule updates for any repo.
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowScheduler(!showScheduler)}>
            {showScheduler ? 'Hide Scheduler' : 'Show Scheduler'}
          </button>
        </div>
        {showScheduler && (
          <div style={{ paddingTop: '12px' }}>
            <Scheduler />
          </div>
        )}
      </div>
    </div>
  )
}
````
