import { Stack } from 'expo-router';

export default function BeneficiariosLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="form" />
      <Stack.Screen name="detail" />
      <Stack.Screen name="inactivos" />
    </Stack>
  );
}