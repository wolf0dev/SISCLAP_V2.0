import React, { createContext, useContext, ReactNode } from 'react';
import Toast from 'react-native-toast-message';

interface SnackbarContextType {
  showSnackbar: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

const SnackbarContext = createContext<SnackbarContextType>({
  showSnackbar: () => {},
});

export const useSnackbar = () => useContext(SnackbarContext);

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const showSnackbar = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    Toast.show({
      type: type,
      text1: message,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 60,
    });
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
    </SnackbarContext.Provider>
  );
};