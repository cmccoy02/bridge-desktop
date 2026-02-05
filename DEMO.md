# Bridge Desktop - Quick Demo

## Install & Run
1. Clone this repo
2. `npm install`
3. `npm run dev`

## Test It
1. Open Bridge Desktop
2. Click "Import Repository"
3. Point it at any repo with package.json
4. Click "Update Dependencies"
5. Select packages to update
6. Click "Run Update" (tests will run automatically)
7. Check the terminal output
8. See the PR created (if tests passed)

## What Makes This Different from Dependabot
- Runs YOUR tests in YOUR environment
- Only creates PR if tests actually pass
- Uses package lock as source of truth
- No blind automation - you see what it's doing
