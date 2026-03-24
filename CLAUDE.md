# Field Notes

Multi-domain knowledge hub built with Fumadocs (MDX + Next.js).

## Commands

- `npm run dev` — start development server
- `npm run build` — static export to `out/` (includes llms.txt generation)
- `npm run generate:llms` — regenerate llms.txt and llms-full.txt only

## Structure

Four domains: `design-system`, `principles`, `claude`, `platform`. Each has its own source in `source.config.ts`, loader in `lib/source.ts`, and route in `app/{domain}/`.

## Git

- Branch prefixes: `feat/`, `fix/`, `docs/`, `refactor/`, `chore/`
- Commits: Conventional Commits — `type(scope): description`

## Content

- All `.mdx` files in `content/{domain}/`, lowercase kebab-case
- Frontmatter requires `title` and `description`
- Add filenames (without extension) to directory's `meta.json`
- All content must be project-agnostic
- Run `npm run generate:llms` after content changes

## Deployment

Static site on GitHub Pages. Push to `main` triggers deploy.
Live at: `https://bysixteen.github.io/field-notes/`
