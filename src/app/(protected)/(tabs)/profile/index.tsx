import { 
  ActivityIndicator, 
  FlatList, 
  Text, 
  View, 
  Pressable, 
  Modal,
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { getPostsByUserId } from '@/services/posts';
import PostListItem from '@/components/PostListItem';
import ProfileHeader from '@/components/ProfileHeader';
import { useState } from 'react';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['posts', { user_id: user?.id }],
    queryFn: () => getPostsByUserId(user!.id),
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text className="text-black">Error: {error.message}</Text>;

  return (
    <View className="flex-1 bg-white">
      {/* Header row like Threads: menu icon only */}
      <View className="flex-row justify-end items-center px-4 pt-4">
        <Pressable onPress={() => setMenuVisible(true)} className="p-2">
          <Ionicons name="ellipsis-horizontal" size={24} color="black" />
        </Pressable>
      </View>

      {/* Profile details + posts */}
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostListItem post={item} />}
        ListHeaderComponent={() => (
          <>
            <ProfileHeader />
            <Text className="text-black text-lg font-bold mt-4 m-2">
              Your Posts
            </Text>
          </>
        )}
        showsVerticalScrollIndicator={false}
      />

    {/* Bottom Sheet Menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          onPress={() => setMenuVisible(false)}
          className="flex-1 bg-black/40"
        >
          <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6">
            <View className="border-b border-gray-200 pb-3 mb-3">
              <Text className="text-center text-black font-semibold text-lg">
                Menu
              </Text>
            </View>

            {/* Menu items */}
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                router.push('/account');
              }}
              className="py-3"
            >
              <Text className="text-black text-base">Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                router.push('/account/status');
              }}
              className="py-3"
            >
              <Text className="text-black text-base">Account Status</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                router.push('/help');
              }}
              className="py-3"
            >
              <Text className="text-black text-base">Help</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                router.push('/about');
              }}
              className="py-3"
            >
              <Text className="text-black text-base">About</Text>
            </TouchableOpacity>

            <View className="border-t border-gray-200 mt-4 pt-3">
              <TouchableOpacity
                onPress={() => {
                  setMenuVisible(false);
                  handleSignOut();
                }}
                className="py-3"
              >
                <Text className="text-red-500 text-base font-semibold">Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}