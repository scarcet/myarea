import '../../global.css';
import { Slot } from 'expo-router';
import { AuthProvider } from '@/providers/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SupabaseProvider from '@/providers/SupabaseProvider';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
        {/* <SupabaseProvider> */}
          <Slot />
        {/* </SupabaseProvider> */}
        </AuthProvider>
      </QueryClientProvider>
  );
}