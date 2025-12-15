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
import { useState, useEffect } from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';

export default function ProfileScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const { openMenu } = useLocalSearchParams();

  const [menuVisible, setMenuVisible] = useState(false);

  // 🔥 when layout triggers menu
  useEffect(() => {
    if (openMenu) {
      setMenuVisible(true);
      navigation.setParams({ openMenu: null });
    }
  }, [openMenu]);

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

      {/* Profile + posts */}
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostListItem post={item} showDelete />}
        ListHeaderComponent={() => (
          <>
            <ProfileHeader />
            <Text className="text-black text-lg font-bold mt-4 m-2">
              Your Posts
            </Text>
          </>
        )}
        ListEmptyComponent={() => (
          <View className="items-center justify-center mt-10 px-4">
            <Ionicons name="images-outline" size={48} color="#9ca3af" />
            <Text className="text-gray-400 text-lg font-medium mt-3">
              You haven't posted anything yet
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal */}
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

            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                router.push('/profile/orgInfo/termsCondition');
              }}
              className="py-3"
            >
              <Text className="text-black text-base">Terms and Conditions</Text>
            </TouchableOpacity>
            <View className="border-t border-gray-200 mt-4 pt-3">
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                router.push('/profile/orgInfo/aboutUs');
              }}
              className="py-3"
            >
              <Text className="text-black text-base">About Us</Text>
            </TouchableOpacity>
            </View>

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
