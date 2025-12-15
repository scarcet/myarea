import { View, ActivityIndicator, FlatList, Text, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PostListItem from '@/components/PostListItem';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAreaPosts } from '@/services/posts';
import { useAuth } from "@/providers/AuthProvider";
import { useState } from 'react';

export default function HomeScreen() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", profile?.area, profile?.city, profile?.country],
    queryFn: () =>
      fetchAreaPosts(profile!.area, profile!.city, profile!.country),
    enabled: !!profile, // 👈 Only runs when profile is loaded
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ["posts", profile?.area, profile?.city, profile?.state, profile?.country],
    });
    await new Promise((resolve) => setTimeout(resolve, 600));
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View className="items-center justify-center mt-10 px-4">
            <Ionicons name="newspaper-outline" size={48} color="#9ca3af" />
            <Text className="text-gray-400 text-lg font-medium mt-3">
              No posts available in your area yet
            </Text>
          </View>
        )}
      />
    </View>
  );
}
