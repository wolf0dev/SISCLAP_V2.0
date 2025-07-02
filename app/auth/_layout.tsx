import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="recover-password" />
      <Stack.Screen name="recover-username" />
    </Stack>
  );
}