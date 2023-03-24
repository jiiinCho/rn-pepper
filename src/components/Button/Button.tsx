import * as React from 'react';
import {
  Animated,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
  View,
} from 'react-native';

import color from 'color';

import { ButtonMode, getButtonColors } from './utils';
import { Surface, Icon, IconSource, ActivityIndicator, Text } from '../../components';
import { useInternalTheme } from '../../core';
import type { ThemeProp } from '../../types';
import TouchableRipple from '../TouchableRipple/TouchableRipple';

type Props = Omit<React.ComponentProps<typeof Surface>, 'children'> & {
  /**
   * Mode:
   * * `text`: flat button without background or outline, used for the lowest priority actions especailly when pression multiple options
   * * `outlined`: button with an outline without background, used for important but not primary action
   * * `contained`: button with a background color, used for important action, have the most visual impact and high emphasis
   * * `elevated`: button with a background color and elevation, used when absolutely necessary e.g. button requires visual separation from a patterned background
   * * `contained-tonal`: button with a secondary background color, an alternatie middle ground betwen contained and outlined buttons
   */
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
  /**
   * A dark button will render light text and vice-versa. Only applicable for:
   * * `contained` mode for theme version 2
   * * `contained`, `contained-tonal` and `elevated` modes for theme version 3
   */
  dark?: boolean;
  /**
   * A compact look, useful for `test` buttons in a row
   */
  compact?: boolean;
  /**
   * Custom button's background color
   */
  buttonColor?: string;
  /**
   * Custom button's text color
   */
  textColor?: string;
  loading?: boolean;
  icon?: IconSource;
  /**
   * A disabled button is greyed out and `onPress` in not called on touch
   */
  disabled?: boolean;
  /**
   * Mkae the label text uppercased. Note that this won't work if you pass React elements as children
   */
  uppercase?: boolean;
  /**
   * TODO: Accessiblity label for the button. This is read by the screen reader when the user taps the button
   */
  accessibilityLabel?: string;
  /**
   * TODO: Accessiblity hint for the button. This is read by the screen reader when the user taps the button
   */
  accessibilityHint?: string;
  /**
   * Function to execute on press
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute as soon as the touchable element is pressed and invoked even before onPress
   */
  onPressIn?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute as soon as the touch is released even before onPress
   */
  onPressOut?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute on long press
   */
  onLongPress?: (e: GestureResponderEvent) => void;
  /**
   * Millieseconds a user must touch the element before executing `onLongPress`
   */
  delayLongPress?: number;
  /**
   * Style of the button's inner content
   * Use this prop to apply custom height and width and to set the icon on the right with `flexDirection`: `row-reverse`
   */
  contentStyle?: StyleProp<ViewStyle>;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  labelStyle?: StyleProp<TextStyle>;
  theme?: ThemeProp;
  testID?: string;
  label?: string;
};

const Button = ({
  disabled,
  compact,
  mode = 'text',
  dark,
  loading,
  icon,
  buttonColor: customButtonColor,
  textColor: customTextColor,
  accessibilityLabel,
  accessibilityHint,
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
  delayLongPress,
  style,
  theme: themeOverrides,
  uppercase: uppercaseProp,
  contentStyle,
  label,
  labelStyle,
  testID = 'button',
  accessible,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const isMode = React.useCallback(
    (modeToCompare: ButtonMode) => {
      return mode === modeToCompare;
    },
    [mode],
  );

  const { roundness, isV3, animation } = theme;
  const uppercase = uppercaseProp ?? !theme.isV3;
  const isElevatedModeEnabled = isV3 ? isMode('elevated') : isMode('contained');

  const isElevationEntitled = !disabled && isElevatedModeEnabled;
  const initialElevation = isV3 ? 1 : 2;
  const activeElevation = isV3 ? 2 : 8;

  const { current: elevation } = React.useRef<Animated.Value>(
    new Animated.Value(isElevationEntitled ? initialElevation : 0),
  );

  React.useEffect(() => {
    // reset ref elevation in case mode changed
    elevation.setValue(isElevationEntitled ? initialElevation : 0);
  }, [elevation, initialElevation, isElevationEntitled]);

  const handlePressIn = (e: GestureResponderEvent) => {
    onPressIn?.(e);

    // if v3 & elevated mode, when user press in this button, the button will be elevated from 1 to 2
    if (isElevatedModeEnabled) {
      const { scale } = animation;
      Animated.timing(elevation, {
        toValue: activeElevation,
        duration: 200 * scale,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    onPressOut?.(e);
    if (isElevatedModeEnabled) {
      const { scale } = animation;
      Animated.timing(elevation, {
        toValue: initialElevation,
        duration: 150 * scale,
        useNativeDriver: true,
      }).start();
    }
  };

  const borderRadius = (isV3 ? 5 : 1) * roundness; // 5 * 4 : LightTheme.roundness = 4
  const iconSize = isV3 ? 18 : 16;

  const { backgroundColor, borderColor, textColor, borderWidth } = getButtonColors({
    customButtonColor,
    customTextColor,
    theme,
    mode,
    disabled,
    dark,
  });

  const rippleColor = color(textColor).alpha(0.12).rgb().string();

  const buttonStyle = {
    backgroundColor,
    borderColor,
    borderWidth,
    borderRadius,
  };
  // if style exists, borderRadius = ((StyleSheet.flatten(style) || {}) as ViewStyle).borderRadius ?? borderRadius
  // borderRadius = undefined ?? 20, borderRadius = 20
  // borderRadius = !!undefined ?? 20, borderRadius = false
  const touchableStyle = {
    borderRadius: ((StyleSheet.flatten(style) || {}) as ViewStyle).borderRadius && borderRadius,
  };

  const { color: customLabelColor, fontSize: customLabelSize } =
    StyleSheet.flatten(labelStyle) || {};

  const font = isV3 ? theme.fonts.labelLarge : theme.fonts.medium;
  const textStyle = { color: textColor, ...font };

  const iconStyle =
    StyleSheet.flatten(contentStyle)?.flexDirection === 'row-reverse'
      ? [
          styles.iconReverse,
          isV3 && styles[`md3IconReverse${compact ? 'Compact' : ''}`],
          isV3 && isMode('text') && styles[`md3IconReverseTextMode${compact ? 'Compact' : ''}`],
        ]
      : [
          styles.icon,
          isV3 && styles[`md3Icon${compact ? 'Compact' : ''}`],
          isV3 && isMode('text') && styles[`md3IconTextMode${compact ? 'Compact' : ''}`],
        ];

  return (
    <Surface
      {...rest}
      testID={`${testID}-container`}
      style={[styles.button, compact && styles.compact, buttonStyle, style, { elevation }]}
    >
      <TouchableRipple
        borderless
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        delayLongPress={delayLongPress}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        accessible={accessible}
        disabled={disabled}
        rippleColor={rippleColor}
        style={touchableStyle}
        testID={testID}
        theme={theme}
      >
        <View style={[styles.content, contentStyle]}>
          {icon && loading !== true ? (
            <View style={iconStyle} testID={`${testID}-icon-counter`}>
              <Icon
                source={icon}
                size={customLabelSize ?? iconSize}
                color={typeof customLabelColor === 'string' ? customLabelColor : textColor}
              />
            </View>
          ) : null}
          {loading ? (
            <ActivityIndicator
              size={customLabelSize ?? iconSize}
              color={typeof customLabelColor === 'string' ? customLabelColor : textColor}
              style={iconStyle}
            />
          ) : null}
          {label ? (
            <Text
              variant="labelLarge"
              selectable={false}
              numberOfLines={1}
              testID={`${testID}-text`}
              style={[
                styles.label,
                !isV3 && styles.md2Label,
                isV3 &&
                  (isMode('text')
                    ? icon || loading
                      ? styles.md3LabelTextAddons
                      : styles.md3LabelText
                    : styles.md3Label),
                compact && styles.compactLabel,
                uppercase && styles.uppercaseLabel,
                textStyle,
                labelStyle,
              ]}
            >
              {label}
            </Text>
          ) : null}
        </View>
      </TouchableRipple>
    </Surface>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: 64,
    borderStyle: 'solid',
  },
  compact: {
    minWidth: 'auto',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginLeft: 12,
    marginRight: -4,
  },
  iconReverse: {
    marginLeft: -4,
    marginRight: 12,
  },
  /* eslint-disable react-native/no-unused-styles */
  md3Icon: {
    marginLeft: 16,
    marginRight: -16,
  },
  md3IconCompact: {
    marginLeft: 8,
    marginRight: 0,
  },
  md3IconReverse: {
    marginLeft: -16,
    marginRight: 16,
  },
  md3IconReverseCompact: {
    marginLeft: 0,
    marginRight: 8,
  },
  md3IconTextMode: {
    marginLeft: 12,
    marginRight: -8,
  },
  md3IconTextModeCompact: {
    marginLeft: 6,
    marginRight: 0,
  },
  md3IconReverseTextMode: {
    marginLeft: -8,
    marginRight: 12,
  },
  md3IconReverseTextModeCompact: {
    marginLeft: 0,
    marginRight: 6,
  },
  label: {
    textAlign: 'center',
    marginVertical: 9,
    marginHorizontal: 16,
  },
  md2Label: {
    letterSpacing: 1,
  },
  compactLabel: {
    marginHorizontal: 8,
  },
  uppercaseLabel: {
    textTransform: 'uppercase',
  },
  md3Label: {
    marginVertical: 10,
    marginHorizontal: 24,
  },
  md3LabelText: {
    marginHorizontal: 12,
  },
  md3LabelTextAddons: {
    marginHorizontal: 16,
  },
});

export default Button;
