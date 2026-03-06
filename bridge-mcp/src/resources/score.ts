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
