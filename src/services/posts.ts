import { supabase } from '@/lib/supabase';
import { TablesInsert } from '@/types/database.types';

type PostInput = TablesInsert<'posts'>;

export const fetchPosts = async () => {
  const { data } = await supabase
    .from('posts')
    .select('*, user:profiles(*), replies:posts(count)')
    .order('created_at', { ascending: false })
    .throwOnError();

  return data;
};

export const createPost = async (newPost: PostInput) => {
  const { data } = await supabase
    .from('posts')
    .insert(newPost)
    .select('*')
    .throwOnError();

  return data;
};

export const getPostById = async (id: string) => {
  const { data } = await supabase
    .from('posts')
    .select('*, user:profiles(*), replies:posts(count)')
    .eq('id', id)
    .single()
    .throwOnError();

  return data;
};

export const getPostsByUserId = async (id: string) => {
  const { data } = await supabase
    .from('posts')
    .select('*, user:profiles(*), replies:posts(count)')
    .eq('user_id', id)
    .order('created_at', { ascending: false })
    .throwOnError();

  return data;
};

export const getPostsByPostCode = async (postCode: string) => {
  const { data } = await supabase
    .from('posts')
    .select('*, user:profiles(*), replies:posts(count)')
    .eq('post_code', postCode)
    .order('created_at', { ascending: false })
    .throwOnError();

  return data;
};

export const getPostsReplies = async (id: string) => {
  const { data } = await supabase
    .from('posts')
    .select('*, user:profiles(*), replies:posts(count)')
    .eq('parent_id', id)
    .throwOnError();

  return data;
};

// services for likes

export async function likePost (postId: string, userId: string) {
  const { error } = await supabase
    .from('likes')
    .upsert(
      { post_id: postId, user_id: userId },
      { onConflict: 'post_id,user_id' } // ignore duplicates
    );

  if (error) throw error;
}

export async function unlikePost(postId: string, userId: string) {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function getLikesForPost(postId: string) {
  const { data, error } = await supabase
    .from('likes')
    .select('user_id')
    .eq('post_id', postId);

  if (error) throw error;
  return data;
}

export async function hasUserLikedPost(postId: string, userId: string) {
  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
}
