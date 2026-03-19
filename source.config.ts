import { defineDocs, defineConfig } from 'fumadocs-mdx/config';

export const designSystem = defineDocs({
  dir: 'content/design-system',
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
