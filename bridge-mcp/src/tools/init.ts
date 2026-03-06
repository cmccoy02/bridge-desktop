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
