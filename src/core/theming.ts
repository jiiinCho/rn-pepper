import { $DeepPartial, createTheming } from '@callstack/react-theme-provider';

import { MD3LightTheme } from 'styles';
import type { InternalTheme } from 'types';

const { useTheme: useAppTheme } = createTheming<unknown>(MD3LightTheme);

export const useInternalTheme = (themeOverrides: $DeepPartial<InternalTheme> | undefined) =>
  useAppTheme<InternalTheme>(themeOverrides);
