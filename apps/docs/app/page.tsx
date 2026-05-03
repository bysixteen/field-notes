import Link from 'next/link';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

const domains = [
  {
    href: '/principles',
    title: 'Principles',
    description:
      'Core principles, synthesis and validation, journey mapping.',
    pages: 8,
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
    ),
  },
  {
    href: '/claude',
    title: 'Claude & AI',
    description:
      'Context engineering, CLAUDE.md playbook, Claude Code setup, workflow architectures, and skill-based automation.',
    pages: 9,
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
    ),
  },
  {
    href: '/platform',
    title: 'Platform',
    description:
      'Architecture patterns, monorepo structure, data and auth, bootstrapping.',
    pages: 12,
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
    ),
  },
  {
    href: '/design-system',
    title: 'Design System',
    description:
      'Multi-dimensional token model, composition rules, naming conventions, and constraints.',
    pages: 44,
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
    ),
  },
];

export default function HomePage() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="container mx-auto max-w-[1100px] py-20 md:py-32">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold md:text-5xl">Field Notes</h1>
          <p className="text-fd-muted-foreground mt-3 text-lg">
            Design engineering knowledge, distilled.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-6">Domains</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {domains.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className="flex flex-col rounded-xl border bg-fd-card p-5 transition-colors hover:bg-fd-accent"
            >
              <div className="text-fd-muted-foreground mb-4">{d.icon}</div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{d.title}</h3>
                <span className="text-fd-muted-foreground text-xs">{d.pages} pages</span>
              </div>
              <p className="text-fd-muted-foreground text-sm mt-1.5 flex-1">
                {d.description}
              </p>
            </Link>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-6 mt-16">I need to...</h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: '/principles/new-project-checklist', label: 'Start a new project', desc: 'Bootstrap sequence from zero to running CI' },
            { href: '/claude/claude-code-setup', label: 'Set up Claude Code', desc: 'CLAUDE.md, rules, hooks, and sessions' },
            { href: '/platform/bootstrap-commands', label: 'Get the CLI commands', desc: 'Copy-paste scaffolding sequences' },
            { href: '/claude/skills-catalogue', label: 'Find a skill', desc: 'Browse available automation skills' },
            { href: '/design-system/model', label: 'Understand the token model', desc: 'Five orthogonal dimensions explained' },
            { href: '/design-system/figma-documentation-rules', label: 'Document in Figma', desc: 'Rules for token pages and components' },
            { href: '/platform/dependency-catalogue', label: 'Choose packages', desc: 'Curated picks grouped by purpose' },
            { href: '/platform/stack-decisions', label: 'Record a tech decision', desc: 'ADR template and trade-off tables' },
          ].map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="flex flex-col rounded-lg border bg-fd-card p-4 transition-colors hover:bg-fd-accent"
            >
              <span className="font-medium text-sm">{q.label}</span>
              <span className="text-fd-muted-foreground text-xs mt-1">{q.desc}</span>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-xl border bg-fd-card p-6">
          <h2 className="text-lg font-semibold mb-2">For AI Agents</h2>
          <p className="text-fd-muted-foreground text-sm mb-4">
            Add this to any project&apos;s <code className="text-xs bg-fd-accent px-1.5 py-0.5 rounded">CLAUDE.md</code> to give agents access to documented patterns. Use the index — agents fetch specific pages as needed rather than loading everything at once:
          </p>
          <pre className="bg-fd-accent rounded-lg p-4 text-sm overflow-x-auto">
            <code>See https://bysixteen.github.io/field-notes/llms.txt for design engineering pattern index</code>
          </pre>
        </div>
      </div>
    </HomeLayout>
  );
}
