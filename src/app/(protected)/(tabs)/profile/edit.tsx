import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
 } from 'react-native';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfileById, updateProfile } from '@/services/profiles';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';
import UserAvatarPicker from '@/components/UserAvatarPicker';

export default function ProfileEditScreen() {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => getProfileById(user!.id),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateProfile(user!.id, {
        username,
        bio,
        avatar_url: avatarUrl,
        street: street,
        area,
        city,
        country,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      router.back();
    },
  });

  useEffect(() => {
    if (profile) {
      setUsername(profile.username ?? '');
      setBio(profile.bio ?? '');
      setAvatarUrl(profile.avatar_url ?? '');
      setStreet(profile.street ?? '');
      setArea(profile.area ?? '');
      setCity(profile.city ?? '');
      setCountry(profile.country ?? '');
    }
  }, [profile]);

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 0}
    className="flex-1"
  >
    <ScrollView className="flex-1 bg-white">
    <View className="p-6 gap-6">
      {/* Avatar Section */}
      <View className="items-center">
        <UserAvatarPicker currentAvatar={avatarUrl} onUpload={setAvatarUrl} />
      </View>

      {/* Username */}
      <View>
        <Text className="text-gray-500 text-sm mb-2">Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
          placeholderTextColor="#aaa"
          className="border border-gray-300 rounded-xl p-4 text-black bg-gray-50"
        />
      </View>

      {/* Bio */}
      <View>
        <Text className="text-gray-500 text-sm mb-2">Bio</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          placeholder="Write something about yourself"
          placeholderTextColor="#aaa"
          className="border border-gray-300 rounded-xl p-4 text-black bg-gray-50"
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Street */}
      <View>
        <Text className="text-gray-500 text-sm mb-2">Street</Text>
        <TextInput
          value={street}
          onChangeText={setStreet}
          autoCapitalize="none"
          placeholder="Enter your postcode"
          placeholderTextColor="#aaa"
          className="border border-gray-300 rounded-xl p-4 text-black bg-gray-50"
        />
      </View>

      {/* Area */}
      <View>
        <Text className="text-gray-500 text-sm mb-2">Area/Neighbourhood/Estate/Village</Text>
        <TextInput
          value={area}
          onChangeText={setArea}
          autoCapitalize="none"
          placeholder="Enter your area"
          placeholderTextColor="#aaa"
          className="border border-gray-300 rounded-xl p-4 text-black bg-gray-50"
        />
      </View>

        {/* City */}
      <View>
        <Text className="text-gray-500 text-sm mb-2">City/State/Town/Village</Text>
        <TextInput
          value={city}
          onChangeText={setCity}
          autoCapitalize="none"
          placeholder="Enter your area"
          placeholderTextColor="#aaa"
          className="border border-gray-300 rounded-xl p-4 text-black bg-gray-50"
        />
      </View>

      {/* Country */}
      <View>
        <Text className="text-gray-500 text-sm mb-2">Country</Text>
        <TextInput
          value={country}
          onChangeText={setCountry}
          autoCapitalize="none"
          placeholder="Enter your country"
          placeholderTextColor="#aaa"
          className="border border-gray-300 rounded-xl p-4 text-black bg-gray-50"
        />
      </View>

      {/* Save Button */}
      <Pressable
        onPress={() => mutate()}
        disabled={isPending}
        className={`${
          isPending ? 'bg-gray-200' : 'bg-black'
        } py-4 rounded-full mt-8`}
      >
        <Text
          className={`text-center font-semibold ${
            isPending ? 'text-gray-500' : 'text-white'
          }`}
        >
          {isPending ? 'Saving...' : 'Save'}
        </Text>
      </Pressable>
    </View>
  </ScrollView>
  </KeyboardAvoidingView>
  );
}