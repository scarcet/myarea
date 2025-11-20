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

export default function CompleteProfileStep2() {
  const { user } = useAuth();
  const [postcode, setPostcode] = useState('');
  const [area, setArea] = useState('');
  const [county, setCounty] = useState('');
  const [country, setCountry] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateProfile(user!.id, {
        post_code: postcode,
        area,
        county,
        country,
      }),
    onSuccess: () => {
      router.push('/(protected)'); // redirect to home after step 2
    },
  });

  const handleSave = () => {
    if (!postcode || !area) {
      Alert.alert('Please fill in required fields');
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
          Step 2: Address
        </Text>

        <View className="gap-4">
          <View>
            <Text className="text-lg font-semibold text-neutral-900 mb-1">
              Postcode
            </Text>
            <TextInput
              placeholder="Enter your postcode"
              value={postcode}
              onChangeText={setPostcode}
              className="w-full px-6 py-4 bg-neutral-300 border border-neutral-300 rounded-2xl text-black text-lg placeholder:text-gray-500 focus:border-gray-400"
            />
          </View>

          <View>
            <Text className="text-lg font-semibold text-neutral-900 mb-1">
              Area
            </Text>
            <TextInput
              placeholder="Enter your area"
              value={area}
              onChangeText={setArea}
              className="w-full px-6 py-4 bg-neutral-300 border border-neutral-300 rounded-2xl text-black text-lg placeholder:text-gray-500 focus:border-gray-400"
            />
          </View>

          <View>
            <Text className="text-lg font-semibold text-neutral-900 mb-1">
              County
            </Text>
            <TextInput
              placeholder="Enter your county"
              value={county}
              onChangeText={setCounty}
              className="w-full px-6 py-4 bg-neutral-300 border border-neutral-300 rounded-2xl text-black text-lg placeholder:text-gray-500 focus:border-gray-400"
            />
          </View>

          <View>
            <Text className="text-lg font-semibold text-neutral-900 mb-1">
              Country
            </Text>
            <TextInput
              placeholder="Enter your country"
              value={country}
              onChangeText={setCountry}
              className="w-full px-6 py-4 bg-neutral-300 border border-neutral-300 rounded-2xl text-black text-lg placeholder:text-gray-500 focus:border-gray-400"
            />
          </View>

          <TouchableOpacity
            onPress={handleSave}
            disabled={isPending}
            className={`w-full bg-sky-500 py-4 rounded-2xl mt-4 ${
              isPending ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-white text-center font-bold text-lg">
              {isPending ? 'Saving...' : 'Save & Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
  );
}
