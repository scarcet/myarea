import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !username || !street || !area) {
      Alert.alert('All fields are required');
      return;
    }

    try {
      setIsLoading(true);

      // 🔥 1) Create auth account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Alert.alert(error.message);
        return;
      }

      const userId = data.user?.id;
      if (!userId) return;

      // 🔥 2) Check if the profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (existingProfile) {
        // 🔄 UPDATE profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            username,
            street,
            area,
            city,
            country
          })
          .eq('id', userId);

        if (updateError) {
          Alert.alert(updateError.message);
          return;
        }
      } else {
        // ➕ INSERT profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            username,
            street,
            area,
            city,
            country
          });

        if (insertError) {
          Alert.alert(insertError.message);
          return;
        }
      }

      // 🎯 Redirect to home
      router.replace('/(protected)');

    } catch (err) {
      Alert.alert('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 40,           // ⬆ pushes content up
          paddingHorizontal: 16,
          paddingBottom: 40,
        }}
      >
        <View className="w-full max-w-md self-center">
          <Text className="text-4xl font-bold text-center mb-10 text-sky-500">
            Create Account
          </Text>

          <View className="gap-4">

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="w-full px-5 py-[15px] bg-neutral-100 rounded-xl border border-neutral-300
              text-base text-black text-xl leading-[22px] placeholder:text-gray-500
              focus:border-grey-900 focus:bg-white"
            />

{/* PASSWORD FIELD */}
<View className="relative">
  <TextInput
    placeholder="Password"
    value={password}
    onChangeText={setPassword}
    secureTextEntry={!showPassword}  // 👈 hide or show
    className="w-full px-5 py-[15px] bg-neutral-100 rounded-xl border border-neutral-300
    text-base text-black text-xl leading-[22px] placeholder:text-gray-500
    focus:border-grey-900 focus:bg-white"
  />

  {/* TOGGLE BUTTON */}
  <TouchableOpacity
    onPress={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-4"
  >
<Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="gray" />

  </TouchableOpacity>
</View>


            <TextInput
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              className="w-full px-5 py-[15px] bg-neutral-100 rounded-xl border border-neutral-300
               text-base text-black text-xl leading-[22px] placeholder:text-gray-500
               focus:border-grey-900 focus:bg-white"
            />

            {/* STREET + AREA */}
<View className="flex-row gap-2">
  <TextInput
    placeholder="Street"
    value={street}
    onChangeText={setStreet}
    autoCapitalize="none"
    className="flex-1 px-4 py-3 bg-neutral-100 rounded-xl border border-neutral-300
    text-base text-black text-m leading-[18px] placeholder:text-gray-500
    focus:border-grey-900 focus:bg-white"
  />

  <TextInput
    placeholder="Area/Neighbourhood/Estate/Village"
    value={area}
    onChangeText={setArea}
    autoCapitalize="none"
    className="flex-1 px-4 py-3 bg-neutral-100 rounded-xl border border-neutral-300
    text-base text-black text-m leading-[18px] placeholder:text-gray-500
    focus:border-grey-900 focus:bg-white"
  />
</View>

<View className="flex-row gap-2">
  <TextInput
    placeholder="City/State/Town/Village"
    value={city}
    onChangeText={setCity}
    autoCapitalize="none"
    className="flex-1 px-4 py-3 bg-neutral-100 rounded-xl border border-neutral-300
    text-base text-black text-m leading-[18px] placeholder:text-gray-500
    focus:border-grey-900 focus:bg-white"
  />

  <TextInput
    placeholder="Country"
    value={country}
    onChangeText={setCountry}
    autoCapitalize="none"
    className="flex-1 px-4 py-3 bg-neutral-100 rounded-xl border border-neutral-300
    text-base text-black text-m leading-[18px] placeholder:text-gray-500
    focus:border-grey-900 focus:bg-white"
  />
</View>
            <TouchableOpacity
              onPress={handleSignUp}
              disabled={isLoading}
              className="w-full bg-sky-500 py-4 rounded-2xl mt-4"
            >
              <Text className="text-white text-center text-lg font-bold">
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
            <Text className="text-gray-500 text-center text-xs mt-3 leading-5 px-4">
  By creating an account and using this app, you agree to our{" "}
  <Text
    className="text-sky-600 font-semibold"
    onPress={() => router.push("/orgInfo/aboutUs")}
  >
    Terms & Conditions
  </Text>
  . Your information is used solely to help you connect with people in your
  local community.
</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
