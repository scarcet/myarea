import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ title: 'Home' }} />
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