// components/feed/PostImage.tsx
import React, { memo } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

interface PostImageProps {
  imageUrl?: string;
}

const PostImage = memo(({ imageUrl }: PostImageProps) => {
  if (!imageUrl) {
    return (
      <View style={[styles.container, styles.placeholder]}>
        <Text style={styles.placeholderText}>No Image</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: imageUrl }}
      style={styles.image}
      resizeMode="cover"
    />
  );
}, (prevProps, nextProps) => {
  return prevProps.imageUrl === nextProps.imageUrl;
});

PostImage.displayName = 'PostImage';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#999999',
    fontSize: 14,
  },
});

export default PostImage;
