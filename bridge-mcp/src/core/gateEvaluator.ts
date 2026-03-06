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
