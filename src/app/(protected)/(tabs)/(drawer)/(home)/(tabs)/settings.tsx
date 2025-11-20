import { View, Text, Button } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useSupabase } from '@/providers/SupabaseProvider';

export default function HomeScreen() {


  return (
    <View className='flex-1 items-center justify-center'>
      <Text className='text-3xl'>Settings</Text>

      <Button title='Sign out' />

      <Button  title='Test insert' />
      <Button title='Test fetch' />
    </View>
  );
}