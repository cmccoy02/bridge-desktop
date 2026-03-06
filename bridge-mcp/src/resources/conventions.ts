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
