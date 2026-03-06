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
