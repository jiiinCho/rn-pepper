import color from 'color';

import { configureFonts } from 'src/styles';
import type { MD2Theme, Fonts } from 'src/types';

import { white, black, pinkA400 } from './colors';

export const MD2LightTheme: MD2Theme = {
  dark: false,
  roundness: 4,
  version: 2,
  isV3: false,
  colors: {
    primary: '#6200ee',
    accent: '#03dac4',
    background: '#f6f6f6',
    surface: white,
    error: '#B00020',
    text: black,
    onSurface: '#000000',
    disabled: color(black).alpha(0.26).rgb().string(),
    placeholder: color(black).alpha(0.54).rgb().string(),
    backdrop: color(black).alpha(0.5).rgb().string(),
    notification: pinkA400,
    tooltip: 'rgba(28, 27, 31, 1)',
  },
  fonts: configureFonts({ isV3: false }) as Fonts,
  animation: {
    scale: 1.0,
  },
};
