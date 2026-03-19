Add a new domain to Field Notes.

## Steps

1. Ask for the domain name, route path, and description
2. Generate a kebab-case directory name from the domain name

### Source configuration

3. Add to `source.config.ts`:
   ```ts
   export const {name} = defineDocs({ dir: 'content/{dirname}' });
   ```
4. Add to `lib/source.ts`:
   ```ts
   export const {name}Source = loader({
     baseUrl: '/{dirname}',
     source: {name}.toFumadocsSource(),
   });
   ```
   Add `{name}Source` to the `allSources` array.

### Routes

5. Create `app/{dirname}/layout.tsx`:
   ```tsx
   import { {name}Source } from '@/lib/source';
   import { DocsLayout } from 'fumadocs-ui/layouts/docs';
   import { baseOptions } from '@/lib/layout.shared';
   import type { ReactNode } from 'react';

   export default function Layout({ children }: { children: ReactNode }) {
     return (
       <DocsLayout tree={{name}Source.getPageTree()} {...baseOptions()}>
         {children}
       </DocsLayout>
     );
   }
   ```
6. Create `app/{dirname}/[[...slug]]/page.tsx` following the pattern in existing domains.

### Navigation

7. Add to `lib/layout.shared.tsx` links array:
   ```ts
   { text: '{Domain Name}', url: '/{dirname}', active: 'nested-url' },
   ```

### Content

8. Create `content/{dirname}/meta.json`:
   ```json
   { "title": "{Domain Name}", "pages": ["index"] }
   ```
9. Create `content/{dirname}/index.mdx` with title and description frontmatter.

### LLM integration

10. Add entry to `DOMAINS` array in `scripts/generate-llms-txt.mjs`
11. Add domain card to `app/page.tsx` domains array

### Verification

12. Run `npm run build` — all pages compile
13. New domain appears in top navigation bar
14. New domain appears in `public/llms.txt`
