import { ActivityIndicator, FlatList } from 'react-native';
import ChannelListItem from '@/components/ChannelListItem';
import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '@/providers/SupabaseProvider';
import { supabase } from '@/lib/supabase';
// import { useUser } from '@clerk/clerk-expo';
import { useAuth } from '@/providers/AuthProvider';

export default function ChannelListScreen() {
  // const supabase = useSupabase();
  // const { user } = useUser();
  const { user } = useAuth();

  // TODO: Pagination
  // TODO: Pull down to reload
  // TODO: Sort by recent first
  const {
    data: channels,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['channels'],
    queryFn: async () => {
      const { data } = await supabase
        .from('channel_users')
        .select('*, channels(*, profiles(*))')
        .eq('user_id', user!.id)
        .throwOnError();

      const channels = data.map((m) => m.channels);

      return channels;
    },
  });

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