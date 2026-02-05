# Bridge

Dependency updates you can actually trust. Bridge validates patch updates locally before creating PRs.

## Quick Start (macOS)

1. Download `Bridge-0.1.0-arm64.dmg` from [releases/](./releases/)
2. Open the DMG and drag Bridge to Applications
3. Right-click Bridge > Open (first time only, to bypass Gatekeeper)
4. Import a repository and start updating

## What It Does

- **Patch Batch**: Select patch updates, Bridge runs your tests locally, then creates a PR only if everything passes
- **Security Scanner**: Scan for vulnerabilities with one click
- **Scheduler**: Automate patch updates on a schedule
- **Cleanup**: Find large files and oversized components

## Why Bridge?

Dependabot says "100% compatible" but breaks things. Bridge runs actual lint/build/tests locally before pushing anything.

## Supported Languages

- JavaScript (npm)
- Python (pip)
- Ruby (bundler)
- Elixir (mix)

## Development

```bash
npm install
npm run dev          # Dev server
npm run build        # Production build + DMG
```

## Requirements

- macOS (Apple Silicon)
- Node.js 18+
- Git
- `gh` CLI (for PR creation)
