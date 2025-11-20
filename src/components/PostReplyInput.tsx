import { View, TextInput, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { createPost } from '@/services/posts';

export default function PostReplyInput({ postId }: { postId: string }) {
  const [text, setText] = useState('');

  const { user } = useAuth();

  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: () =>
      createPost({ content: text, user_id: user!.id, parent_id: postId }),
    onSuccess: (data) => {
      setText('');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error(error);
      // Alert.alert('Error', error.message);
    },
  });

  return (
    <View className="bg-white border-t border-gray-200 p-4">
      <View className="flex-row items-center gap-3 bg-gray-100 rounded-2xl px-4 py-3 shadow-sm">
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Add a reply..."
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-gray-900 text-base"
          multiline
        />
        <Pressable
          onPress={() => mutate()}
          disabled={isPending || text.trim().length === 0}
          className="p-1"
        >
          <AntDesign
            name="plus-circle"
            size={28}
            color={text.trim().length === 0 ? '#0EA5E9' : '#0284C7'}
          />
        </Pressable>
      </View>
    </View>
  );
}