// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#999999',
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Text style={[styles.icon, { color }]}>
                {focused ? '🏠' : '🏠'}
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Text style={[styles.icon, { color }]}>🔍</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.createButton, focused && styles.createButtonActive]}>
              <Text style={styles.createIcon}>➕</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Text style={[styles.icon, { color }]}>
                {focused ? '🔔' : '🔔'}
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.profileIcon,
              focused && styles.profileIconActive
            ]}>
              <Text style={styles.icon}>👤</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonActive: {
    backgroundColor: '#5568d3',
    transform: [{ scale: 1.1 }],
  },
  createIcon: {
    fontSize: 20,
    color: '#ffffff',
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  profileIconActive: {
    borderColor: '#000000',
  },
});