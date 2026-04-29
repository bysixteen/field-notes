// Storybook documentation helpers — stub barrel export
export { DocPage } from './DocPage';
export { TokenTable } from './TokenTable';
export { Swatch } from './Swatch';
export { DemoBox } from './DemoBox';
export { DosDonts } from './DosDonts';
export { FigmaRef } from './FigmaRef';
export { Callout } from './Callout';

export type DimensionalToken = {
  figmaPath: string;
  cssProperty: string;
  category: 'color' | 'spacing' | 'typography' | 'structure';
};
