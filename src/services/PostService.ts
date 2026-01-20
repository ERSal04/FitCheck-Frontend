import { API_URL } from '../lib/constants';
import ApiService from './WardrobeApi';

const API_BASE_URL = API_URL;

// Endpoints
const ENDPOINTS = {
  POSTS: '/posts',
  COMMENTS: '/comments',
};

/**
 * Interface for a Post object
 */
export interface Post {
  _id?: string;
  id?: string;
  user?: {
    _id?: string;
    username?: string;
    profilePictureUrl?: string;
  };
  imageUrl: string;
  caption?: string;
  timestamp?: string;
  likes?: number;
  comments?: any[] | number;
  location?: string;
  mentions?: string;
  category?: string;
  userAvatar?: string;
  username?: string;
  isLiked?: Boolean;
}

/**
 * Interface for a Comment object
 */
export interface Comment {
  _id?: string;
  id?: string;
  user?: {
    _id?: string;
    username?: string;
    profilePictureUrl?: string;
  };
  post?: string;
  text: string;
  timestamp?: string;
  likes?: number;
  avatar?: string;
  username?: string;
}

/**
 * Interface for pagination parameters
 */
interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Service to handle Post-related API requests
 */
class PostService {
  /**
   * Get a post by ID
   * @param postId The ID of the post to retrieve
   */
  static async getPostById(postId) {
    try {
      const url = `${API_BASE_URL}${ENDPOINTS.POSTS}/${postId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: await ApiService.getAuthHeader(),
      });

      const data = await ApiService.handleResponse(response);

      // Add some logging to debug the API response
      // console.log(`Post data for ID ${postId}:`, data);

      // Check for different response formats
      if (data) {
        // Sometimes the API returns { data: post } and sometimes just the post
        return data.data ? data : { data: data };
      }

      return null;
    } catch (error) {
      console.error(`Error fetching post ${postId}:`, error);
      throw error;
    }
  }

  /**
   * Toggle like status for a post
   * @param postId The ID of the post to like/unlike
   */
  static async toggleLike(postId: string) {
    try {
      const url = `${API_BASE_URL}${ENDPOINTS.POSTS}/${postId}/toggle-like`;

      const response = await fetch(url, {
        method: 'PATCH',
        headers: await ApiService.getAuthHeader(),
      });

      return await ApiService.handleResponse(response);
    } catch (error) {
      console.error(`Error toggling like for post ${postId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a post - Enhanced with better error handling
   * @param postId The ID of the post to delete
   */
  static async deletePost(postId) {
    try {
      const url = `${API_BASE_URL}${ENDPOINTS.POSTS}/${postId}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: await ApiService.getAuthHeader(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Delete post error response:', errorData);

        // Check for specific error types
        if (response.status === 403) {
          throw new Error('You do not have permission to delete this post');
        } else if (response.status === 404) {
          throw new Error('Post not found');
        }

        throw new Error(errorData.message || 'Failed to delete post');
      }

      return await ApiService.handleResponse(response);
    } catch (error) {
      console.error(`Error deleting post ${postId}:`, error);
      throw error;
    }
  }

  /**
   * Check if a post is liked by the current user
   * @param postId The ID of the post to check
   * @returns Object containing isLiked boolean status
   */
  static async isLiked(postId: string) {
    try {
      const url = `${API_BASE_URL}${ENDPOINTS.POSTS}/${postId}/is-liked`;

      const response = await fetch(url, {
        method: 'GET',
        headers: await ApiService.getAuthHeader(),
      });

      return await ApiService.handleResponse(response);
    } catch (error) {
      console.error(`Error checking like status for post ${postId}:`, error);
      throw error;
    }
  }

  /**
   * Get comments for a post
   * @param postId The ID of the post
   * @param params Pagination parameters
   */
  static async getComments(postId: string, params: PaginationParams = { page: 1, limit: 10 }) {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();

      // Add pagination params
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const url = `${API_BASE_URL}${ENDPOINTS.POSTS}/${postId}/comments?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: await ApiService.getAuthHeader(),
      });

      return await ApiService.handleResponse(response);
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw error;
    }
  }

  /**
   * Add a comment to a post
   * @param postId The ID of the post
   * @param text The comment text
   */
  static async addComment(postId: string, text: string) {
    try {
      const url = `${API_BASE_URL}${ENDPOINTS.POSTS}/${postId}/comments`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...(await ApiService.getAuthHeader()),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      return await ApiService.handleResponse(response);
    } catch (error) {
      console.error(`Error adding comment to post ${postId}:`, error);
      throw error;
    }
  }

  /**
   * Get related posts based on category or other factors
   * @param postId The ID of the post to find related posts for
   * @param limit Maximum number of posts to return
   */
  static async getRelatedPosts(postId: string, limit: number = 4) {
    try {
      const url = `${API_BASE_URL}${ENDPOINTS.POSTS}/${postId}/related?limit=${limit}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: await ApiService.getAuthHeader(),
      });

      return await ApiService.handleResponse(response);
    } catch (error) {
      console.error(`Error fetching related posts for ${postId}:`, error);
      throw error;
    }
  }

  /**
   * Get posts by category
   * @param category The category to filter by
   * @param params Pagination parameters
   */
  static async getPostsByCategory(
    category: string,
    params: PaginationParams = { page: 1, limit: 10 },
  ) {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();

      // Add pagination and category params
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      queryParams.append('category', category);

      const url = `${API_BASE_URL}${ENDPOINTS.POSTS}?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: await ApiService.getAuthHeader(),
      });

      return await ApiService.handleResponse(response);
    } catch (error) {
      console.error(`Error fetching posts for category ${category}:`, error);
      throw error;
    }
  }
}

export default PostService;
