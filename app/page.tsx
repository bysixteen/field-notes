import Link from 'next/link';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

const domains = [
  {
    href: '/design-system',
    title: 'Design System',
    description:
      'Multi-dimensional token model, composition rules, naming conventions, and constraints.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
    ),
  },
  {
    href: '/principles',
    title: 'Principles',
    description:
      'Core principles, Pioneer framework, Project Squad toolkit, synthesis and validation.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
    ),
  },
  {
    href: '/claude',
    title: 'Claude & AI',
    description:
      'CLAUDE.md playbook, agent efficiency research, skill-based automation patterns.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
    ),
  },
  {
    href: '/platform',
    title: 'Platform',
    description:
      'Architecture patterns, monorepo structure, data and auth, documentation hub.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
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
              <h3 className="font-semibold">{d.title}</h3>
              <p className="text-fd-muted-foreground text-sm mt-1.5 flex-1">
                {d.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </HomeLayout>
  );
}
