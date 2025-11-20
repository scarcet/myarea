import { useAuth } from '@/providers/AuthProvider';
import { Redirect, Stack } from 'expo-router';

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href='/signIn' />;
  }

  return (
    <Stack>
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen
        name='new'
        options={{
          title: 'New Post',
          presentation: 'modal',
          // animation: 'slide_from_bottom',
        }}
      />
        <Stack.Screen
        name='completeProfileStep1'
        options={{
          title: 'Edit Profile',
          // animation: 'slide_from_bottom',
        }}
      />
        <Stack.Screen
        name='completeProfileStep2'
        options={{
          title: 'Edit Location',
          // animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  )
}