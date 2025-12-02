// components/feed/PostHeader.tsx
import { Post } from '@/lib/types';
import { getTimeAgo } from '@/lib/utils';
import { useRouter } from 'expo-router';
import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PostHeaderProps {
  post: Post;
}

const PostHeader = memo(({ post }: PostHeaderProps) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.userInfo}
        onPress={() => router.push(`/user/${post.user_id}`)}
      >
        {post.profiles?.avatar_url ? (
          <Image
            source={{ uri: post.profiles.avatar_url }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {post.profiles?.username?.[0]?.toUpperCase() || '?'}
            </Text>
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.username}>
            {post.profiles?.username || 'Unknown'}
          </Text>
          <Text style={styles.timestamp}>
            {getTimeAgo(post.created_at)}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButton}>
        <Text style={styles.menuIcon}>⋯</Text>
      </TouchableOpacity>
    </View>
  );
}, (prevProps, nextProps) => {
  return prevProps.post.id === nextProps.post.id;
});

PostHeader.displayName = 'PostHeader';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#999999',
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 20,
    color: '#666666',
  },
});

export default PostHeader;
