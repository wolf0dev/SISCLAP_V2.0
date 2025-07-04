import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import LoadingScreen from '../src/components/common/LoadingScreen';

export default function Index() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // For now, always redirect to the main tabs since we don't have a login screen yet
  // In a real app, you would check authentication and redirect accordingly
  return <Redirect href="/(tabs)" />;
}