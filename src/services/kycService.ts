import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.31.14:5000/api';

export interface KycData {
  name: string;
  address: string;
  phoneNumber: string;
  aadharNumber?: string;
  passportNumber?: string;
  idProofImage?: string | null;
}

export const kycService = {
  async submitKyc(kycData: KycData): Promise<any> {
    try {
      console.log('=== KYC Service Start ===');
      
      // Get auth token
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        throw new Error('Authentication required');
      }

      console.log('Making API request to:', `${API_URL}/kyc`);
      const response = await fetch(`${API_URL}/kyc`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(kycData)
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        console.error('Server error:', data);
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error('KYC Service Error:', {
        message: error.message,
        type: error.name,
        stack: error.stack
      });
      throw error;
    } finally {
      console.log('=== KYC Service End ===');
    }
  }
};