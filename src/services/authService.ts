import AsyncStorage from '@react-native-async-storage/async-storage';

export const getApiUrl = () => {
  if (__DEV__) {
    return 'http://172.20.10.3:5000/api';  // Updated IP address
  }
  return 'https://your-production-api.com/api';
};

const API_URL = getApiUrl();

export const authService = {
  async signup(userData: SignupData): Promise<AuthResponse> {
    try {
      console.log('Attempting signup with:', API_URL);
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Store both token and user role
      await AsyncStorage.multiSet([
        ['authToken', data.token],
        ['userRole', data.user.role]
      ]);

      console.log('Signup successful:', data.user.role);
      return data;
    } catch (error: any) {
      console.error('Detailed signup error:', error);
      throw new Error(error.message || 'Network request failed');
    }
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      await AsyncStorage.setItem('authToken', data.token);
      await AsyncStorage.setItem('userRole', data.user.role);

      return data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Network request failed');
    }
  },

  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['authToken', 'userRole']);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  }
};