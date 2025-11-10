// lib/types.ts
export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  caption?: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles?: Profile;
}

export interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  profiles?: Profile;
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  actor_id: string;
  type: 'like' | 'comment' | 'follow';
  post_id?: string;
  is_read: boolean;
  created_at: string;
  actor?: Profile;
  post?: Post;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}