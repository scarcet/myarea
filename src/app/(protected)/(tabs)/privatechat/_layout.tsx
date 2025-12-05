import { Stack } from 'expo-router';

export default function PrivateChatLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='chats'
        options={{ headerShown: false, title: 'Home' }}
      />
      {/* <Stack.Screen
        name='privatechat/channel/[id]'
        options={{
          title: 'Channel',
          headerBackButtonDisplayMode: 'minimal',
          // headerLargeTitle: true,
          // headerTransparent: true,
        }}
      /> */}

      <Stack.Screen
        name='new/chat'
        options={{ title: 'People in your area', presentation: 'modal' }}
      />
    </Stack>
  );
}