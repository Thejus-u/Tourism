import React from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from './ThemedText';
import { theme } from '@/src/theme';

interface SubmitButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  title: string;
}

export function SubmitButton({ 
  onPress, 
  isLoading = false, 
  disabled = false,
  title
}: SubmitButtonProps) {
  const handlePress = () => {
    console.log('Button pressed'); // Debug log
    if (!disabled && !isLoading) {
      onPress();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <ThemedText style={styles.text}>{title}</ThemedText>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  button: {
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  }
});