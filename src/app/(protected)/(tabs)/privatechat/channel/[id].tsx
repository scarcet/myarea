import { Stack, useLocalSearchParams } from 'expo-router';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import MessageList from '@/components/MessageList';
import MessageInput from '@/components/MessageInput';
import { useQuery } from '@tanstack/react-query';
// import { useSupabase } from '@/providers/SupabaseProvider';
import { useAuth } from '@/providers/AuthProvider';
import { useUser } from '@clerk/clerk-expo';
import ChannelProvider, { useChannel } from '@/providers/ChannelProvider';

function StackHeader() {
  const { channel } = useChannel();
  // const { user } = useUser();
  const { user } = useAuth();

  if (!channel) {
    return null;
  }

  const otherUser = channel.profiles.find((u) => u.id !== user!.id);

  let channelName = channel.name || 'Unknown';
  if (channel.type === 'direct') {
    channelName = otherUser?.full_name || 'Unknown';
  }
  return <Stack.Screen 
  options={{ 
    title: channelName,
    headerBackTitle: 'Back', 
  }} />;
}

export default function ChannelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ChannelProvider id={id}>
      <StackHeader />

      <MessageList />
      <MessageInput />
    </ChannelProvider>
  );
}