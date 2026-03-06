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
