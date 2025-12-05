import { Stack } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';

export default function HomeLayout() {
  const { profile } = useAuth();
  const homeTitle = profile?.area ? `${profile.area} - Area` : 'Area';
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: homeTitle,
        }}
      />
      <Stack.Screen
        name='posts/[id]'
        options={{
          title: 'Area',
          headerBackButtonDisplayMode: 'generic',
        }}
      />
    </Stack>
  );
}