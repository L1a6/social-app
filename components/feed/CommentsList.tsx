// components/feed/CommentsList.tsx
import { useComments } from '@/hooks/useComments';
import { Comment } from '@/lib/types';
import { getTimeAgo } from '@/lib/utils';
import React, { memo, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface CommentsListProps {
  postId: string;
  onCommentAdded?: () => void;
}

const CommentItem = memo(({ comment }: { comment: Comment }) => (
  <View style={styles.commentItem}>
    {comment.profiles?.avatar_url ? (
      <Image
        source={{ uri: comment.profiles.avatar_url }}
        style={styles.commentAvatar}
      />
    ) : (
      <View style={[styles.commentAvatar, styles.avatarPlaceholder]}>
        <Text style={styles.avatarText}>
          {comment.profiles?.username?.[0]?.toUpperCase() || '?'}
        </Text>
      </View>
    )}
    <View style={styles.commentContent}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentUsername}>
          {comment.profiles?.username || 'Unknown'}
        </Text>
        <Text style={styles.commentTime}>
          {getTimeAgo(comment.created_at)}
        </Text>
      </View>
      <Text style={styles.commentText}>{comment.content}</Text>
    </View>
  </View>
), (prevProps, nextProps) => {
  return prevProps.comment.id === nextProps.comment.id;
});

CommentItem.displayName = 'CommentItem';

const CommentsList = memo(({ postId, onCommentAdded }: CommentsListProps) => {
  const { comments, loading, submitting, fetchComments, addComment } = useComments(postId);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async () => {
    if (!commentText.trim()) return;

    const result = await addComment(commentText);
    if (result) {
      setCommentText('');
      onCommentAdded?.();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          value={commentText}
          onChangeText={setCommentText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting || !commentText.trim()}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#667eea" />
          ) : (
            <Text style={styles.submitButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#667eea" style={styles.loader} />
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CommentItem comment={item} />}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No comments yet</Text>
          }
        />
      )}
    </View>
  );
}, (prevProps, nextProps) => {
  return prevProps.postId === nextProps.postId;
});

CommentsList.displayName = 'CommentsList';

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 12,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 80,
  },
  submitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#667eea',
    borderRadius: 16,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  loader: {
    padding: 12,
  },
  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  avatarPlaceholder: {
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUsername: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    marginRight: 8,
  },
  commentTime: {
    fontSize: 11,
    color: '#999999',
  },
  commentText: {
    fontSize: 13,
    color: '#000000',
    lineHeight: 18,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999999',
    fontSize: 13,
    padding: 12,
  },
});

export default CommentsList;
