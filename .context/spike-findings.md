# Phase 0 spike findings — R1, R2, R3

**Date:** 2026-05-03
**Master plan:** #218
**Spike workspace (throwaway):** `/tmp/fn-spikes/`

All three spikes **passed**. Cutover (commit `pnpm-workspace.yaml`, transform root `package.json`) is unblocked.

---

## R1 — Fumadocs in `apps/docs/` workspace nesting + static export

**Pass criterion:** `next build` from `apps/docs/` produces working `out/`; content paths and route handlers resolve correctly.

**Result: ✅ PASS**

- `next build` from `apps/docs/` succeeds.
- 82 HTML pages generated, ~29 MB `out/`.
- All four domain routes (`/design-system`, `/principles`, `/claude`, `/platform`) plus home + `/api/search` resolve correctly.
- Static export preserved (`output: 'export'` in `next.config.mjs`).

**Prerequisites that must land in Phase 3 setup:**

1. **`fumadocs-mdx` CLI must run before `next build`.** The `.source/` directory generation isn't auto-triggered when wrapped via `withMDX(config)` alone in this nested setup. Add to `apps/docs/package.json` scripts:
   ```json
   "prebuild": "fumadocs-mdx",
   "build": "node scripts/generate-llms-txt.mjs && next build"
   ```
   Or fold into a single line: `"build": "fumadocs-mdx && node scripts/generate-llms-txt.mjs && next build"`.

2. **`@types/mdx` must be an explicit devDependency** of `apps/docs/`. pnpm's stricter hoisting (vs npm's transitive resolution) doesn't auto-expose it. Without it, `next build` compiles fine but type-check fails on `import type { MDXComponents } from 'mdx/types'` in `components/mdx.tsx`.

Both are minor and one-time additions to `apps/docs/package.json` during Phase 3 cutover.

---

## R2 — `/studio` in static-export Next.js app

**Pass criterion:** throwaway `/studio` page imports culori (deep), renders OKLCH ramp on state change, builds static. Initial JS budget: 250 kB gzipped.

**Result: ✅ PASS** with significant headroom.

| Metric | Value |
|---|---|
| /studio total initial JS (raw) | 653.7 kB |
| /studio total initial JS (gzipped) | **196.7 kB** |
| Budget (gzipped) | 250.0 kB |
| Headroom | **53.3 kB** |
| /studio-specific chunk (not shared with home) | 6.1 kB gzipped (1 chunk) |
| Home page initial JS for context | 232.4 kB gzipped |

**Notes:**

- culori deep imports (`culori/fn`, with `useMode(modeOklch)` / `useMode(modeRgb)` registration) tree-shake correctly. Only 6.1 kB of /studio-specific JS — the rest is shared framework + Fumadocs UI chunks.
- /studio is *lighter* than the home page (which loads search + MDX components) — good ergonomics for the Phase 3 build.
- 53 kB headroom should comfortably fit the actual UI controls (Radix UI primitives + shadcn/ui starter components + dimensional pickers).
- Route shows as `○ (Static)` in Next 16's build output — static export preserved.

**Throwaway page tested:**

```typescript
'use client';
import { useState, useMemo } from 'react';
import { parse, converter, formatHex, modeOklch, modeRgb, useMode } from 'culori/fn';
useMode(modeOklch);
useMode(modeRgb);
// ... color picker → 12-step ramp on state change
```

This pattern works as expected under Next 16.2 + Turbopack with `output: 'export'`.

---

## R3 — CLI as workspace package

**Pass criterion:** `pnpm install <path>` (or workspace-protocol resolution) from a consumer dir produces a working binary; `field-notes init` in `/tmp/` produces files.

**Result: ✅ PASS**

**Verified via three invocation paths:**

1. **`pnpm install /tmp/fn-spikes/packages/cli` from a fresh consumer dir** — links the workspace package, creates `node_modules/.bin/fn-spike` (POSIX shell wrapper).
2. **Direct invocation:** `./node_modules/.bin/fn-spike init --target /tmp/r3-test-2` — works, produces `tokens.json` + `DESIGN.md` in target.
3. **`npx --no-install fn-spike init --target /tmp/r3-test-3`** — works (real-world consumer pattern).

**Minor finding (non-blocking):**

- `pnpm --filter <pkg> exec <bin>` from *within* the workspace failed with "Command not found." This is a pnpm workspace bin-hoisting quirk, not a consumer-side problem. The consumer-install path (the actual pass criterion) works. Phase 2 implementation can ignore this — but if local-dev convenience matters, link via `pnpm --filter <pkg> exec node ./bin/...` directly, or use root-level scripts.

**Throwaway CLI shape tested:**

```javascript
// packages/cli/bin/fn-spike.mjs
#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'node:fs';
// argv parsing → mkdir + writeFile
```

```json
// packages/cli/package.json
{ "name": "field-notes-cli-spike", "type": "module", "bin": { "fn-spike": "./bin/fn-spike.mjs" } }
```

---

## Implications for Phase 1+ implementation

- pnpm workspace nesting validated. Repo shape from the brief (`apps/docs/` + `packages/{lib, cli, skills}`) is achievable.
- Bundle budget for `/studio` is comfortably reachable. The 250 kB gzipped target is realistic for Phase 3.
- CLI distribution via `pnpm install <path>` works for local-link smoke testing in Phase 2.
- Static export (`output: 'export'`) is preserved across all three spikes — GitHub Pages deploy after Phase 3 cutover is unblocked.

## Cleanup

- `/tmp/fn-spikes/` is the throwaway spike workspace. Safe to delete.
- `/tmp/r3-consumer/`, `/tmp/r3-test-{1,2,3}/` are throwaway consumer / target dirs from R3 testing. Safe to delete.
