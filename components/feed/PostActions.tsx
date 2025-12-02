// components/feed/PostActions.tsx
import { Post } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PostActionsProps {
  post: Post;
  isLiked: boolean;
  likesCount: number;
  onToggleLike: () => void;
  onToggleComments: () => void;
}

const PostActions = memo(({
  post,
  isLiked,
  likesCount,
  onToggleLike,
  onToggleComments,
}: PostActionsProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onToggleLike}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>{isLiked ? '❤️' : '🤍'}</Text>
          <Text style={styles.count}>{formatNumber(likesCount)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onToggleComments}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>💬</Text>
          <Text style={styles.count}>
            {formatNumber(post.comments_count)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Text style={styles.icon}>📤</Text>
        </TouchableOpacity>
      </View>

      {post.caption && (
        <View style={styles.captionContainer}>
          <Text style={styles.username}>{post.profiles?.username}</Text>
          <Text style={styles.caption}> {post.caption}</Text>
        </View>
      )}
    </View>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.isLiked === nextProps.isLiked &&
    prevProps.likesCount === nextProps.likesCount &&
    prevProps.post.comments_count === nextProps.post.comments_count &&
    prevProps.post.caption === nextProps.post.caption
  );
});

PostActions.displayName = 'PostActions';

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
    marginRight: 4,
  },
  count: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  captionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  caption: {
    fontSize: 14,
    color: '#000000',
  },
});

export default PostActions;
