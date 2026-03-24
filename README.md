```
       ███████ ██ ███████ ██      ██████
       ██      ██ ██      ██      ██   ██
       █████   ██ █████   ██      ██   ██
       ██      ██ ██      ██      ██   ██
       ██      ██ ███████ ███████ ██████

       ██   ██  ██████  ████████ ███████ ███████
       ████  ██ ██    ██    ██    ██      ██
       ██ ██ ██ ██    ██    ██    █████   ███████
       ██  ████ ██    ██    ██    ██           ██
       ██   ███  ██████     ██    ███████ ███████

              Design engineering reference
```

Design engineering knowledge, distilled.

## Domains

| Domain | Route | Description | Pages |
|--------|-------|-------------|-------|
| Design System | `/design-system` | Token model, composition rules, naming conventions, constraints | 16 |
| Principles | `/principles` | Core principles, Delivery Framework, Project Squad, validation | 12 |
| Claude & AI | `/claude` | Context engineering, CLAUDE.md playbook, workflow architectures | 8 |
| Platform | `/platform` | Architecture patterns, monorepo structure, data and auth | 19 |

## For AI Agents

Add this to any project's `CLAUDE.md` to give agents access to all documented patterns:

```markdown
See https://bysixteen.github.io/field-notes/llms-full.txt for design engineering patterns
```

Field Notes generates two machine-readable files on every build:

- **`llms.txt`** — structured index of all pages with descriptions
- **`llms-full.txt`** — full content dump for one-shot context loading

## Quick Start

```bash
npm run dev              # Start development server
npm run build            # Static export to out/ (includes llms.txt)
npm run generate:llms    # Regenerate llms.txt and llms-full.txt only
```

## Live Site

[bysixteen.github.io/field-notes](https://bysixteen.github.io/field-notes/)

Deployed to GitHub Pages on every push to `main`.

## Contributing

- Content lives in `content/{domain}/` as `.mdx` files
- Every page needs `title` and `description` frontmatter
- Add filenames (without extension) to the directory's `meta.json`
- Lowercase kebab-case filenames, project-agnostic content only
- Run `npm run generate:llms` after content changes
