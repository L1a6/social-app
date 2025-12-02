// hooks/usePosts.ts
import supabase from '@/lib/supabase';
import { Post } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const refreshPosts = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
  }, [fetchPosts]);

  // Update a specific post without refetching all
  const updatePost = useCallback((postId: string, updates: Partial<Post>) => {
    setPosts(currentPosts =>
      currentPosts.map(post =>
        post.id === postId ? { ...post, ...updates } : post
      )
    );
  }, []);

  useEffect(() => {
    fetchPosts();

    // Subscribe to new posts
    const subscription = supabase
      .channel('posts_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            fetchPosts();
          } else if (payload.eventType === 'UPDATE') {
            updatePost(payload.new.id, payload.new as Post);
          } else if (payload.eventType === 'DELETE') {
            setPosts(current => current.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchPosts, updatePost]);

  return {
    posts,
    loading,
    refreshing,
    refreshPosts,
    updatePost,
  };
}
