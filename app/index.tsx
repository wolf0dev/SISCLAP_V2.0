import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import LoadingScreen from '../src/components/common/LoadingScreen';

export default function Index() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Redirect href="/dashboard" />;
  }

  return <Redirect href="/auth/login" />;
}