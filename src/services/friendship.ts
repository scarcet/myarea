import { supabase } from '@/lib/supabase';
import { TablesInsert, TablesUpdate } from '@/types/database.types';

export async function sendFriendRequest(receiverId: string) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not logged in');
  
    const { data, error } = await supabase
      .from('friendships')
      .insert([{ requester_id: user.id, receiver_id: receiverId }]);
  
    if (error) throw error;
    return data;
  }

  export async function acceptFriendRequest(requesterId: string) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not logged in');
  
    const { data, error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .match({ requester_id: requesterId, receiver_id: user.id });
  
    if (error) throw error;
    return data;
  }
  
  export async function removeFriend(otherUserId: string) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not logged in');
  
    const { error } = await supabase
      .from('friendships')
      .delete()
      .or(
        `and(requester_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(requester_id.eq.${otherUserId},receiver_id.eq.${user.id})`
      );
  
    if (error) throw error;
  }
  
  export async function getFriends(userId: string) {
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        requester:profiles!friendships_requester_id_fkey(*),
        receiver:profiles!friendships_receiver_id_fkey(*)
      `)
      .eq('status', 'accepted')
      .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`);
  
    if (error) throw error;
  
    // Extract the other person in each friendship
    return data.map((f) =>
      f.requester.id === userId ? f.receiver : f.requester
    );
  }
  
  