---
globs: ["content/**/*.mdx", "content/**/meta.json"]
---

# Content Conventions

- Sidebar navigation via `meta.json` files in each directory
- meta.json separator syntax: `"---Label---"` (three dashes each side)
- Filenames in meta.json are without extension (e.g., `"my-page"` not `"my-page.mdx"`)
- Cross-reference within a domain using relative links
- Cross-reference across domains using absolute paths (e.g., `/principles/answer-first`)
- Static export (`output: 'export'`) means no server-side API routes — search uses `staticGET`

## Adding a new domain

1. Add `defineDocs()` in `source.config.ts`
2. Add loader in `lib/source.ts` and to `allSources` array
3. Create `app/{domain}/layout.tsx` and `app/{domain}/[[...slug]]/page.tsx`
4. Add nav link in `lib/layout.shared.tsx`
5. Create `content/{domain}/` with `meta.json` and `index.mdx`
6. Add domain entry to `DOMAINS` array in `scripts/generate-llms-txt.mjs`
7. Verify: `npm run dev` renders the domain, `npm run build` succeeds
