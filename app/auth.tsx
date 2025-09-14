import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { theme } from '@/src/theme';
import { authService } from '@/src/services/authService';

export default function AuthScreen() {
  const { role } = useLocalSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleAuth = async () => {
    try {
      setIsLoading(true);

      if (!isLogin && formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }

      if (isLogin) {
        await authService.login(formData.email, formData.password);
      } else {
        await authService.signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: role as string,
        });
      }

      router.push('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[theme.colors.background.gradient.start, theme.colors.background.gradient.end]}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <ThemedText style={styles.headerText}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </ThemedText>
        <ThemedText style={styles.roleText}>
          {role === 'admin' ? 'Admin Portal' : 'Tourist Portal'}
        </ThemedText>
        <View style={styles.headerAccent} />
      </View>

      <View style={styles.formContainer}>
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor={theme.colors.text.secondary}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={theme.colors.text.secondary}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={theme.colors.text.secondary}
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
        />
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={theme.colors.text.secondary}
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          />
        )}

        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.accent} />
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={handleAuth}>
            <LinearGradient
              colors={[theme.colors.accent, '#DAA520']}
              style={styles.submitGradient}
            >
              <ThemedText style={styles.submitText}>
                {isLogin ? 'Login' : 'Sign Up'}
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setIsLogin(!isLogin)}
        >
          <ThemedText style={styles.toggleText}>
            {isLogin
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Login'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 60,
  },
  headerText: {
    fontSize: 36,
    fontWeight: '700',
    color: theme.colors.text.accent,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  roleText: {
    fontSize: 20,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  headerAccent: {
    width: 60,
    height: 4,
    backgroundColor: theme.colors.accent,
    borderRadius: 2,
  },
  formContainer: {
    gap: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.input.background,
    borderWidth: 1,
    borderColor: theme.colors.input.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    color: theme.colors.text.primary,
    fontSize: 16,
  },
  submitButton: {
    marginTop: theme.spacing.lg,
    ...theme.shadows.heavy,
  },
  submitGradient: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  submitText: {
    color: theme.colors.text.dark,
    fontSize: 18,
    fontWeight: '700',
  },
  toggleButton: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  toggleText: {
    color: theme.colors.text.accent,
    fontSize: 16,
  },
});