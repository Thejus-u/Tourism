import { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function SettingsScreen() {
  const [language, setLanguage] = useState('en');
  const languages = useMemo(
    () => [
      { label: 'English', value: 'en' },
      { label: 'हिन्दी', value: 'hi' },
      { label: 'বাংলা', value: 'bn' },
      { label: 'অসমীয়া', value: 'as' },
      { label: 'தமிழ்', value: 'ta' },
      { label: 'తెలుగు', value: 'te' },
      { label: 'मराठी', value: 'mr' },
      { label: 'ગુજરાતી', value: 'gu' },
      { label: 'ਪੰਜਾਬੀ', value: 'pa' },
      { label: 'ಕನ್ನಡ', value: 'kn' },
      { label: 'മലയാളം', value: 'ml' },
      { label: 'اردو', value: 'ur' },
    ],
    []
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Settings</ThemedText>
      <View style={styles.section}>
        <ThemedText type="subtitle">Language</ThemedText>
        <View style={styles.chipsRow}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.value}
              onPress={() => setLanguage(lang.value)}
              style={[styles.chip, language === lang.value && styles.chipSelected]}
            >
              <ThemedText style={language === lang.value ? styles.chipTextSelected : styles.chipText}>
                {lang.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  section: {
    gap: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#dadce0',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: 'white',
  },
  chipSelected: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
  chipText: {
    fontSize: 14,
  },
  chipTextSelected: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
});


