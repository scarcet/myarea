import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import SupabaseImage from "@/components/SupabaseImage";
import { useAuth } from "@/providers/AuthProvider";
import { useState, useEffect } from "react";

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user: authUser } = useAuth();
  const [channelExists, setChannelExists] = useState(false);
  const [existingChannelId, setExistingChannelId] = useState<string | null>(null);

  // Fetch user profile
  const { data: user, isLoading } = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Check if a direct channel exists for these two users
  const checkChannelExists = async () => {
    if (!authUser?.id || !id) return;

    const { data, error } = await supabase
      .from("channels")
      .select("id, channel_users(user_id)")
      .eq("type", "direct");

    if (error || !data) return;

    const found = data.find((ch) => {
      const ids = ch.channel_users.map((u) => u.user_id);
      return ids.includes(authUser.id) && ids.includes(id) && ids.length === 2;
    });

    if (found) {
      setChannelExists(true);
      setExistingChannelId(found.id);
    } else {
      setChannelExists(false);
      setExistingChannelId(null);
    }
  };

  useEffect(() => {
    checkChannelExists();
  }, [authUser, id]);

  const startPrivateChat = async () => {
    if (!authUser?.id || !id) return;
  
    // 1. Check for existing channel
    const { data: channels } = await supabase
      .from("channels")
      .select("id, channel_users(user_id)")
      .eq("type", "direct");
  
    const existing = channels?.find((ch) => {
      const ids = ch.channel_users?.map((u) => u.user_id) || [];
      return ids.includes(authUser.id) && ids.includes(id) && ids.length === 2;
    });
  
    if (existing) {
      router.push(`privatechat/channel/${existing.id}`);
      return;
    }
  
    // 2. Create a new channel
    const { data: newChannel, error: channelError } = await supabase
      .from("channels")
      .insert({ type: "direct", name: null })
      .select()
      .single();
  
    if (channelError || !newChannel) {
      console.error("Failed creating channel:", channelError);
      return;
    }
  
    // ---------------------------
    // 3. ADD USER #1 (auth user)
    // ---------------------------
    const { data: u1 } = await supabase
      .from("channel_users")
      .select("*")
      .eq("channel_id", newChannel.id)
      .eq("user_id", authUser.id)
      .maybeSingle();
  
    if (!u1) {
      await supabase
        .from("channel_users")
        .insert({ channel_id: newChannel.id, user_id: authUser.id });
    }
  
    // ---------------------------
    // 4. ADD USER #2 (other user)
    // ---------------------------
    const { data: u2 } = await supabase
      .from("channel_users")
      .select("*")
      .eq("channel_id", newChannel.id)
      .eq("user_id", id)
      .maybeSingle();
  
    if (!u2) {
      await supabase
        .from("channel_users")
        .insert({ channel_id: newChannel.id, user_id: id });
    }
  
    // 5. Navigate
    router.push(`/channel/${newChannel.id}`);
  };
  

  if (isLoading) return <ActivityIndicator />;

  return (
    <View className="p-4 bg-white flex-1">
      {/* Avatar + Profile Info */}
      <View className="flex-row items-start gap-4">
        <SupabaseImage
          bucket="avatars"
          path={user?.avatar_url}
          className="w-24 h-24 rounded-full"
          transform={{ width: 96, height: 96 }}
        />
        <View className="flex-1">
          <Text className="text-black text-xl font-bold">{user?.username}</Text>
          {user?.area && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="location-outline" size={16} color="#6b7280" />
              <Text className="text-gray-500 text-sm ml-1">{user.area}</Text>
            </View>
          )}
          {user?.bio && (
            <Text className="text-gray-700 mt-2 leading-snug font-semibold">{user.bio}</Text>
          )}
        </View>
      </View>

      {/* Private Chat Button */}
      <View className="mt-6 w-full px-8">
        <Pressable
          onPress={startPrivateChat}
          className={`py-3 rounded-full border border-gray-300 ${
            channelExists ? "bg-green-200" : "bg-white"
          }`}
        >
          <Text className="text-center text-black font-medium">
            {channelExists ? "Chat" : "Private Chat"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
