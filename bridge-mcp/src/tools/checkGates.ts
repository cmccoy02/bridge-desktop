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
