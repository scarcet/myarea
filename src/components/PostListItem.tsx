import { View, Text, Image, Pressable, Alert, Modal } from 'react-native';
import { Post } from '@/type';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Tables } from '@/type/database.types';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';
import SupabaseImage from './SupabaseImage';
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { likePost, unlikePost, getLikesForPost, hasUserLikedPost, deletePost } from '@/services/posts';


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
  showDelete = false,
}: {
  post: PostWithUser;
  isLastInGroup?: boolean;
  showDelete?: boolean;
}) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const queryClient = useQueryClient();



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
    <>
    <Link href={`/posts/${post.id}`} asChild>
      <Pressable
        className={`bg-white ${isLastInGroup ? 'border-b border-gray-200' : ''}`}
      >
        {/* Header: Avatar + Username + Time */}
        <Pressable
      className="flex-row items-center justify-between px-4 pt-4"
      onPress={(e) => {
        e.stopPropagation();               // 👈 Prevent opening the post
        router.push(`/(protected)/${post.user.id}`);
      }}
    >
        <View className="flex-row items-center">
          <SupabaseImage
            bucket="avatars"
            path={post.user.avatar_url}
            className="w-12 h-12 rounded-full mr-3"
            transform={{ width: 50, height: 50 }}
          />

          <View>
            <Text className="text-black font-semibold text-base">
              {post.user.username}
            </Text>
            <Text className="text-gray-500 text-sm">
              {dayjs(post.created_at).fromNow()}
            </Text>
            </View>
            </View>
            {showDelete && user?.id === post.user.id && (
  <Pressable
    onPress={(e) => {
      e.stopPropagation();
      setMenuVisible(true);
    }}
  >
    <Ionicons name="ellipsis-horizontal" size={22} color="#6B7280" />
  </Pressable>
)}
         
          </Pressable>

        {/* Post Text Content */}
        {post.content && (
          <Text className="text-gray-900 text-base leading-6 px-4 mt-3">
            {post.content}
          </Text>
        )}

        {/* Post Image */}
        {post.images && post.images.length > 0 && (
          <View className="w-full mt-3">
            <SupabaseImage
              key={post.images[0]}
              bucket="media"
              path={post.images[0]}
              className="w-full aspect-[4/3] rounded-xl"
              transform={{ width: 900, height: 675 }}
            />
          </View>
        )}

        {/* Interaction Buttons */}
        <View className="flex-row justify-start px-6 py-3 border-t border-gray-100">

          <Pressable className="flex-row items-center" onPress={toggleLike}>
          <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={22}
              color={liked ? "#ef4444" : "#6B7280"}
            />
            <Text className="text-gray-600 ml-1 text-sm">
              {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
            </Text>
          </Pressable>

          <Pressable className="flex-row px-6 items-center">
            <Ionicons name="chatbubble-outline" size={22} color="#6B7280" />
            <Text className="text-gray-600 ml-1 text-sm">{post?.replies?.[0].count || 0}   Comment</Text>
          </Pressable>

          <Pressable className="flex-row items-center">
            <Ionicons name="paper-plane-outline" size={22} color="#6B7280" />
            <Text className="text-gray-600 ml-1 text-sm">Share</Text>
          </Pressable>
        </View>
      </Pressable>
      </Link>
      {menuVisible && (
    <Modal
      transparent
      animationType="fade"
      onRequestClose={() => setMenuVisible(false)}
    >
      <Pressable
        className="flex-1 bg-black/40"
        onPress={() => setMenuVisible(false)}
      >
        <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6">
          
          <Pressable
            className="py-3"
            onPress={async () => {
              setMenuVisible(false);
              await deletePost(post.id, user!.id);
              queryClient.invalidateQueries({ queryKey: ["posts"] });
            }}
          >
            <Text className="text-red-500 text-base font-semibold">
              Delete Post
            </Text>
          </Pressable>
  
          <Pressable className="py-3" onPress={() => setMenuVisible(false)}>
            <Text className="text-black text-base">Cancel</Text>
          </Pressable>
  
        </View>
      </Pressable>
    </Modal>
  )}
</>
  );
}
