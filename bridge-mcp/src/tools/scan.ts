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
