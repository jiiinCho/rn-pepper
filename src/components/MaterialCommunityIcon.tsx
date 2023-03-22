import * as React from 'react';
import { Text, StyleSheet, ViewProps, View } from 'react-native';

import { MD3Colors } from 'styles';

// NOTE: not support for web
// TODO: Investigate more
export const accessibilityProps = {
  accessibilityElementsHidden: true,
  importantForAccessibility: 'no-hide-descendants' as 'no-hide-descendants',
};

export type IconProps = {
  name: string;
  color?: string;
  size: number;
  direction: 'rtl' | 'ltr';
  allowFontScaling?: boolean;
};

let MaterialCommunityIcons: React.ComponentType<
  React.ComponentProps<
    typeof import('react-native-vector-icons/MaterialCommunityIcons').default
  > & {
    color: string;
    pointerEvents: ViewProps['pointerEvents'];
  }
>;

try {
  // Optionally require vector-icons
  MaterialCommunityIcons = require('react-native-vector-icons/MaterialCommunityIcons').default;
} catch (error) {
  let isErrorLogged = false;
  // TODO: Fallback component for icons - add more props if needed
  MaterialCommunityIcons = ({ name, color, size }) => {
    if (!isErrorLogged) {
      if (
        !/(Cannot find module|Module not found|Cannot resolve module)/.test((error as any).message)
      ) {
        console.error(error);
      }

      console.warn(
        `Tried to use the icon '${name}' in a component from 'react-native-paper', but 'react-native-vector-icons/MaterialCommunityIcons' could not be loaded.`,
        `To remove this warning, try installing 'react-native-vector-icons' or use another method to specify icon: https://callstack.github.io/react-native-paper/icons.html.`,
      );

      isErrorLogged = true;
    }

    return (
      // TODO: Add more props if needed
      <View style={[styles.icon]} pointerEvents={'none'}>
        <Text style={{ color, fontSize: size }} selectable={false}>
          □
        </Text>
      </View>
    );
  };
}

const defaultIcon = ({
  name,
  color = MD3Colors.black,
  size,
  direction,
  allowFontScaling,
}: IconProps) => {
  return (
    <MaterialCommunityIcons
      allowFontScaling={allowFontScaling}
      name={name}
      color={color}
      size={size}
      style={[
        {
          transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }],
          lineHeight: size,
        },
        styles.icon,
      ]}
      pointerEvents="none"
      selectable={false}
      {...accessibilityProps}
    />
  );
};

const ICON_BACKGROUND_COLOR = 'transparent';

const styles = StyleSheet.create({
  icon: {
    backgroundColor: ICON_BACKGROUND_COLOR,
  },
});

export default defaultIcon;
