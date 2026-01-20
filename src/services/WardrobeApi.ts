import AuthService from './AuthService';
import { API_URL } from '../lib/constants';

const API_BASE_URL = API_URL;

// Endpoints
const ENDPOINTS = {
  WARDROBE: '/wardrobe',
};

/**
 * Service to handle API requests
 */
class ApiService {
  /**
   * Get authorization header with token
   */
  static async getAuthHeader(): Promise<HeadersInit> {
    const token = await AuthService.getToken();
    return {
      Authorization: token ?? '',
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get multipart form data header with token
   */
  static async getMultipartHeader(): Promise<HeadersInit> {
    const token = await AuthService.getToken();
    return {
      Authorization: token ?? '',
      'Content-Type': 'multipart/form-data',
    };
  }

  /**
   * Handle API response
   */
  static async handleResponse(response: Response) {
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || `Error: ${response.status}`;
      } catch (e) {
        errorMessage = `HTTP Error: ${response.status}`;
      }

      throw new Error(errorMessage);
    }

    // Check if response has content
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return true; // Success with no content
  }

  /**
   * Fetch all wardrobe items or filter by category
   */
  static async getWardrobeItems(category?: string, username?: string) {
    try {
      // Use provided username or get the current user's username
      let targetUsername;
      if (username) {
        targetUsername = username;
      } else {
        const userData = await AuthService.getUserData();
        targetUsername = userData?.username;
      }

      const url = `${API_BASE_URL}${ENDPOINTS.WARDROBE}/${targetUsername}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: await this.getAuthHeader(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching wardrobe items:', error);
      throw error;
    }
  }

  /**
   * Add a new item to the wardrobe
   */
  static async addWardrobeItem(data: { image: string; category: string; description: string }) {
    try {
      // Create form data with image
      const formData = new FormData();
      formData.append('category', data.category);
      formData.append('description', data.description);

      // Append image to form data
      const filename = data.image.split('/').pop() || `image_${Date.now()}.jpg`;
      formData.append('image', {
        uri: data.image,
        name: filename,
        type: 'image/jpeg', // Adjust if needed
      } as any); // Type assertion needed for React Native's FormData

      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.WARDROBE}`, {
        method: 'POST',
        headers: await this.getMultipartHeader(),
        body: formData,
      });

      console.log(response);

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error adding wardrobe item:', error);
      throw error;
    }
  }

  /**
   * Delete a wardrobe item
   */
  static async deleteWardrobeItem(itemId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.WARDROBE}/${itemId}`, {
        method: 'DELETE',
        headers: await this.getAuthHeader(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting wardrobe item:', error);
      throw error;
    }
  }
}

export default ApiService;
