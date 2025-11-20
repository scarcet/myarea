import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
 } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { useState } from 'react';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { updateProfile } from '@/services/profiles';

export default function CompleteProfileStep1() {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateProfile(user!.id, {
        username,
        bio,
      }),
    onSuccess: () => {
      // go to Step 2
      router.push('/completeProfileStep2');
    },
  });

  const handleNext = () => {
    if (!username) {
      Alert.alert('Username is required');
      return;
    }
    mutate();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingBottom: 90,
          paddingHorizontal: 16,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-md self-center">
          <Text className="text-4xl font-bold text-center mb-10 text-sky-500">
            Step 1: Profile Info
          </Text>

          <View className="gap-4">
            <View>
              <Text className="text-lg font-semibold text-neutral-900 mb-1">
                Username
              </Text>
              <TextInput
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
                className="w-full px-6 py-4 bg-neutral-300 border border-neutral-300 rounded-2xl text-black text-lg placeholder:text-gray-500 focus:border-gray-400"
              />
            </View>

            <View>
              <Text className="text-lg font-semibold text-neutral-900 mb-1">
                Bio
              </Text>
              <TextInput
                placeholder="Enter your bio"
                value={bio}
                onChangeText={setBio}
                className="w-full px-6 py-4 bg-neutral-300 border border-neutral-300 rounded-2xl text-black text-lg placeholder:text-gray-500 focus:border-gray-400"
              />
            </View>

            <TouchableOpacity
              onPress={handleNext}
              disabled={isPending}
              className={`w-full bg-sky-500 py-4 rounded-2xl mt-4 ${
                isPending ? 'opacity-50' : ''
              }`}
            >
              <Text className="text-white text-center font-bold text-lg">
                {isPending ? 'Saving...' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
