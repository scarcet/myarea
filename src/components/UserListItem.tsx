import { User } from '@/type';
import SupabaseImage from './SupabaseImage';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Pressable } from 'react-native';

type UserListItemProps = {
  user: User;
  onPress?: (user: User) => void;
};

export default function UserListItem({ user, onPress }: UserListItemProps) {
  return (
    <Pressable
      onPress={() => onPress?.(user)}
      className="flex-row items-center gap-4 p-4 border-b border-gray-100"
    >
      {/* Avatar */}
      <View className="bg-gray-200 w-12 h-12 items-center justify-center rounded-full overflow-hidden">
        {user.avatar_url ? (
          <SupabaseImage
            bucket="avatars"
            path={user.avatar_url}
            className="w-12 h-12 rounded-full"
            transform={{ width: 48, height: 48 }}
          />
        ) : (
          <Text className="text-neutral-500 font-bold text-lg">
            {user.first_name?.charAt(0)?.toUpperCase()}
          </Text>
        )}
      </View>

{/* Name + Address */}
<View className="flex-1">
  <Text className="text-gray-900 font-semibold text-base">
    {user.first_name} {user.last_name}
  </Text>

  {(user.street || user.area) && (
    <View className="flex-row items-center mt-1">

      {/* Street Icon + Text */}
      <Ionicons name="location-outline" size={16} color="#6b7280" />
      <Text className="text-gray-500 text-sm ml-1">
        {user.street || 'N/A'}
      </Text>

      {/* Dot Separator */}
      {(user.street && user.area) && (
        <Text className="text-gray-400 text-sm mx-2">•</Text>
      )}

      {/* Area Icon + Text */}
      {user.area && (
        <>
          <Ionicons name="walk-outline" size={16} color="#6b7280" />
          <Text className="text-gray-500 text-sm ml-1">
            {user.area}
          </Text>
        </>
      )}
    </View>
  )}
</View>
    </Pressable>
  );
}
