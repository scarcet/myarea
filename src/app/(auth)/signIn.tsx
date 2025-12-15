import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Link } from 'expo-router';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Please enter an email and password');
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) Alert.alert(error.message);
    } catch (error: unknown) {
      console.error("Login error:", error);
    
      if (error instanceof Error) {
        Alert.alert("Login error", error.message);
      } else {
        Alert.alert("Login error", String(error));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 90, paddingHorizontal: 16 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className='w-full max-w-md self-center'>
        <Text className='text-4xl font-bold text-center mb-10 text-sky-500'>
          Welcome Back
        </Text>

        <View className='gap-4'>
          <View>
            <Text className='text-lg font-semibold text-neutral-900 mb-1'>
              Email
            </Text>
            <TextInput

               className="w-full px-5 py-[15px] bg-neutral-100 rounded-xl border border-neutral-300
               text-base text-black text-xl leading-[22px] placeholder:text-gray-500
               focus:border-grey-900 focus:bg-white"
               placeholder="Enter your email"
               placeholderTextColor="#6B7280"
               keyboardType="email-address"
               autoCapitalize="none"
               value={email}
               onChangeText={setEmail}
             />

          </View>

          <View>
            <Text className='text-lg font-semibold text-neutral-900 mb-1'>
              Password
            </Text>
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

          </View>

          <TouchableOpacity
            className='w-full bg-sky-500 py-4 rounded-2xl mt-4'
            activeOpacity={0.85}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text className='text-white text-center font-bold text-lg'>
              {isLoading ? 'Logging in...' : 'Sign in'}
            </Text>
          </TouchableOpacity>

          <View className='flex-row justify-center'>
            <Text className='text-gray-400 text-base'>Don't have an account? </Text>
            <Link href='/signUp' asChild>
              <Pressable>
                <Text className='text-sky-500 font-medium text-base'>Create one</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
  );
}

