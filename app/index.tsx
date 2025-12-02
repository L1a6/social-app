// app/index.tsx
import { BlurView } from 'expo-blur';
import LinearGradient from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Import your professional logo here
import BackgroundImg from '../assets/images/background.png'; // optional background
import LogoImg from '../assets/images/logo.png'; // replace with your actual logo

export default function WelcomeScreen() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animations for background shapes
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: -20,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: -15,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Optional Background Image */}
      <Image
        source={BackgroundImg}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

  
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Animated Floating Shapes */}
      <Animated.View
        style={[
          styles.floatingShape1,
          { transform: [{ translateY: floatAnim1 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingShape2,
          { transform: [{ translateY: floatAnim2 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingShape3,
          { transform: [{ translateY: floatAnim1 }] },
        ]}
      />

      {/* Main Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        {/* Logo Container with Glow */}
        <View style={styles.logoContainer}>
          <View style={styles.logoGlow} />
          <View style={styles.logo}>
            <Image
              source={LogoImg}
              style={{ width: 80, height: 80, borderRadius: 20 }}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* App Name */}
        <Text style={styles.appName}>Framez</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>Capture. Share. Connect.</Text>

        {/* Description */}
        <Text style={styles.description}>
          Join millions of creators sharing their moments and stories with the world
        </Text>

        {/* Get Started Button */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.buttonContainer}
            onPress={() => router.push('../auth/login')}
          >
            <BlurView intensity={50} tint="light" style={styles.buttonBlur}>
              <LinearGradient
                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

        {/* Sign In Link */}
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('../auth/login')}
          >
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Feature Pills */}
        <View style={styles.featuresContainer}>
          <View style={styles.featurePill}>
            <Text style={styles.featurePillText}>✨ AI Filters</Text>
          </View>
          <View style={styles.featurePill}>
            <Text style={styles.featurePillText}>🌍 Global Feed</Text>
          </View>
          <View style={styles.featurePill}>
            <Text style={styles.featurePillText}>💬 Real-time Chat</Text>
          </View>
        </View>
      </Animated.View>

      {/* Bottom Gradient Accent */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.2)']}
        style={styles.bottomGradient}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  floatingShape1: {
    position: 'absolute',
    top: 100,
    right: 30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  floatingShape2: {
    position: 'absolute',
    bottom: 150,
    left: 20,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  floatingShape3: {
    position: 'absolute',
    top: 300,
    left: 50,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  logoContainer: { marginBottom: 32, position: 'relative' },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    opacity: 0.3,
    transform: [{ scale: 1.2 }],
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
  },
  appName: {
    fontSize: 64,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 16,
    letterSpacing: -2,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  tagline: { fontSize: 22, color: 'rgba(255,255,255,0.95)', marginBottom: 12, fontWeight: '600' },
  description: { fontSize: 16, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 48, lineHeight: 24, maxWidth: 320 },
  buttonContainer: { width: width - 64, marginBottom: 16 },
  buttonBlur: { borderRadius: 16, overflow: 'hidden' },
  button: { paddingVertical: 20, paddingHorizontal: 32, alignItems: 'center', borderRadius: 16 },
  buttonText: { color: '#ffffff', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
  signInContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 24 },
  signInText: { color: 'rgba(255,255,255,0.7)', fontSize: 16 },
  signInLink: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  featuresContainer: { flexDirection: 'row', marginTop: 40, gap: 12 },
  featurePill: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  featurePillText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  bottomGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 },
});