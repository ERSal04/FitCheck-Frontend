import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants for storage keys
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

// Interface for user data
interface UserData {
  id: string;
  username: string;
  email: string;
  // Add other user properties as needed
}

/**
 * Service to handle authentication-related functionality
 */
class AuthService {
  /**
   * Store authentication token in AsyncStorage
   * @param token The authentication token to store
   */
  static async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error storing auth token:', error);
      throw error;
    }
  }

  /**
   * Retrieve the authentication token from AsyncStorage
   * @returns The stored authentication token or null if not found
   */
  static async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error retrieving auth token:', error);
      return null;
    }
  }

  /**
   * Store user data in AsyncStorage
   * @param userData The user data to store
   */
  static async setUserData(userData: UserData): Promise<void> {
    try {
      const userDataString = JSON.stringify(userData);
      await AsyncStorage.setItem(USER_DATA_KEY, userDataString);
    } catch (error) {
      console.error('Error storing user data:', error);
      throw error;
    }
  }

  /**
   * Retrieve user data from AsyncStorage
   * @returns The stored user data or null if not found
   */
  static async getUserData(): Promise<UserData | null> {
    try {
      const userDataString = await AsyncStorage.getItem(USER_DATA_KEY);
      if (userDataString) {
        return JSON.parse(userDataString) as UserData;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  /**
   * Check if the user is authenticated
   * @returns True if authenticated, false otherwise
   */
  static async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  /**
   * Clear all authentication data (logout)
   */
  static async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
}

export default AuthService;
