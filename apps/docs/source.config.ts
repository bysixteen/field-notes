import { defineDocs, defineConfig } from 'fumadocs-mdx/config';

export const designSystem = defineDocs({
  dir: 'content/design-system',
  // Component contract sidecars (`*.contract.md`) are tooling-facing data
  // for the dimensional walker, not user-facing docs. Exclude them so
  // fumadocs doesn't try to render them as pages.
  docs: {
    files: ['**/*.{md,mdx}', '!**/*.contract.md'],
  },
});

export const principles = defineDocs({
  dir: 'content/principles',
});

export const claude = defineDocs({
  dir: 'content/claude',
});

export const platform = defineDocs({
  dir: 'content/platform',
});

export default defineConfig();
