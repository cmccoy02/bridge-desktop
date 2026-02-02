"use strict";
const electron = require("electron");
const path = require("path");
const Store = require("electron-store");
const fs = require("fs/promises");
const child_process = require("child_process");
const util = require("util");
const execAsync$4 = util.promisify(child_process.exec);
async function detectLanguages(repoPath) {
  const languages = [];
  const checks = [
    { file: "package.json", lang: "javascript" },
    { file: "requirements.txt", lang: "python" },
    { file: "Pipfile", lang: "python" },
    { file: "pyproject.toml", lang: "python" },
    { file: "Gemfile", lang: "ruby" },
    { file: "mix.exs", lang: "elixir" }
  ];
  for (const check of checks) {
    try {
      await fs.access(path.join(repoPath, check.file));
      if (!languages.includes(check.lang)) {
        languages.push(check.lang);
      }
    } catch {
    }
  }
  return languages;
}
async function getPythonOutdated(repoPath) {
  const packages = [];
  try {
    const reqPath = path.join(repoPath, "requirements.txt");
    const content = await fs.readFile(reqPath, "utf-8");
    const lines = content.split("\n").filter((l) => l.trim() && !l.startsWith("#"));
    const installed = /* @__PURE__ */ new Map();
    for (const line of lines) {
      const match = line.match(/^([a-zA-Z0-9_-]+)==([0-9.]+)/);
      if (match) {
        installed.set(match[1].toLowerCase(), match[2]);
      }
    }
    try {
      const { stdout } = await execAsync$4("pip list --outdated --format=json", {
        cwd: repoPath,
        timeout: 6e4
      });
      const outdated = JSON.parse(stdout || "[]");
      for (const pkg of outdated) {
        const name = pkg.name.toLowerCase();
        if (installed.has(name)) {
          const current = pkg.version;
          const latest = pkg.latest_version;
          const currentParts = current.split(".").map(Number);
          const latestParts = latest.split(".").map(Number);
          const hasPatchUpdate = currentParts[0] === latestParts[0] && currentParts[1] === latestParts[1] && (currentParts[2] || 0) < (latestParts[2] || 0);
          packages.push({
            name: pkg.name,
            current,
            wanted: latest,
            latest,
            type: "dependencies",
            hasPatchUpdate,
            language: "python"
          });
        }
      }
    } catch (e) {
      console.error("pip list failed:", e);
    }
  } catch {
  }
  return packages;
}
async function getRubyOutdated(repoPath) {
  const packages = [];
  try {
    await fs.access(path.join(repoPath, "Gemfile"));
    try {
      const { stdout } = await execAsync$4("bundle outdated --parseable", {
        cwd: repoPath,
        timeout: 12e4
      });
      const lines = stdout.split("\n").filter((l) => l.trim());
      for (const line of lines) {
        const match = line.match(/^(\S+)\s+\(newest\s+([0-9.]+),\s+installed\s+([0-9.]+)/);
        if (match) {
          const [, name, latest, current] = match;
          const currentParts = current.split(".").map(Number);
          const latestParts = latest.split(".").map(Number);
          const hasPatchUpdate = currentParts[0] === latestParts[0] && currentParts[1] === latestParts[1] && (currentParts[2] || 0) < (latestParts[2] || 0);
          packages.push({
            name,
            current,
            wanted: latest,
            latest,
            type: "dependencies",
            hasPatchUpdate,
            language: "ruby"
          });
        }
      }
    } catch (e) {
      if (e.stdout) {
        const lines = e.stdout.split("\n").filter((l) => l.trim());
        for (const line of lines) {
          const match = line.match(/^(\S+)\s+\(newest\s+([0-9.]+),\s+installed\s+([0-9.]+)/);
          if (match) {
            const [, name, latest, current] = match;
            const currentParts = current.split(".").map(Number);
            const latestParts = latest.split(".").map(Number);
            const hasPatchUpdate = currentParts[0] === latestParts[0] && currentParts[1] === latestParts[1] && (currentParts[2] || 0) < (latestParts[2] || 0);
            packages.push({
              name,
              current,
              wanted: latest,
              latest,
              type: "dependencies",
              hasPatchUpdate,
              language: "ruby"
            });
          }
        }
      }
    }
  } catch {
  }
  return packages;
}
async function getElixirOutdated(repoPath) {
  const packages = [];
  try {
    await fs.access(path.join(repoPath, "mix.exs"));
    try {
      const { stdout } = await execAsync$4("mix hex.outdated", {
        cwd: repoPath,
        timeout: 12e4
      });
      const lines = stdout.split("\n").filter((l) => l.trim());
      for (const line of lines) {
        const match = line.match(/^(\S+)\s+([0-9.]+)\s+([0-9.]+)/);
        if (match) {
          const [, name, current, latest] = match;
          const currentParts = current.split(".").map(Number);
          const latestParts = latest.split(".").map(Number);
          const hasPatchUpdate = currentParts[0] === latestParts[0] && currentParts[1] === latestParts[1] && (currentParts[2] || 0) < (latestParts[2] || 0);
          packages.push({
            name,
            current,
            wanted: latest,
            latest,
            type: "dependencies",
            hasPatchUpdate,
            language: "elixir"
          });
        }
      }
    } catch (e) {
      console.error("mix hex.outdated failed:", e);
    }
  } catch {
  }
  return packages;
}
async function updatePythonPackages(repoPath, packages) {
  var _a;
  const updated = [];
  const failed = [];
  const reqPath = path.join(repoPath, "requirements.txt");
  try {
    let content = await fs.readFile(reqPath, "utf-8");
    for (const pkg of packages) {
      try {
        await execAsync$4(`pip install --upgrade ${pkg}`, { cwd: repoPath, timeout: 6e4 });
        const { stdout } = await execAsync$4(`pip show ${pkg} | grep Version`, { cwd: repoPath });
        const version = (_a = stdout.match(/Version:\s*([0-9.]+)/)) == null ? void 0 : _a[1];
        if (version) {
          const regex = new RegExp(`^${pkg}==.+$`, "mi");
          content = content.replace(regex, `${pkg}==${version}`);
          updated.push(pkg);
        }
      } catch {
        failed.push(pkg);
      }
    }
    await fs.writeFile(reqPath, content);
  } catch (e) {
    console.error("Python update failed:", e);
  }
  return { updated, failed };
}
async function updateRubyPackages(repoPath, packages) {
  const updated = [];
  const failed = [];
  for (const pkg of packages) {
    try {
      await execAsync$4(`bundle update ${pkg} --patch`, { cwd: repoPath, timeout: 12e4 });
      updated.push(pkg);
    } catch {
      failed.push(pkg);
    }
  }
  return { updated, failed };
}
async function updateElixirPackages(repoPath, packages) {
  const updated = [];
  const failed = [];
  for (const pkg of packages) {
    try {
      await execAsync$4(`mix deps.update ${pkg}`, { cwd: repoPath, timeout: 12e4 });
      updated.push(pkg);
    } catch {
      failed.push(pkg);
    }
  }
  return { updated, failed };
}
function getCleanInstallCommand(lang) {
  switch (lang) {
    case "javascript":
      return "rm -rf node_modules package-lock.json && npm install && npm update && rm -rf node_modules package-lock.json && npm install";
    case "python":
      return "pip install -r requirements.txt --upgrade";
    case "ruby":
      return "rm -rf .bundle vendor/bundle && bundle install";
    case "elixir":
      return "rm -rf deps _build && mix deps.get && mix compile";
    default:
      return "";
  }
}
function getTestCommand(lang) {
  switch (lang) {
    case "javascript":
      return "npm test";
    case "python":
      return "pytest || python -m pytest || python -m unittest discover";
    case "ruby":
      return "bundle exec rspec || bundle exec rake test";
    case "elixir":
      return "mix test";
    default:
      return null;
  }
}
function getLintCommand(lang) {
  switch (lang) {
    case "javascript":
      return "npm run lint || npx eslint .";
    case "python":
      return "flake8 || pylint . || ruff check .";
    case "ruby":
      return "bundle exec rubocop";
    case "elixir":
      return "mix credo";
    default:
      return null;
  }
}
function getFilesToCommit(lang) {
  switch (lang) {
    case "javascript":
      return ["package.json", "package-lock.json"];
    case "python":
      return ["requirements.txt", "Pipfile.lock", "poetry.lock"];
    case "ruby":
      return ["Gemfile", "Gemfile.lock"];
    case "elixir":
      return ["mix.exs", "mix.lock"];
    default:
      return [];
  }
}
async function scanRepository(repoPath) {
  const name = path.basename(repoPath);
  let hasGit = false;
  let exists = true;
  try {
    await fs.access(repoPath);
  } catch {
    exists = false;
  }
  try {
    await fs.access(path.join(repoPath, ".git"));
    hasGit = true;
  } catch {
  }
  const languages = exists ? await detectLanguages(repoPath) : [];
  return {
    path: repoPath,
    name,
    languages,
    hasGit,
    addedAt: (/* @__PURE__ */ new Date()).toISOString(),
    exists
  };
}
async function checkRepositoryExists(repoPath) {
  try {
    await fs.access(repoPath);
    return true;
  } catch {
    return false;
  }
}
async function validateRepositories(repos) {
  const validated = [];
  for (const repo of repos) {
    const exists = await checkRepositoryExists(repo.path);
    validated.push({ ...repo, exists });
  }
  return validated;
}
async function cleanupMissingRepositories(repos) {
  const validated = await validateRepositories(repos);
  return validated.filter((r) => r.exists);
}
async function readDirectory(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") {
      continue;
    }
    const fullPath = path.join(dirPath, entry.name);
    try {
      const stats = await fs.stat(fullPath);
      files.push({
        name: entry.name,
        path: fullPath,
        isDirectory: entry.isDirectory(),
        size: entry.isDirectory() ? void 0 : stats.size,
        modified: stats.mtime.toISOString()
      });
    } catch {
    }
  }
  return files.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return a.name.localeCompare(b.name);
  });
}
async function readFile(filePath) {
  const content = await fs.readFile(filePath, "utf-8");
  return content;
}
const execAsync$3 = util.promisify(child_process.exec);
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
async function findLargeFiles(repoPath, minSizeBytes = 1024 * 1024) {
  const largeFiles = [];
  async function scanDir(dir) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (["node_modules", ".git", "vendor", "deps", "_build", ".bundle", "__pycache__", ".venv", "venv"].includes(entry.name)) {
          continue;
        }
        if (entry.isDirectory()) {
          await scanDir(fullPath);
        } else {
          try {
            const stats = await fs.stat(fullPath);
            if (stats.size >= minSizeBytes) {
              largeFiles.push({
                path: path.relative(repoPath, fullPath),
                size: stats.size,
                sizeFormatted: formatSize(stats.size),
                type: "current"
              });
            }
          } catch {
          }
        }
      }
    } catch {
    }
  }
  await scanDir(repoPath);
  return largeFiles.sort((a, b) => b.size - a.size);
}
async function findGitHistoryBlobs(repoPath, minSizeBytes = 5 * 1024 * 1024) {
  const largeFiles = [];
  try {
    const { stdout } = await execAsync$3(
      `git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | awk '/^blob/ {print $2, $3, $4}'`,
      { cwd: repoPath, timeout: 6e4, maxBuffer: 50 * 1024 * 1024 }
    );
    const lines = stdout.split("\n").filter((l) => l.trim());
    for (const line of lines) {
      const parts = line.split(" ");
      if (parts.length >= 2) {
        const size = parseInt(parts[1], 10);
        const filePath = parts.slice(2).join(" ") || parts[0];
        if (size >= minSizeBytes) {
          largeFiles.push({
            path: filePath,
            size,
            sizeFormatted: formatSize(size),
            type: "git-history"
          });
        }
      }
    }
  } catch (e) {
    console.error("Git history scan failed:", e);
  }
  return largeFiles.sort((a, b) => b.size - a.size).slice(0, 50);
}
async function findOversizedComponents(repoPath, maxLines = 150) {
  const oversized = [];
  const codeExtensions = [".js", ".jsx", ".ts", ".tsx", ".vue", ".svelte", ".py", ".rb", ".ex", ".exs", ".go", ".rs", ".java", ".kt", ".swift"];
  async function scanDir(dir) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (["node_modules", ".git", "vendor", "deps", "_build", ".bundle", "__pycache__", ".venv", "venv", "dist", "build"].includes(entry.name)) {
          continue;
        }
        if (entry.isDirectory()) {
          await scanDir(fullPath);
        } else {
          const ext = path.extname(entry.name).toLowerCase();
          if (codeExtensions.includes(ext)) {
            try {
              const content = await fs.readFile(fullPath, "utf-8");
              const lines = content.split("\n").length;
              if (lines > maxLines) {
                let type = "file";
                if (ext === ".tsx" || ext === ".jsx") {
                  type = "React Component";
                } else if (ext === ".vue") {
                  type = "Vue Component";
                } else if (ext === ".svelte") {
                  type = "Svelte Component";
                } else if (content.includes("class ") && content.includes("def ")) {
                  type = "Class";
                }
                oversized.push({
                  path: path.relative(repoPath, fullPath),
                  lines,
                  type
                });
              }
            } catch {
            }
          }
        }
      }
    } catch {
    }
  }
  await scanDir(repoPath);
  return oversized.sort((a, b) => b.lines - a.lines);
}
async function getFileSizeStats(repoPath) {
  let totalSize = 0;
  let fileCount = 0;
  const files = [];
  async function scanDir(dir) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (["node_modules", ".git", "vendor", "deps", "_build", ".bundle"].includes(entry.name)) {
          continue;
        }
        if (entry.isDirectory()) {
          await scanDir(fullPath);
        } else {
          try {
            const stats = await fs.stat(fullPath);
            totalSize += stats.size;
            fileCount++;
            files.push({
              path: path.relative(repoPath, fullPath),
              size: stats.size,
              sizeFormatted: formatSize(stats.size),
              type: "current"
            });
          } catch {
          }
        }
      }
    } catch {
    }
  }
  await scanDir(repoPath);
  files.sort((a, b) => b.size - a.size);
  return {
    totalSize,
    totalSizeFormatted: formatSize(totalSize),
    fileCount,
    largestFiles: files.slice(0, 20)
  };
}
async function generateCleanupReport(repoPath) {
  const [largeFiles, gitHistoryFiles, oversizedComponents] = await Promise.all([
    findLargeFiles(repoPath, 500 * 1024),
    // 500KB+
    findGitHistoryBlobs(repoPath, 5 * 1024 * 1024),
    // 5MB+ in git history
    findOversizedComponents(repoPath, 150)
  ]);
  const totalWastedSpace = gitHistoryFiles.reduce((sum, f) => sum + f.size, 0);
  return {
    largeFiles,
    gitHistoryFiles,
    oversizedComponents,
    totalWastedSpace,
    totalWastedSpaceFormatted: formatSize(totalWastedSpace)
  };
}
const store$1 = new Store();
const JOBS_KEY = "scheduled-jobs";
const RESULTS_KEY = "job-results";
const jobTimers = /* @__PURE__ */ new Map();
function getScheduledJobs() {
  return store$1.get(JOBS_KEY, []);
}
function saveScheduledJobs(jobs) {
  store$1.set(JOBS_KEY, jobs);
}
function addScheduledJob(job) {
  const jobs = getScheduledJobs();
  const newJob = {
    ...job,
    id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    lastRun: null,
    nextRun: calculateNextRun(job.frequency)
  };
  jobs.push(newJob);
  saveScheduledJobs(jobs);
  scheduleJobTimer(newJob);
  return newJob;
}
function updateScheduledJob(jobId, updates) {
  const jobs = getScheduledJobs();
  const index = jobs.findIndex((j) => j.id === jobId);
  if (index === -1) return null;
  jobs[index] = { ...jobs[index], ...updates };
  if (updates.frequency) {
    jobs[index].nextRun = calculateNextRun(updates.frequency);
  }
  saveScheduledJobs(jobs);
  clearJobTimer(jobId);
  if (jobs[index].enabled) {
    scheduleJobTimer(jobs[index]);
  }
  return jobs[index];
}
function deleteScheduledJob(jobId) {
  const jobs = getScheduledJobs();
  const filtered = jobs.filter((j) => j.id !== jobId);
  if (filtered.length === jobs.length) return false;
  saveScheduledJobs(filtered);
  clearJobTimer(jobId);
  return true;
}
function getJobResults(jobId) {
  const results = store$1.get(RESULTS_KEY, []);
  if (jobId) {
    return results.filter((r) => r.jobId === jobId);
  }
  return results;
}
function addJobResult(result) {
  const results = getJobResults();
  results.unshift(result);
  if (results.length > 100) {
    results.splice(100);
  }
  store$1.set(RESULTS_KEY, results);
}
function calculateNextRun(frequency) {
  const now = /* @__PURE__ */ new Date();
  let next;
  switch (frequency) {
    case "daily":
      next = new Date(now.getTime() + 24 * 60 * 60 * 1e3);
      next.setHours(3, 0, 0, 0);
      break;
    case "weekly":
      next = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1e3);
      next.setHours(3, 0, 0, 0);
      break;
    case "monthly":
      next = new Date(now.getFullYear(), now.getMonth() + 1, 1, 3, 0, 0, 0);
      break;
  }
  return next.toISOString();
}
function scheduleJobTimer(job) {
  if (!job.enabled) return;
  const nextRun = new Date(job.nextRun);
  const now = /* @__PURE__ */ new Date();
  const delay = Math.max(0, nextRun.getTime() - now.getTime());
  if (delay > 24 * 60 * 60 * 1e3) {
    return;
  }
  const timer = setTimeout(() => {
    executeJob(job.id);
  }, delay);
  jobTimers.set(job.id, timer);
}
function clearJobTimer(jobId) {
  const timer = jobTimers.get(jobId);
  if (timer) {
    clearTimeout(timer);
    jobTimers.delete(jobId);
  }
}
function initializeScheduler() {
  const jobs = getScheduledJobs();
  for (const job of jobs) {
    if (job.enabled) {
      const nextRun = new Date(job.nextRun);
      const now = /* @__PURE__ */ new Date();
      if (nextRun < now) {
        setTimeout(() => executeJob(job.id), 5e3);
      } else {
        scheduleJobTimer(job);
      }
    }
  }
}
async function executeJob(jobId) {
  const jobs = getScheduledJobs();
  const job = jobs.find((j) => j.id === jobId);
  if (!job || !job.enabled) return;
  const windows = electron.BrowserWindow.getAllWindows();
  for (const win of windows) {
    win.webContents.send("scheduler-job-started", { jobId, repoName: job.repoName });
  }
  for (const win of windows) {
    win.webContents.send("scheduler-execute-job", job);
  }
  const index = jobs.findIndex((j) => j.id === jobId);
  if (index !== -1) {
    jobs[index].lastRun = (/* @__PURE__ */ new Date()).toISOString();
    jobs[index].nextRun = calculateNextRun(job.frequency);
    saveScheduledJobs(jobs);
    scheduleJobTimer(jobs[index]);
  }
}
function cleanupScheduler() {
  for (const timer of jobTimers.values()) {
    clearTimeout(timer);
  }
  jobTimers.clear();
}
const execAsync$2 = util.promisify(child_process.exec);
const PROTECTED_BRANCHES = ["main", "master", "develop", "production", "staging"];
async function runGitCommand(repoPath, command) {
  const { stdout } = await execAsync$2(command, { cwd: repoPath, timeout: 3e4 });
  return stdout.trim();
}
async function getRepoInfo(repoPath) {
  try {
    const branch = await runGitCommand(repoPath, "git rev-parse --abbrev-ref HEAD");
    let remote = null;
    try {
      remote = await runGitCommand(repoPath, "git remote get-url origin");
    } catch {
    }
    let hasChanges = false;
    try {
      const status = await runGitCommand(repoPath, "git status --porcelain");
      hasChanges = status.length > 0;
    } catch {
    }
    let defaultBranch = "main";
    try {
      const remoteInfo = await runGitCommand(repoPath, 'git remote show origin 2>/dev/null | grep "HEAD branch"');
      const match = remoteInfo.match(/HEAD branch:\s*(\S+)/);
      if (match) {
        defaultBranch = match[1];
      }
    } catch {
      try {
        await runGitCommand(repoPath, "git rev-parse --verify main");
        defaultBranch = "main";
      } catch {
        try {
          await runGitCommand(repoPath, "git rev-parse --verify master");
          defaultBranch = "master";
        } catch {
        }
      }
    }
    const isProtectedBranch = PROTECTED_BRANCHES.includes(branch.toLowerCase());
    return { branch, remote, hasChanges, isProtectedBranch, defaultBranch };
  } catch (error) {
    return {
      branch: "unknown",
      remote: null,
      hasChanges: false,
      isProtectedBranch: false,
      defaultBranch: "main"
    };
  }
}
async function isOnProtectedBranch(repoPath) {
  const info = await getRepoInfo(repoPath);
  return info.isProtectedBranch;
}
async function createBranch(repoPath, branchName) {
  const info = await getRepoInfo(repoPath);
  if (info.isProtectedBranch) {
    try {
      await runGitCommand(repoPath, "git fetch origin");
    } catch {
    }
    await runGitCommand(repoPath, `git checkout ${info.defaultBranch}`);
    try {
      await runGitCommand(repoPath, `git pull origin ${info.defaultBranch}`);
    } catch {
    }
  }
  await runGitCommand(repoPath, `git checkout -b ${branchName}`);
}
async function commitChanges(repoPath, message, files) {
  if (files && files.length > 0) {
    for (const file of files) {
      try {
        await runGitCommand(repoPath, `git add "${file}"`);
      } catch {
      }
    }
  } else {
    const commonFiles = [
      "package.json",
      "package-lock.json",
      "requirements.txt",
      "Pipfile.lock",
      "Gemfile",
      "Gemfile.lock",
      "mix.exs",
      "mix.lock"
    ];
    for (const file of commonFiles) {
      try {
        await runGitCommand(repoPath, `git add "${file}"`);
      } catch {
      }
    }
  }
  await runGitCommand(repoPath, `git commit -m "${message.replace(/"/g, '\\"')}"`);
}
async function pushBranch(repoPath, branchName) {
  await runGitCommand(repoPath, `git push -u origin ${branchName}`);
}
async function createPullRequest(repoPath, title, body) {
  const result = await runGitCommand(
    repoPath,
    `gh pr create --title "${title.replace(/"/g, '\\"')}" --body "${body.replace(/"/g, '\\"')}"`
  );
  return result;
}
async function runTests(repoPath, command) {
  try {
    const { stdout, stderr } = await execAsync$2(command, {
      cwd: repoPath,
      timeout: 3e5,
      // 5 min timeout for tests
      maxBuffer: 10 * 1024 * 1024
    });
    return { success: true, output: stdout + stderr };
  } catch (error) {
    return { success: false, output: error.stdout + error.stderr || error.message };
  }
}
async function runLint(repoPath, command) {
  try {
    const { stdout, stderr } = await execAsync$2(command, {
      cwd: repoPath,
      timeout: 12e4,
      maxBuffer: 10 * 1024 * 1024
    });
    return { success: true, output: stdout + stderr };
  } catch (error) {
    return { success: false, output: error.stdout + error.stderr || error.message };
  }
}
async function abortChanges(repoPath, originalBranch) {
  try {
    await runGitCommand(repoPath, "git checkout -- .");
    await runGitCommand(repoPath, "git clean -fd");
    await runGitCommand(repoPath, `git checkout ${originalBranch}`);
  } catch (e) {
    console.error("Failed to abort changes:", e);
  }
}
async function deleteBranch(repoPath, branchName) {
  try {
    await runGitCommand(repoPath, `git branch -D ${branchName}`);
  } catch {
  }
}
const execAsync$1 = util.promisify(child_process.exec);
const AGENTIC_FIXER_PATH = path.join(__dirname, "../../agentic_fixer");
async function checkAgenticFixerAvailable() {
  try {
    await fs.access(AGENTIC_FIXER_PATH);
    await execAsync$1('python3 -c "import flask"', { timeout: 5e3 });
    return true;
  } catch {
    return false;
  }
}
async function runSecurityScan(repoPath, onProgress) {
  const scanId = `scan-${Date.now()}`;
  const startTime = Date.now();
  onProgress == null ? void 0 : onProgress({
    status: "scanning",
    progress: 0,
    message: "Initializing security scan..."
  });
  try {
    const available = await checkAgenticFixerAvailable();
    if (!available) {
      return await runBasicSecurityScan(repoPath, scanId, onProgress);
    }
    return await runPythonSecurityScan(repoPath, scanId, startTime, onProgress);
  } catch (error) {
    console.error("Security scan failed:", error);
    throw error;
  }
}
async function runPythonSecurityScan(repoPath, scanId, startTime, onProgress) {
  return new Promise((resolve, reject) => {
    const pythonScript = `
import sys
import json
sys.path.insert(0, '${AGENTIC_FIXER_PATH}')

from code_security_auto_fixer import repo_scanner, language_detector, pattern_detector

try:
    repo_path = '${repoPath.replace(/'/g, "\\'")}'

    # Detect languages
    languages = language_detector.detect(repo_path)
    print(json.dumps({'type': 'progress', 'status': 'scanning', 'progress': 20, 'message': f'Detected languages: {", ".join(languages)}'}))
    sys.stdout.flush()

    # Scan for patterns
    print(json.dumps({'type': 'progress', 'status': 'analyzing', 'progress': 40, 'message': 'Analyzing code patterns...'}))
    sys.stdout.flush()

    findings = pattern_detector.scan(repo_path, languages)

    print(json.dumps({'type': 'progress', 'status': 'complete', 'progress': 100, 'message': f'Found {len(findings)} security issues'}))
    sys.stdout.flush()

    # Output results
    result = {
        'type': 'result',
        'findings': findings
    }
    print(json.dumps(result))
    sys.stdout.flush()

except Exception as e:
    print(json.dumps({'type': 'error', 'message': str(e)}))
    sys.stdout.flush()
    sys.exit(1)
`;
    const python = child_process.spawn("python3", ["-c", pythonScript], {
      cwd: AGENTIC_FIXER_PATH,
      env: { ...process.env, PYTHONUNBUFFERED: "1" }
    });
    let findings = [];
    python.stdout.on("data", (data) => {
      const lines = data.toString().split("\n").filter((l) => l.trim());
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.type === "progress") {
            onProgress == null ? void 0 : onProgress({
              status: parsed.status,
              progress: parsed.progress,
              message: parsed.message
            });
          } else if (parsed.type === "result") {
            findings = parsed.findings.map((f) => ({
              file: f.file,
              line: f.line,
              issue: f.issue,
              severity: normalizeSeverity(f.severity),
              code: f.code,
              description: f.description || f.issue,
              cwe: f.cwe || "CWE-Unknown",
              owasp: f.owasp || "Unknown",
              solution: f.solution
            }));
          } else if (parsed.type === "error") {
            reject(new Error(parsed.message));
          }
        } catch {
        }
      }
    });
    python.stderr.on("data", (data) => {
      console.error("Python stderr:", data.toString());
    });
    python.on("close", (code) => {
      if (code === 0 || findings.length > 0) {
        const result = {
          scanId,
          repoPath,
          totalFindings: findings.length,
          criticalCount: findings.filter((f) => f.severity === "critical").length,
          highCount: findings.filter((f) => f.severity === "high").length,
          mediumCount: findings.filter((f) => f.severity === "medium").length,
          lowCount: findings.filter((f) => f.severity === "low").length,
          findings,
          scannedAt: (/* @__PURE__ */ new Date()).toISOString(),
          duration: Date.now() - startTime
        };
        resolve(result);
      } else {
        reject(new Error("Security scan failed"));
      }
    });
    python.on("error", (error) => {
      reject(error);
    });
  });
}
async function runBasicSecurityScan(repoPath, scanId, onProgress) {
  const startTime = Date.now();
  const findings = [];
  const patterns = [
    // SQL Injection
    { pattern: /execute\s*\(\s*['"`].*\$|%s|{.*}.*['"`]/i, issue: "sql-injection", severity: "critical", cwe: "CWE-89", owasp: "A03:2021" },
    { pattern: /query\s*\(\s*['"`].*\+.*['"`]/i, issue: "sql-injection", severity: "critical", cwe: "CWE-89", owasp: "A03:2021" },
    // XSS
    { pattern: /innerHTML\s*=|document\.write\s*\(/i, issue: "xss", severity: "high", cwe: "CWE-79", owasp: "A03:2021" },
    { pattern: /dangerouslySetInnerHTML/i, issue: "xss", severity: "medium", cwe: "CWE-79", owasp: "A03:2021" },
    // Command Injection
    { pattern: /exec\s*\(|system\s*\(|shell_exec\s*\(/i, issue: "command-injection", severity: "critical", cwe: "CWE-78", owasp: "A03:2021" },
    { pattern: /subprocess\.call.*shell\s*=\s*True/i, issue: "command-injection", severity: "critical", cwe: "CWE-78", owasp: "A03:2021" },
    // Hardcoded Secrets
    { pattern: /password\s*=\s*['"][^'"]+['"]/i, issue: "hardcoded-secret", severity: "high", cwe: "CWE-798", owasp: "A07:2021" },
    { pattern: /api[_-]?key\s*=\s*['"][^'"]+['"]/i, issue: "hardcoded-secret", severity: "high", cwe: "CWE-798", owasp: "A07:2021" },
    { pattern: /secret\s*=\s*['"][^'"]+['"]/i, issue: "hardcoded-secret", severity: "high", cwe: "CWE-798", owasp: "A07:2021" },
    // Path Traversal
    { pattern: /\.\.\/|\.\.\\|path\.join.*\.\./i, issue: "path-traversal", severity: "high", cwe: "CWE-22", owasp: "A01:2021" },
    // Insecure Deserialization
    { pattern: /pickle\.loads|yaml\.load\s*\([^,)]+\)/i, issue: "insecure-deserialization", severity: "critical", cwe: "CWE-502", owasp: "A08:2021" },
    { pattern: /eval\s*\(|Function\s*\(/i, issue: "code-injection", severity: "critical", cwe: "CWE-94", owasp: "A03:2021" },
    // Weak Crypto
    { pattern: /md5\s*\(|sha1\s*\(/i, issue: "weak-crypto", severity: "medium", cwe: "CWE-327", owasp: "A02:2021" },
    // SSRF
    { pattern: /requests\.get\s*\(.*request\.|fetch\s*\(.*req\./i, issue: "ssrf", severity: "high", cwe: "CWE-918", owasp: "A10:2021" }
  ];
  const codeExtensions = [".js", ".jsx", ".ts", ".tsx", ".py", ".rb", ".php", ".java", ".go", ".rs", ".c", ".cpp"];
  async function scanDir(dir) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (["node_modules", ".git", "vendor", "deps", "_build", "__pycache__", "venv", ".venv"].includes(entry.name)) {
          continue;
        }
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await scanDir(fullPath);
        } else {
          const ext = path.extname(entry.name).toLowerCase();
          if (codeExtensions.includes(ext)) {
            try {
              const content = await fs.readFile(fullPath, "utf-8");
              const lines = content.split("\n");
              const relPath = path.relative(repoPath, fullPath);
              for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                for (const { pattern, issue, severity, cwe, owasp } of patterns) {
                  if (pattern.test(line)) {
                    findings.push({
                      file: relPath,
                      line: i + 1,
                      issue,
                      severity,
                      code: line.trim(),
                      description: `Potential ${issue.replace(/-/g, " ")} vulnerability detected`,
                      cwe,
                      owasp
                    });
                  }
                }
              }
            } catch {
            }
          }
        }
      }
    } catch {
    }
  }
  onProgress == null ? void 0 : onProgress({ status: "scanning", progress: 10, message: "Scanning files..." });
  await scanDir(repoPath);
  onProgress == null ? void 0 : onProgress({ status: "complete", progress: 100, message: `Found ${findings.length} security issues` });
  return {
    scanId,
    repoPath,
    totalFindings: findings.length,
    criticalCount: findings.filter((f) => f.severity === "critical").length,
    highCount: findings.filter((f) => f.severity === "high").length,
    mediumCount: findings.filter((f) => f.severity === "medium").length,
    lowCount: findings.filter((f) => f.severity === "low").length,
    findings,
    scannedAt: (/* @__PURE__ */ new Date()).toISOString(),
    duration: Date.now() - startTime
  };
}
function normalizeSeverity(severity) {
  const s = severity.toLowerCase();
  if (s === "critical" || s === "error") return "critical";
  if (s === "high" || s === "warning") return "high";
  if (s === "medium" || s === "info") return "medium";
  return "low";
}
async function generateSecurityFix(finding) {
  const available = await checkAgenticFixerAvailable();
  if (!available) {
    return null;
  }
  return new Promise((resolve) => {
    const pythonScript = `
import sys
import json
sys.path.insert(0, '${AGENTIC_FIXER_PATH}')

try:
    from code_security_auto_fixer.ai_fixer import AIFixer
    from code_security_auto_fixer.config import (
        GEMINI_API_BASE_URL, GEMINI_MODEL_NAME, GEMINI_API_KEY,
        GEMINI_ACCESS_TOKEN, GEMINI_TEMPERATURE, GEMINI_MAX_OUTPUT_TOKENS, GEMINI_CANDIDATE_COUNT
    )

    fixer = AIFixer(
        api_base_url=GEMINI_API_BASE_URL,
        model_name=GEMINI_MODEL_NAME,
        api_key=GEMINI_API_KEY,
        access_token=GEMINI_ACCESS_TOKEN,
        temperature=GEMINI_TEMPERATURE,
        max_output_tokens=GEMINI_MAX_OUTPUT_TOKENS,
        candidate_count=GEMINI_CANDIDATE_COUNT
    )

    issue_data = ${JSON.stringify(finding)}
    result = fixer.generate_secure_solution(issue_data)
    print(json.dumps({'success': True, 'fix': result.get('fixed_code', '')}))
except Exception as e:
    print(json.dumps({'success': False, 'error': str(e)}))
`;
    const python = child_process.spawn("python3", ["-c", pythonScript], {
      cwd: AGENTIC_FIXER_PATH
    });
    let output = "";
    python.stdout.on("data", (data) => {
      output += data.toString();
    });
    python.on("close", () => {
      try {
        const result = JSON.parse(output.trim());
        if (result.success) {
          resolve(result.fix);
        } else {
          resolve(null);
        }
      } catch {
        resolve(null);
      }
    });
    python.on("error", () => {
      resolve(null);
    });
  });
}
var re$2 = { exports: {} };
const MAX_LENGTH$1 = 256;
const MAX_SAFE_INTEGER$1 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991;
const MAX_SAFE_COMPONENT_LENGTH = 16;
const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH$1 - 6;
var constants = {
  MAX_LENGTH: MAX_LENGTH$1,
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_SAFE_INTEGER: MAX_SAFE_INTEGER$1,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const debug$1 = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
};
var debug_1 = debug$1;
(function(module, exports$1) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: MAX_SAFE_COMPONENT_LENGTH2,
    MAX_SAFE_BUILD_LENGTH: MAX_SAFE_BUILD_LENGTH2,
    MAX_LENGTH: MAX_LENGTH2
  } = constants;
  const debug2 = debug_1;
  exports$1 = module.exports = {};
  const re2 = exports$1.re = [];
  const safeRe = exports$1.safeRe = [];
  const src = exports$1.src = [];
  const safeSrc = exports$1.safeSrc = [];
  const t2 = exports$1.t = {};
  let R = 0;
  const LETTERDASHNUMBER = "[a-zA-Z0-9-]";
  const safeRegexReplacements = [
    ["\\s", 1],
    ["\\d", MAX_LENGTH2],
    [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH2]
  ];
  const makeSafeRegex = (value) => {
    for (const [token, max] of safeRegexReplacements) {
      value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
    }
    return value;
  };
  const createToken = (name, value, isGlobal) => {
    const safe = makeSafeRegex(value);
    const index = R++;
    debug2(name, index, value);
    t2[name] = index;
    src[index] = value;
    safeSrc[index] = safe;
    re2[index] = new RegExp(value, isGlobal ? "g" : void 0);
    safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
  };
  createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
  createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
  createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
  createToken("MAINVERSION", `(${src[t2.NUMERICIDENTIFIER]})\\.(${src[t2.NUMERICIDENTIFIER]})\\.(${src[t2.NUMERICIDENTIFIER]})`);
  createToken("MAINVERSIONLOOSE", `(${src[t2.NUMERICIDENTIFIERLOOSE]})\\.(${src[t2.NUMERICIDENTIFIERLOOSE]})\\.(${src[t2.NUMERICIDENTIFIERLOOSE]})`);
  createToken("PRERELEASEIDENTIFIER", `(?:${src[t2.NONNUMERICIDENTIFIER]}|${src[t2.NUMERICIDENTIFIER]})`);
  createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t2.NONNUMERICIDENTIFIER]}|${src[t2.NUMERICIDENTIFIERLOOSE]})`);
  createToken("PRERELEASE", `(?:-(${src[t2.PRERELEASEIDENTIFIER]}(?:\\.${src[t2.PRERELEASEIDENTIFIER]})*))`);
  createToken("PRERELEASELOOSE", `(?:-?(${src[t2.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t2.PRERELEASEIDENTIFIERLOOSE]})*))`);
  createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
  createToken("BUILD", `(?:\\+(${src[t2.BUILDIDENTIFIER]}(?:\\.${src[t2.BUILDIDENTIFIER]})*))`);
  createToken("FULLPLAIN", `v?${src[t2.MAINVERSION]}${src[t2.PRERELEASE]}?${src[t2.BUILD]}?`);
  createToken("FULL", `^${src[t2.FULLPLAIN]}$`);
  createToken("LOOSEPLAIN", `[v=\\s]*${src[t2.MAINVERSIONLOOSE]}${src[t2.PRERELEASELOOSE]}?${src[t2.BUILD]}?`);
  createToken("LOOSE", `^${src[t2.LOOSEPLAIN]}$`);
  createToken("GTLT", "((?:<|>)?=?)");
  createToken("XRANGEIDENTIFIERLOOSE", `${src[t2.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
  createToken("XRANGEIDENTIFIER", `${src[t2.NUMERICIDENTIFIER]}|x|X|\\*`);
  createToken("XRANGEPLAIN", `[v=\\s]*(${src[t2.XRANGEIDENTIFIER]})(?:\\.(${src[t2.XRANGEIDENTIFIER]})(?:\\.(${src[t2.XRANGEIDENTIFIER]})(?:${src[t2.PRERELEASE]})?${src[t2.BUILD]}?)?)?`);
  createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t2.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t2.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t2.XRANGEIDENTIFIERLOOSE]})(?:${src[t2.PRERELEASELOOSE]})?${src[t2.BUILD]}?)?)?`);
  createToken("XRANGE", `^${src[t2.GTLT]}\\s*${src[t2.XRANGEPLAIN]}$`);
  createToken("XRANGELOOSE", `^${src[t2.GTLT]}\\s*${src[t2.XRANGEPLAINLOOSE]}$`);
  createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH2}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH2}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH2}}))?`);
  createToken("COERCE", `${src[t2.COERCEPLAIN]}(?:$|[^\\d])`);
  createToken("COERCEFULL", src[t2.COERCEPLAIN] + `(?:${src[t2.PRERELEASE]})?(?:${src[t2.BUILD]})?(?:$|[^\\d])`);
  createToken("COERCERTL", src[t2.COERCE], true);
  createToken("COERCERTLFULL", src[t2.COERCEFULL], true);
  createToken("LONETILDE", "(?:~>?)");
  createToken("TILDETRIM", `(\\s*)${src[t2.LONETILDE]}\\s+`, true);
  exports$1.tildeTrimReplace = "$1~";
  createToken("TILDE", `^${src[t2.LONETILDE]}${src[t2.XRANGEPLAIN]}$`);
  createToken("TILDELOOSE", `^${src[t2.LONETILDE]}${src[t2.XRANGEPLAINLOOSE]}$`);
  createToken("LONECARET", "(?:\\^)");
  createToken("CARETTRIM", `(\\s*)${src[t2.LONECARET]}\\s+`, true);
  exports$1.caretTrimReplace = "$1^";
  createToken("CARET", `^${src[t2.LONECARET]}${src[t2.XRANGEPLAIN]}$`);
  createToken("CARETLOOSE", `^${src[t2.LONECARET]}${src[t2.XRANGEPLAINLOOSE]}$`);
  createToken("COMPARATORLOOSE", `^${src[t2.GTLT]}\\s*(${src[t2.LOOSEPLAIN]})$|^$`);
  createToken("COMPARATOR", `^${src[t2.GTLT]}\\s*(${src[t2.FULLPLAIN]})$|^$`);
  createToken("COMPARATORTRIM", `(\\s*)${src[t2.GTLT]}\\s*(${src[t2.LOOSEPLAIN]}|${src[t2.XRANGEPLAIN]})`, true);
  exports$1.comparatorTrimReplace = "$1$2$3";
  createToken("HYPHENRANGE", `^\\s*(${src[t2.XRANGEPLAIN]})\\s+-\\s+(${src[t2.XRANGEPLAIN]})\\s*$`);
  createToken("HYPHENRANGELOOSE", `^\\s*(${src[t2.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t2.XRANGEPLAINLOOSE]})\\s*$`);
  createToken("STAR", "(<|>)?=?\\s*\\*");
  createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
  createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(re$2, re$2.exports);
var reExports = re$2.exports;
const looseOption = Object.freeze({ loose: true });
const emptyOpts = Object.freeze({});
const parseOptions$1 = (options) => {
  if (!options) {
    return emptyOpts;
  }
  if (typeof options !== "object") {
    return looseOption;
  }
  return options;
};
var parseOptions_1 = parseOptions$1;
const numeric = /^[0-9]+$/;
const compareIdentifiers$1 = (a, b) => {
  if (typeof a === "number" && typeof b === "number") {
    return a === b ? 0 : a < b ? -1 : 1;
  }
  const anum = numeric.test(a);
  const bnum = numeric.test(b);
  if (anum && bnum) {
    a = +a;
    b = +b;
  }
  return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
};
var identifiers = {
  compareIdentifiers: compareIdentifiers$1
};
const debug = debug_1;
const { MAX_LENGTH, MAX_SAFE_INTEGER } = constants;
const { safeRe: re$1, t: t$1 } = reExports;
const parseOptions = parseOptions_1;
const { compareIdentifiers } = identifiers;
let SemVer$2 = class SemVer {
  constructor(version, options) {
    options = parseOptions(options);
    if (version instanceof SemVer) {
      if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
        return version;
      } else {
        version = version.version;
      }
    } else if (typeof version !== "string") {
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
    }
    if (version.length > MAX_LENGTH) {
      throw new TypeError(
        `version is longer than ${MAX_LENGTH} characters`
      );
    }
    debug("SemVer", version, options);
    this.options = options;
    this.loose = !!options.loose;
    this.includePrerelease = !!options.includePrerelease;
    const m = version.trim().match(options.loose ? re$1[t$1.LOOSE] : re$1[t$1.FULL]);
    if (!m) {
      throw new TypeError(`Invalid Version: ${version}`);
    }
    this.raw = version;
    this.major = +m[1];
    this.minor = +m[2];
    this.patch = +m[3];
    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError("Invalid major version");
    }
    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError("Invalid minor version");
    }
    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError("Invalid patch version");
    }
    if (!m[4]) {
      this.prerelease = [];
    } else {
      this.prerelease = m[4].split(".").map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id;
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num;
          }
        }
        return id;
      });
    }
    this.build = m[5] ? m[5].split(".") : [];
    this.format();
  }
  format() {
    this.version = `${this.major}.${this.minor}.${this.patch}`;
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join(".")}`;
    }
    return this.version;
  }
  toString() {
    return this.version;
  }
  compare(other) {
    debug("SemVer.compare", this.version, this.options, other);
    if (!(other instanceof SemVer)) {
      if (typeof other === "string" && other === this.version) {
        return 0;
      }
      other = new SemVer(other, this.options);
    }
    if (other.version === this.version) {
      return 0;
    }
    return this.compareMain(other) || this.comparePre(other);
  }
  compareMain(other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }
    if (this.major < other.major) {
      return -1;
    }
    if (this.major > other.major) {
      return 1;
    }
    if (this.minor < other.minor) {
      return -1;
    }
    if (this.minor > other.minor) {
      return 1;
    }
    if (this.patch < other.patch) {
      return -1;
    }
    if (this.patch > other.patch) {
      return 1;
    }
    return 0;
  }
  comparePre(other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }
    if (this.prerelease.length && !other.prerelease.length) {
      return -1;
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1;
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0;
    }
    let i = 0;
    do {
      const a = this.prerelease[i];
      const b = other.prerelease[i];
      debug("prerelease compare", i, a, b);
      if (a === void 0 && b === void 0) {
        return 0;
      } else if (b === void 0) {
        return 1;
      } else if (a === void 0) {
        return -1;
      } else if (a === b) {
        continue;
      } else {
        return compareIdentifiers(a, b);
      }
    } while (++i);
  }
  compareBuild(other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }
    let i = 0;
    do {
      const a = this.build[i];
      const b = other.build[i];
      debug("build compare", i, a, b);
      if (a === void 0 && b === void 0) {
        return 0;
      } else if (b === void 0) {
        return 1;
      } else if (a === void 0) {
        return -1;
      } else if (a === b) {
        continue;
      } else {
        return compareIdentifiers(a, b);
      }
    } while (++i);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(release, identifier, identifierBase) {
    if (release.startsWith("pre")) {
      if (!identifier && identifierBase === false) {
        throw new Error("invalid increment argument: identifier is empty");
      }
      if (identifier) {
        const match = `-${identifier}`.match(this.options.loose ? re$1[t$1.PRERELEASELOOSE] : re$1[t$1.PRERELEASE]);
        if (!match || match[1] !== identifier) {
          throw new Error(`invalid identifier: ${identifier}`);
        }
      }
    }
    switch (release) {
      case "premajor":
        this.prerelease.length = 0;
        this.patch = 0;
        this.minor = 0;
        this.major++;
        this.inc("pre", identifier, identifierBase);
        break;
      case "preminor":
        this.prerelease.length = 0;
        this.patch = 0;
        this.minor++;
        this.inc("pre", identifier, identifierBase);
        break;
      case "prepatch":
        this.prerelease.length = 0;
        this.inc("patch", identifier, identifierBase);
        this.inc("pre", identifier, identifierBase);
        break;
      case "prerelease":
        if (this.prerelease.length === 0) {
          this.inc("patch", identifier, identifierBase);
        }
        this.inc("pre", identifier, identifierBase);
        break;
      case "release":
        if (this.prerelease.length === 0) {
          throw new Error(`version ${this.raw} is not a prerelease`);
        }
        this.prerelease.length = 0;
        break;
      case "major":
        if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
          this.major++;
        }
        this.minor = 0;
        this.patch = 0;
        this.prerelease = [];
        break;
      case "minor":
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++;
        }
        this.patch = 0;
        this.prerelease = [];
        break;
      case "patch":
        if (this.prerelease.length === 0) {
          this.patch++;
        }
        this.prerelease = [];
        break;
      case "pre": {
        const base = Number(identifierBase) ? 1 : 0;
        if (this.prerelease.length === 0) {
          this.prerelease = [base];
        } else {
          let i = this.prerelease.length;
          while (--i >= 0) {
            if (typeof this.prerelease[i] === "number") {
              this.prerelease[i]++;
              i = -2;
            }
          }
          if (i === -1) {
            if (identifier === this.prerelease.join(".") && identifierBase === false) {
              throw new Error("invalid increment argument: identifier already exists");
            }
            this.prerelease.push(base);
          }
        }
        if (identifier) {
          let prerelease = [identifier, base];
          if (identifierBase === false) {
            prerelease = [identifier];
          }
          if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = prerelease;
            }
          } else {
            this.prerelease = prerelease;
          }
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${release}`);
    }
    this.raw = this.format();
    if (this.build.length) {
      this.raw += `+${this.build.join(".")}`;
    }
    return this;
  }
};
var semver$1 = SemVer$2;
const SemVer$1 = semver$1;
const parse$1 = (version, options, throwErrors = false) => {
  if (version instanceof SemVer$1) {
    return version;
  }
  try {
    return new SemVer$1(version, options);
  } catch (er) {
    if (!throwErrors) {
      return null;
    }
    throw er;
  }
};
var parse_1 = parse$1;
const SemVer2 = semver$1;
const compare$6 = (a, b, loose) => new SemVer2(a, loose).compare(new SemVer2(b, loose));
var compare_1 = compare$6;
const compare$5 = compare_1;
const gt$1 = (a, b, loose) => compare$5(a, b, loose) > 0;
var gt_1 = gt$1;
const compare$4 = compare_1;
const lt$1 = (a, b, loose) => compare$4(a, b, loose) < 0;
var lt_1 = lt$1;
const compare$3 = compare_1;
const eq$1 = (a, b, loose) => compare$3(a, b, loose) === 0;
var eq_1 = eq$1;
const compare$2 = compare_1;
const neq$1 = (a, b, loose) => compare$2(a, b, loose) !== 0;
var neq_1 = neq$1;
const compare$1 = compare_1;
const gte$1 = (a, b, loose) => compare$1(a, b, loose) >= 0;
var gte_1 = gte$1;
const compare = compare_1;
const lte$1 = (a, b, loose) => compare(a, b, loose) <= 0;
var lte_1 = lte$1;
const eq = eq_1;
const neq = neq_1;
const gt = gt_1;
const gte = gte_1;
const lt = lt_1;
const lte = lte_1;
const cmp = (a, op, b, loose) => {
  switch (op) {
    case "===":
      if (typeof a === "object") {
        a = a.version;
      }
      if (typeof b === "object") {
        b = b.version;
      }
      return a === b;
    case "!==":
      if (typeof a === "object") {
        a = a.version;
      }
      if (typeof b === "object") {
        b = b.version;
      }
      return a !== b;
    case "":
    case "=":
    case "==":
      return eq(a, b, loose);
    case "!=":
      return neq(a, b, loose);
    case ">":
      return gt(a, b, loose);
    case ">=":
      return gte(a, b, loose);
    case "<":
      return lt(a, b, loose);
    case "<=":
      return lte(a, b, loose);
    default:
      throw new TypeError(`Invalid operator: ${op}`);
  }
};
var cmp_1 = cmp;
const { safeRe: re, t } = reExports;
class LRUCache {
  constructor() {
    this.max = 1e3;
    this.map = /* @__PURE__ */ new Map();
  }
  get(key) {
    const value = this.map.get(key);
    if (value === void 0) {
      return void 0;
    } else {
      this.map.delete(key);
      this.map.set(key, value);
      return value;
    }
  }
  delete(key) {
    return this.map.delete(key);
  }
  set(key, value) {
    const deleted = this.delete(key);
    if (!deleted && value !== void 0) {
      if (this.map.size >= this.max) {
        const firstKey = this.map.keys().next().value;
        this.delete(firstKey);
      }
      this.map.set(key, value);
    }
    return this;
  }
}
var lrucache = LRUCache;
var range;
var hasRequiredRange;
function requireRange() {
  if (hasRequiredRange) return range;
  hasRequiredRange = 1;
  const SPACE_CHARACTERS = /\s+/g;
  class Range {
    constructor(range2, options) {
      options = parseOptions2(options);
      if (range2 instanceof Range) {
        if (range2.loose === !!options.loose && range2.includePrerelease === !!options.includePrerelease) {
          return range2;
        } else {
          return new Range(range2.raw, options);
        }
      }
      if (range2 instanceof Comparator2) {
        this.raw = range2.value;
        this.set = [[range2]];
        this.formatted = void 0;
        return this;
      }
      this.options = options;
      this.loose = !!options.loose;
      this.includePrerelease = !!options.includePrerelease;
      this.raw = range2.trim().replace(SPACE_CHARACTERS, " ");
      this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
      if (!this.set.length) {
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      }
      if (this.set.length > 1) {
        const first = this.set[0];
        this.set = this.set.filter((c) => !isNullSet(c[0]));
        if (this.set.length === 0) {
          this.set = [first];
        } else if (this.set.length > 1) {
          for (const c of this.set) {
            if (c.length === 1 && isAny(c[0])) {
              this.set = [c];
              break;
            }
          }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let i = 0; i < this.set.length; i++) {
          if (i > 0) {
            this.formatted += "||";
          }
          const comps = this.set[i];
          for (let k = 0; k < comps.length; k++) {
            if (k > 0) {
              this.formatted += " ";
            }
            this.formatted += comps[k].toString().trim();
          }
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(range2) {
      const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
      const memoKey = memoOpts + ":" + range2;
      const cached = cache.get(memoKey);
      if (cached) {
        return cached;
      }
      const loose = this.options.loose;
      const hr = loose ? re2[t2.HYPHENRANGELOOSE] : re2[t2.HYPHENRANGE];
      range2 = range2.replace(hr, hyphenReplace(this.options.includePrerelease));
      debug2("hyphen replace", range2);
      range2 = range2.replace(re2[t2.COMPARATORTRIM], comparatorTrimReplace);
      debug2("comparator trim", range2);
      range2 = range2.replace(re2[t2.TILDETRIM], tildeTrimReplace);
      debug2("tilde trim", range2);
      range2 = range2.replace(re2[t2.CARETTRIM], caretTrimReplace);
      debug2("caret trim", range2);
      let rangeList = range2.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
      if (loose) {
        rangeList = rangeList.filter((comp) => {
          debug2("loose invalid filter", comp, this.options);
          return !!comp.match(re2[t2.COMPARATORLOOSE]);
        });
      }
      debug2("range list", rangeList);
      const rangeMap = /* @__PURE__ */ new Map();
      const comparators = rangeList.map((comp) => new Comparator2(comp, this.options));
      for (const comp of comparators) {
        if (isNullSet(comp)) {
          return [comp];
        }
        rangeMap.set(comp.value, comp);
      }
      if (rangeMap.size > 1 && rangeMap.has("")) {
        rangeMap.delete("");
      }
      const result = [...rangeMap.values()];
      cache.set(memoKey, result);
      return result;
    }
    intersects(range2, options) {
      if (!(range2 instanceof Range)) {
        throw new TypeError("a Range is required");
      }
      return this.set.some((thisComparators) => {
        return isSatisfiable(thisComparators, options) && range2.set.some((rangeComparators) => {
          return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
            return rangeComparators.every((rangeComparator) => {
              return thisComparator.intersects(rangeComparator, options);
            });
          });
        });
      });
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(version) {
      if (!version) {
        return false;
      }
      if (typeof version === "string") {
        try {
          version = new SemVer3(version, this.options);
        } catch (er) {
          return false;
        }
      }
      for (let i = 0; i < this.set.length; i++) {
        if (testSet(this.set[i], version, this.options)) {
          return true;
        }
      }
      return false;
    }
  }
  range = Range;
  const LRU = lrucache;
  const cache = new LRU();
  const parseOptions2 = parseOptions_1;
  const Comparator2 = requireComparator();
  const debug2 = debug_1;
  const SemVer3 = semver$1;
  const {
    safeRe: re2,
    t: t2,
    comparatorTrimReplace,
    tildeTrimReplace,
    caretTrimReplace
  } = reExports;
  const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = constants;
  const isNullSet = (c) => c.value === "<0.0.0-0";
  const isAny = (c) => c.value === "";
  const isSatisfiable = (comparators, options) => {
    let result = true;
    const remainingComparators = comparators.slice();
    let testComparator = remainingComparators.pop();
    while (result && remainingComparators.length) {
      result = remainingComparators.every((otherComparator) => {
        return testComparator.intersects(otherComparator, options);
      });
      testComparator = remainingComparators.pop();
    }
    return result;
  };
  const parseComparator = (comp, options) => {
    comp = comp.replace(re2[t2.BUILD], "");
    debug2("comp", comp, options);
    comp = replaceCarets(comp, options);
    debug2("caret", comp);
    comp = replaceTildes(comp, options);
    debug2("tildes", comp);
    comp = replaceXRanges(comp, options);
    debug2("xrange", comp);
    comp = replaceStars(comp, options);
    debug2("stars", comp);
    return comp;
  };
  const isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
  const replaceTildes = (comp, options) => {
    return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
  };
  const replaceTilde = (comp, options) => {
    const r = options.loose ? re2[t2.TILDELOOSE] : re2[t2.TILDE];
    return comp.replace(r, (_, M, m, p, pr) => {
      debug2("tilde", comp, _, M, m, p, pr);
      let ret;
      if (isX(M)) {
        ret = "";
      } else if (isX(m)) {
        ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
      } else if (isX(p)) {
        ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
      } else if (pr) {
        debug2("replaceTilde pr", pr);
        ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
      } else {
        ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
      }
      debug2("tilde return", ret);
      return ret;
    });
  };
  const replaceCarets = (comp, options) => {
    return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
  };
  const replaceCaret = (comp, options) => {
    debug2("caret", comp, options);
    const r = options.loose ? re2[t2.CARETLOOSE] : re2[t2.CARET];
    const z = options.includePrerelease ? "-0" : "";
    return comp.replace(r, (_, M, m, p, pr) => {
      debug2("caret", comp, _, M, m, p, pr);
      let ret;
      if (isX(M)) {
        ret = "";
      } else if (isX(m)) {
        ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
      } else if (isX(p)) {
        if (M === "0") {
          ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
        }
      } else if (pr) {
        debug2("replaceCaret pr", pr);
        if (M === "0") {
          if (m === "0") {
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
          }
        } else {
          ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
        }
      } else {
        debug2("no pr");
        if (M === "0") {
          if (m === "0") {
            ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
          } else {
            ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
          }
        } else {
          ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
        }
      }
      debug2("caret return", ret);
      return ret;
    });
  };
  const replaceXRanges = (comp, options) => {
    debug2("replaceXRanges", comp, options);
    return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
  };
  const replaceXRange = (comp, options) => {
    comp = comp.trim();
    const r = options.loose ? re2[t2.XRANGELOOSE] : re2[t2.XRANGE];
    return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
      debug2("xRange", comp, ret, gtlt, M, m, p, pr);
      const xM = isX(M);
      const xm = xM || isX(m);
      const xp = xm || isX(p);
      const anyX = xp;
      if (gtlt === "=" && anyX) {
        gtlt = "";
      }
      pr = options.includePrerelease ? "-0" : "";
      if (xM) {
        if (gtlt === ">" || gtlt === "<") {
          ret = "<0.0.0-0";
        } else {
          ret = "*";
        }
      } else if (gtlt && anyX) {
        if (xm) {
          m = 0;
        }
        p = 0;
        if (gtlt === ">") {
          gtlt = ">=";
          if (xm) {
            M = +M + 1;
            m = 0;
            p = 0;
          } else {
            m = +m + 1;
            p = 0;
          }
        } else if (gtlt === "<=") {
          gtlt = "<";
          if (xm) {
            M = +M + 1;
          } else {
            m = +m + 1;
          }
        }
        if (gtlt === "<") {
          pr = "-0";
        }
        ret = `${gtlt + M}.${m}.${p}${pr}`;
      } else if (xm) {
        ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
      } else if (xp) {
        ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
      }
      debug2("xRange return", ret);
      return ret;
    });
  };
  const replaceStars = (comp, options) => {
    debug2("replaceStars", comp, options);
    return comp.trim().replace(re2[t2.STAR], "");
  };
  const replaceGTE0 = (comp, options) => {
    debug2("replaceGTE0", comp, options);
    return comp.trim().replace(re2[options.includePrerelease ? t2.GTE0PRE : t2.GTE0], "");
  };
  const hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
    if (isX(fM)) {
      from = "";
    } else if (isX(fm)) {
      from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
    } else if (isX(fp)) {
      from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
    } else if (fpr) {
      from = `>=${from}`;
    } else {
      from = `>=${from}${incPr ? "-0" : ""}`;
    }
    if (isX(tM)) {
      to = "";
    } else if (isX(tm)) {
      to = `<${+tM + 1}.0.0-0`;
    } else if (isX(tp)) {
      to = `<${tM}.${+tm + 1}.0-0`;
    } else if (tpr) {
      to = `<=${tM}.${tm}.${tp}-${tpr}`;
    } else if (incPr) {
      to = `<${tM}.${tm}.${+tp + 1}-0`;
    } else {
      to = `<=${to}`;
    }
    return `${from} ${to}`.trim();
  };
  const testSet = (set, version, options) => {
    for (let i = 0; i < set.length; i++) {
      if (!set[i].test(version)) {
        return false;
      }
    }
    if (version.prerelease.length && !options.includePrerelease) {
      for (let i = 0; i < set.length; i++) {
        debug2(set[i].semver);
        if (set[i].semver === Comparator2.ANY) {
          continue;
        }
        if (set[i].semver.prerelease.length > 0) {
          const allowed = set[i].semver;
          if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
            return true;
          }
        }
      }
      return false;
    }
    return true;
  };
  return range;
}
var comparator;
var hasRequiredComparator;
function requireComparator() {
  if (hasRequiredComparator) return comparator;
  hasRequiredComparator = 1;
  const ANY2 = Symbol("SemVer ANY");
  class Comparator2 {
    static get ANY() {
      return ANY2;
    }
    constructor(comp, options) {
      options = parseOptions2(options);
      if (comp instanceof Comparator2) {
        if (comp.loose === !!options.loose) {
          return comp;
        } else {
          comp = comp.value;
        }
      }
      comp = comp.trim().split(/\s+/).join(" ");
      debug2("comparator", comp, options);
      this.options = options;
      this.loose = !!options.loose;
      this.parse(comp);
      if (this.semver === ANY2) {
        this.value = "";
      } else {
        this.value = this.operator + this.semver.version;
      }
      debug2("comp", this);
    }
    parse(comp) {
      const r = this.options.loose ? re2[t2.COMPARATORLOOSE] : re2[t2.COMPARATOR];
      const m = comp.match(r);
      if (!m) {
        throw new TypeError(`Invalid comparator: ${comp}`);
      }
      this.operator = m[1] !== void 0 ? m[1] : "";
      if (this.operator === "=") {
        this.operator = "";
      }
      if (!m[2]) {
        this.semver = ANY2;
      } else {
        this.semver = new SemVer3(m[2], this.options.loose);
      }
    }
    toString() {
      return this.value;
    }
    test(version) {
      debug2("Comparator.test", version, this.options.loose);
      if (this.semver === ANY2 || version === ANY2) {
        return true;
      }
      if (typeof version === "string") {
        try {
          version = new SemVer3(version, this.options);
        } catch (er) {
          return false;
        }
      }
      return cmp2(version, this.operator, this.semver, this.options);
    }
    intersects(comp, options) {
      if (!(comp instanceof Comparator2)) {
        throw new TypeError("a Comparator is required");
      }
      if (this.operator === "") {
        if (this.value === "") {
          return true;
        }
        return new Range(comp.value, options).test(this.value);
      } else if (comp.operator === "") {
        if (comp.value === "") {
          return true;
        }
        return new Range(this.value, options).test(comp.semver);
      }
      options = parseOptions2(options);
      if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
        return false;
      }
      if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
        return false;
      }
      if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
        return true;
      }
      if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
        return true;
      }
      if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
        return true;
      }
      if (cmp2(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
        return true;
      }
      if (cmp2(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
        return true;
      }
      return false;
    }
  }
  comparator = Comparator2;
  const parseOptions2 = parseOptions_1;
  const { safeRe: re2, t: t2 } = reExports;
  const cmp2 = cmp_1;
  const debug2 = debug_1;
  const SemVer3 = semver$1;
  const Range = requireRange();
  return comparator;
}
requireRange();
requireRange();
requireRange();
requireRange();
requireRange();
requireRange();
const Comparator$1 = requireComparator();
const { ANY: ANY$1 } = Comparator$1;
requireRange();
requireRange();
requireRange();
const Comparator = requireComparator();
const { ANY } = Comparator;
[new Comparator(">=0.0.0-0")];
[new Comparator(">=0.0.0")];
const internalRe = reExports;
const parse = parse_1;
requireComparator();
requireRange();
var semver = {
  parse,
  re: internalRe.re,
  src: internalRe.src,
  tokens: internalRe.t
};
const execAsync = util.promisify(child_process.exec);
const store = new Store();
let mainWindow = null;
function createWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1e3,
    minHeight: 700,
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 20, y: 20 },
    backgroundColor: "#0a0a0a",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  const devServerUrl = process.env.VITE_DEV_SERVER_URL || process.env["VITE_DEV_SERVER_URL"] || (process.env.NODE_ENV !== "production" ? "http://localhost:5173" : null);
  if (devServerUrl) {
    console.log("Loading dev server:", devServerUrl);
    mainWindow.loadURL(devServerUrl);
    mainWindow.webContents.openDevTools();
    mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDesc) => {
      console.error("Failed to load:", errorCode, errorDesc);
      setTimeout(() => {
        mainWindow == null ? void 0 : mainWindow.loadURL(devServerUrl);
      }, 1e3);
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}
electron.app.whenReady().then(() => {
  createWindow();
  initializeScheduler();
  setTimeout(async () => {
    const repos = store.get("repositories", []);
    const cleaned = await cleanupMissingRepositories(repos);
    store.set("repositories", cleaned);
  }, 2e3);
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
electron.app.on("window-all-closed", () => {
  cleanupScheduler();
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("before-quit", () => {
  cleanupScheduler();
});
electron.ipcMain.handle("select-directory", async () => {
  const result = await electron.dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
    title: "Select Repository"
  });
  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }
  return result.filePaths[0];
});
electron.ipcMain.handle("scan-repository", async (_, repoPath) => {
  return await scanRepository(repoPath);
});
electron.ipcMain.handle("read-directory", async (_, dirPath) => {
  return await readDirectory(dirPath);
});
electron.ipcMain.handle("read-file", async (_, filePath) => {
  return await readFile(filePath);
});
electron.ipcMain.handle("detect-languages", async (_, repoPath) => {
  return await detectLanguages(repoPath);
});
electron.ipcMain.handle("get-repositories", async () => {
  const repos = store.get("repositories", []);
  return await validateRepositories(repos);
});
electron.ipcMain.handle("save-repositories", (_, repositories) => {
  store.set("repositories", repositories);
  return true;
});
electron.ipcMain.handle("remove-repository", (_, repoPath) => {
  const repos = store.get("repositories", []);
  const filtered = repos.filter((r) => r.path !== repoPath);
  store.set("repositories", filtered);
  return filtered;
});
electron.ipcMain.handle("cleanup-missing-repos", async () => {
  const repos = store.get("repositories", []);
  const cleaned = await cleanupMissingRepositories(repos);
  store.set("repositories", cleaned);
  return cleaned;
});
electron.ipcMain.handle("get-file-stats", async (_, repoPath) => {
  return await getFileSizeStats(repoPath);
});
electron.ipcMain.handle("get-cleanup-report", async (_, repoPath) => {
  return await generateCleanupReport(repoPath);
});
electron.ipcMain.handle("get-outdated-packages", async (_, repoPath, language) => {
  const languages = language ? [language] : await detectLanguages(repoPath);
  const allPackages = [];
  for (const lang of languages) {
    switch (lang) {
      case "javascript":
        const jsPackages = await getJsOutdatedPackages(repoPath);
        allPackages.push(...jsPackages);
        break;
      case "python":
        const pyPackages = await getPythonOutdated(repoPath);
        allPackages.push(...pyPackages);
        break;
      case "ruby":
        const rbPackages = await getRubyOutdated(repoPath);
        allPackages.push(...rbPackages);
        break;
      case "elixir":
        const exPackages = await getElixirOutdated(repoPath);
        allPackages.push(...exPackages);
        break;
    }
  }
  return allPackages;
});
async function getJsOutdatedPackages(repoPath) {
  try {
    const packageJsonPath = path.join(repoPath, "package.json");
    const packageJsonContent = await fs.readFile(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(packageJsonContent);
    const devDeps = new Set(Object.keys(packageJson.devDependencies || {}));
    let outdatedJson;
    try {
      const { stdout } = await execAsync("npm outdated --json", { cwd: repoPath });
      outdatedJson = stdout;
    } catch (error) {
      outdatedJson = error.stdout || "{}";
    }
    const outdated = JSON.parse(outdatedJson || "{}");
    const packages = [];
    for (const [name, info] of Object.entries(outdated)) {
      const current = info.current || "0.0.0";
      const wanted = info.wanted || current;
      const latest = info.latest || wanted;
      const currentParsed = semver.parse(current);
      const wantedParsed = semver.parse(wanted);
      let hasPatchUpdate = false;
      if (currentParsed && wantedParsed) {
        hasPatchUpdate = currentParsed.major === wantedParsed.major && currentParsed.minor === wantedParsed.minor && currentParsed.patch < wantedParsed.patch;
      }
      packages.push({
        name,
        current,
        wanted,
        latest,
        type: devDeps.has(name) ? "devDependencies" : "dependencies",
        hasPatchUpdate,
        language: "javascript"
      });
    }
    return packages.sort((a, b) => {
      if (a.hasPatchUpdate && !b.hasPatchUpdate) return -1;
      if (!a.hasPatchUpdate && b.hasPatchUpdate) return 1;
      return a.name.localeCompare(b.name);
    });
  } catch {
    return [];
  }
}
electron.ipcMain.handle("run-patch-batch", async (event, config) => {
  var _a;
  const { repoPath, branchName, packages, createPR, runTests: shouldRunTests, prTitle, prBody } = config;
  const sendProgress = (message, step, total) => {
    event.sender.send("patch-batch-progress", { message, step, total });
  };
  const totalSteps = shouldRunTests ? 8 : 6;
  let currentStep = 0;
  try {
    sendProgress("Checking branch safety...", ++currentStep, totalSteps);
    const repoInfo = await getRepoInfo(repoPath);
    const originalBranch = repoInfo.branch;
    if (repoInfo.hasChanges) {
      return { success: false, error: "Repository has uncommitted changes. Please commit or stash first." };
    }
    sendProgress("Creating git branch...", ++currentStep, totalSteps);
    await createBranch(repoPath, branchName);
    sendProgress("Updating packages...", ++currentStep, totalSteps);
    const byLanguage = /* @__PURE__ */ new Map();
    for (const pkg of packages) {
      const list = byLanguage.get(pkg.language) || [];
      list.push(pkg.name);
      byLanguage.set(pkg.language, list);
    }
    const allUpdated = [];
    const allFailed = [];
    for (const [lang, pkgNames] of byLanguage) {
      let result;
      switch (lang) {
        case "javascript":
          result = await updateJsPackages(repoPath, pkgNames);
          break;
        case "python":
          result = await updatePythonPackages(repoPath, pkgNames);
          break;
        case "ruby":
          result = await updateRubyPackages(repoPath, pkgNames);
          break;
        case "elixir":
          result = await updateElixirPackages(repoPath, pkgNames);
          break;
        default:
          result = { updated: [], failed: pkgNames };
      }
      allUpdated.push(...result.updated);
      allFailed.push(...result.failed);
    }
    sendProgress("Running clean install...", ++currentStep, totalSteps);
    const primaryLang = ((_a = packages[0]) == null ? void 0 : _a.language) || "javascript";
    const cleanCmd = getCleanInstallCommand(primaryLang);
    if (cleanCmd) {
      await execAsync(cleanCmd, { cwd: repoPath, timeout: 3e5 });
    }
    let testsPassed = true;
    if (shouldRunTests) {
      sendProgress("Running tests...", ++currentStep, totalSteps);
      const testCmd = getTestCommand(primaryLang);
      if (testCmd) {
        const testResult = await runTests(repoPath, testCmd);
        testsPassed = testResult.success;
        if (!testsPassed) {
          sendProgress("Tests failed, reverting changes...", ++currentStep, totalSteps);
          await abortChanges(repoPath, originalBranch);
          await deleteBranch(repoPath, branchName);
          return {
            success: false,
            error: "Tests failed. Changes reverted.",
            testOutput: testResult.output
          };
        }
      }
      sendProgress("Running linter...", ++currentStep, totalSteps);
      const lintCmd = getLintCommand(primaryLang);
      if (lintCmd) {
        const lintResult = await runLint(repoPath, lintCmd);
        if (!lintResult.success) {
          event.sender.send("patch-batch-warning", { message: "Linter found issues", output: lintResult.output });
        }
      }
    }
    sendProgress("Committing changes...", ++currentStep, totalSteps);
    const files = getFilesToCommit(primaryLang);
    await commitChanges(repoPath, `chore(deps): update ${allUpdated.length} packages to latest patch versions

Updated packages:
${allUpdated.map((p) => `- ${p}`).join("\n")}`, files);
    sendProgress("Pushing branch...", ++currentStep, totalSteps);
    await pushBranch(repoPath, branchName);
    let prUrl = null;
    if (createPR) {
      sendProgress("Creating pull request...", ++currentStep, totalSteps);
      prUrl = await createPullRequest(
        repoPath,
        prTitle || `chore(deps): update ${allUpdated.length} packages`,
        prBody || `## Summary
Automated patch version updates via Bridge.

### Updated packages
${allUpdated.map((p) => `- ${p}`).join("\n")}

${shouldRunTests ? "### Checks\n- [x] Tests passed\n- [x] Lint checked" : ""}`
      );
    }
    return {
      success: true,
      updatedPackages: allUpdated,
      failedPackages: allFailed,
      prUrl,
      testsPassed
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
});
async function updateJsPackages(repoPath, packages) {
  var _a, _b, _c, _d;
  const updated = [];
  const failed = [];
  const packageJsonPath = path.join(repoPath, "package.json");
  const packageJsonContent = await fs.readFile(packageJsonPath, "utf-8");
  const packageJson = JSON.parse(packageJsonContent);
  const outdated = await getJsOutdatedPackages(repoPath);
  const outdatedMap = new Map(outdated.map((p) => [p.name, p]));
  for (const pkgName of packages) {
    const pkg = outdatedMap.get(pkgName);
    if (!pkg || !pkg.hasPatchUpdate) {
      failed.push(pkgName);
      continue;
    }
    if ((_a = packageJson.dependencies) == null ? void 0 : _a[pkgName]) {
      const currentVersion = packageJson.dependencies[pkgName];
      const prefix = ((_b = currentVersion.match(/^[^0-9]*/)) == null ? void 0 : _b[0]) || "^";
      packageJson.dependencies[pkgName] = `${prefix}${pkg.wanted}`;
      updated.push(pkgName);
    } else if ((_c = packageJson.devDependencies) == null ? void 0 : _c[pkgName]) {
      const currentVersion = packageJson.devDependencies[pkgName];
      const prefix = ((_d = currentVersion.match(/^[^0-9]*/)) == null ? void 0 : _d[0]) || "^";
      packageJson.devDependencies[pkgName] = `${prefix}${pkg.wanted}`;
      updated.push(pkgName);
    } else {
      failed.push(pkgName);
    }
  }
  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
  return { updated, failed };
}
electron.ipcMain.handle("get-repo-info", async (_, repoPath) => {
  return await getRepoInfo(repoPath);
});
electron.ipcMain.handle("check-protected-branch", async (_, repoPath) => {
  return await isOnProtectedBranch(repoPath);
});
electron.ipcMain.handle("get-scheduled-jobs", () => {
  return getScheduledJobs();
});
electron.ipcMain.handle("add-scheduled-job", (_, job) => {
  return addScheduledJob(job);
});
electron.ipcMain.handle("update-scheduled-job", (_, jobId, updates) => {
  return updateScheduledJob(jobId, updates);
});
electron.ipcMain.handle("delete-scheduled-job", (_, jobId) => {
  return deleteScheduledJob(jobId);
});
electron.ipcMain.handle("get-job-results", (_, jobId) => {
  return getJobResults(jobId);
});
electron.ipcMain.on("scheduler-job-complete", (_, result) => {
  addJobResult(result);
});
electron.ipcMain.handle("check-security-scanner-available", async () => {
  return await checkAgenticFixerAvailable();
});
electron.ipcMain.handle("run-security-scan", async (event, repoPath) => {
  return await runSecurityScan(repoPath, (progress) => {
    event.sender.send("security-scan-progress", progress);
  });
});
electron.ipcMain.handle("generate-security-fix", async (_, finding) => {
  return await generateSecurityFix(finding);
});
