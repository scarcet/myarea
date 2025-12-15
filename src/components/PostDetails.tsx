import { View, Text, Image, Pressable, Alert } from 'react-native';
import { Post } from '@/type';
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Tables } from '@/types/database.types';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';
import SupabaseImage from './SupabaseImage';
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { likePost, unlikePost, getLikesForPost, hasUserLikedPost } from '@/services/posts';

dayjs.extend(relativeTime);

type PostWithUser = Tables<'posts'> & {
  user: Tables<'profiles'>;
  replies: {
    count: number;
  }[];
};

export default function PostDetails({ post }: { post: PostWithUser }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchLikes = async () => {
      const likes = await getLikesForPost(post.id);
      setLikeCount(likes.length);
      if (user) {
        const userLiked = await hasUserLikedPost(post.id, user.id);
        setLiked(userLiked);
      }
    };
    fetchLikes();
  }, [post.id]);

  const toggleLike = async () => {
    if (!user) return;
    try {
      if (liked) {
        await unlikePost(post.id, user.id);
        setLikeCount((prev) => prev - 1);
      } else {
        await likePost(post.id, user.id);
        setLikeCount((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      Alert.alert(
        "Something went wrong",
        "Please try again in a moment."
      );
    }
  };
  return (
    <Link href={`/posts/${post.id}`} asChild>
      <Pressable className="bg-white">
        {/* Header: Avatar + Username + Time */}
        <Pressable
      className="flex-row items-center px-4 pt-4"
      onPress={(e) => {
        e.stopPropagation();               // 👈 Prevent opening the post
        router.push(`/(protected)/${post.user.id}`);
      }}
    >
          <SupabaseImage
            bucket="avatars"
            path={post.user.avatar_url}
            className="w-12 h-12 rounded-full mr-3"
            transform={{ width: 50, height: 50 }}
          />

          <View className="flex-1">
            <Text className="text-black font-semibold text-base">
              {post.user.username}
            </Text>
            <Text className="text-gray-500 text-sm">
              {dayjs(post.created_at).fromNow()}
            </Text>
          </View>
          </Pressable>

        {/* Post Content */}
        {post.content && (
          <Text className="text-gray-900 text-base leading-6 px-4 mt-2">
            {post.content}
          </Text>
        )}

        {/* Post Images */}
        {post.images && post.images.length > 0 && (
          <View className="w-full mt-2 px-4">
            {post.images.map((image) => (
              <SupabaseImage
                key={image}
                bucket="media"
                path={image}
                className="w-full aspect-[4/3] rounded-xl mb-2"
                transform={{ width: 900, height: 675 }}
              />
            ))}
          </View>
        )}

        {/* Interaction Buttons */}
        <View className="flex-row justify-start px-4 py-3 border-t border-gray-100">
          <Pressable className="flex-row items-center mr-6" onPress={toggleLike}>
          <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={22}
              color={liked ? "#ef4444" : "#6B7280"}
            />
            <Text className="text-gray-600 ml-1 text-sm">
              {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
            </Text>
          </Pressable>

          <Pressable className="flex-row items-center mr-6">
            <Ionicons name="chatbubble-outline" size={22} color="#6B7280" />
            <Text className="text-gray-600 ml-1 text-sm">
              {post?.replies?.[0].count || 0} Comment
            </Text>
          </Pressable>

          <Pressable className="flex-row items-center mr-6">
            <Ionicons name="repeat-outline" size={22} color="#6B7280" />
            <Text className="text-gray-600 ml-1 text-sm">0</Text>
          </Pressable>

          <Pressable className="flex-row items-center">
            <Ionicons name="paper-plane-outline" size={22} color="#6B7280" />
          </Pressable>
        </View>
      </Pressable>
    </Link>
  );
}