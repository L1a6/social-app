// hooks/useComments.ts
import { useAuthStore } from '@/app/store/authStore';
import supabase from '@/lib/supabase';
import { Comment } from '@/lib/types';
import { useCallback, useState } from 'react';

export function useComments(postId: string) {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const addComment = useCallback(async (content: string) => {
    if (!user || !content.trim()) return null;

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: content.trim(),
        })
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Update post comments_count
      const { data: post } = await supabase
        .from('posts')
        .select('comments_count')
        .eq('id', postId)
        .single();

      await supabase
        .from('posts')
        .update({ comments_count: (post?.comments_count || 0) + 1 })
        .eq('id', postId);

      setComments(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [user, postId]);

  return {
    comments,
    loading,
    submitting,
    fetchComments,
    addComment,
  };
}
