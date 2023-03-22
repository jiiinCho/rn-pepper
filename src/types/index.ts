type $DeepPartial<T> = { [P in keyof T]?: $DeepPartial<T[P]> };

export type ThemeProp = $DeepPartial<InternalTheme>;
export type InternalTheme = MD2Theme | MD3Theme;
export type MD2Theme = ThemeBase & {
  version: 2;
  isV3: false;
  colors: MD2Colors;
  fonts: Fonts;
};

export type MD3Theme = ThemeBase & {
  version: 3;
  isV3: true;
  colors: MD3Colors;
  fonts: MD3Typescale;
};

export type MD3Elevation = 0 | 1 | 2 | 3 | 4 | 5;

type ThemeBase = {
  dark: boolean;
  mode?: Mode;
  roundness: number;
  animation: {
    scale: number;
    defaultAnimationDuration?: number;
  };
};

type Mode = 'adaptive' | 'exact';

type MD2Colors = {
  primary: string;
  background: string;
  surface: string;
  accent: string;
  error: string;
  text: string;
  onSurface: string;
  disabled: string;
  placeholder: string;
  backdrop: string;
  notification: string;
  tooltip: string;
};

type MD3Colors = {
  primary: string;
  primaryContainer: string;
  secondary: string;
  secondaryContainer: string;
  tertiary: string;
  tertiaryContainer: string;
  surface: string;
  surfaceVariant: string;
  surfaceDisabled: string;
  background: string;
  error: string;
  errorContainer: string;
  onPrimary: string;
  onPrimaryContainer: string;
  onSecondary: string;
  onSecondaryContainer: string;
  onTertiary: string;
  onTertiaryContainer: string;
  onSurface: string;
  onSurfaceVariant: string;
  onSurfaceDisabled: string;
  onError: string;
  onErrorContainer: string;
  onBackground: string;
  outline: string;
  outlineVariant: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  shadow: string;
  scrim: string;
  backdrop: string;
  elevation: MD3EelevationColors;
};

export type MD3EelevationColors = {
  [key in keyof typeof ElevactionLevels]: string;
};

enum ElevactionLevels {
  'level0',
  'level1',
  'level2',
  'level3',
  'level4',
  'level5',
}

export type Fonts = {
  regular: Font;
  medium: Font;
  light: Font;
  thin: Font;
};

export type Font = {
  fontFamily: string;
  fontWeight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
};

export type MD3Typescale = { [key in MD3TypescaleKey]: MD3Type } & {
  ['default']: Omit<MD3Type, 'lineHeight' | 'fontSize'>;
};

export enum MD3TypescaleKey {
  displayLarge = 'displayLarge',
  displayMedium = 'displayMedium',
  displaySmall = 'displaySmall',

  headlineLarge = 'headlineLarge',
  headlineMedium = 'headlineMedium',
  headlineSmall = 'headlineSmall',

  titleLarge = 'titleLarge',
  titleMedium = 'titleMedium',
  titleSmall = 'titleSmall',

  labelLarge = 'labelLarge',
  labelMedium = 'labelMedium',
  labelSmall = 'labelSmall',

  bodyLarge = 'bodyLarge',
  bodyMedium = 'bodyMedium',
  bodySmall = 'bodySmall',
}

export type MD3Type = {
  fontFamily: string;
  letterSpacing: number;
  fontWeight: Font['fontWeight'];
  lineHeight: number;
  fontSize: number;
};
