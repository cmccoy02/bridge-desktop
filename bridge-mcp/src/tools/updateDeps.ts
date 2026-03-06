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
