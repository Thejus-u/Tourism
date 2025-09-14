import { Link, Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing info', 'Please fill all fields.');
      return;
    }
    try {
      setIsSubmitting(true);
      // TODO: Replace with real signup call
      await new Promise((r) => setTimeout(r, 700));
      Alert.alert('Account created', 'You can now log in.');
      router.replace('/login');
    } catch (e) {
      Alert.alert('Signup failed', 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Sign up' }} />
      <ThemedText type="title">Create account</ThemedText>
      <View style={styles.form}>
        <Input label="Full name" placeholder="Your name" value={name} onChangeText={setName} />
        <Input
          label="Email"
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="Password"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title={isSubmitting ? 'Please wait…' : 'Sign up'} onPress={onSubmit} loading={isSubmitting} />
      </View>
      <ThemedText>
        Already have an account? <Link href="/login">Log in</Link>
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
    justifyContent: 'center',
  },
  form: {
    gap: 12,
  },
  input: {},
});


