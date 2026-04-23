# setup-prompt2.ps1
# Propharmex - Prompt 2 (Design System) install + verify + commit helper
#
# Usage:
#   cd "C:\Users\anilb\OneDrive\Desktop\projects\Propharmex website"
#   .\setup-prompt2.ps1

$ErrorActionPreference = "Stop"

function Step {
    param([string]$msg)
    Write-Host ""
    Write-Host ("==> " + $msg) -ForegroundColor Cyan
}

function Ok {
    param([string]$msg)
    Write-Host ("    " + $msg) -ForegroundColor Green
}

function Warn {
    param([string]$msg)
    Write-Host ("    " + $msg) -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Propharmex - Prompt 2 (Design System) setup" -ForegroundColor Magenta
Write-Host "============================================="  -ForegroundColor Magenta

# 1. Prerequisites
Step "Checking prerequisites"

$nodeVersion = node --version 2>$null
$pnpmVersion = pnpm --version 2>$null

if (-not $nodeVersion) { throw "Node.js 20+ required. Install from https://nodejs.org" }
if (-not $pnpmVersion) { throw "pnpm 9+ required. Install: npm install -g pnpm@9.12.0" }

Ok ("Node " + $nodeVersion)
Ok ("pnpm " + $pnpmVersion)

# 2. Install dependencies
Step "Installing dependencies [Radix, Embla, Framer Motion, Storybook 8]"
pnpm install
if ($LASTEXITCODE -ne 0) { throw "pnpm install failed" }
Ok "Dependencies installed"

# 3. Typecheck
Step "Typechecking all workspaces"
pnpm typecheck
if ($LASTEXITCODE -ne 0) {
    Warn "Typecheck errors detected."
    exit 1
}
Ok "Typecheck clean"

# 4. Lint
Step "Linting all workspaces"
pnpm lint
if ($LASTEXITCODE -ne 0) {
    Warn "Lint errors detected."
    exit 1
}
Ok "Lint clean"

# 5. Unit tests
Step "Running unit tests"
pnpm test
if ($LASTEXITCODE -ne 0) {
    Warn "Unit tests failed."
    exit 1
}
Ok "Unit tests pass"

# 6. Storybook smoke build
Step "Building Storybook [smoke test for all 18 stories]"
pnpm build-storybook
if ($LASTEXITCODE -ne 0) {
    Warn "Storybook build failed."
    exit 1
}
Ok "Storybook built to storybook-static/"

# 7. Commit
Step "Staging + committing Prompt 2 deliverables"

git add packages/config/design-tokens.css
git add packages/config/package.json
git add apps/web/app/globals.css
git add apps/web/app/layout.tsx
git add packages/ui
git add .storybook
git add docs/design-system.mdx
git add docs/design-system
git add package.json
git add pnpm-lock.yaml
git add .github/workflows/ci.yml
git add README.md
git add setup-prompt2.ps1

$lines = @()
$lines += "feat(design-system): Prompt 2 - tokens, 18 components, Storybook, docs"
$lines += ""
$lines += "- Authored design tokens in packages/config/design-tokens.css:"
$lines += "  Deep Teal primary (50-950), Warm Amber accent, Pharma White"
$lines += "  neutrals, Manrope + Inter Tight + JetBrains Mono stack,"
$lines += "  spacing 4-96, radii 4-24 (default 12), pharma glass shadow"
$lines += "  set, motion 240/180/40ms."
$lines += "- Wired three-family fonts into apps/web/app/layout.tsx via"
$lines += "  next/font/google; shrunk globals.css to two imports."
$lines += "- Built 18 components under packages/ui/components with CVA"
$lines += "  variants, Radix primitives (Select, Tabs, Accordion, Dialog,"
$lines += "  Sheet, Tooltip), and Framer Motion (Marquee, Carousel)."
$lines += "  Every interactive component is keyboard-navigable,"
$lines += "  focus-ring-visible, and honors prefers-reduced-motion."
$lines += "- Added Storybook 8 with a11y + interactions addons, one story"
$lines += "  file per component, and CI storybook-build job."
$lines += "- Authored docs/design-system.mdx plus per-component MDX"
$lines += "  (anatomy, props, states, tokens, a11y, motion, examples)"
$lines += "  for all 18 components."
$lines += "- Added unit tests for MOTION tokens and Button component."
$lines += ""
$lines += "Closes Prompt 2."
$lines += ""
$lines += "Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"

$commitMsg = $lines -join "`n"
$tmp = New-TemporaryFile
Set-Content -Path $tmp.FullName -Value $commitMsg -Encoding UTF8

git commit -F $tmp.FullName
$commitExit = $LASTEXITCODE
Remove-Item $tmp.FullName -ErrorAction SilentlyContinue

if ($commitExit -ne 0) {
    Warn "Commit failed - possibly nothing to commit or pre-commit hook fired."
    git status
    exit 1
}
Ok "Committed."

git status

# 8. Next steps
Write-Host ""
Write-Host "=============================================" -ForegroundColor Magenta
Write-Host "Prompt 2 complete." -ForegroundColor Green
Write-Host ""
Write-Host "Next:" -ForegroundColor White
Write-Host "  1. Open Storybook:   pnpm storybook   [http://localhost:6006]"
Write-Host "  2. Boot the web app: pnpm dev         [http://localhost:3000]"
Write-Host "  3. Push when ready:  git push origin main"
Write-Host "  4. Then run Prompt 3 [App shell + CMS]."
Write-Host ""
