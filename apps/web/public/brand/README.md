# Brand assets — placeholders

All files in this folder are **placeholders** generated in Prompt 1. They are intentionally neutral so real brand assets can be swapped in without refactoring.

## File inventory

| Path | Purpose | Replace with |
|---|---|---|
| `logo.svg` | Light-surface wordmark | Final logomark + wordmark SVG, single-color, currentColor-driven |
| `logo-dark.svg` | Dark-surface wordmark | Same, white-on-transparent |
| `og-default.svg` | Static Open Graph image | Prompt 23 replaces with dynamic `next/og` PNG |
| `favicon.svg` (in `/public/favicon.svg`) | Tab icon | Final favicon (SVG + ICO) |
| `cert/del.svg` | Health Canada DEL badge | Official DEL assurance logo |
| `cert/iso-9001.svg` | ISO 9001 | Official ISO-registered certifier logo |
| `cert/who-gmp.svg` | WHO-GMP | Actual GMP certificate image |
| `cert/usfda.svg` | US FDA capability | Accurate US FDA capability claim artwork |
| `cert/tga.svg` | TGA (Australia) | Official TGA registration artwork |
| `facility/mississauga-placeholder.svg` | Canada site hero | Real facility photograph (16:9, ≥ 2400px wide) |
| `facility/hyderabad-placeholder.svg` | India site hero | Real facility photograph (16:9, ≥ 2400px wide) |
| `leadership/placeholder-headshot.svg` | Leader card fallback | Per-leader 1:1 headshot (≥ 800×800) |

## Rules (CLAUDE.md §10)

- **Do not imply any certification Propharmex does not hold.** Every cert placeholder reads `placeholder` in a visible label. Before production, verify with the regulatory team which certifications are current and in scope.
- Cert logos from official bodies often require licensing — use the licensed mark, not a redrawn version.
- Headshots require explicit written consent from each leader.

## How to swap

1. Drop real files with the same filenames into this folder.
2. Remove `-placeholder` from filenames where that suffix exists.
3. Update any hardcoded reference in `apps/web/app/**` (grep for `/brand/`).
4. Re-run `pnpm build` to regenerate Open Graph and image metadata.
