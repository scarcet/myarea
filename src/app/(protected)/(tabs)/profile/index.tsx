import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { getPostsByUserId } from '@/services/posts';
import PostListItem from '@/components/PostListItem';
import { getProfileById } from '@/services/profiles';
import ProfileHeader from '@/components/ProfileHeader';

export default function ProfileScreen() {
  const { user } = useAuth();

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['posts', { user_id: user?.id }],
    queryFn: () => getPostsByUserId(user!.id),
  });

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text className='text-white'>Error: {error.message}</Text>;

  return (
    <View className='flex-1 justify-center'>
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostListItem post={item} />}
        ListHeaderComponent={() => (
          <>
            <ProfileHeader />
            <Text className='text-white text-lg font-bold mt-4 m-2'>
              Threads
            </Text>
          </>
        )}
      />

      <Text
        onPress={() => supabase.auth.signOut()}
        className='text-2xl font-bold text-white'
      >
        Sign out
      </Text>
    </View>
  );
}