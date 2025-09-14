import React from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { theme } from '@/src/theme';

const { width } = Dimensions.get('window');

export default function RoleSelectionScreen() {
  const handleRoleSelect = (role: string) => {
    router.push({
      pathname: '/auth',
      params: { role }
    });
  };

  return (
    <LinearGradient
      colors={[theme.colors.background.gradient.start, theme.colors.background.gradient.end]}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <ThemedText style={styles.title}>Welcome</ThemedText>
          <View style={styles.headerAccent} />
          <ThemedText style={styles.subtitle}>Choose your role to continue</ThemedText>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity onPress={() => handleRoleSelect('tourist')}>
            <LinearGradient
              colors={['rgba(38, 38, 86, 0.95)', 'rgba(38, 38, 86, 0.85)']}
              style={styles.roleCard}
            >
              <ThemedText style={styles.roleIcon}>👤</ThemedText>
              <ThemedText style={styles.roleTitle}>Tourist</ThemedText>
              <ThemedText style={styles.roleDescription}>
                Plan trips, manage documents, and stay safe
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleRoleSelect('admin')}>
            <LinearGradient
              colors={['rgba(38, 38, 86, 0.95)', 'rgba(38, 38, 86, 0.85)']}
              style={styles.roleCard}
            >
              <ThemedText style={styles.roleIcon}>👮</ThemedText>
              <ThemedText style={styles.roleTitle}>Admin</ThemedText>
              <ThemedText style={styles.roleDescription}>
                Monitor and manage tourist activities
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: width * 0.2,
    marginBottom: width * 0.1,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: theme.colors.text.accent,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  headerAccent: {
    width: 80,
    height: 4,
    backgroundColor: theme.colors.accent,
    borderRadius: 2,
  },
  cardsContainer: {
    gap: theme.spacing.xl,
    marginTop: width * 0.1,
  },
  roleCard: {
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.card.border,
    alignItems: 'center',
    ...theme.shadows.heavy,
  },
  roleIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  roleTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.sm,
  },
  roleDescription: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});