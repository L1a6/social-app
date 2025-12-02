// app/_layout.tsx
import supabase from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from './store/authStore';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user, setUser, setProfile, loading, setLoading } = useAuthStore();

  // Listen for auth changes
  useEffect(() => {
    checkUser();

    const { subscription } = supabase.auth.onAuthStateChange(
      async (_event: string, session: Session | null) => {
        if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Check initial session
  async function checkUser() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      const session = data?.session ?? null;
      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
      }
    } catch (err) {
      console.error('Error checking user:', err);
    } finally {
      setLoading(false);
    }
  }

  // Load user profile
  async function loadUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  }

  // Navigation based on auth state
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!user && !inAuthGroup) {
      router.replace('/'); // redirect to login/welcome
    } else if (user && !inTabsGroup) {
      router.replace('/(tabs)/feed'); // redirect logged-in user to feed
    }
  }, [user, segments, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="post/[id]" />
      <Stack.Screen name="user/[id]" />
    </Stack>
  );
}