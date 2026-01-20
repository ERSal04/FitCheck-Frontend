import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Alert,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image as ExpoImage } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import PostService from '../services/PostService';
import COLORS from '../types/styles/colorConstants';
import AuthService from '../services/AuthService';

// Get screen dimensions
const { width } = Dimensions.get('window');

// Format date function
const formatDate = dateString => {
  try {
    const date = new Date(dateString);
    const now = new Date();

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Just now';
    }

    const diffTime = now.getTime() - date.getTime();

    // If in the future (due to clock differences)
    if (diffTime < 0) {
      return 'Just now';
    }

    const diffSeconds = Math.floor(diffTime / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 30) {
      // If more than a month, show actual date
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    } else if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`;
    } else {
      return 'Just now';
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Recently';
  }
};

const PostDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Extract postId from route params (preferred method)
  // But also support the post object for backward compatibility
  const postId = route.params?.postId;
  const initialPost = route.params?.post;
  const onGoBack = route.params || {};

  // State variables
  const [post, setPost] = useState(initialPost || null);
  const [liked, setLiked] = useState(false);
  // const [saved, setSaved] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOwnPost, setIsOwnPost] = useState(false);
  const [error, setError] = useState(null);
  const scrollViewRef = useRef(null);
  const commentInputRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      await loadPostData();
    };

    loadData();
  }, [postId, initialPost]);

  // Add a separate useEffect for ownership check that runs after post data is loaded
  useEffect(() => {
    if (post) {
      checkPostOwnership();
      checkLikeStatus();
    }
  }, [post]);

  const navigateToUserProfile = async username => {
    console.log('Navigating to profile with username:', username);

    // Ensure username is defined and not empty
    if (!username) {
      console.error('Cannot navigate to profile: username is undefined or empty');
      return;
    }

    // Get current user data to determine if this is the current user's profile
    const currentUser = await AuthService.getUserData();
    const isCurrentUserProfile = currentUser?.username === username;

    console.log('Is current user profile?', isCurrentUserProfile);

    // Navigate differently based on whether it's the current user or not
    if (isCurrentUserProfile) {
      // If it's the current user's profile, navigate to the Profile tab
      navigation.navigate('Tabs', {
        screen: 'Profile',
      });
    } else {
      // If it's someone else's profile, use the shared Profile screen
      navigation.navigate('Profile', {
        username: username,
        fromPostDetail: true,
      });
    }
  };

  const checkPostOwnership = async () => {
    try {
      // Get current user data
      const currentUser = await AuthService.getUserData();

      // Only proceed if both currentUser and post exist
      if (!currentUser) {
        console.log('Current user data missing for ownership check');
        setIsOwnPost(false);
        return;
      }

      if (!post) {
        console.log('Post data missing for ownership check');
        setIsOwnPost(false);
        return;
      }

      // Log everything for debugging
      // console.log('Post data for ownership check:', {
      //   postId: post.id || post._id,
      //   postUserId: post.userId,
      //   postUser: post.user ? (typeof post.user === 'object' ? (post.user._id || post.user.id) : post.user) : null,
      //   postUsername: post.username
      // });

      // console.log('Current user for ownership check:', {
      //   userId: currentUser._id || currentUser.id,
      //   username: currentUser.username
      // });

      // Get current user ID
      const currentUserId = currentUser._id || currentUser.id;

      // Handle different post data structures
      let postUserId = null;

      // Post has a user object (populated)
      if (post.user && typeof post.user === 'object') {
        postUserId = post.user._id || post.user.id;
        // console.log('Using user object ID for comparison:', postUserId);
      }
      // Post has a userId field (string reference)
      else if (post.userId) {
        postUserId = post.userId;
        // console.log('Using userId field for comparison:', postUserId);
      }
      // Post has user as string ID
      else if (post.user && typeof post.user === 'string') {
        postUserId = post.user;
        // console.log('Using user string ID for comparison:', postUserId);
      }

      // If we have IDs to compare, check ownership
      if (currentUserId && postUserId) {
        // Convert IDs to strings for proper comparison
        const strCurrentUserId = String(currentUserId);
        const strPostUserId = String(postUserId);
        const isOwner = strCurrentUserId === strPostUserId;

        // console.log(`Ownership check: "${strCurrentUserId}" vs "${strPostUserId}" = ${isOwner}`);
        setIsOwnPost(isOwner);
        return;
      }

      // Fallback to username comparison if IDs aren't available
      if (post.username && currentUser.username) {
        const isOwner = currentUser.username === post.username;
        // console.log(`Ownership check (username): "${currentUser.username}" vs "${post.username}" = ${isOwner}`);
        setIsOwnPost(isOwner);
        return;
      }

      console.log('Could not determine post ownership - missing data');
      setIsOwnPost(false);
    } catch (error) {
      console.error('Error checking post ownership:', error);
      setIsOwnPost(false);
    }
  };

  const checkLikeStatus = async () => {
    try {
      // Determine which postId to use
      const postIdToUse = postId || (post && (post.id || post._id));

      if (!postIdToUse) {
        return;
      }

      try {
        const response = await PostService.isLiked(postIdToUse);
        if (response && response.isLiked !== undefined) {
          setLiked(response.isLiked);
        }
      } catch (error) {
        console.error('Error checking like status:', error);
        // Keep current liked state if there's an error
      }
    } catch (error) {
      console.error('Error in checkLikeStatus:', error);
    }
  };

  // Load post data from API
  const loadPostData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (postId) {
        const response = await PostService.getPostById(postId);

        if (response && response.data) {
          const postData = response.data;

          // Enhanced logging to debug the response structure
          console.log('API Response structure:', {
            hasUserObject: !!postData.user,
            hasUserId: !!postData.userId,
            userType: postData.user ? typeof postData.user : 'undefined',
          });

          if (postData.user && typeof postData.user === 'object') {
            console.log('User ID in response:', postData.user._id || postData.user.id);
          }

          // Handle user information in a flexible way
          let username = 'Unknown';
          let profilePic = 'https://via.placeholder.com/50x50';
          let userId = null;

          if (postData.user) {
            if (typeof postData.user === 'object') {
              // User is populated object
              username = postData.user.username || 'Unknown';
              profilePic = postData.user.profilePictureUrl || 'https://via.placeholder.com/50x50';
              userId = postData.user._id || postData.user.id;
            } else {
              // User is just an ID string
              userId = postData.user;
            }
          } else if (postData.userId) {
            userId = postData.userId;
          }

          setPost({
            id: postData._id || postData.id,
            imageUrl: postData.imageUrl,
            username: username,
            userAvatar: profilePic,
            likes: postData.likes || 0,
            comments: Array.isArray(postData.comments)
              ? postData.comments.length
              : postData.comments || 0,
            caption: postData.caption || '',
            timestamp: postData.timestamp || new Date().toISOString(),
            location: postData.location || null,
            mentions: postData.mentions || null,
            category: postData.category || null,
            user: postData.user, // Store the user object/id as-is
            userId: userId, // Store userId explicitly
            isLiked: postData.isLiked,
          });
        } else {
          setError('Failed to load post details');
        }
      }
      // Use initialPost if provided and no postId
      else if (initialPost) {
        setPost(initialPost);
      } else {
        setError('Post information missing');
      }

      // Load comments and related posts if we have a post
      if (post || postId || (initialPost && (initialPost.id || initialPost._id))) {
        await Promise.all([fetchComments(), fetchRelatedPosts()]);
      }
    } catch (error) {
      console.error('Error loading post data:', error);
      setError('Failed to load post details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    try {
      setIsLoadingComments(true);

      // Determine which postId to use
      const postIdToUse =
        postId ||
        (post && (post.id || post._id)) ||
        (initialPost && (initialPost.id || initialPost._id));

      if (!postIdToUse) {
        setSampleComments();
        return;
      }

      try {
        const response = await PostService.getComments(postIdToUse);

        if (response && response.comments && Array.isArray(response.comments)) {
          // Transform API response to match UI expectations
          const formattedComments = response.comments.map(comment => ({
            id: comment._id || comment.id,
            username: comment.user?.username || 'Unknown',
            text: comment.text,
            timestamp: comment.timestamp || new Date().toISOString(),
            likes: comment.likes || 0,
            avatar: comment.user?.profilePictureUrl || 'https://via.placeholder.com/30x30',
          }));

          setComments(formattedComments);
        } else {
          setSampleComments();
        }
      } catch (apiError) {
        console.error('API error fetching comments:', apiError);
        setSampleComments();
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  // Set sample comments as fallback
  const setSampleComments = () => {
    const dummyComments = [
      {
        id: '1',
        username: 'fashion_critic',
        text: 'Absolutely love this fit! 🔥',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        likes: 24,
        avatar: 'https://via.placeholder.com/30x30',
      },
      {
        id: '2',
        username: 'style_hunter',
        text: 'Where did you get those shoes? They look amazing!',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        likes: 12,
        avatar: 'https://via.placeholder.com/30x30',
      },
      {
        id: '3',
        username: 'trend_spotter',
        text: 'Color coordination on point! 👌',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        likes: 9,
        avatar: 'https://via.placeholder.com/30x30',
      },
    ];

    setComments(dummyComments);
  };

  // Fetch related posts
  const fetchRelatedPosts = async () => {
    try {
      setIsLoadingRelated(true);

      // Determine which postId to use
      const postIdToUse =
        postId ||
        (post && (post.id || post._id)) ||
        (initialPost && (initialPost.id || initialPost._id));

      if (!postIdToUse) {
        setSampleRelatedPosts();
        return;
      }

      try {
        const response = await PostService.getRelatedPosts(postIdToUse);

        if (response && response.relatedPosts && Array.isArray(response.relatedPosts)) {
          // Transform API response to match UI expectations
          const formattedPosts = response.relatedPosts.map(relatedPost => ({
            id: relatedPost._id || relatedPost.id,
            imageUrl: relatedPost.imageUrl,
            username: relatedPost.user?.username || 'Unknown',
          }));

          setRelatedPosts(formattedPosts);
        } else {
          setSampleRelatedPosts();
        }
      } catch (apiError) {
        console.error('API error fetching related posts:', apiError);
        setSampleRelatedPosts();
      }
    } catch (error) {
      console.error('Error fetching related posts:', error);
    } finally {
      setIsLoadingRelated(false);
    }
  };

  // Handle post deletion
  // Fix this once Elias fixes the API response
  const handleDeletePost = async () => {
    // Close the menu first
    setMenuVisible(false);

    // Show confirmation dialog
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);

              // Get post ID
              const postIdToDelete = postId || (post && (post.id || post._id));

              if (!postIdToDelete) {
                Alert.alert('Error', 'Could not identify post to delete.');
                return;
              }

              // Call API to delete the post
              await PostService.deletePost(postIdToDelete);

              // Navigate back to previous screen
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting post:', error);
              Alert.alert('Error', 'Failed to delete post. Please try again later.');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  // Set sample related posts as fallback
  const setSampleRelatedPosts = () => {
    const dummyRelatedPosts = [
      {
        id: '101',
        imageUrl: 'https://via.placeholder.com/200x200',
        username: 'style_seeker',
      },
      {
        id: '102',
        imageUrl: 'https://via.placeholder.com/200x200',
        username: 'fashion_forward',
      },
      {
        id: '103',
        imageUrl: 'https://via.placeholder.com/200x200',
        username: 'vintage_finds',
      },
      {
        id: '104',
        imageUrl: 'https://via.placeholder.com/200x200',
        username: 'minimal_style',
      },
    ];

    setRelatedPosts(dummyRelatedPosts);
  };

  // Toggle like
  // Replace the existing handleLike function with this updated version:

  const handleLike = async () => {
    try {
      // Get post ID to use for API call
      const postIdToUse = postId || (post && (post.id || post._id));

      if (!postIdToUse) {
        // Just toggle locally if we don't have a post ID
        setLiked(!liked);
        setPost(prev => ({
          ...prev,
          likes: liked ? prev.likes - 1 : prev.likes + 1,
        }));
        return;
      }

      try {
        // Try to toggle like with the API
        const response = await PostService.toggleLike(postIdToUse);

        if (response) {
          // Update based on API response
          const isNowLiked = response.liked !== undefined ? response.liked : !liked;
          const newLikesCount =
            response.likesCount !== undefined
              ? response.likesCount
              : post.likes + (isNowLiked ? 1 : -1);

          setLiked(isNowLiked);
          setPost(prev => ({
            ...prev,
            likes: newLikesCount,
          }));

          // Call onGoBack from route params if it exists to update the ProfileScreen
          if (route.params?.onGoBack) {
            route.params.onGoBack();
          }
        } else {
          // Fall back to local toggle
          setLiked(!liked);
          setPost(prev => ({
            ...prev,
            likes: liked ? prev.likes - 1 : prev.likes + 1,
          }));

          // Still call onGoBack even with local toggle
          if (route.params?.onGoBack) {
            route.params.onGoBack();
          }
        }
      } catch (apiError) {
        console.error('API error toggling like:', apiError);
        // Fall back to local toggle
        setLiked(!liked);
        setPost(prev => ({
          ...prev,
          likes: liked ? prev.likes - 1 : prev.likes + 1,
        }));

        // Still call onGoBack even with error
        if (route.params?.onGoBack) {
          route.params.onGoBack();
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Error', 'Failed to update like status');
    }
  };

  // Toggle save
  // For future development if needed
  // const handleSave = () => {
  //   setSaved(!saved);
  //   // For future: Implement API call to save post
  // };

  // Post comment
  const handlePostComment = async () => {
    if (!commentText.trim()) return;

    try {
      // Get post ID to use for API call
      const postIdToUse = postId || (post && (post.id || post._id));

      if (!postIdToUse) {
        // Just add comment locally if we don't have a post ID
        addLocalComment();
        return;
      }

      try {
        // Try to add comment with the API
        const response = await PostService.addComment(postIdToUse, commentText);

        if (response && response.comment) {
          // Use the comment from the API response
          const apiComment = response.comment;

          const newComment = {
            id: apiComment._id || apiComment.id,
            username: apiComment.user?.username || 'You',
            text: apiComment.text,
            timestamp: apiComment.timestamp || new Date().toISOString(),
            likes: 0,
            avatar: apiComment.user?.profilePictureUrl || 'https://via.placeholder.com/30x30',
          };

          // Add to the top of the list
          setComments([newComment, ...comments]);
          setCommentText('');

          // Update the post comments count
          setPost(prev => ({
            ...prev,
            comments: (prev.comments || 0) + 1,
          }));

          // Ensure comments are visible after posting
          setShowAllComments(true);
        } else {
          // Fall back to local comment
          addLocalComment();
        }
      } catch (apiError) {
        console.error('API error adding comment:', apiError);
        // Fall back to local comment
        addLocalComment();
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      Alert.alert('Error', 'Failed to post comment');
    }
  };

  // Add a local comment as fallback
  const addLocalComment = () => {
    const newComment = {
      id: `temp-${Date.now()}`,
      username: 'You', // Should be replaced with actual user data
      text: commentText,
      timestamp: new Date().toISOString(),
      likes: 0,
      avatar: 'https://via.placeholder.com/30x30', // Should be replaced with actual user avatar
    };

    setComments([newComment, ...comments]);
    setCommentText('');

    // Update the post comments count
    setPost(prev => ({
      ...prev,
      comments: (prev.comments || 0) + 1,
    }));

    // Ensure comments are visible after posting
    setShowAllComments(true);
  };

  // Render related post item
  const renderRelatedItem = ({ item }) => (
    <TouchableOpacity
      style={styles.relatedItem}
      onPress={() => {
        // Navigate to the post detail screen for the related post using postId
        navigation.push('PostDetail', { postId: item.id });
      }}
      activeOpacity={0.9}
    >
      <ExpoImage
        source={{ uri: item.imageUrl }}
        style={styles.relatedImage}
        contentFit="cover"
        transition={200}
      />
    </TouchableOpacity>
  );

  // Render comment item
  const renderCommentItem = ({ item }) => (
    <View style={styles.commentItem}>
      <TouchableOpacity onPress={() => navigateToUserProfile(item.username)}>
        <Image source={{ uri: item.avatar }} style={styles.commentAvatar} />
      </TouchableOpacity>
      <View style={styles.commentContent}>
        <TouchableOpacity onPress={() => navigateToUserProfile(item.username)}>
          <Text style={styles.commentUsername}>{item.username}</Text>
        </TouchableOpacity>
        <Text style={styles.commentText}>{item.text}</Text>
        <View style={styles.commentMeta}>
          <Text style={styles.commentTime}>{formatDate(item.timestamp)}</Text>
        </View>
      </View>
    </View>
  );

  // Show loading indicator
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.accent || '#FF8C05'} />
      </SafeAreaView>
    );
  }

  // Show error message
  if (error || !post) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.errorText}>{error || 'Post not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadPostData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.retryButton, { marginTop: 10 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />

        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{post.username}'s Fit</Text>
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Post image */}
          <View style={styles.postContainer}>
            <ExpoImage
              source={{ uri: post.imageUrl }}
              style={styles.postImage}
              contentFit="cover"
              transition={200}
            />
          </View>

          {/* Interaction buttons */}
          <View style={styles.actionBar}>
            <View style={styles.leftActions}>
              {/* Need to check if the user already liked the post to keep heart icon filled */}
              <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                <Ionicons
                  name={liked ? 'heart' : 'heart-outline'}
                  size={26}
                  color={liked ? COLORS.accent || '#FF8C05' : 'white'}
                />
              </TouchableOpacity>
            </View>
            {/* For potential future developement */}
            {/* <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
              <Ionicons 
                name={saved ? "bookmark" : "bookmark-outline"} 
                size={24} 
                color={saved ? COLORS.accent || "#FF8C05" : "white"} 
              />
            </TouchableOpacity> */}
          </View>

          {/* Likes count */}
          <View style={styles.likesContainer}>
            <Text style={styles.likesText}>{post.likes || 0} likes</Text>
          </View>

          {/* Caption */}
          <View style={styles.captionContainer}>
            <View style={styles.userInfo}>
              <Image source={{ uri: post.userAvatar }} style={styles.userAvatar} />
              <TouchableOpacity
                onPress={() => navigateToUserProfile(post.username)}
                activeOpacity={0.7}
                style={{ flex: 1 }}
              >
                <Text style={styles.username}>{post.username}</Text>
              </TouchableOpacity>

              {/* Display timestamp */}
              {post.timestamp && <Text style={styles.timestamp}>{formatDate(post.timestamp)}</Text>}
            </View>

            <Text style={styles.caption}>{post.caption}</Text>

            {/* Display location if available */}
            {post.location && (
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color="#999" />
                <Text style={styles.locationText}>{post.location}</Text>
              </View>
            )}

            {/* Display category if available */}
            {post.category && (
              <View style={styles.categoryContainer}>
                <TouchableOpacity
                  style={styles.categoryBadge}
                  onPress={() => {
                    // Navigate to explore screen with this category
                    navigation.navigate('Explore', { category: post.category });
                  }}
                >
                  <Text style={styles.categoryText}>{post.category}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Display mentions if available */}
            {post.mentions && (
              <View style={styles.mentionsContainer}>
                <Text style={styles.mentionsText}>Mentions: {post.mentions}</Text>
              </View>
            )}
          </View>

          {/* Comments section */}
          <View style={styles.commentsContainer}>
            <Text style={styles.commentsTitle}>Comments</Text>

            {isLoadingComments ? (
              <ActivityIndicator size="small" color={COLORS.accent || '#FF8C05'} />
            ) : comments.length > 0 ? (
              <>
                <TouchableOpacity
                  onPress={() => setShowAllComments(!showAllComments)}
                  style={styles.viewAllComments}
                >
                  <Text style={styles.viewAllText}>
                    {showAllComments
                      ? 'Hide comments'
                      : `View all ${post.comments || comments.length} comments`}
                  </Text>
                </TouchableOpacity>

                {showAllComments && (
                  <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                  />
                )}
              </>
            ) : (
              <Text style={styles.noCommentsText}>No comments yet. Be the first!</Text>
            )}

            {/* Comment input */}
            <View style={styles.addCommentContainer}>
              {/* <Image
                source={{ uri: 'https://via.placeholder.com/30x30' }}
                style={styles.currentUserAvatar}
              /> */}
              <TextInput
                ref={commentInputRef}
                style={styles.commentInput}
                placeholder="Add a comment..."
                placeholderTextColor="#777"
                value={commentText}
                onChangeText={setCommentText}
                onFocus={() => {
                  // Make sure the keyboard doesn't cover the input
                  setTimeout(() => {
                    if (scrollViewRef.current && commentInputRef.current) {
                      commentInputRef.current.measure((fx, fy, width, height, px, py) => {
                        scrollViewRef.current.scrollTo({
                          animated: true,
                          y: py - 1000,
                        });
                      });
                    }
                  }, 100);
                }}
              />
              <TouchableOpacity
                style={[styles.postButton, !commentText.trim() && styles.postButtonDisabled]}
                onPress={handlePostComment}
                disabled={!commentText.trim()}
              >
                <Text
                  style={[
                    styles.postButtonText,
                    !commentText.trim() && styles.postButtonTextDisabled,
                  ]}
                >
                  Post
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* More to explore section */}
          <View style={styles.moreToExploreContainer}>
            <Text style={styles.moreToExploreTitle}>More to explore</Text>

            {isLoadingRelated ? (
              <ActivityIndicator size="small" color={COLORS.accent || '#FF8C05'} />
            ) : (
              <FlatList
                data={relatedPosts}
                renderItem={renderRelatedItem}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedList}
              />
            )}
          </View>
        </ScrollView>

        {/* Menu Dropdown Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={menuVisible}
          onRequestClose={() => setMenuVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
            <View style={styles.menuContainer}>
              {isOwnPost && (
                <TouchableOpacity style={styles.menuItem} onPress={handleDeletePost}>
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                  <Text style={styles.menuItemTextDelete}>Delete Post</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                <Text style={styles.menuItemText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>

        {/* Loading indicator for delete operation */}
        {isDeleting && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.accent || '#FF8C05'} />
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.accent || '#FF8C05',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 50,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuButton: {
    padding: 5,
  },
  postContainer: {
    width: '100%',
    height: width,
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  leftActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: 15,
  },
  likesContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  likesText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  captionContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  timestamp: {
    fontSize: 12,
    color: '#777',
  },
  caption: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 13,
    color: '#999',
    marginLeft: 5,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
  },
  mentionsContainer: {
    marginTop: 5,
  },
  mentionsText: {
    fontSize: 13,
    color: '#1E90FF',
  },
  commentsContainer: {
    padding: 15,
    borderTopWidth: 0.5,
    borderTopColor: '#333',
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  noCommentsText: {
    color: '#777',
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 15,
  },
  viewAllComments: {
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    color: '#777',
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  commentText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 3,
  },
  commentMeta: {
    flexDirection: 'row',
    marginTop: 5,
  },
  commentTime: {
    fontSize: 12,
    color: '#777',
    marginRight: 10,
  },
  commentReply: {
    fontSize: 12,
    color: '#777',
  },
  commentLike: {
    alignItems: 'center',
    paddingLeft: 10,
  },
  likeIcon: {
    fontSize: 16,
    color: '#fff',
  },
  likesCount: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 0.5,
    borderTopColor: '#333',
  },
  currentUserAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentInput: {
    flex: 1,
    height: 40,
    color: '#fff',
    fontSize: 14,
  },
  postButton: {
    marginLeft: 10,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    color: COLORS.accent || '#FF8C05',
    fontWeight: 'bold',
    fontSize: 14,
  },
  postButtonTextDisabled: {
    color: '#777',
  },
  moreToExploreContainer: {
    padding: 15,
    borderTopWidth: 0.5,
    borderTopColor: '#333',
  },
  moreToExploreTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  relatedList: {
    paddingBottom: 10,
  },
  relatedItem: {
    marginRight: 10,
    width: 120,
    height: 120,
  },
  relatedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60, // Position below the header
    paddingRight: 15,
  },
  menuContainer: {
    backgroundColor: '#222',
    borderRadius: 8,
    width: 180,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  menuItemText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  menuItemTextDelete: {
    fontSize: 16,
    color: '#FF3B30', // Red color for delete
    marginLeft: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default PostDetailScreen;
