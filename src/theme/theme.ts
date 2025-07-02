import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FF4040',
    primaryContainer: '#FF6B6B',
    secondary: '#424242',
    secondaryContainer: '#F5F5F5',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    background: '#F5F5F5',
    error: '#D32F2F',
    errorContainer: '#FFEBEE',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#212121',
    onBackground: '#212121',
    onError: '#FFFFFF',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FF6B6B',
    primaryContainer: '#D32F2F',
    secondary: '#757575',
    secondaryContainer: '#424242',
    surface: '#1E1E1E',
    surfaceVariant: '#424242',
    background: '#121212',
    error: '#F44336',
    errorContainer: '#FFCDD2',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#FFFFFF',
    onBackground: '#FFFFFF',
    onError: '#FFFFFF',
  },
};

export const theme = lightTheme;