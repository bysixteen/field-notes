import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'Field Notes',
      url: '/',
    },
    links: [
      { text: 'Principles', url: '/principles', active: 'nested-url' },
      { text: 'Claude', url: '/claude', active: 'nested-url' },
      { text: 'Platform', url: '/platform', active: 'nested-url' },
      { text: 'Design System', url: '/design-system', active: 'nested-url' },
    ],
  };
}
