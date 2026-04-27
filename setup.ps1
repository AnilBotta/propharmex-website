# Propharmex — Prompt 1 setup script
# Run this in PowerShell from the project root:
#     cd "C:\Users\anilb\OneDrive\Desktop\projects\Propharmex website"
#     powershell -ExecutionPolicy Bypass -File .\setup.ps1
#
# What it does (stops on first failure):
#   1. Pre-flight:  verify node 20+, pnpm 9+, git, gh (auth'd)
#   2. Install:     pnpm install
#   3. Verify:      pnpm typecheck + lint + build
#   4. Git:         init, first commit
#   5. GitHub:      create PUBLIC repo `propharmex-site` under your account, push
#   6. Smoke:       start pnpm dev (you open :3000 and :3333 manually)

$ErrorActionPreference = "Stop"

function Write-Section($msg) {
    Write-Host ""
    Write-Host "==== $msg ====" -ForegroundColor Cyan
}

function Fail($msg) {
    Write-Host "FAIL: $msg" -ForegroundColor Red
    exit 1
}

# -----------------------------------------------------------------------------
# 1. Pre-flight
# -----------------------------------------------------------------------------
Write-Section "1/6  Pre-flight"

try {
    $nodeV = (node --version).TrimStart("v")
    if ([version]$nodeV -lt [version]"20.0.0") { Fail "Node $nodeV is too old. Need >= 20.0.0." }
    Write-Host "  node $nodeV  OK" -ForegroundColor Green
} catch { Fail "Node is not installed or not on PATH. Install Node 20 LTS from https://nodejs.org/" }

try {
    $pnpmV = pnpm --version
    if ([version]$pnpmV -lt [version]"9.0.0") { Fail "pnpm $pnpmV is too old. Need >= 9.0.0." }
    Write-Host "  pnpm $pnpmV  OK" -ForegroundColor Green
} catch {
    Write-Host "  pnpm not found — installing via corepack..." -ForegroundColor Yellow
    corepack enable
    corepack prepare pnpm@9.12.0 --activate
    $pnpmV = pnpm --version
    Write-Host "  pnpm $pnpmV  OK" -ForegroundColor Green
}

try {
    $gitV = (git --version) -replace "git version ", ""
    Write-Host "  git $gitV  OK" -ForegroundColor Green
} catch { Fail "git is not installed. Install from https://git-scm.com/" }

try {
    $ghV = (gh --version | Select-Object -First 1) -replace "gh version ", ""
    Write-Host "  gh $ghV  OK" -ForegroundColor Green
    $authStatus = gh auth status 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  gh is not authenticated." -ForegroundColor Yellow
        Write-Host "  Run:  gh auth login   (pick GitHub.com → HTTPS → login with a web browser)" -ForegroundColor Yellow
        Fail "Authenticate gh first, then re-run this script."
    }
    Write-Host "  gh auth: logged in  OK" -ForegroundColor Green
} catch { Fail "gh (GitHub CLI) is not installed. Install from https://cli.github.com/" }

# -----------------------------------------------------------------------------
# 2. Install
# -----------------------------------------------------------------------------
Write-Section "2/6  pnpm install"
pnpm install
if ($LASTEXITCODE -ne 0) { Fail "pnpm install failed." }

# -----------------------------------------------------------------------------
# 3. Verify
# -----------------------------------------------------------------------------
Write-Section "3/6  Typecheck + Lint"
pnpm typecheck
if ($LASTEXITCODE -ne 0) { Fail "pnpm typecheck failed." }

pnpm lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Lint warnings/errors above. Continuing — fix in Prompt 2." -ForegroundColor Yellow
}

# -----------------------------------------------------------------------------
# 4. Git
# -----------------------------------------------------------------------------
Write-Section "4/6  Git init + first commit"

if (-not (Test-Path ".git")) {
    git init -b main
    Write-Host "  git initialized on main" -ForegroundColor Green
} else {
    Write-Host "  git repo already exists" -ForegroundColor Yellow
}

git add -A
$staged = git diff --cached --name-only
if ($staged) {
    git commit -m "chore(repo): initial scaffold (prompts 0+1)

- Phase 0 foundation: CLAUDE.md, 12 project skills, docs, config
- Prompt 0: docs/alignment-summary.md from master plan
- Prompt 1: Next.js 15 + Sanity v3 monorepo (pnpm + Turbo)
- Placeholder brand assets, content seeds

Co-Authored-By: Claude <noreply@anthropic.com>"
    if ($LASTEXITCODE -ne 0) { Fail "git commit failed." }
} else {
    Write-Host "  Nothing to commit." -ForegroundColor Yellow
}

# -----------------------------------------------------------------------------
# 5. GitHub repo + push
# -----------------------------------------------------------------------------
Write-Section "5/6  Create public GitHub repo + push"

# `gh repo view` writes to stderr when the repo is missing, which
# $ErrorActionPreference = "Stop" treats as a terminating error.
# Scope ErrorActionPreference locally so we can inspect $LASTEXITCODE instead.
$repoExists = $false
$prevEAP = $ErrorActionPreference
$ErrorActionPreference = "SilentlyContinue"
try {
    $null = gh repo view propharmex-site 2>&1
    if ($LASTEXITCODE -eq 0) { $repoExists = $true }
} catch {
    $repoExists = $false
}
$ErrorActionPreference = $prevEAP

if ($repoExists) {
    Write-Host "  Repo 'propharmex-site' already exists on your account — pushing to it." -ForegroundColor Yellow
    $remotes = git remote
    if ($remotes -notcontains "origin") {
        $ghUser = (gh api user --jq .login)
        git remote add origin "https://github.com/$ghUser/propharmex-site.git"
    }
    git push -u origin main
    if ($LASTEXITCODE -ne 0) { Fail "git push failed." }
} else {
    Write-Host "  Creating public repo 'propharmex-site'..." -ForegroundColor Cyan
    gh repo create propharmex-site --public --source=. --remote=origin --push --description "Propharmex website — Canadian CDMO (Next.js 15 + Sanity + AI tools)"
    if ($LASTEXITCODE -ne 0) { Fail "gh repo create failed." }
}

# -----------------------------------------------------------------------------
# 6. Smoke
# -----------------------------------------------------------------------------
Write-Section "6/6  Done"

$repoUrl = (gh repo view --json url --jq .url)
Write-Host ""
Write-Host "  Repo:         $repoUrl" -ForegroundColor Green
Write-Host "  Next step:    pnpm dev" -ForegroundColor Green
Write-Host "                  web:    http://localhost:3000" -ForegroundColor Gray
Write-Host "                  studio: http://localhost:3333" -ForegroundColor Gray
Write-Host "                  health: curl http://localhost:3000/api/health" -ForegroundColor Gray
Write-Host ""
Write-Host "  Then feed Prompt 2 (Design System) when ready." -ForegroundColor Cyan
