import color from 'color';

import { MD3Colors } from '../../styles';
import type { InternalTheme } from '../../types';

export type ButtonMode = 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';

type BaseProps = {
  isMode: (mode: ButtonMode) => boolean;
  theme: InternalTheme;
  disabled?: boolean;
};

export const getButtonColors = ({
  theme,
  mode,
  customButtonColor,
  customTextColor,
  disabled,
  dark,
}: {
  theme: InternalTheme;
  mode: ButtonMode;
  customButtonColor?: string;
  customTextColor?: string;
  disabled?: boolean;
  dark?: boolean;
}) => {
  const isMode = (modeToCompare: ButtonMode) => {
    return mode === modeToCompare;
  };

  const backgroundColor = getButtonBackgroundColor({
    isMode,
    theme,
    disabled,
    customButtonColor,
  });

  const textColor = getButtonTextColor({
    isMode,
    theme,
    disabled,
    customTextColor,
    backgroundColor,
    dark,
  });

  const borderColor = getButtonBorderColor({ isMode, theme, disabled });
  const borderWidth = getButtonBorderWidth({ isMode, theme });

  return {
    backgroundColor,
    borderColor,
    textColor,
    borderWidth,
  };
};

function getButtonBackgroundColor({
  isMode,
  theme,
  disabled,
  customButtonColor,
}: BaseProps & {
  customButtonColor?: string;
}) {
  if (customButtonColor && !disabled) {
    return customButtonColor;
  }

  if (theme.isV3) {
    if (disabled) {
      if (isMode('outlined') || isMode('text')) {
        return 'transparent';
      }
      return theme.colors.surfaceDisabled;
    }

    if (isMode('elevated')) {
      return theme.colors.elevation.level1;
    }

    if (isMode('contained')) {
      return theme.colors.primary;
    }

    if (isMode('contained-tonal')) {
      return theme.colors.secondaryContainer;
    }
  }

  // [NOTE] V2 handling excluded
  return 'transparent';
}

function getButtonTextColor({
  isMode,
  theme,
  disabled,
  customTextColor,
  backgroundColor,
  dark,
}: BaseProps & {
  customTextColor?: string;
  backgroundColor?: string;
  dark?: boolean;
}) {
  if (customTextColor && !disabled) {
    return customTextColor;
  }

  if (theme.isV3) {
    if (disabled) {
      return theme.colors.onSurfaceDisabled;
    }

    if (typeof dark === 'boolean') {
      if (isMode('contained') || isMode('contained-tonal') || isMode('elevated')) {
        return isDark({ dark, backgroundColor }) ? MD3Colors.white : MD3Colors.black;
      }

      if (isMode('outlined') || isMode('text') || isMode('elevated')) {
        return theme.colors.primary;
      }

      if (isMode('contained')) {
        return theme.colors.onPrimary;
      }

      if (isMode('contained-tonal')) {
        return theme.colors.onSecondaryContainer;
      }
    }

    if (isMode('elevated')) {
      return theme.colors.elevation.level1;
    }

    if (isMode('contained')) {
      return theme.colors.primary;
    }

    if (isMode('contained-tonal')) {
      return theme.colors.secondaryContainer;
    }
  }

  // [NOTE] V2 handling excluded
  return theme.colors.primary;
}

function isDark({ dark, backgroundColor }: { dark?: boolean; backgroundColor?: string }) {
  if (typeof dark === 'boolean') {
    return dark;
  }

  if (backgroundColor === 'transparent') {
    return false;
  }

  if (backgroundColor !== 'transparent') {
    return !color(backgroundColor).isLight();
  }

  return false;
}

function getButtonBorderColor({ isMode, disabled, theme }: BaseProps) {
  if (theme.isV3) {
    if (disabled && isMode('outlined')) {
      return theme.colors.surfaceDisabled;
    }

    if (isMode('outlined')) {
      return theme.colors.outline;
    }
  }
  // V2 exlucded
  return 'transparent';
}

function getButtonBorderWidth({ isMode, theme }: BaseProps) {
  if (theme.isV3) {
    if (isMode('outlined')) {
      return 1;
    }
  }
  // V2 exlucded
  return 0;
}
