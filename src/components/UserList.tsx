import { FlatList, Alert, ActivityIndicator, Text } from 'react-native';
import UserListItem from './UserListItem';
// import { User } from '@/types';
import { supabase } from '@/lib/supabase';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useEffect, useState } from 'react';
// import { useSession, useUser } from '@clerk/clerk-expo';
import { useAuth } from '@/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';

import { Tables } from '@/types/database.types';
type User = Tables<'profiles'>;

type UserListProps = {
  onPress?: (user: User) => void;
};

export default function UserList({ onPress }: UserListProps) {
  // const supabase = useSupabase();
  // const { user } = useUser();
  const { user, profile } = useAuth();

  const { data, error, isLoading } = useQuery({
    queryKey: ['profiles', profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', profile!.id)
        .eq('area', profile!.area)
        .eq('city', profile!.city)
        .eq('country', profile!.country)
        .throwOnError();
  
      return data;
    },
    enabled: !!profile,
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>{error.message}</Text>;
  }

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <UserListItem user={item} onPress={onPress} />}
    />
  );
}