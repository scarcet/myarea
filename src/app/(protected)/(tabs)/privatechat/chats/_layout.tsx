import { Ionicons } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={({ navigation }) => ({
          title: 'Chats',
          headerLargeTitle: true,
          // headerRight: () => (
          //   <Link href='privatechat/new/chat' asChild>
          //     <Ionicons name='add' size={28} className='px-1' color='gray' />
          //   </Link>
          // ),
        })}
      />
    </Stack>
  );
}