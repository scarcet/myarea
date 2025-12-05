import { ActivityIndicator, FlatList } from 'react-native';
import ChannelListItem from '@/components/ChannelListItem';
import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '@/providers/SupabaseProvider';
import { supabase } from '@/lib/supabase';
import { useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useAuth } from '@/providers/AuthProvider';

export default function ChannelListScreen() {
  // const supabase = useSupabase();
  // const { user } = useUser();
  const { user } = useAuth();

  const {
    data: channels,
    isLoading, refetch,
  } = useQuery({
    queryKey: ['channels', user?.id],
    queryFn: async () => {
      const { data } = await supabase
      .from('channel_users')
      .select(`
        *,
        channels (
          *,
          profiles (*),
          messages (
            id,
            content,
            created_at,
            user_id,
            channel_id
          )
        )
      `)
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false, foreignTable: 'channels.messages' })
      .limit(1, { foreignTable: 'channels.messages' })
      .throwOnError();
    
    const channels = data.map((row) => {
      const channel = row.channels;
    
      return {
        ...channel,
        lastMessage: channel.messages?.[0] ?? null,
      };
    });
    
    return channels;
    },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );
  

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={channels}
      className='bg-white'
      renderItem={({ item }) => <ChannelListItem channel={item} />}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior='automatic'
    />
  );
}