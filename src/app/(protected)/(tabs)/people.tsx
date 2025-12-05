import UserList from '@/components/UserList';
import { supabase } from '@/lib/supabase';
import { User } from '@/types';
import { useAuth } from '@/providers/AuthProvider';
import { View } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

// Create a direct channel between two users
async function findOrCreateDirectChannel(currentUserId: string, otherUserId: string) {

  // 1️⃣ Find channels current user is in
  const { data: myChannels } = await supabase
    .from('channel_users')
    .select('channel_id')
    .eq('user_id', currentUserId);

  // 2️⃣ Find channels other user is in
  const { data: otherChannels } = await supabase
    .from('channel_users')
    .select('channel_id')
    .eq('user_id', otherUserId);

  // 3️⃣ Find common channel_ids
  const mySet = new Set(myChannels?.map(c => c.channel_id));
  const commonIds = otherChannels
    ?.map(c => c.channel_id)
    .filter(id => mySet.has(id));

  // 4️⃣ If any common channel is DIRECT → return it
  if (commonIds.length > 0) {
    const { data: directChannel } = await supabase
      .from('channels')
      .select('*')
      .eq('id', commonIds[0])
      .eq('type', 'direct')
      .single();

    if (directChannel) {
      return directChannel;
    }
  }

  // 5️⃣ Otherwise create new channel
  const { data: channel } = await supabase
    .from('channels')
    .insert({ type: 'direct' })
    .select('*')
    .single()
    .throwOnError();

  // 6️⃣ Add both members
  await supabase.from('channel_users').insert([
    { channel_id: channel.id, user_id: currentUserId },
    { channel_id: channel.id, user_id: otherUserId },
  ]).throwOnError();

  return channel;
}


export default function NewChat() {
  const { user } = useAuth();

  const createChannel = useMutation({
    mutationFn: async (clickedUser: User) => {
      return await findOrCreateDirectChannel(user!.id, clickedUser.id);
    },
    onSuccess(channel) {
      router.back();
      router.push(`privatechat/channel/${channel.id}`);
    },
  });

  const handleUserPress = (user: User) => {
    console.log("User clicked:", user.first_name);
    createChannel.mutate(user);
  };

  return (
    <View className="bg-white flex-1">
      <UserList onPress={handleUserPress} />
    </View>
  );
}
