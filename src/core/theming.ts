import { $DeepPartial, createTheming } from '@callstack/react-theme-provider';

import { MD3LightTheme, MD3DarkTheme } from '../styles';
import type { InternalTheme } from '../types';

export const { ThemeProvider, useTheme: useAppTheme } = createTheming<unknown>(MD3LightTheme);

export const useInternalTheme = (themeOverrides: $DeepPartial<InternalTheme> | undefined) =>
  useAppTheme<InternalTheme>(themeOverrides);

export const defaultThemesByVersion = {
  2: {
    light: MD3LightTheme,
    dark: MD3DarkTheme,
  },
  3: {
    light: MD3LightTheme,
    dark: MD3DarkTheme,
  },
};
