import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert
} from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    <View className='flex-1 items-center justify-center px-6'>
      <View className='w-full max-w-sm'>
        <Text className='text-3xl font-bold text-center mb-8 text-sky-500'>
          Welcome Back
        </Text>

        <View className='gap-4'>
          <View>
            <Text className='text-sm font-medium text-neutral-900 mb-1'>
              Email
            </Text>
            <TextInput
              className='w-full px-4 py-3 bg-neutral-300 border border-neutral-300 rounded-lg text-black placeholder:text-gray-500 focus:border-gray-400'
              placeholder='Enter your email'
              placeholderTextColor='#6B7280'
              keyboardType='email-address'
              autoCapitalize='none'
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View>
            <Text className='text-sm font-medium text-neutral-900 mb-1'>
              Password
            </Text>
            <TextInput
              className='w-full px-4 py-3 bg-neutral-300 border border-neutral-300 rounded-lg text-black placeholder:text-gray-500 focus:border-gray-400'
              placeholder='Enter your password'
              placeholderTextColor='#6B7280'
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            className='w-full bg-sky-500 py-3 rounded-lg mt-6'
            activeOpacity={0.8}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text className='text-white text-center font-semibold'>
              {isLoading ? 'Logging in...' : 'Sign in'}
            </Text>
          </TouchableOpacity>

          <View className='flex-row justify-center mt-4'>
            <Text className='text-gray-400'>Don't have an account? </Text>
            <Link href='/signUp' asChild>
              <Pressable>
                <Text className='text-sky-500 font-medium'>Create one</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}

