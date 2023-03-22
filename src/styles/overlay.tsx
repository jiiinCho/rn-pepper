import { Animated } from 'react-native';

import color from 'color';

import { MD2DarkTheme } from './themes/v2/DarkTheme';

const elevationOverlayTransparency: Record<string, number> = {
  1: 5,
  2: 7,
  3: 8,
  4: 9,
  5: 10,
  6: 11,
  7: 11.5,
  8: 12,
  9: 12.5,
  10: 13,
  11: 13.5,
  12: 14,
  13: 14.25,
  14: 14.5,
  15: 14.75,
  16: 15,
  17: 15.12,
  18: 15.24,
  19: 15.36,
  20: 15.48,
  21: 15.6,
  22: 15.72,
  23: 15.84,
  24: 16,
};

function calculateColor(surfaceColor: string, elevation: number = 1): string {
  let overlayTransparency: number;
  if (elevation >= 1 && elevation <= 24) {
    overlayTransparency = elevationOverlayTransparency[elevation];
  } else if (elevation > 24) {
    overlayTransparency = elevationOverlayTransparency[24];
  } else {
    overlayTransparency = elevationOverlayTransparency[1];
  }

  return color(surfaceColor)
    .mix(color('white'), overlayTransparency * 0.01)
    .hex();
}

export const isAnimatedValue = (
  it: number | string | Animated.AnimatedInterpolation<number | string>,
): it is Animated.Value => it instanceof Animated.Value;

/**
 * creates an opaque hex color value according to given elevation
 * @param elevation TODO: greater elevation leads to a more transparent overlay
 * @param surfaceColor base color for white overlay layer, default is black shade
 * @returns opaque hex color value
 */
export default function overlay(
  elevation: number | Animated.Value,
  surfaceColor: string = MD2DarkTheme.colors.surface,
): string | Animated.AnimatedInterpolation<string | number> {
  if (isAnimatedValue(elevation)) {
    const inputRange = [0, 1, 2, 3, 8, 24];

    return elevation.interpolate({
      inputRange,
      outputRange: inputRange.map((elevation) => {
        return calculateColor(surfaceColor, elevation);
      }),
    });
  }

  return calculateColor(surfaceColor, elevation);
}
