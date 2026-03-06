# Bridge MCP

Bridge MCP is a standalone [Model Context Protocol](https://modelcontextprotocol.io/) server that gives coding agents repo health and tech debt intelligence before they write code.

It is designed for fast pre-task context and post-change validation:
- Pre-task: `bridge_get_context`
- Validation: `bridge_check_gates`
- Full refresh: `bridge_scan`
- Bootstrap: `bridge_init`
- Package policy check: `bridge_check_package`
- Dependency policy dry-run: `bridge_update_deps`

## Features

- Standalone Node.js package (`node build/index.js`)
- Stdio MCP transport for Claude Code/Cursor
- `.bridge.json` project config loader + generator
- Lightweight analyzer (dependency drift, vulnerabilities, file stats, TODO debt, circular deps, language profile)
- Weighted tech debt score with grade and prioritized actions
- Quality gate evaluation for security and repo policy checks
- Cache artifacts under `.bridge/` for fast context responses

## Installation

```bash
cd bridge-mcp
npm install
npm run build
```

Run directly:

```bash
node build/index.js
```

## Claude Code MCP Config Example

Use `bridge-mcp/.mcp.json` as a template and replace path as needed.

```json
{
  "mcpServers": {
    "bridge": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/bridge-mcp/build/index.js"]
    }
  }
}
```

## Tools

### `bridge_get_context`
Input:
```json
{ "repo_path": "/path/to/repo", "focus": "security" }
```

Returns condensed repo context:
- debt score and grade
- critical issues
- top recommended actions
- conventions and avoid patterns
- outdated summary
- gate pass/fail snapshot

Behavior:
- Uses `.bridge/latest-scan.json` cache when fresh (< 24h)
- Falls back to live analysis when cache is missing/stale
- Writes `.bridge/latest-context.json`, `.bridge/latest-score.json`

### `bridge_init`
Input:
```json
{ "repo_path": "/path/to/repo" }
```

Generates `.bridge.json` with autodetected defaults and creates `.bridge/`.

### `bridge_check_gates`
Input:
```json
{ "repo_path": "/path/to/repo" }
```

Runs analysis and evaluates configured gates.

### `bridge_scan`
Input:
```json
{ "repo_path": "/path/to/repo" }
```

Runs analysis and writes:
- `.bridge/latest-scan.json`
- `.bridge/latest-score.json`

### `bridge_check_package`
Input:
```json
{ "repo_path": "/path/to/repo", "package_name": "moment" }
```

Checks package policy before install:
- banned package enforcement
- preferred-library alternative guidance
- npm deprecation metadata warnings
- install recommendation

### `bridge_update_deps`
Input:
```json
{ "repo_path": "/path/to/repo" }
```

Dry-run dependency policy plan:
- what would update automatically
- what would be skipped by policy
- what is pinned in `.bridge.json`
- recommendation summary

## Resources

### `bridge://conventions`
Returns `agent` conventions from `.bridge.json`.

Optional query param:
- `repo_path=/absolute/path`

### `bridge://score`
Returns cached score from `.bridge/latest-score.json`.

Optional query param:
- `repo_path=/absolute/path`

## Cache Files

Bridge writes cache under `<repo>/.bridge/`:
- `latest-scan.json`
- `latest-score.json`
- `latest-context.json`

## Development

```bash
cd bridge-mcp
npm run dev
```

## Notes

- MCP JSON-RPC uses stdout. Bridge MCP logs only to stderr.
- Analyzer commands are time-limited and degrade gracefully when tools are missing.
