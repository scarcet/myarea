import { View, Text, Image, Pressable } from 'react-native';
import { Post } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Tables } from '@/types/database.types';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';
import SupabaseImage from './SupabaseImage';

dayjs.extend(relativeTime);

type PostWithUser = Tables<'posts'> & {
  user: Tables<'profiles'>;
  replies: {
    count: number;
  }[];
};

export default function PostListItem({
  post,
  isLastInGroup = true,
}: {
  post: PostWithUser;
  isLastInGroup?: boolean;
}) {
  return (
    <Link href={`/posts/${post.id}`} asChild>
      <Pressable
        className={`flex-row p-4 ${
          isLastInGroup ? 'border-b border-gray-800/70' : ''
        }`}
      >
        {/* User Avatar */}
        <View className='mr-3 items-center gap-2'>
          <SupabaseImage
            bucket='avatars'
            path={post.user.avatar_url}
            className='w-12 h-12 rounded-full'
            transform={{ width: 50, height: 50 }}
          />

          {!isLastInGroup && (
            <View className='w-[3px] flex-1 rounded-full bg-neutral-700 translate-y-2' />
          )}
        </View>

        {/* Content */}
        <View className='flex-1'>
          {/* User Info */}
          <View className='flex-row items-center'>
            <Text className='text-white font-bold mr-2'>
              {post.user.username}
            </Text>
            <Text className='text-gray-500'>
              {dayjs(post.created_at).fromNow()}
            </Text>
          </View>

          {/* Post Content */}
          <Text className='text-white mt-2 mb-3'>{post.content}</Text>

          {post.images && (
            <View className='flex-row gap-2 mt-2'>
              {post.images.map((image) => (
                <SupabaseImage
                  key={image}
                  bucket='media'
                  path={image}
                  className='w-full aspect-square rounded-lg'
                  transform={{ width: 500, height: 500 }}
                />
              ))}
            </View>
          )}

          {/* Interaction Buttons */}
          <View className='flex-row gap-4 mt-2'>
            <Pressable className='flex-row items-center'>
              <Ionicons name='heart-outline' size={20} color='#d1d5db' />
              <Text className='text-gray-300 ml-2'>0</Text>
            </Pressable>

            <Pressable className='flex-row items-center'>
              <Ionicons name='chatbubble-outline' size={20} color='#d1d5db' />
              <Text className='text-gray-300 ml-2'>
                {post?.replies?.[0].count || 0}
              </Text>
            </Pressable>

            <Pressable className='flex-row items-center'>
              <Ionicons name='repeat-outline' size={20} color='#d1d5db' />
              <Text className='text-gray-300 ml-2'>0</Text>
            </Pressable>

            <Pressable>
              <Ionicons name='paper-plane-outline' size={20} color='#d1d5db' />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}