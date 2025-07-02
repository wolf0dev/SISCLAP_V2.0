import React, { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';

type ThemeContextType = {
  toggleTheme: () => void;
  isDarkMode: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  toggleTheme: () => {},
  isDarkMode: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          primary: {
            main: '#FF4040', // Coral rojo intenso
            light: '#FF6B6B',
            dark: '#D32F2F',
          },
          secondary: {
            main: '#424242',
          },
          background: {
            default: isDarkMode ? '#121212' : '#F5F5F5',
            paper: isDarkMode ? '#1E1E1E' : '#FFFFFF',
          },
          error: {
            main: '#D32F2F',
          },
          warning: {
            main: '#F57C00',
          },
          info: {
            main: '#0288D1',
          },
          success: {
            main: '#388E3C',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 500,
          },
          h2: {
            fontWeight: 500,
          },
          h3: {
            fontWeight: 500,
          },
          h4: {
            fontWeight: 500,
          },
          h5: {
            fontWeight: 500,
          },
          h6: {
            fontWeight: 500,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 500,
              },
              containedPrimary: {
                '&:hover': {
                  backgroundColor: '#D32F2F',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                marginBottom: 16,
              },
            },
          },
        },
      }),
    [isDarkMode]
  );

  return (
    <ThemeContext.Provider value={{ toggleTheme, isDarkMode }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};