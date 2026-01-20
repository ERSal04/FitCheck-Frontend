import { API_URL } from '../lib/constants';
import ApiService from './WardrobeApi';

// Base API URL (using the same constant as other services)
const API_BASE_URL = API_URL;

// Endpoints
const ENDPOINTS = {
  EXPLORE: '/explore',
  POSTS: '/posts',
};

/**
 * Interface for pagination parameters
 */
interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Interface for explore filters
 */
interface ExploreFilters {
  category?: string;
}

/**
 * Service to handle Explore API requests
 */
class ExploreService {
  /**
   * Fetch posts for the explore page
   * @param params Pagination parameters
   * @param filters Optional filters like category
   */
  static async fetchExplorePosts(
    params: PaginationParams = { page: 1, limit: 10 },
    filters: ExploreFilters = {},
  ) {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();

      // Add pagination params
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      // Add filters
      if (filters.category && filters.category !== 'Trending') {
        queryParams.append('category', filters.category);
      }

      // Construct URL
      const url = `${API_BASE_URL}${ENDPOINTS.EXPLORE}?${queryParams.toString()}`;

      // Make request
      const response = await fetch(url, {
        method: 'GET',
        headers: await ApiService.getAuthHeader(),
      });

      // The backend returns { posts: [...] }
      return await ApiService.handleResponse(response);
    } catch (error) {
      console.error('Error fetching explore posts:', error);
      throw error;
    }
  }

  /**
   * Create a new post
   * @param postData The post data to submit
   */
  static async createPost(postData: {
    image: string;
    caption?: string;
    location?: string;
    mentions?: string[];
    category?: string;
  }) {
    try {
      // Create form data with image
      const formData = new FormData();

      // Add text fields
      if (postData.caption) formData.append('caption', postData.caption);
      if (postData.location) formData.append('location', postData.location);
      if (postData.category) formData.append('category', postData.category);

      // Add mentions as JSON string
      if (postData.mentions && postData.mentions.length > 0) {
        formData.append('mentions', JSON.stringify(postData.mentions));
      }

      // Append image to form data
      const filename = postData.image.split('/').pop() || `post_${Date.now()}.jpg`;
      formData.append('image', {
        uri: postData.image,
        name: filename,
        type: 'image/jpeg', // Adjust if needed
      } as any); // Type assertion needed for React Native's FormData

      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.POSTS}`, {
        method: 'POST',
        headers: await ApiService.getMultipartHeader(),
        body: formData,
      });

      console.log('Post Created');

      return await ApiService.handleResponse(response);
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }
}

export default ExploreService;
