import React from 'react';
import { I18nManager, StyleProp, StyleSheet, Text as NativeText, TextStyle } from 'react-native';

import { useInternalTheme } from 'core';
import type { ThemeProp } from 'types';
import { forwardRef } from 'utils';

import type { VariantProp } from './types';

type Props = React.ComponentProps<typeof NativeText> & {
  /**
   * Variant defines appropriate text styles for type role and its size
   * Available variants:
   * Display: `displayLarge`, `displayMedium`, `displaySmall`
   * Headline: `headlineLarge`,`headlineMedium`,`headlineSmall`
   * Title: `titleLarge`,  `titleMedium`,  `titleSmall`
   * Label: `labelLarge`, `labelMedium`, `labelSmall`
   * Body: `bodyLarge`,  `bodyMedium`,  `bodySmall`
   */
  variant?: VariantProp;
  children: React.ReactNode;
  theme?: ThemeProp;
  style?: StyleProp<TextStyle>;
};

type TextRef = React.ForwardedRef<{ setNativeProps(arg: Object): void }>;

const Text = ({ style, variant, theme: initialTheme, ...rest }: Props, ref: TextRef) => {
  const root = React.useRef<NativeText | null>(null);
  const theme = useInternalTheme(initialTheme);

  const writingDirection = I18nManager.getConstants().isRTL ? 'rtl' : 'ltr';

  // TODO: Explore more about useImperativeHandle
  React.useImperativeHandle(ref, () => ({
    setNativeProps: (args: Object) => root.current?.setNativeProps(args),
  }));

  if (theme.isV3 && variant) {
    const font = theme.fonts[variant];

    if (typeof font !== 'object') {
      // TODO: Where this error will be handled?
      throw new Error(
        `Variant ${variant} was not provided properly. Valid variants are ${Object.keys(
          theme.fonts,
        ).join(', ')}.`,
      );
    }

    // TODO: Where is children for NativeText? will it render empty content?
    return (
      <NativeText
        ref={root}
        style={[font, styles.text, { writingDirection, color: theme.colors.onSurface }, style]}
        {...rest}
      />
    );
  } else {
    const font = theme.isV3 ? theme.fonts.default : theme.fonts?.regular;
    const textStyle = { ...font, color: theme.isV3 ? theme.colors?.onSurface : theme.colors.text };

    return (
      <NativeText
        {...rest}
        ref={root}
        style={[styles.text, textStyle, { writingDirection }, style]}
      ></NativeText>
    );
  }
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },
});

type TextComponent = (props: Props & { ref?: React.RefObject<TextRef> }) => JSX.Element;

// TODO: explore why it should be forwardRef
const Component = forwardRef(Text) as TextComponent;
export default Component;
