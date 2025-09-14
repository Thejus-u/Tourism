import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View, Animated, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function HomeScreen() {
  // Add animation value for button press effect
  const animatedValue = new Animated.Value(0);

  const handlePanic = () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Handle panic button press
    // Add your panic button logic here
  };

  const handleNavigation = (screen: string) => {
    switch (screen) {
      case 'travel':
        router.push('/travelPlan');
        break;
      case 'kyc':
        router.push('/kyc');
        break;
      default:
        router.push(`/${screen.toLowerCase()}`);
    }
  };

  // Calculate button transform based on animation
  const buttonScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.95],
  });

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e']}
      style={styles.container}>
      <ThemedText style={styles.headerText}>Dashboard</ThemedText>
      <View style={styles.grid}>
        {[
          { title: 'KYC', icon: '🆔', route: 'kyc' },
          { title: 'My Travel Plan', icon: '✈️', route: 'travel' },
          { title: 'My Family', icon: '👨‍👩‍👦', route: 'family' },
          { title: 'Safety Numbers', icon: '☎️', route: 'safety' },
        ].map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.cardWrapper}
            onPress={() => handleNavigation(item.route)}
          >
            <View style={styles.card}>
              <ThemedText style={styles.cardIcon}>{item.icon}</ThemedText>
              <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* 3D Panic Button */}
      <View style={styles.panicContainer}>
        <Pressable onPress={handlePanic}>
          <Animated.View 
            style={[
              styles.panicButton,
              { transform: [{ scale: buttonScale }] }
            ]}
          >
            <LinearGradient
              colors={['#ff3b30', '#dc1c13']}
              style={styles.panicGradient}
            >
              <View style={styles.panicInner}>
                <ThemedText style={styles.panicText}>PANIC</ThemedText>
                <ThemedText style={styles.panicSubtext}>Press for Emergency</ThemedText>
              </View>
            </LinearGradient>
          </Animated.View>
          <View style={styles.panicShadow} />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'space-between',
    alignContent: 'flex-start',
    width: '100%',
  },
  cardWrapper: {
    width: '47%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',  // Semi-transparent card
    borderRadius: 10,
    padding: 15,
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
  },
  panicContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  panicButton: {
    width: 200,
    height: 80,
    borderRadius: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    position: 'relative',
    zIndex: 2,
  },
  panicGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    padding: 4,
  },
  panicInner: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  panicText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
  },
  panicSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  panicShadow: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    bottom: -4,
    backgroundColor: '#8b0000',
    borderRadius: 40,
    zIndex: 1,
  }
});
