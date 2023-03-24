import * as React from 'react';
// import { StyleSheet } from 'react-native';

import renderer from 'react-test-renderer';

import { Button } from 'src/components';

// const styles = StyleSheet.create({
//   flexing: {
//     flexDirection: 'row-reverse',
//   },
// });

it('renders text button by default', () => {
  const tree = renderer.create(<Button label="Text Button" />).toJSON();
  expect(tree).toMatchSnapshot();
});
