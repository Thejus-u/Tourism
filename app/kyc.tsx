import { SubmitButton } from '@/components/SubmitButton';
import { ThemedText } from '@/components/ThemedText';
import { kycService } from '@/src/services/kycService';
import { theme } from '@/src/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function KycScreen() {
  const [idType, setIdType] = useState('aadhar');
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    phone: '',
    address: '',
  });
  const [photo, setPhoto] = useState(null);
  const [showLivenessCheck, setShowLivenessCheck] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tourDates, setTourDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  // Add form validation function
  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.idNumber.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.address.trim() !== '' &&
      photo !== null
    );
  };

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDate(false);
    if (selectedDate) {
      setTourDates(prev => ({
        ...prev,
        startDate: selectedDate
      }));
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDate(false);
    if (selectedDate) {
      setTourDates(prev => ({
        ...prev,
        endDate: selectedDate
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('=== KYC Submission Start ===');
      setIsSubmitting(true);

      // Validate form data
      if (!isFormValid()) {
        console.log('Form validation failed');
        Alert.alert('Error', 'Please fill all required fields and upload ID proof');
        return;
      }

      // Log form data before submission
      console.log('Form Data:', {
        name: formData.name,
        idType: idType,
        idNumber: formData.idNumber,
        phone: formData.phone,
        address: formData.address,
        hasPhoto: !!photo
      });

      const kycData = {
        name: formData.name,
        address: formData.address,
        phoneNumber: formData.phone,
        aadharNumber: idType === 'aadhar' ? formData.idNumber : undefined,
        passportNumber: idType === 'passport' ? formData.idNumber : undefined,
        tourDates: {
          startDate: tourDates.startDate,
          endDate: tourDates.endDate
        },
        idProofImage: photo
      };

      console.log('Submitting KYC data to server...');
      const response = await kycService.submitKyc(kycData);
      console.log('Server Response:', response);

      if (!response) {
        throw new Error('No response from server');
      }

      if (response.kyc && response.kyc._id) {
        console.log('KYC submitted successfully with ID:', response.kyc._id);
        Alert.alert(
          'Success',
          `KYC submitted successfully!\nYour Blockchain ID: ${response.kyc.blockchainId}`,
          [{ 
            text: 'OK', 
            onPress: () => {
              console.log('Navigating to tabs');
              router.push('/(tabs)');
            }
          }]
        );
      } else {
        throw new Error('Invalid response format from server');
      }

      // Save KYC data to AsyncStorage
      await AsyncStorage.setItem('kycData', JSON.stringify({
        name: formData.name,
        address: formData.address,
        phoneNumber: formData.phone,
        aadharNumber: idType === 'aadhar' ? formData.idNumber : undefined,
        passportNumber: idType === 'passport' ? formData.idNumber : undefined,
        tourDates: {
          startDate: tourDates.startDate,
          endDate: tourDates.endDate
        },
        idProofImage: photo
      }));

    } catch (error: any) {
      console.error('KYC Submission Error:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });

      Alert.alert(
        'Error',
        `Failed to submit KYC: ${error.message || 'Unknown error occurred'}`
      );
    } finally {
      setIsSubmitting(false);
      console.log('=== KYC Submission End ===');
    }
  };

  return (
    <LinearGradient
      colors={[theme.colors.background.gradient.start, theme.colors.background.gradient.end]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <ThemedText style={styles.headerText}>KYC Verification</ThemedText>
          <View style={styles.headerAccent} />
        </View>
        
        <View style={styles.idTypeSelector}>
          <TouchableOpacity 
            style={[styles.idTypeButton, idType === 'aadhar' && styles.selectedButton]}
            onPress={() => setIdType('aadhar')}
          >
            <ThemedText style={[styles.idTypeText, idType === 'aadhar' && styles.selectedText]}>
              Aadhar Card
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.idTypeButton, idType === 'passport' && styles.selectedButton]}
            onPress={() => setIdType('passport')}
          >
            <ThemedText style={[styles.idTypeText, idType === 'passport' && styles.selectedText]}>
              Passport (NRI)
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={theme.colors.input.placeholder}
            value={formData.name}
            onChangeText={(text) => {
              console.log('Name changed:', text);
              setFormData(prev => ({ ...prev, name: text }));
            }}
          />
          <TextInput
            style={styles.input}
            placeholder={idType === 'aadhar' ? "Aadhar Number" : "Passport Number"}
            value={formData.idNumber}
            onChangeText={(text) => setFormData({...formData, idNumber: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={formData.phone}
            onChangeText={(text) => setFormData({...formData, phone: text})}
            keyboardType="phone-pad"
          />
          <TextInput
            style={[styles.input, styles.addressInput]}
            placeholder="Address"
            value={formData.address}
            onChangeText={(text) => setFormData({...formData, address: text})}
            multiline
          />

          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <LinearGradient
              colors={['rgba(255,215,0,0.8)', 'rgba(255,215,0,0.6)']}
              style={styles.uploadGradient}
            >
              <ThemedText style={styles.uploadButtonText}>
                Upload ID Proof Photo
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>

          {photo && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: photo }} style={styles.previewImage} />
            </View>
          )}

          {/* Tour Dates Section */}
          <View style={styles.dateSection}>
            <ThemedText style={styles.sectionTitle}>Tour Dates</ThemedText>
            
            {/* Start Date */}
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowStartDate(true)}
            >
              <ThemedText>Start Date: {tourDates.startDate.toLocaleDateString()}</ThemedText>
            </TouchableOpacity>

            {showStartDate && (
              <DateTimePicker
                value={tourDates.startDate}
                mode="date"
                display="default"
                onChange={onStartDateChange}
                minimumDate={new Date()}
              />
            )}

            {/* End Date */}
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowEndDate(true)}
            >
              <ThemedText>End Date: {tourDates.endDate.toLocaleDateString()}</ThemedText>
            </TouchableOpacity>

            {showEndDate && (
              <DateTimePicker
                value={tourDates.endDate}
                mode="date"
                display="default"
                onChange={onEndDateChange}
                minimumDate={tourDates.startDate}
              />
            )}
          </View>

          <SubmitButton 
            onPress={handleSubmit}
            isLoading={isSubmitting}
            disabled={!isFormValid()}
            title="Submit KYC"
          />
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
    padding: theme.spacing.lg,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  headerText: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text.accent,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  headerAccent: {
    width: 60,
    height: 4,
    backgroundColor: theme.colors.accent,
    borderRadius: 2,
  },
  formContainer: {
    backgroundColor: 'rgba(27, 27, 58, 0.7)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.card.border,
    ...theme.shadows.medium,
  },
  idTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  idTypeButton: {
    width: '48%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.card.border,
    backgroundColor: 'rgba(38, 38, 86, 0.5)',
    ...theme.shadows.light,
  },
  selectedButton: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.secondary,
    ...theme.shadows.gold,
  },
  idTypeText: {
    color: theme.colors.text.secondary,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedText: {
    color: theme.colors.text.accent,
  },
  input: {
    backgroundColor: theme.colors.input.background,
    borderWidth: 1,
    borderColor: theme.colors.input.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.input.text,
    fontSize: 16,
    marginBottom: theme.spacing.md,
    ...theme.shadows.light,
  },
  uploadButton: {
    marginVertical: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  uploadGradient: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: theme.colors.text.dark,
    fontSize: 16,
    fontWeight: '700',
  },
  imageContainer: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    backgroundColor: 'rgba(255, 217, 0, 0.34)',
    ...theme.shadows.light,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.sm,
  },
  submitButton: {
    marginTop: theme.spacing.xl,
    ...theme.shadows.heavy,
  },
  submitGradient: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  submitButtonText: {
    color: theme.colors.text.dark,
    fontSize: 18,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.7
  },
  dateSection: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: theme.colors.card.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.card.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.accent,
    marginBottom: 15,
  },
  dateButton: {
    padding: 15,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.sm,
    marginVertical: 5,
    alignItems: 'center',
  }
});