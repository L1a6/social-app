// components/feed/PostCard.tsx
import { Post } from '@/lib/types';
import React, { memo, useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CommentsList from './CommentsList';
import PostActions from './PostActions';
import PostHeader from './PostHeader';
import PostImage from './PostImage';

interface PostCardProps {
  post: Post;
  onLike: (postId: string, isLiked: boolean, currentLikesCount: number) => Promise<{ isLiked: boolean; likesCount: number } | null>;
  onUpdatePost: (postId: string, updates: Partial<Post>) => void;
}

const PostCard = memo(({ post, onLike, onUpdatePost }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [localIsLiked, setLocalIsLiked] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(post.likes_count);

  const handleToggleLike = useCallback(async () => {
    const result = await onLike(post.id, localIsLiked, localLikesCount);
    if (result) {
      setLocalIsLiked(result.isLiked);
      setLocalLikesCount(result.likesCount);
      onUpdatePost(post.id, { likes_count: result.likesCount });
    }
  }, [post.id, localIsLiked, localLikesCount, onLike, onUpdatePost]);

  const handleCommentAdded = useCallback(() => {
    const newCount = post.comments_count + 1;
    onUpdatePost(post.id, { comments_count: newCount });
  }, [post.id, post.comments_count, onUpdatePost]);

  return (
    <View style={styles.container}>
      <PostHeader post={post} />
      <PostImage imageUrl={post.image_url} />
      <PostActions
        post={post}
        isLiked={localIsLiked}
        likesCount={localLikesCount}
        onToggleLike={handleToggleLike}
        onToggleComments={() => setShowComments(!showComments)}
      />
      {showComments && (
        <CommentsList
          postId={post.id}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.post.id === nextProps.post.id &&
    prevProps.post.likes_count === nextProps.post.likes_count &&
    prevProps.post.comments_count === nextProps.post.comments_count &&
    prevProps.post.image_url === nextProps.post.image_url
  );
});

PostCard.displayName = 'PostCard';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default PostCard;
