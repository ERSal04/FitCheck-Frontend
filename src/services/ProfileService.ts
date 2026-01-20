import AuthService from './AuthService';
import { API_URL } from '../lib/constants';

const BASE_API_URL = API_URL;

// Interfaces for data types
export interface UserProfile {
  username: string;
  bio: string;
  profilePictureUrl: string | null;
  favoriteBrands: string;
  stylePreferences: string;
  posts: Post[];
  followers: string[];
  following: string[];
  followersCount?: number;
  followingCount?: number;
  topPosts?: Post[];
}

export interface Post {
  _id: string;
  imageUrl: string;
  caption?: string;
  timestamp: Date;
  likes: number;
  comments: string[]; // Array of Comment IDs
  location?: string;
  mentions?: string;
  category?: string;
  user: string; // User ID
}

export interface ProfileUpdateData {
  bio?: string;
  favoriteBrands?: string;
  stylePreferences?: string;
}

class ProfileService {
  // Get current user's profile
  async getMyProfile(): Promise<UserProfile> {
    try {
      const token = await AuthService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // First get the current user's username
      const currentUser = await AuthService.getUserData();
      if (!currentUser || !currentUser.username) {
        throw new Error('User data not available');
      }

      // Then use the existing profile/:username endpoint
      const response = await fetch(`${BASE_API_URL}/profile/${currentUser.username}`, {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get profile');
      }

      const responseData = await response.json();
      const userData = responseData.data;

      // Process data for the frontend
      userData.followersCount = userData.followers ? userData.followers.length : 0;
      userData.followingCount = userData.following ? userData.following.length : 0;

      // Create topPosts from posts if sorted by likes
      if (userData.posts && userData.posts.length > 0) {
        userData.topPosts = userData.posts.slice(0, 6); // Top 6 posts by likes (already sorted in backend)
      } else {
        userData.topPosts = [];
      }

      // console.log(userData);
      return userData;
    } catch (error) {
      console.error('Error in getMyProfile:', error);
      throw error;
    }
  }

  // Get another user's profile
  async getUserProfile(username: string): Promise<UserProfile> {
    try {
      const token = await AuthService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${BASE_API_URL}/profile/${username}`, {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get user profile');
      }

      const responseData = await response.json();
      const userData = responseData.data;

      // Process data for the frontend
      userData.followersCount = userData.followers ? userData.followers.length : 0;
      userData.followingCount = userData.following ? userData.following.length : 0;

      // Create topPosts from posts if sorted by likes
      if (userData.posts && userData.posts.length > 0) {
        userData.topPosts = userData.posts.slice(0, 6); // Top 6 posts by likes (already sorted in backend)
      } else {
        userData.topPosts = [];
      }

      // console.log(userData);
      return userData;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      throw error;
    }
  }

  // Update profile with the new endpoint
  async updateProfile(profileData: ProfileUpdateData): Promise<UserProfile> {
    try {
      const token = await AuthService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // Using PATCH method to match your backend
      const response = await fetch(`${BASE_API_URL}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          bio: profileData.bio,
          stylePreferences: profileData.stylePreferences,
          favoriteBrands: profileData.favoriteBrands, // Map to correct field name
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const responseData = await response.json();

      // Get updated profile to ensure we have fresh data
      return await this.getMyProfile();
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  }

  // Upload a new profile picture
  async updateProfilePicture(
    imageUri: string,
  ): Promise<{ success: boolean; profilePictureUrl: string }> {
    try {
      const token = await AuthService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // Create form data for image upload
      const formData = new FormData();

      // Add the image file to form data
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('image', {
        uri: imageUri,
        name: `profile-picture.${fileType}`,
        type: `image/${fileType}`,
      } as any);

      const response = await fetch(`${BASE_API_URL}/profile/upload-picture`, {
        method: 'POST',
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile picture');
      }

      const result = await response.json();
      return {
        success: true,
        profilePictureUrl: result.profilePicture,
      };
    } catch (error) {
      console.error('Error in updateProfilePicture:', error);
      throw error;
    }
  }

  // Get followers for a specific user
  async getFollowers(username: string) {
    try {
      const token = await AuthService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${BASE_API_URL}/user/followers/${username}`, {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get followers');
      }

      const result = await response.json();
      return result.followers;
    } catch (error) {
      console.error('Error in getFollowers:', error);
      throw error;
    }
  }

  // Get accounts a user is following
  async getFollowing(username: string) {
    try {
      const token = await AuthService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${BASE_API_URL}/user/following/${username}`, {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get following list');
      }

      const result = await response.json();
      return result.following;
    } catch (error) {
      console.error('Error in getFollowing:', error);
      throw error;
    }
  }

  // Toggle follow/unfollow a user
  async toggleFollow(username: string): Promise<{ success: boolean; isFollowing: boolean }> {
    try {
      const token = await AuthService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${BASE_API_URL}/user/follow/${username}`, {
        method: 'POST',
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle follow status');
      }

      const result = await response.json();
      // Determine new follow status from message
      const isFollowing = result.message.includes('Followed');

      return {
        success: true,
        isFollowing,
      };
    } catch (error) {
      console.error('Error in toggleFollow:', error);
      throw error;
    }
  }

  // Check if current user is following another user
  async isFollowing(username: string): Promise<boolean> {
    try {
      const token = await AuthService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${BASE_API_URL}/user/is-following/${username}`, {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get following status');
      }

      const data = await response.json();
      return data.isFollowing;
    } catch (error) {
      console.error('Error in isFollowing:', error);
      throw error;
    }
  }
}

export default new ProfileService();
