# DEPRECATED — `apps/studio` was retired in PR-L′

The Sanity Studio is now embedded inside `apps/web` at the `/studio`
route. Schemas, desk structure, presentation resolver, and the studio
config have all moved to:

- `apps/web/sanity/schemas/**`
- `apps/web/sanity/structure/`
- `apps/web/sanity/presentation/`
- `apps/web/sanity.config.ts`
- `apps/web/sanity.cli.ts`

## Status

This folder is **excluded from the pnpm workspace** (`pnpm-workspace.yaml`
explicitly lists `apps/web` instead of `apps/*`), so it is no longer
built, linted, or typechecked.

## Removal

Once the embedded studio is verified in the production Vercel deploy,
delete this folder physically:

```bash
git rm -rf apps/studio
git commit -m "chore(studio): physically remove retired apps/studio (PR-L′ follow-up)"
```

The implementation session for PR-L′ could not run shell commands to do
this automatically (cygwin fork failures on the Windows host); the
operator runs it as the final step of the cutover.

## Why a separate hop

Implemented as a soft-decommission first to reduce blast radius:

1. The workspace exclusion stops pnpm/turbo from acting on `apps/studio`.
2. The folder remains on disk so any in-flight branches with edits to
   `apps/studio` can resolve cleanly without merge conflicts inside the
   PR-L′ tree.
3. After production verification, the operator deletes it in a single
   tiny follow-up commit — no risk to the live editor.

If you reach this file and the embedded studio at `/studio` is working,
the deletion is safe.
