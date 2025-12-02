// hooks/useLikes.ts
import { useAuthStore } from '@/app/store/authStore';
import supabase from '@/lib/supabase';
import { useCallback, useState } from 'react';

export function useLikes() {
  const { user } = useAuthStore();
  const [liking, setLiking] = useState<Record<string, boolean>>({});

  const toggleLike = useCallback(async (postId: string, isLiked: boolean, currentLikesCount: number) => {
    if (!user || liking[postId]) return null;

    setLiking(prev => ({ ...prev, [postId]: true }));

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;

        // Update post likes_count
        await supabase
          .from('posts')
          .update({ likes_count: Math.max(0, currentLikesCount - 1) })
          .eq('id', postId);

        return { isLiked: false, likesCount: Math.max(0, currentLikesCount - 1) };
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({ post_id: postId, user_id: user.id });

        if (error) throw error;

        // Update post likes_count
        await supabase
          .from('posts')
          .update({ likes_count: currentLikesCount + 1 })
          .eq('id', postId);

        return { isLiked: true, likesCount: currentLikesCount + 1 };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      return null;
    } finally {
      setLiking(prev => ({ ...prev, [postId]: false }));
    }
  }, [user, liking]);

  const checkIfLiked = useCallback(async (postId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking like status:', error);
      return false;
    }
  }, [user]);

  return {
    toggleLike,
    checkIfLiked,
    liking,
  };
}
