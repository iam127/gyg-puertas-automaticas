import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const LAYOUT = {
  window: {
    width,
    height,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    round: 9999,
    full: 9999,
  },
  typography: {
    sizes: {
      hero: 32,
      h1: 24,
      h2: 20,
      h3: 18,
      bodyLarge: 16,
      body: 14,
      small: 12,
      xs: 10,
    },
    lineHeights: {
      hero: 38,
      h1: 30,
      h2: 26,
      h3: 24,
      bodyLarge: 22,
      body: 20,
      small: 16,
      xs: 12,
    },
    fontWeights: {
      regular: '400' as '400',
      medium: '500' as '500',
      semibold: '600' as '600',
      bold: '700' as '700',
      black: '900' as '900',
    },
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 10,
    },
  },
};

export default LAYOUT;