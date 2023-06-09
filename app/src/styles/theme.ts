import {DefaultTheme} from '@react-navigation/native';

export const colors = {
  black: '#000000',
  white: '#FFFFFF',
  transparent: 'transparent',
  success: '#22c55e',
  error: '#ef4444',
  'picton-blue': {
    '50': '#f0faff',
    '100': '#e0f5fe',
    '200': '#bae8fd',
    '300': '#7dd5fc',
    '400': '#38bdf8',
    '500': '#0ea6e9',
    '600': '#028ac7',
    '700': '#0370a1',
    '800': '#075e85',
    '900': '#0c506e',
    '950': '#083549',
  },
  'water-leaf': {
    '50': '#f1fcf8',
    '100': '#d1f6ec',
    '200': '#9eecd9',
    '300': '#6cdcc5',
    '400': '#3dc4ac',
    '500': '#24a892',
    '600': '#1a8778',
    '700': '#196c61',
    '800': '#19564f',
    '900': '#194843',
    '950': '#082b28',
  },
  grey: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.black,
    primary: colors.white,
    text: colors.white,
    border: colors.black,
    notification: 'red',
    card: colors.black,
  },
};
