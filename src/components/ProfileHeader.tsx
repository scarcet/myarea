import { useQuery } from '@tanstack/react-query';
import { getProfileById } from '@/services/profiles';
import { View, Text, ActivityIndicator, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/providers/AuthProvider';
import { Link } from 'expo-router';
import SupabaseImage from './SupabaseImage';

export default function ProfileHeader() {
  const { user } = useAuth();

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => getProfileById(user!.id),
  });

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text className='text-white'>Error: {error.message}</Text>;
  // console.log(JSON.stringify(profile, null, 2));

  return (
    <View className="p-4 bg-white">
      {/* Top row: avatar + text content */}
      <View className="flex-row items-start gap-4">
        <SupabaseImage
          bucket="avatars"
          path={profile?.avatar_url}
          className="w-24 h-24 rounded-full"
          transform={{ width: 96, height: 96 }}
        />

        <View className="flex-1">
          {/* Username */}
          <Text className="text-black text-xl font-bold">{profile?.username}</Text>

          {/* Location */}
          <View className="flex-row items-center mt-1">
          <Ionicons name="location-outline" size={16} color="#6b7280" />
          <Text className="text-gray-500 text-sm ml-1">{profile?.street}</Text>
          <Text className="text-gray-400 text-sm mx-2">•</Text>
          <Ionicons name="walk-outline" size={16} color="#6b7280" />
          <Text className="text-gray-500 text-sm ml-1">{profile?.area}</Text>

          </View>

          {/* Bio (kept in same column) */}
          {profile?.bio && (
            <Text className="text-gray-700 mt-2 leading-snug font-semibold flex-wrap" numberOfLines={3} ellipsizeMode="tail">
              {profile.bio}
            </Text>
          )}
        </View>
      </View>

      {/* Buttons */}
      <View className="mt-4 w-full px-8">
  <Link href="/profile/edit" asChild>
    <Pressable className="w-full py-2 rounded-full border border-gray-300 bg-white">
      <Text className="text-center text-black font-medium">Edit Profile</Text>
    </Pressable>
  </Link>
</View>
    </View>
  );
}