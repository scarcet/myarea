import { View, ActivityIndicator, FlatList, Text, RefreshControl } from 'react-native';
import PostListItem from '@/components/PostListItem';
import { supabase } from '@/lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPosts } from '@/services/posts';
import { useState } from 'react';

export default function HomeScreen() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['posts'] });
    await new Promise((resolve) => setTimeout(resolve, 600)); // short delay
    setRefreshing(false);
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>{error.message}</Text>;
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={data}
        renderItem={({ item }) => <PostListItem post={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        // 👇 This enables pull-to-refresh
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}