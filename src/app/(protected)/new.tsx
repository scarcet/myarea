import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/AuthProvider';
import { Entypo } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { createPost } from '@/services/posts';
import * as ImagePicker from 'expo-image-picker';
import SupabaseImage from '@/components/SupabaseImage';
import { supabase } from '@/lib/supabase';
import { Ionicons } from "@expo/vector-icons";
import { sendLikeNotification, sendPostNotification } from '@/utils/notification';

export default function NewPostScreen() {
  const [text, setText] = useState('');
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [postLocation, setPostLocation] = useState<'street' | 'area'>('street'); // default
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      let imagePath;
      if (image) {
        const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());
        const fileExt = image.uri.split('.').pop()?.toLowerCase() ?? 'jpeg';
        const path = `${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('media')
          .upload(path, arraybuffer, { contentType: image.mimeType ?? 'image/jpeg' });
        if (uploadError) throw uploadError;
        imagePath = uploadData.path;
      }

      return createPost({
        content: text,
        user_id: user!.id,
        images: imagePath ? [imagePath] : undefined,
        street: profile?.street,
        area: profile?.area,
        city: profile?.city,
        country: profile?.country,
        location_type: postLocation, // <-- post type
      });
    },
    onSuccess: () => {
      setText('');
      setImage(null);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      router.back();
    },
    onError: (error) => {
      console.error(error);
      Alert.alert('Error', (error as Error).message);
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 0}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, flexGrow: 1, justifyContent: 'space-between' }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-row gap-4">
            <SupabaseImage
              bucket="avatars"
              path={profile?.avatar_url}
              className="w-12 h-12 rounded-full"
              transform={{ width: 50, height: 50 }}
            />

            <View className="flex-1">
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="What's happening?"
                placeholderTextColor="gray"
                className="text-black text-lg"
                multiline
                style={{ minHeight: 80 }}
              />

              {image && (
                <Image
                  source={{ uri: image.uri }}
                  className="w-full rounded-xl my-4"
                  style={{ aspectRatio: image.width / image.height }}
                />
              )}

              {error && <Text className="text-red-500 text-sm mt-2">{(error as Error).message}</Text>}

              <View className="flex-row items-center justify-between mt-4">
                {/* Left Icons */}
                <View className="flex-row gap-4 items-center">
                  <Entypo name="images" size={24} color="gray" onPress={pickImage} />

                  {/* Custom dropdown button */}
  {/* ░░ FACEBOOK-STYLE LOCATION SELECTOR ░░ */}
<View>
  <Pressable
    onPress={() => setDropdownOpen(true)}
    style={{
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 4,
      paddingHorizontal: 10,
      backgroundColor: "#F1F2F6",
      borderRadius: 20,
      gap: 6,
    }}
  >
    <Ionicons name="earth" size={16} color="#555" />
    <Text style={{ color: "#333" }}>
      {postLocation === "street" ? "Street" : "Area"}
    </Text>
    <Ionicons name="caret-down" size={14} color="#555" />
  </Pressable>

  {/* Dropdown modal */}
  <Modal transparent visible={dropdownOpen} animationType="fade">
    <Pressable
      style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        paddingHorizontal: 30,
      }}
      onPress={() => setDropdownOpen(false)}
    >
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          paddingVertical: 8,
        }}
      >
        {/* Street */}
        <Pressable
          style={{ paddingVertical: 14, paddingHorizontal: 20 }}
          onPress={() => {
            setPostLocation("street");
            setDropdownOpen(false);
          }}
        >
          <Text style={{ fontSize: 16 }}>Street</Text>
        </Pressable>

        {/* Area */}
        <Pressable
          style={{ paddingVertical: 14, paddingHorizontal: 20 }}
          onPress={() => {
            setPostLocation("area");
            setDropdownOpen(false);
          }}
        >
          <Text style={{ fontSize: 16 }}>Area</Text>
        </Pressable>
      </View>
    </Pressable>
  </Modal>
</View>

                </View>

                {/* Post Button */}
                <Pressable
                  onPress={() => mutate()}
                  className={`${
                    isPending || text.trim().length === 0 ? 'bg-gray-300' : 'bg-black'
                  } px-6 py-2 rounded-full`}
                  disabled={isPending || text.trim().length === 0}
                >
                  <Text className={`font-bold ${isPending ? 'text-gray-500' : 'text-white'}`}>
                    Post
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
