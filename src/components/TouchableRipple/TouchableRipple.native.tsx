import * as React from 'react';
import {
  GestureResponderEvent,
  Platform,
  Pressable,
  PressableAndroidRippleConfig,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';

import { useInternalTheme } from 'core';
import type { InternalTheme } from 'types';

import { getTouchableRippleColors } from './utils';

/**
 * .native.tsx: platform-specific code
 * https://reactnative.dev/docs/platform-specific-code#native-specific-extensions-ie-sharing-code-with-nodejs-and-web
 */
type Props = React.ComponentProps<typeof Pressable> & {
  borderless?: boolean;
  background?: PressableAndroidRippleConfig;
  disabled?: boolean;
  onPress?: (e: GestureResponderEvent) => void | null;
  rippleColor?: string;
  underlayColor: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  theme: InternalTheme;
};

const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_VERSION_PIE = 28;

const TouchableRipple = ({
  borderless = false,
  background,
  disabled: disabledProp,
  onPress,
  rippleColor,
  underlayColor,
  children,
  style,
  theme: themeOverrides,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const [showUnderlay, setShowUnderlay] = React.useState<boolean>(false);

  const disabled = disabledProp || !onPress;
  const { calculatedRippleColor, calculatedUnderlayColor } = getTouchableRippleColors({
    theme,
    rippleColor,
    underlayColor,
  });

  // A workaround for ripple on Android P is to use useForeground + overflow: 'hidden'
  // TODO: Update based on latested comment https://github.com/facebook/react-native/issues/6480
  const useForeground =
    Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_PIE && borderless;

  const handlePressIn = (e: GestureResponderEvent) => {
    setShowUnderlay(true);
    rest.onPressIn?.(e);
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    setShowUnderlay(false);
    rest.onPressOut?.(e);
  };

  if (TouchableRipple.supported) {
    return (
      <Pressable
        {...rest}
        disabled={disabled}
        style={[borderless && styles.overflowHidden, style]}
        android_ripple={
          background != null
            ? background
            : { color: calculatedRippleColor, borderless, foreground: useForeground }
        }
      >
        {/* If the children prop has more than one child, React.Children.only(children) will throw an error. If the children prop has no children, it will also throw an error. */}
        {React.Children.only(children)}
      </Pressable>
    );
  }

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      style={[
        borderless && styles.overflowHidden,
        showUnderlay && { backgroundColor: calculatedUnderlayColor },
        style,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {React.Children.only(children)}
    </Pressable>
  );
};

TouchableRipple.supported =
  Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP;

const styles = StyleSheet.create({
  overflowHidden: {
    overflow: 'hidden',
  },
});

export default TouchableRipple;
