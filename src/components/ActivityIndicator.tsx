import * as React from 'react';
import { Animated, Easing, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useInternalTheme } from 'src/core';
import type { ThemeProp } from 'src/types';

const DURATION = 2400;

const DefaultIndicatorSize = {
  small: 24,
  large: 48,
};

type LoaderSize = keyof typeof DefaultIndicatorSize;

type Props = React.ComponentPropsWithRef<typeof View> & {
  // Show indicator
  animating?: boolean;
  // Spinner color
  color?: string;
  // hide indicator when not animating
  hidesWhenStopped?: boolean;
  // Indicator size
  size?: LoaderSize | number;
  style?: StyleProp<ViewStyle>;
  theme?: ThemeProp;
};

/**
 * Activity indicator is used to present progress of some activity in the app.
 * It can be used as a drop-in for the ActivityIndicator shipped with React Native.
 */
const ActivityIndicator = ({
  animating = true,
  color: indicatorColor,
  hidesWhenStopped = true,
  size: indicatorSize = 'small',
  style,
  theme: themeOverrides,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { current: timer } = React.useRef<Animated.Value>(new Animated.Value(0));
  const { current: fade } = React.useRef<Animated.Value>(
    new Animated.Value(!animating && hidesWhenStopped ? 0 : 1),
  );

  const rotation = React.useRef<Animated.CompositeAnimation | undefined>(undefined);

  const {
    animation: { scale },
  } = theme;

  const startRotation = React.useCallback(() => {
    // Show indicator
    // TODO: What is this for? toValue: 1 won't do anything because starting value is 1?
    Animated.timing(fade, {
      duration: 200 * scale,
      toValue: 1,
      isInteraction: false,
      useNativeDriver: true,
    }).start();

    // Circular animation in loop
    if (rotation.current) {
      timer.setValue(0);
      Animated.loop(rotation.current).start();
    }
  }, [scale, fade, timer]);

  const stopRotation = () => {
    if (rotation.current) {
      rotation.current.stop();
    }
  };

  React.useEffect(() => {
    if (rotation.current === undefined) {
      // Circular rotation in loop
      rotation.current = Animated.timing(timer, {
        duration: DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
        toValue: 1,
        isInteraction: false,
      });
    }

    if (animating) {
      startRotation();
    } else if (hidesWhenStopped) {
      Animated.timing(fade, {
        duration: 200 * scale, // default lightTheme.scale = 1
        toValue: 0,
        useNativeDriver: true,
        isInteraction: false,
      }).start(stopRotation); // TODO: Does this mean to start when stopRotation is.. what?
    }
  }, [animating, fade, hidesWhenStopped, scale, startRotation, timer]);

  const color = indicatorColor || theme.colors?.primary;
  const size =
    typeof indicatorSize === 'string'
      ? DefaultIndicatorSize[indicatorSize as LoaderSize]
      : indicatorSize;

  const frames = (60 * DURATION) / 1000;
  const easing = Easing.bezier(0.4, 0.0, 0.7, 1.0);
  const containerStyle = {
    width: size,
    height: size / 2,
    overflow: 'hidden' as const,
  };

  return (
    <View
      style={[styles.container, style]}
      {...rest}
      accessible
      accessibilityRole="progressbar"
      accessibilityState={{ busy: animating }}
    >
      <Animated.View style={{ width: size, height: size, opacity: fade }} collapsable={false}>
        {[0, 1].map((index) => {
          const inputRange = Array.from(
            new Array(frames),
            (_, frameIndex) => frameIndex / (frames - 1),
          );

          const outputRange = Array.from(new Array(frames), (_, frameIndex) => {
            let progress = (2 * frameIndex) / (frames - 1);
            const rotation = index ? +(360 - 15) : -(180 - 15);

            if (progress > 1.0) {
              progress = 2.0 - progress;
            }

            const direction = index ? -1 : +1;

            return `${direction * (180 - 30) * easing(progress) + rotation}deg`;
          });

          const layerStyle = {
            width: size,
            height: size,
            transform: [
              {
                rotate: timer.interpolate({
                  inputRange: [0, 1],
                  outputRange: [`${0 + 30 + 15}deg`, `${2 * 360 + 30 + 15}deg`],
                }),
              },
            ],
          };

          const viewportStyle = {
            width: size,
            height: size,
            transform: [
              { translateY: index ? -size / 2 : 0 },
              { rotate: timer.interpolate({ inputRange, outputRange }) },
            ],
          };

          const offsetStyle = index ? { top: size / 2 } : null;

          const lineStyle = {
            width: size,
            height: size,
            borderColor: color,
            borderWidth: size / 10,
            borderRadius: size / 2,
          };

          return (
            <Animated.View key={index} style={[styles.layer]}>
              <Animated.View style={layerStyle}>
                <Animated.View style={[containerStyle, offsetStyle]} collapsable={false}>
                  <Animated.View style={viewportStyle}>
                    <Animated.View style={containerStyle} collapsable={false}>
                      <Animated.View style={lineStyle} />
                    </Animated.View>
                  </Animated.View>
                </Animated.View>
              </Animated.View>
            </Animated.View>
          );
        })}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ActivityIndicator;
