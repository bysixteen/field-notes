import { designSystem, principles, claude, platform } from 'collections/server';
import { loader } from 'fumadocs-core/source';

export const designSystemSource = loader({
  baseUrl: '/design-system',
  source: designSystem.toFumadocsSource(),
});

export const principlesSource = loader({
  baseUrl: '/principles',
  source: principles.toFumadocsSource(),
});

export const claudeSource = loader({
  baseUrl: '/claude',
  source: claude.toFumadocsSource(),
});

export const platformSource = loader({
  baseUrl: '/platform',
  source: platform.toFumadocsSource(),
});

export const allSources = [
  designSystemSource,
  principlesSource,
  claudeSource,
  platformSource,
];
