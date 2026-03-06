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
