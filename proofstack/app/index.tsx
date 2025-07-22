import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, Pattern, Path, Rect, Circle } from 'react-native-svg';
import { colors } from '../src/theme/colors';

const SplashScreen = () => {
  const slideUpAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim1 = useRef(new Animated.Value(0)).current;
  const bounceAnim2 = useRef(new Animated.Value(0)).current;
  const bounceAnim3 = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide up animation
    Animated.timing(slideUpAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
    
    // Bouncing loader animation
    const createBounceAnimation = (anim: Animated.Value) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: -10, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 300, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        ])
      );

    createBounceAnimation(bounceAnim1).start();
    setTimeout(() => createBounceAnimation(bounceAnim2).start(), 100);
    setTimeout(() => createBounceAnimation(bounceAnim3).start(), 200);

    // Spin animation
    Animated.loop(
        Animated.timing(spinAnim, {
            toValue: 1,
            duration: 8000,
            easing: Easing.linear,
            useNativeDriver: true,
        })
    ).start();

  }, []);

  const slideUpStyle = {
    transform: [{
      translateY: slideUpAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 0],
      }),
    }],
    opacity: slideUpAnim,
  };

  const floatStyle = {
    transform: [{
      translateY: floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 20],
      }),
    }],
  };
  
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={StyleSheet.absoluteFill}>
        {/* @ts-ignore */}
        <Svg height="100%" width="100%" style={{ opacity: 0.1 }}>
          {/* @ts-ignore */}
          <Defs>
            {/* @ts-ignore */}
            <Pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              {/* @ts-ignore */}
              <Path d="M10 10h80v80H10V10zm20 20v40m20-40v40m20-40v40" stroke={colors.textWhite} strokeWidth="1" fill="none"/>
              {/* @ts-ignore */}
              <Circle cx="30" cy="30" r="3" fill={colors.textWhite}/>
              {/* @ts-ignore */}
              <Circle cx="50" cy="50" r="3" fill={colors.textWhite}/>
              {/* @ts-ignore */}
              <Circle cx="70" cy="70" r="3" fill={colors.textWhite}/>
            </Pattern>
          </Defs>
          {/* @ts-ignore */}
          <Rect width="100%" height="100%" fill="url(#circuit)" />
        </Svg>
      </View>

      {/* Floating Geometric Elements */}
      <Animated.View style={[styles.geoElement, styles.geo1, floatStyle]} />
      <Animated.View style={[styles.geoElement, styles.geo2, { transform: [{ scale: pulseAnim }] }]} />
      <Animated.View style={[styles.geoElement, styles.geo3]} />
      <Animated.View style={[styles.geoElement, styles.geo4, { transform: [{ rotate: spin }] }]} />

      {/* Logo Container */}
      <Animated.View style={[styles.logoContainer, slideUpStyle]}>
        <View style={styles.logoWrapper}>
          {/* @ts-ignore */}
          <LinearGradient
            colors={[colors.cosmicIndigo, colors.electricTeal]}
            style={styles.logoBg}
          >
            <View style={styles.logoInner}>
              <Text style={styles.logoText}>PS</Text>
              <View style={styles.logoPulseDot} />
            </View>
          </LinearGradient>
        </View>

        <Text style={styles.appName}>
          Proof<Text style={{ color: colors.electricTeal }}>Stack</Text>
        </Text>

        <Text style={styles.tagline}>
          Earn Trust. Get Paid.
        </Text>

        <View style={styles.loadingContainer}>
          <Animated.View style={[styles.loadingDot, { transform: [{ translateY: bounceAnim1 }] }]} />
          <Animated.View style={[styles.loadingDot, { backgroundColor: colors.vividNeonYellow, transform: [{ translateY: bounceAnim2 }] }]} />
          <Animated.View style={[styles.loadingDot, { backgroundColor: colors.cosmicIndigo, transform: [{ translateY: bounceAnim3 }] }]} />
        </View>
      </Animated.View>

      {/* Bottom Gradient Glow */}
      {/* @ts-ignore */}
      <LinearGradient
        colors={['transparent', 'rgba(0, 255, 209, 0.1)']}
        style={styles.bottomGlow}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.deepSpacePurple,
    overflow: 'hidden',
  },
  geoElement: {
    position: 'absolute',
  },
  geo1: {
    top: '10%',
    left: '10%',
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: colors.electricTeal,
    transform: [{ rotate: '45deg' }],
    opacity: 0.3,
  },
  geo2: {
    top: '20%',
    right: '8%',
    width: 48,
    height: 48,
    borderWidth: 2,
    borderColor: colors.vividNeonYellow,
    borderRadius: 24,
    opacity: 0.4,
  },
  geo3: {
    bottom: '20%',
    left: '8%',
    width: 24,
    height: 24,
    backgroundColor: colors.cosmicIndigo,
    transform: [{ rotate: '12deg' }],
    opacity: 0.5,
  },
  geo4: {
    bottom: '10%',
    right: '12%',
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: '#9B3EFF', // This color is not in colors.js, using as is.
    opacity: 0.35,
  },
  logoContainer: {
    alignItems: 'center',
    zIndex: 10,
  },
  logoWrapper: {
    marginBottom: 32,
  },
  logoBg: {
    width: 96,
    height: 96,
    borderRadius: 16,
    padding: 4,
  },
  logoInner: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: colors.deepSpacePurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.electricTeal,
  },
  logoPulseDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    backgroundColor: colors.vividNeonYellow,
    borderRadius: 6,
  },
  appName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginBottom: 16,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 20,
    color: colors.textMuted,
    marginBottom: 48,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  loadingDot: {
    width: 12,
    height: 12,
    backgroundColor: colors.electricTeal,
    borderRadius: 6,
  },
  bottomGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 128,
  },
});

export default SplashScreen;
