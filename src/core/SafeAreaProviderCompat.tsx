import * as React from 'react';
import { Dimensions, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { SafeAreaInsetsContext, SafeAreaProvider } from 'react-native-safe-area-context';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const { width = 0, height = 0 } = Dimensions.get('window');

// Empty initial metrics values to support test environment
const initialMetrics = {
  frame: { x: 0, y: 0, width, height },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export default function SafeAreaProviderCompat({ children, style }: Props) {
  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => {
        if (insets) {
          // TODO: is this issue still remains?
          // if we already have insets, don't wrap the stack in another safe area provider
          // This avoids an issue with updates at the const of potentially incorrect values
          // https://github.com/react-navigation/react-navigation/issues/174
          return <View style={[styles.container, style]}>{children}</View>;
        }

        return (
          <SafeAreaProvider initialMetrics={initialMetrics} style={style}>
            {children}
          </SafeAreaProvider>
        );
      }}
    </SafeAreaInsetsContext.Consumer>
  );
}

SafeAreaProviderCompat.initialMetrics = initialMetrics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
