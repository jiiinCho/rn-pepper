import * as React from 'react';
import {
  AccessibilityInfo,
  Appearance,
  ColorSchemeName,
  NativeEventSubscription,
} from 'react-native';

import MaterialCommunityIcon from '../components/MaterialCommunityIcon';
import {
  SettingsProvider,
  Settings,
  defaultThemesByVersion,
  SafeAreaProviderCompat,
  ThemeProvider,
} from '../core';
import type { ThemeProp } from '../types';
import { addEventListener } from '../utils';

type Props = {
  children: React.ReactNode;
  theme?: ThemeProp;
  settings?: Settings;
};

const Provider = (props: Props) => {
  const isOnlyVersionInTheme =
    props.theme && Object.keys(props.theme).length === 1 && props.theme.version;

  // TODO: Appearance?.getColorScheme()
  const colorSchemeName =
    ((!props.theme || isOnlyVersionInTheme) && Appearance?.getColorScheme()) || 'light';

  const [reduceMotionEnabled, setReduceMotionEnabled] = React.useState<boolean>(false);
  const [colorScheme, setColorScheme] = React.useState<ColorSchemeName>(colorSchemeName);

  React.useEffect(() => {
    let subscription: NativeEventSubscription | undefined;

    if (!props.theme) {
      subscription = addEventListener(
        AccessibilityInfo,
        'reduceMotionChanged',
        setReduceMotionEnabled,
      );
    }

    return () => {
      if (!props.theme) {
        subscription?.remove();
      }
    };
  }, [props.theme]);

  const handleAppearanceChange = (preferences: Appearance.AppearancePreferences) => {
    const { colorScheme } = preferences;
    setColorScheme(colorScheme);
  };

  React.useEffect(() => {
    let appearanceSubscription: NativeEventSubscription | undefined;

    if (!props.theme || isOnlyVersionInTheme) {
      appearanceSubscription = Appearance?.addChangeListener(handleAppearanceChange);
    }

    return () => {
      if (!props.theme || isOnlyVersionInTheme) {
        appearanceSubscription?.remove();
      }
    };
  }, [isOnlyVersionInTheme, props.theme]);

  const getTheme = () => {
    const themeVersion = props.theme?.version || 3;
    const scheme = colorScheme || 'light';
    const defaultThemeBase = defaultThemesByVersion[themeVersion][scheme];

    const extendedThemeBase = {
      ...defaultThemeBase,
      ...props.theme,
      version: themeVersion,
      animation: {
        ...props.theme?.animation,
        scale: reduceMotionEnabled ? 0 : 1,
      },
    };

    return {
      ...extendedThemeBase,
      isV3: extendedThemeBase.version === 3,
    };
  };

  const { children, settings } = props;

  return (
    <SafeAreaProviderCompat>
      <SettingsProvider value={settings || { icon: MaterialCommunityIcon }}>
        {/* @ts-expect-error why React.ComponentType does not have children as prop? */}
        <ThemeProvider theme={getTheme()}>{children}</ThemeProvider>
      </SettingsProvider>
    </SafeAreaProviderCompat>
  );
};

export default Provider;
