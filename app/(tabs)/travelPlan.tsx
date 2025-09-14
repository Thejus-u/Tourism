import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function TravelPlanScreen() {
  const [state, setState] = useState('');
  const dummyDates = {
    startDate: new Date('2025-10-01'),
    endDate: new Date('2025-10-05')
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e']}  // Dark theme colors
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <ThemedText style={styles.headerText}>Travel Plan</ThemedText>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.dateSection}>
            <ThemedText style={styles.sectionTitle}>Tour Dates</ThemedText>
            <View style={styles.dateDisplay}>
              <ThemedText style={styles.dateText}>
                {dummyDates.startDate.toLocaleDateString()} - {dummyDates.endDate.toLocaleDateString()}
              </ThemedText>
            </View>
          </View>

          <View style={styles.inputSection}>
            <ThemedText style={styles.sectionTitle}>State Details</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter state to visit"
              placeholderTextColor="#999999"
              value={state}
              onChangeText={setState}
            />
          </View>

          <View style={styles.dayPlansSection}>
            <ThemedText style={styles.sectionTitle}>Daily Itinerary</ThemedText>
            {Array.from({ length: 5 }, (_, i) => (
              <View key={i} style={styles.dayPlan}>
                <ThemedText style={styles.dayTitle}>Day {i + 1}</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Enter place to visit"
                  placeholderTextColor="#999999"
                />
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  placeholder="Enter planned activities"
                  placeholderTextColor="#999999"
                  multiline
                  numberOfLines={3}
                />
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.submitButton}>
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.submitGradient}
            >
              <ThemedText style={styles.submitButtonText}>
                Save Travel Plan
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dateSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  dateDisplay: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
  },
  inputSection: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  dayPlansSection: {
    marginBottom: 24,
  },
  dayPlan: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    overflow: 'hidden',
    borderRadius: 8,
  },
  submitGradient: {
    padding: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  }
});