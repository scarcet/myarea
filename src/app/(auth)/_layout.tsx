import { useAuth } from '@/providers/AuthProvider';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const { user, profile, isAuthenticated } = useAuth();

  // if (isAuthenticated && profile && !profile.username) {
  //   return <Redirect href="/completeProfileStep1" />;
  // }

  if (isAuthenticated && profile?.username) {
    return <Redirect href='/(protected)/' />;
  }

  return (
    <Stack>
      <Stack.Screen name='signIn' options={{ headerShown: false }} />
      <Stack.Screen
        name='signUp'
        options={{ title: 'Sign up', headerBackButtonDisplayMode: 'minimal' }}
      />
    </Stack>
  );
}