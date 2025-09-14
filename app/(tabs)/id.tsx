import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { StyleSheet, View } from 'react-native';

export default function DigitalIDScreen() {
  const generateID = () => {
    // TODO: Integrate with blockchain ID issuance flow
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Digital Tourist ID</ThemedText>
      <ThemedText>Secure identity for your trip. KYC-linked and time-bound.</ThemedText>
      <View style={styles.actions}>
        <Button title="Generate / Link ID" onPress={generateID} />
      </View>
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
  actions: {
    marginTop: 8,
  },
});



