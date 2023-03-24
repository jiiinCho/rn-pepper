import { Platform, PlatformOSType } from 'react-native';

import { fontConfig } from './themes/v2/tokens';
import { typescale } from './themes/v3/tokens';
import type { Fonts, MD3TypescaleKey, MD3Type, MD3Typescale } from '../types';

type MD3FontsConfig =
  | { [key in MD3TypescaleKey]: Partial<MD3Type> }
  | { [key: string]: MD3Type }
  | Partial<MD3Type>;

function configureV3Fonts(
  config: MD3FontsConfig,
): MD3Typescale | (MD3Typescale & { [key: string]: MD3Type }) {
  if (!config) {
    return typescale;
  }

  // true case: config = { fontFamily: 'sans=serif', letterSpacing: 3 }
  // false case: config = { displayLarge: { fontFamily: 'sans=serif', letterSpacing: 3 }}
  const isFlatConfig = Object.keys(config).every(
    (key) => typeof config[key as keyof MD3FontsConfig] !== 'object',
  );

  if (isFlatConfig) {
    return Object.fromEntries(
      Object.entries(typescale).map(([variantName, variantProperties]) => [
        variantName,
        { ...variantProperties, ...config },
      ]),
    ) as MD3Typescale;
  }

  return Object.assign(
    typescale,
    ...Object.entries(config).map(([variantName, variantProperties]) => ({
      [variantName]: {
        ...typescale[variantName as MD3TypescaleKey],
        ...variantProperties,
      },
    })),
  );
}

type MD2FontConfig = {
  [platform in PlatformOSType | 'default']?: Fonts;
};

function configureV2Fonts(config: MD2FontConfig): Fonts {
  const fonts = Platform.select({ ...fontConfig, ...config }) as Fonts;
  return fonts;
}

export default function configureFonts(params: { isV3: false }): Fonts;
// eslint-disable-next-line no-redeclare
export default function configureFonts(params: { config?: MD2FontConfig; isV3: false }): Fonts;

// eslint-disable-next-line no-redeclare
export default function configureFonts(params?: {
  config?: Partial<MD3Type>;
  isV3?: true;
}): MD3Typescale;
// eslint-disable-next-line no-redeclare
export default function configureFonts(params?: {
  config?: Partial<Record<MD3TypescaleKey, Partial<MD3Type>>>;
  isV3?: true;
}): MD3Typescale;
// eslint-disable-next-line no-redeclare
export default function configureFonts(params?: {
  config?: Record<string, MD3Type>;
  isV3?: true;
}): MD3Typescale & { [key: string]: MD3Type };

// eslint-disable-next-line no-redeclare
export default function configureFonts(params?: any) {
  const { isV3 = true, config } = params || {};

  if (isV3) {
    return configureV3Fonts(config);
  }

  return configureV2Fonts(config);
}
