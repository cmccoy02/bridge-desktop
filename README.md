# Bridge-Desktop

Local-first technical debt automation for engineers.

Bridge runs directly against repositories that already exist on your machine. It avoids GitHub API onboarding and uses your existing local git + optional `gh` authentication.

## 5-Minute Onboarding

1. Install and open Bridge.
2. Select your code directory (for example `~/code`).
3. Pick a repository.
4. Run **Update Dependencies**:
   - **Non-Breaking Updates**: one click for patch + minor updates.
   - **Major Updates**: manual per-package selection.
5. Optional: turn on PR creation (off by default) if `gh` is installed and authenticated.

The Dashboard includes a first-run checklist and preflight checks.

## Current Capabilities

- Local repository discovery (no GitHub API required).
- One-click non-breaking dependency update workflow using:
  - `rm -rf node_modules package-lock.json; npm install; npm update; rm -rf node_modules package-lock.json; npm install;`
- Major-version package updates with explicit selection.
- Isolated update workspaces via `git worktree` so local unstaged changes stay untouched.
- Optional test and lint verification before commit/PR.
- Optional PR creation through GitHub CLI (`gh`).
- Merge conflict risk prediction based on branch divergence.
- Scheduled dependency updates.
- Optional Bridge-Console metrics upload.

## Experimental Features

Default: **disabled**.

When enabled in Settings:
- Full TD Scan
- Security Scan
- Smart TD Scans

## Development

```bash
npm install
npm run dev
```

Build app + DMG:

```bash
npm run build
```

Unsigned local build:

```bash
npm run build:unsigned
```

## macOS Signing + Notarization

Bridge is configured for hardened runtime, entitlements, and an `afterSign` notarization hook.

Set these environment variables in CI or your release shell:

- `APPLE_ID`
- `APPLE_APP_SPECIFIC_PASSWORD`
- `APPLE_TEAM_ID`
- `CSC_LINK` (certificate)
- `CSC_KEY_PASSWORD`

If Apple notarization variables are missing, build still succeeds but notarization is skipped.

## Requirements

- macOS
- Node.js 18+
- Git
- Optional for PR creation: GitHub CLI (`gh`) authenticated with `gh auth login`
