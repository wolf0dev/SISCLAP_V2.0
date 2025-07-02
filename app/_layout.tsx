import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AuthProvider } from '../src/contexts/AuthContext';
import { SnackbarProvider } from '../src/contexts/SnackbarContext';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { theme } from '../src/theme/theme'
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PaperProvider theme={theme}>
          <SnackbarProvider>
            <AuthProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="auth" />
                <Stack.Screen name="dashboard" />
              </Stack>
              <StatusBar style="light" backgroundColor="#FF4040" />
              <Toast />
            </AuthProvider>
          </SnackbarProvider>
        </PaperProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}