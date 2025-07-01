import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar } from 'react-native-paper';

interface SnackbarContextType {
  showSnackbar: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType>({
  showSnackbar: () => {},
  hideSnackbar: () => {},
});

export const useSnackbar = () => useContext(SnackbarContext);

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  const showSnackbar = (msg: string, msgType: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setMessage(msg);
    setType(msgType);
    setVisible(true);
  };

  const hideSnackbar = () => {
    setVisible(false);
  };

  const getSnackbarColor = () => {
    switch (type) {
      case 'success':
        return '#388E3C';
      case 'error':
        return '#D32F2F';
      case 'warning':
        return '#F57C00';
      default:
        return '#0288D1';
    }
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={hideSnackbar}
        duration={3000}
        style={{ backgroundColor: getSnackbarColor() }}
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};