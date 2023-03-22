import * as React from 'react';
import { I18nManager, Platform, ImageSourcePropType, Image } from 'react-native';

import { useInternalTheme, Consumer as SettingsConsumer } from 'core';
import type { ThemeProp } from 'types';

import { accessibilityProps } from './MaterialCommunityIcon';

type IconSourceBase = string | ImageSourcePropType;

export type IconSource =
  | IconSourceBase
  | Readonly<{ source: IconSourceBase; direction: 'rtl' | 'ltr' | 'auto' }>
  | ((props: IconProps & { color: string }) => React.ReactNode);

type IconProps = {
  size: number;
  allowFontScaling?: boolean;
};

type Props = IconProps & {
  source: any;
  color?: string;
  direction?: 'rtl' | 'ltr' | 'auto';
  theme?: ThemeProp;
};

const Icon = ({
  source,
  color,
  size,
  theme: themeOverrides,
  direction: customDirection,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const direction =
    customDirection || (typeof source === 'object' && source.direction && source.source)
      ? source.direction === 'auto'
        ? I18nManager.getConstants().isRTL
          ? 'rtl'
          : 'ltr'
        : source.direction
      : null;

  const src =
    typeof source === 'object' && source.direction && source.source ? source.source : source;

  const iconColor = color || (theme.isV3 ? theme.colors.onSurface : theme.colors.text);

  if (isImageSource(src)) {
    return (
      <Image
        {...rest}
        source={src}
        style={[
          { transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }] },
          { width: size, height: size, tintColor: color, resizeMode: `contain` },
        ]}
        {...accessibilityProps}
        accessibilityIgnoresInvertColors
      />
    );
  } else if (typeof src === 'string') {
    return (
      <SettingsConsumer>
        {({ icon }) => {
          return icon({
            name: src,
            color: iconColor,
            size,
            direction,
          });
        }}
      </SettingsConsumer>
    );
  } else if (typeof src === 'function') {
    return src({ color: iconColor, size, direction });
  } else {
    return null;
  }
};

export default Icon;

function isImageSource(source: any) {
  // is source an object with uri?
  return (
    (typeof source === 'object' &&
      source !== null &&
      Object.prototype.hasOwnProperty.call(source, 'uri') &&
      typeof source.uri === 'string') ||
    // source is a module, e.g. require('image')
    typeof source === 'number' ||
    // image url on web
    (Platform.OS === 'web' &&
      typeof source === 'string' &&
      (source.startsWith('data:image') || /\.(bmp|jpg|jpeg|png|gif|svg)$/.test(source)))
  );
}
