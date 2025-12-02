// app/(tabs)/feed.tsx
import PostCard from '@/components/feed/PostCard';
import { useLikes } from '@/hooks/useLikes';
import { usePosts } from '@/hooks/usePosts';
import { Post } from '@/lib/types';
import React, { useCallback, useRef } from 'react';
import {
    ActivityIndicator,
    FlatList,
    ListRenderItem,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FeedScreen() {
  const { posts, loading, refreshing, refreshPosts, updatePost } = usePosts();
  const { toggleLike } = useLikes();
  const flatListRef = useRef<FlatList>(null);

  // Memoized render function to prevent unnecessary re-renders
  const renderPost: ListRenderItem<Post> = useCallback(({ item }) => (
    <PostCard
      post={item}
      onLike={toggleLike}
      onUpdatePost={updatePost}
    />
  ), [toggleLike, updatePost]);

  // Memoized key extractor
  const keyExtractor = useCallback((item: Post) => item.id, []);

  // Get item layout for better performance and scroll preservation
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 600, // Approximate height of a post card
    offset: 600 * index,
    index,
  }), []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#667eea" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Framez</Text>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={posts}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshPosts}
            tintColor="#667eea"
            colors={['#667eea']}
          />
        }
        // Critical props for scroll preservation
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={100}
        windowSize={10}
        initialNumToRender={5}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
        // Performance optimization
        getItemLayout={getItemLayout}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubtext}>
              Follow people to see their posts
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000000',
  },
  listContent: {
    paddingVertical: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
  },
});
