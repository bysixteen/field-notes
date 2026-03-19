Add a new page to Field Notes.

## Steps

1. Ask which domain: `design-system`, `principles`, `claude`, or `platform`
2. Ask for the page title and a one-line description
3. Generate a kebab-case filename from the title
4. Create `content/{domain}/{filename}.mdx` with frontmatter:
   ```
   ---
   title: {title}
   description: {description}
   ---
   ```
5. Add `"{filename}"` to `content/{domain}/meta.json` in the appropriate position
6. Run `npm run generate:llms` to update llms.txt and llms-full.txt
7. Run `npm run build` to verify the page compiles

## Verification

- The new page appears in the sidebar under the correct domain
- `npm run build` passes with no errors
- The page appears in `public/llms.txt`
