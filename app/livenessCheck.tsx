import React, { useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { theme } from '@/src/theme';

const steps = [
  { id: 1, instruction: 'Look straight at the camera', icon: '👀' },
  { id: 2, instruction: 'Turn your head left slowly', icon: '↩️' },
  { id: 3, instruction: 'Turn your head right slowly', icon: '↪️' },
  { id: 4, instruction: 'Blink your eyes naturally', icon: '😊' },
];

export default function LivenessCheckScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<Camera>(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleNextStep = async () => {
    setIsProcessing(true);
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Navigate to success screen or handle completion
      router.push('/(tabs)');
    }
    setIsProcessing(false);
  };

  if (hasPermission === null) {
    return (
      <LinearGradient
        colors={[theme.colors.background.gradient.start, theme.colors.background.gradient.end]}
        style={styles.container}
      >
        <ThemedText style={styles.loadingText}>Requesting camera permission...</ThemedText>
      </LinearGradient>
    );
  }

  if (hasPermission === false) {
    return (
      <LinearGradient
        colors={[theme.colors.background.gradient.start, theme.colors.background.gradient.end]}
        style={styles.container}
      >
        <ThemedText style={styles.errorText}>No access to camera</ThemedText>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[theme.colors.background.gradient.start, theme.colors.background.gradient.end]}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <ThemedText style={styles.headerText}>Liveness Check</ThemedText>
        <View style={styles.headerAccent} />
      </View>

      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          type={CameraType.front}
          style={styles.camera}
        />
        <View style={styles.overlay}>
          <View style={styles.faceMask} />
        </View>
      </View>

      <View style={styles.instructionContainer}>
        <LinearGradient
          colors={['rgba(27, 27, 58, 0.9)', 'rgba(27, 27, 58, 0.7)']}
          style={styles.instructionCard}
        >
          <ThemedText style={styles.stepIndicator}>
            Step {currentStep + 1} of {steps.length}
          </ThemedText>
          <ThemedText style={styles.instructionIcon}>
            {steps[currentStep].icon}
          </ThemedText>
          <ThemedText style={styles.instructionText}>
            {steps[currentStep].instruction}
          </ThemedText>
        </LinearGradient>
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleNextStep}
        disabled={isProcessing}
      >
        <LinearGradient
          colors={[theme.colors.accent, '#DAA520']}
          style={styles.nextButtonGradient}
        >
          <ThemedText style={styles.nextButtonText}>
            {isProcessing ? 'Processing...' : 'Continue'}
          </ThemedText>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
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
  loadingText: {
    color: theme.colors.text.primary,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  errorText: {
    color: theme.colors.button.danger,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  cameraContainer: {
    width: '90%',
    aspectRatio: 3/4,
    alignSelf: 'center',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.accent,
    ...theme.shadows.heavy,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  faceMask: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 3,
    borderColor: theme.colors.accent,
    borderStyle: 'dashed',
  },
  instructionContainer: {
    padding: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  instructionCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.card.border,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  stepIndicator: {
    color: theme.colors.text.secondary,
    fontSize: 14,
    marginBottom: theme.spacing.sm,
  },
  instructionIcon: {
    fontSize: 40,
    marginBottom: theme.spacing.md,
  },
  instructionText: {
    color: theme.colors.text.primary,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  nextButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    ...theme.shadows.heavy,
  },
  nextButtonGradient: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  nextButtonText: {
    color: theme.colors.text.dark,
    fontSize: 18,
    fontWeight: '700',
  },
});