import type * as React from 'react';
import { Animated, Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useInternalTheme } from 'src/core';
import { isAnimatedValue, overlay, shadow } from 'src/styles';
import type { ThemeProp, MD3EelevationColors } from 'src/types';
import { forwardRef } from 'src/utils';

type Props = React.ComponentPropsWithRef<typeof View> & {
  children: React.ReactNode;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  /**
   * @supported Available in v5.x with theme v3
   * Changes shadows and background in iOS and Android.
   * Used to create UI hierarchy between components
   * Note: you should use `elevation` property instead of `style={{ elevation: 4 }}`
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5 | Animated.Value;
  theme?: ThemeProp;
  testID?: string;
  ref?: React.RefObject<View>;
};

const MD2Surface = forwardRef<View, Props>(
  ({ style, theme: overrideTheme, ...rest }: Omit<Props, 'elevation'>, ref) => {
    const { elevation = 4 } = (StyleSheet.flatten(style) || {}) as ViewStyle;
    const { dark: isDarkTheme, mode, colors } = useInternalTheme(overrideTheme);

    return (
      <Animated.View
        ref={ref}
        {...rest}
        style={[
          {
            backgroundColor:
              isDarkTheme && mode === 'adaptive'
                ? overlay(elevation, colors?.surface)
                : colors?.surface,
          },
          elevation ? shadow(elevation) : null,
          style,
        ]}
      />
    );
  },
);

// const { foo = 'a' } = {};
// console.log(foo); -> a

/**
 * Surface is a basic container that can give depth to an element with elevation shadow.
 * On dark theme with `adaptive` mode, surface is constructed by placing a semi-transparent white overlay over a component surface
 * Overlay and shadow can be applied by specifying the `elevation` property both on Android and iOS.
 *
 * `adaptive` mode is a feature that allows your app to automatically switch between light and dark themes based on the device's system settings.
 * Both iOS and Android have adaptive mode:
 * - On iOS, this feature is called "Automatic" mode (available from iOS 13.):
 *  When the user enables this mode, the device will automatically switch between light and dark modes based on the time of day or the user's location.
 * - On Android, the feature is called "Dark Theme" or "Dark Mode" (available from Android 10):
 *  When the user enables this mode, the device will switch between light and dark modes based on system settings, such as the time of day
 *
 * <div class="screenshots">
 *  <figure>
 *    <img class="medium" src="screenshots/surface-android.png" />
 *    <figcaption>Surface on Android</figcaption>
 *  </figure>
 *  <figure>
 *    <img class="medium" src="screenshots/surface-ios.png" />
 *    <figcaption>Surface on iOS</figcaption>
 *  </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Surface, Text } from 'react-native-papper';
 * import { StyleSheet } from 'react-native';
 *
 * const MyComponent = () => (
 *  <Surface style={styles.surface elevation={4}>
 *    <Text>Surface</Text>
 *  </Surface>
 * )
 *
 * export default MyComponent;
 */

const IOSSurfaceOptions = {
  iOSShadowOutputRanges: [
    { shadowOpacity: 0.15, height: [0, 1, 2, 4, 6, 8], shadowRadius: [0, 3, 6, 8, 10, 12] },
    { shadowOpacity: 0.3, height: [0, 1, 1, 1, 2, 4], shadowRadius: [0, 1, 2, 3, 3, 4] },
  ],
  shadowColor: '#000',
  inputRange: [0, 1, 2, 3, 4, 5],
};

const Surface = forwardRef<View, Props>(
  (
    { elevation = 1, children, theme: overridenTheme, style, testID = 'surface', ...props }: Props,
    ref,
  ) => {
    const theme = useInternalTheme(overridenTheme);

    if (!theme.isV3) {
      return (
        <MD2Surface {...props} theme={theme} style={style} ref={ref}>
          {children}
        </MD2Surface>
      );
    }

    const { colors } = theme;
    const inputRange = [0, 1, 2, 3, 4, 5];
    const backgroundColor = (() => {
      if (isAnimatedValue(elevation)) {
        return elevation.interpolate({
          inputRange,
          outputRange: inputRange.map((inputElevation) => {
            const elevationLevel = `level${inputElevation}}` as keyof MD3EelevationColors;
            return colors.elevation?.[elevationLevel];
          }),
        });
      }

      return colors.elevation?.[`level${elevation}`];
    })();

    if (Platform.OS === 'web') {
      return (
        <Animated.View
          {...props}
          ref={ref}
          testID={testID}
          style={[{ backgroundColor }, elevation ? shadow(elevation, theme.isV3) : null, style]}
        >
          {children}
        </Animated.View>
      );
    }

    if (Platform.OS === 'android') {
      const elevationLevel = [0, 3, 6, 9, 12, 15];

      const getElevationAndroid = () => {
        if (isAnimatedValue(elevation)) {
          return elevation.interpolate({
            inputRange,
            outputRange: elevationLevel,
          });
        }

        return elevationLevel[elevation];
      };

      const { margin, padding, transform, borderRadius } = (StyleSheet.flatten(style) ||
        {}) as ViewStyle;

      const outerLayerStyles = { margin, padding, transform, borderRadius };
      const sharedStyle = [{ backgroundColor }, style];

      return (
        <Animated.View
          {...props}
          testID={testID}
          ref={ref}
          style={[
            { backgroundColor, transform },
            outerLayerStyles,
            sharedStyle,
            { elevation: getElevationAndroid() },
          ]}
        >
          {children}
        </Animated.View>
      );
    }

    const { outerLayerViewStyles, innerLayerViewStyles, sharedStyle } = sortIOSStyles({
      style,
      backgroundColor,
    });

    const getIOSShadowStyles = (layer: 0 | 1) => {
      return isAnimatedValue(elevation)
        ? getStyleForAnimatedShadowLayer(layer, elevation)
        : getStyleForShadowLayer(layer, elevation);
    };

    return (
      <Animated.View
        style={[getIOSShadowStyles(0), outerLayerViewStyles]}
        testID={`${testID}-outer-layer`}
      >
        <Animated.View
          style={[getIOSShadowStyles(1), innerLayerViewStyles]}
          testID={`${testID}-inner-layer`}
        >
          <Animated.View {...props} testID={testID} style={sharedStyle}>
            {children}
          </Animated.View>
        </Animated.View>
      </Animated.View>
    );
  },
);

function sortIOSStyles({
  style,
  backgroundColor,
}: {
  style: Props['style'];
  backgroundColor: string | Animated.AnimatedInterpolation<string | number>;
}) {
  const { position, alignSelf, top, left, right, bottom, start, end, flex, ...restStyle } =
    (StyleSheet.flatten(style) || {}) as ViewStyle;

  const absoluteStyles = {
    position,
    alignSelf,
    top,
    right,
    bottom,
    left,
    start,
    end,
  };

  const sharedStyle = [{ backgroundColor, flex }, restStyle];
  const innerLayerViewStyles = [{ flex }];
  const outerLayerViewStyles = [absoluteStyles, innerLayerViewStyles];

  return { outerLayerViewStyles, innerLayerViewStyles, sharedStyle };
}

function getStyleForAnimatedShadowLayer(layer: 0 | 1, elevation: Animated.Value) {
  const { iOSShadowOutputRanges, shadowColor, inputRange } = IOSSurfaceOptions;

  return {
    shadowColor,
    shadowOpacity: elevation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, iOSShadowOutputRanges[layer].shadowOpacity],
      extrapolate: 'clamp',
    }),
    shadowOffset: {
      width: 0,
      height: elevation.interpolate({
        inputRange,
        outputRange: iOSShadowOutputRanges[layer].height,
      }),
    },
    shadowRadius: elevation.interpolate({
      inputRange,
      outputRange: iOSShadowOutputRanges[layer].shadowRadius,
    }),
  };
}

function getStyleForShadowLayer(layer: 0 | 1, elevation: 0 | 1 | 2 | 3 | 4 | 5) {
  const { iOSShadowOutputRanges, shadowColor } = IOSSurfaceOptions;

  return {
    shadowColor,
    shadowOpacity: elevation ? iOSShadowOutputRanges[layer].shadowOpacity : 0,
    shadowOffset: {
      width: 0,
      height: iOSShadowOutputRanges[layer].height[elevation],
    },
    shadowRadius: iOSShadowOutputRanges[layer].shadowRadius[elevation],
  };
}

export default Surface;
