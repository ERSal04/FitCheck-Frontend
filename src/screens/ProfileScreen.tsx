import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Modal,
  Alert,
  Pressable,
  Platform,
  ActivityIndicator,
  TextInput,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import { Image as ExpoImage } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import ProfileService, { UserProfile, ProfileUpdateData, Post } from '../services/ProfileService';
import AuthService from '../services/AuthService';
import { profileStyles } from '../types/styles/ProfileStyles/profileStyles';
import COLORS from '../types/styles/colorConstants';
import PopUpStyles from '../types/styles/wardrobeStyles/AddContentDialogStyle';

const PLACEHOLDER_PROFILE = require('../../assets/images/partial-react-logo.png');

// Get screen dimensions for responsive layout
const { width } = Dimensions.get('window');
const numColumns = 2; // Using 2 columns for profile posts
const gap = 2;
const itemWidth = (width - gap * (numColumns + 1)) / numColumns;

type RouteParams = {
  username?: string;
};

export default function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Get username from route params (undefined for current user)
  const routeParams = route.params || {};
  const { username: usernameParam } = routeParams as RouteParams;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<any>(PLACEHOLDER_PROFILE);
  // Hardcoded background image
  const backgroundImage = require('../../assets/images/SplashScreen.jpg');
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentFocusedInput, setCurrentFocusedInput] = useState(null);
  const scrollViewRef = useRef(null);

  // User data state
  const [userData, setUserData] = useState<UserProfile>({
    username: '',
    bio: '',
    profilePictureUrl: null,
    favoriteBrands: '',
    stylePreferences: '',
    posts: [],
    followers: [],
    following: [],
    followersCount: 0,
    followingCount: 0,
    topPosts: [],
  });

  // State to track if this is the current user's profile
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  // State to track if the current user is following this profile
  const [isFollowing, setIsFollowing] = useState(false);

  // New states for edit profile modal
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editFavoriteBrands, setEditFavoriteBrands] = useState('');
  const [editStylePreferences, setEditStylePreferences] = useState('');
  const [showAllPosts, setShowAllPosts] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadUserProfile();

      // Subscribe to post updates when screen is focused
      const unsubscribe = navigation.addListener('focus', () => {
        loadUserProfile();
      });

      // Clean up the event listener
      return () => {
        unsubscribe();
      };
    }, [usernameParam]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadUserProfile().then(() => {
      setRefreshing(false);
    });
  }, [usernameParam]);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if user is authenticated
      const isAuth = await AuthService.isAuthenticated();
      if (!isAuth) {
        navigation.navigate('Login' as never);
        return;
      }

      let profileData: UserProfile;

      // If no username provided, get current user's profile
      if (!usernameParam) {
        profileData = await ProfileService.getMyProfile();
        setIsOwnProfile(true);
      } else {
        profileData = await ProfileService.getUserProfile(usernameParam);

        // Check if this is the current user's profile
        const currentUser = await AuthService.getUserData();
        setIsOwnProfile(currentUser?.username === usernameParam);

        // Check if following
        if (!isOwnProfile) {
          const followingStatus = await ProfileService.isFollowing(usernameParam);
          setIsFollowing(followingStatus);
        }
      }

      // Update state with profile data
      setUserData(profileData);

      // Set profile image if available
      if (profileData.profilePictureUrl) {
        setProfileImage({ uri: profileData.profilePictureUrl });
      } else {
        setProfileImage(PLACEHOLDER_PROFILE);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle long press on profile image
  const handleProfilePicLongPress = () => {
    longPressTimeout.current = setTimeout(() => {
      setModalVisible(true);
    }, 300); // 300ms long press
  };

  // Clear timeout if press is released before long press time
  const handlePressOut = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
  };

  // Handle profile image tap
  const handleProfilePicTap = () => {
    // Only allow editing on own profile
    if (isOwnProfile) {
      setEditModalVisible(true);
    } else {
      // For other profiles, just show the image in full screen
      setModalVisible(true);
    }
  };

  // Handle profile image selection from camera or gallery
  const pickImage = async useCamera => {
    try {
      // Request permissions first
      let permissionResult;

      if (useCamera) {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted) {
          // Launch camera
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
            exif: false,
            cameraType: ImagePicker.CameraType.front, // Specify front camera
          });

          console.log('Camera result:', result);

          if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedAsset = result.assets[0];
            // Now close the modal
            setEditModalVisible(false);

            // Set the profile image to the selected image
            setProfileImage({ uri: selectedAsset.uri });

            // Upload the image to your backend
            try {
              await ProfileService.updateProfilePicture(selectedAsset.uri);
              // Reload the profile to get updated data
              loadUserProfile();
            } catch (uploadError) {
              console.error('Error uploading image:', uploadError);
              Alert.alert('Upload Error', 'Failed to upload image. Please try again.');
            }
          }
        } else {
          Alert.alert('Permission needed', 'We need camera permissions to take a picture');
        }
      } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted) {
          // Launch image library
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });

          console.log('Gallery result:', result);

          if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedAsset = result.assets[0];
            // Now close the modal
            setEditModalVisible(false);

            // Set the profile image to the selected image
            setProfileImage({ uri: selectedAsset.uri });

            // Upload the image to your backend
            try {
              await ProfileService.updateProfilePicture(selectedAsset.uri);
              // Reload the profile to get updated data
              loadUserProfile();
            } catch (uploadError) {
              console.error('Error uploading image:', uploadError);
              Alert.alert('Upload Error', 'Failed to upload image. Please try again.');
            }
          }
        } else {
          Alert.alert('Permission needed', 'We need media library permissions to select a picture');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', `Failed to select image: ${error.message}`);
    }
  };

  // Function to handle following a user
  const handleFollowToggle = async () => {
    if (isOwnProfile || !userData.username) return; // Can't follow yourself

    try {
      const result = await ProfileService.toggleFollow(userData.username);
      setIsFollowing(result.isFollowing);

      // Refresh to get updated follower count
      loadUserProfile();
    } catch (error) {
      console.error('Error toggling follow:', error);
      Alert.alert('Error', 'Failed to update follow status. Please try again.');
    }
  };

  // Function to handle editing profile
  const handleEditProfile = () => {
    // Set initial values from current user data
    setEditBio(userData.bio || '');
    setEditFavoriteBrands(userData.favoriteBrands || '');
    setEditStylePreferences(userData.stylePreferences || '');
    setEditProfileModalVisible(true);
  };

  const scrollToInput = inputName => {
    let yOffset = 0;

    // Calculate different offset values based on which input is focused
    if (inputName === 'bio') {
      yOffset = 0; // Adjust these values based on your UI layout
    } else if (inputName === 'brands') {
      yOffset = 0;
    } else if (inputName === 'styles') {
      yOffset = 160;
    }

    // Use setTimeout to ensure the keyboard is fully shown before scrolling
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: yOffset, animated: true });
      }
    }, 100);
  };

  // Function to save profile changes
  const saveProfileChanges = async () => {
    try {
      const updatedProfile = await ProfileService.updateProfile({
        bio: editBio,
        favoriteBrands: editFavoriteBrands,
        stylePreferences: editStylePreferences,
      });

      // Update local state with the new values
      setUserData(updatedProfile);

      setEditProfileModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  // Function to toggle between top posts and all posts
  const togglePostsView = () => {
    setShowAllPosts(!showAllPosts);
  };

  // Function to handle post selection
  const handlePostPress = post => {
    const postId = post._id || post.id;

    if (postId) {
      // Navigate to post detail and pass a callback to refresh data when returning
      navigation.navigate('PostDetail' as any, {
        postId,
        onGoBack: () => loadUserProfile(),
      });
    } else {
      console.error('Post ID is missing');
      Alert.alert('Error', 'Unable to view post details');
    }
  };

  const renderPostItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={profileStyles.gridPostItem}
        onPress={() => handlePostPress(item)}
        activeOpacity={0.9}
      >
        <ExpoImage
          source={{ uri: item.imageUrl }}
          style={profileStyles.gridPostImage}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />
        <View style={profileStyles.postLikes}>
          <Ionicons name="heart" size={12} color={COLORS.light} />
          <Text style={profileStyles.postLikesText}>{item.likes || 0}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[profileStyles.container, profileStyles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[profileStyles.container, profileStyles.centerContent]}>
        <Text style={profileStyles.errorText}>{error}</Text>
        <TouchableOpacity style={profileStyles.retryButton} onPress={loadUserProfile}>
          <Text style={profileStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={profileStyles.container}>
      {/* Background Image - Now hardcoded */}
      <View style={profileStyles.headerContainer}>
        <Image source={backgroundImage} style={profileStyles.headerImage} />
      </View>

      {/* Navigation Buttons */}
      {/* Back button - Only show for other users' profiles */}
      {!isOwnProfile && (
        <TouchableOpacity style={profileStyles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      )}

      {/* Virtual Wardrobe Button - Show in a different position based on profile type */}
      <TouchableOpacity
        style={[
          profileStyles.topLeftButton,
          isOwnProfile ? profileStyles.ownProfileWardrobe : null,
        ]}
        onPress={() =>
          navigation.navigate('VirtualWardrobe' as never, { username: userData.username } as never)
        }
      >
        <Ionicons name="shirt-outline" size={24} color="white" />
      </TouchableOpacity>

      {/* Settings Button - Only for own profile */}
      {isOwnProfile && (
        <TouchableOpacity
          style={profileStyles.topRightButton}
          onPress={() => navigation.navigate('Settings' as never)}
        >
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
      )}

      {/* Scrollable Content */}
      <ScrollView
        style={profileStyles.scrollView}
        contentContainerStyle={profileStyles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.accent]}
            tintColor={COLORS.accent}
            title="Pull to refresh"
            titleColor={COLORS.accent}
          />
        }
      >
        {/* Profile Info Section */}
        <View style={profileStyles.profileInfoContainer}>
          {/* Social Stats Row with Profile Pic */}
          <View style={profileStyles.socialStatsRow}>
            {/* Followers */}
            <TouchableOpacity
              style={profileStyles.statContainer}
              onPress={() =>
                navigation.navigate(
                  'FollowersList' as never,
                  { username: userData.username } as never,
                )
              }
            >
              <Text style={profileStyles.statCount}>{userData.followersCount}</Text>
              <Text style={profileStyles.statLabel}>Followers</Text>
            </TouchableOpacity>

            {/* Profile Picture */}
            <TouchableOpacity
              onPress={isOwnProfile ? handleProfilePicTap : undefined}
              onLongPress={handleProfilePicLongPress}
              onPressOut={handlePressOut}
              activeOpacity={0.8}
            >
              <View style={profileStyles.profilePicContainer}>
                <Image source={profileImage} style={profileStyles.profilePic} />
              </View>
              {isOwnProfile && (
                <View style={profileStyles.editIconContainer}>
                  <Ionicons name="camera" size={18} color={COLORS.light} />
                </View>
              )}
            </TouchableOpacity>

            {/* Following */}
            <TouchableOpacity
              style={profileStyles.statContainer}
              onPress={() =>
                navigation.navigate(
                  'FollowingList' as never,
                  { username: userData.username } as never,
                )
              }
            >
              <Text style={profileStyles.statCount}>{userData.followingCount}</Text>
              <Text style={profileStyles.statLabel}>Following</Text>
            </TouchableOpacity>
          </View>

          <Text style={profileStyles.userName}>{userData.username}</Text>
          <Text style={profileStyles.userBio}>{userData.bio || 'No bio yet'}</Text>

          {/* Show edit profile button if own profile, otherwise show follow button */}
          {isOwnProfile ? (
            <TouchableOpacity style={profileStyles.followButton} onPress={handleEditProfile}>
              <Text style={profileStyles.followButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                profileStyles.followButton,
                isFollowing ? profileStyles.followingButton : null,
              ]}
              onPress={handleFollowToggle}
            >
              <Text style={profileStyles.followButtonText}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Favorite Brands Section - Modified for string field */}
        {userData.favoriteBrands && (
          <View style={profileStyles.contentSection}>
            <Text style={profileStyles.sectionTitle}>Favorite Brands</Text>
            <View style={profileStyles.tagsContainer}>
              {userData.favoriteBrands.split(',').map((brand, index) => {
                const trimmedBrand = brand.trim();
                if (trimmedBrand) {
                  return (
                    <View key={index} style={profileStyles.tag}>
                      <Text style={profileStyles.tagText}>{trimmedBrand}</Text>
                    </View>
                  );
                }
                return null;
              })}
            </View>
          </View>
        )}

        {/* Style Preferences Section - Modified for string field */}
        {userData.stylePreferences && (
          <View style={profileStyles.contentSection}>
            <Text style={profileStyles.sectionTitle}>Style Preferences</Text>
            <View style={profileStyles.tagsContainer}>
              {userData.stylePreferences.split(',').map((style, index) => {
                const trimmedStyle = style.trim();
                if (trimmedStyle) {
                  return (
                    <View key={index} style={profileStyles.tag}>
                      <Text style={profileStyles.tagText}>{trimmedStyle}</Text>
                    </View>
                  );
                }
                return null;
              })}
            </View>
          </View>
        )}

        {/* Posts Section - Using FlatList for grid layout */}
        <View style={[profileStyles.contentSection, { paddingHorizontal: 0 }]}>
          {/* Section header with optional toggle between top/all posts */}
          <View style={profileStyles.sectionHeader}>
            <Text style={profileStyles.sectionTitle}>Posts</Text>
            {userData.posts && userData.posts.length > 6 && (
              <TouchableOpacity onPress={togglePostsView}>
                <Text style={profileStyles.sectionToggle}>
                  {showAllPosts ? 'Show Top' : 'Show All'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Posts grid */}
          {userData.posts && userData.posts.length > 0 ? (
            <FlatList
              data={showAllPosts ? userData.posts : userData.posts.slice(0, 6)}
              renderItem={renderPostItem}
              keyExtractor={item => item._id}
              numColumns={numColumns}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              windowSize={5}
              initialNumToRender={8}
              updateCellsBatchingPeriod={30}
              contentContainerStyle={profileStyles.postsGrid}
            />
          ) : (
            <View style={profileStyles.emptyStateContainer}>
              <Ionicons name="images-outline" size={48} color="#555" />
              <Text style={profileStyles.emptyStateText}>No posts yet</Text>
              {isOwnProfile && (
                <TouchableOpacity
                  style={profileStyles.emptyStateButton}
                  onPress={() => navigation.navigate('Post')}
                >
                  <Text style={profileStyles.emptyStateButtonText}>Create Your First Post</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Full Screen Image Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={profileStyles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={profileStyles.centeredView}>
            <View style={profileStyles.modalView}>
              <Image
                source={profileImage}
                style={profileStyles.fullScreenImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={profileStyles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close-circle" size={32} color={COLORS.light} />
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Edit Profile Picture Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={PopUpStyles.modalContainer}>
          <View style={PopUpStyles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity
              style={PopUpStyles.closeButton}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={PopUpStyles.closeButtonText}>X</Text>
            </TouchableOpacity>

            <Text style={PopUpStyles.modalTitle}>Change Profile Picture</Text>

            <View style={PopUpStyles.optionsContainer}>
              <TouchableOpacity style={PopUpStyles.optionButton} onPress={() => pickImage(true)}>
                <Text style={PopUpStyles.buttonText}>Take a Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={PopUpStyles.optionButton} onPress={() => pickImage(false)}>
                <Text style={PopUpStyles.buttonText}>Choose from Library</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={editProfileModalVisible}
        onRequestClose={() => setEditProfileModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[PopUpStyles.modalContainer, { justifyContent: 'center' }]}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}
            >
              <View style={PopUpStyles.modalContent}>
                {/* Close Button */}
                <TouchableOpacity
                  style={PopUpStyles.closeButton}
                  onPress={() => setEditProfileModalVisible(false)}
                >
                  <Text style={PopUpStyles.closeButtonText}>X</Text>
                </TouchableOpacity>

                <Text style={PopUpStyles.modalTitle}>Edit Profile</Text>

                <ScrollView
                  ref={scrollViewRef}
                  showsVerticalScrollIndicator={true}
                  contentContainerStyle={{ width: '100%' }}
                  keyboardShouldPersistTaps="handled"
                >
                  {/* Bio Section */}
                  <Text style={PopUpStyles.categoryLabel}>Bio</Text>
                  <TextInput
                    style={PopUpStyles.input}
                    placeholder="Write something about yourself..."
                    placeholderTextColor="#B697c7"
                    value={editBio}
                    onChangeText={setEditBio}
                    multiline
                    maxLength={150}
                    onFocus={() => {
                      setCurrentFocusedInput('bio');
                      setTimeout(() => scrollToInput('bio'), 100);
                    }}
                    onBlur={() => setCurrentFocusedInput(null)}
                  />

                  {/* Favorite Brands Section */}
                  <Text style={PopUpStyles.categoryLabel}>Favorite Brands</Text>
                  <TextInput
                    style={PopUpStyles.input}
                    placeholder="Add your favorite brands (e.g. Nike, Adidas, Zara)"
                    placeholderTextColor="#B697c7"
                    value={editFavoriteBrands}
                    onChangeText={setEditFavoriteBrands}
                    multiline
                    onFocus={() => {
                      setCurrentFocusedInput('brands');
                      setTimeout(() => scrollToInput('brands'), 100);
                    }}
                    onBlur={() => setCurrentFocusedInput(null)}
                  />
                  <Text
                    style={{
                      alignSelf: 'flex-start',
                      marginLeft: '5%',
                      fontSize: 12,
                      marginBottom: 10,
                      fontStyle: 'italic',
                      color: '#B697c7',
                    }}
                  >
                    Separate multiple brands with commas
                  </Text>

                  {/* Style Preferences Section */}
                  <Text style={PopUpStyles.categoryLabel}>Style Preferences</Text>
                  <TextInput
                    style={PopUpStyles.input}
                    placeholder="Add your style preferences (e.g. Casual, Streetwear, Vintage)"
                    placeholderTextColor="#B697c7"
                    value={editStylePreferences}
                    onChangeText={setEditStylePreferences}
                    multiline
                    onFocus={() => {
                      setCurrentFocusedInput('styles');
                      setTimeout(() => scrollToInput('styles'), 100);
                    }}
                    onBlur={() => setCurrentFocusedInput(null)}
                  />
                  <Text
                    style={{
                      alignSelf: 'flex-start',
                      marginLeft: '5%',
                      fontSize: 12,
                      marginBottom: 10,
                      fontStyle: 'italic',
                      color: '#B697c7',
                    }}
                  >
                    Separate multiple styles with commas
                  </Text>

                  {/* Action Buttons */}
                  <View style={PopUpStyles.actionButtonsContainer}>
                    <TouchableOpacity
                      style={PopUpStyles.removeButton}
                      onPress={() => setEditProfileModalVisible(false)}
                    >
                      <Text style={PopUpStyles.buttonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={PopUpStyles.confirmButton}
                      onPress={saveProfileChanges}
                    >
                      <Text style={PopUpStyles.buttonText}>Save Changes</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
