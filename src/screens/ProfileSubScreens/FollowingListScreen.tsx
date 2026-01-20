import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Image as ExpoImage } from 'expo-image';
import ProfileService from '../../services/ProfileService';
import COLORS from '../../types/styles/colorConstants';
import { followStyles } from '../../types/styles/FollowStyles/followStyles';

const PLACEHOLDER_PROFILE = require('../../../assets/images/partial-react-logo.png');

export default function FollowingListScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { username } = route.params || {};

  const [isLoading, setIsLoading] = useState(true);
  const [following, setFollowing] = useState([]);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadFollowing();
    }, [username]),
  );

  const loadFollowing = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!username) {
        throw new Error('Username is required');
      }

      const followingData = await ProfileService.getFollowing(username);
      setFollowing(followingData);
    } catch (err) {
      console.error('Error loading following list:', err);
      setError(err instanceof Error ? err.message : 'Failed to load following list');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadFollowing();
  };

  const handleUserPress = selectedUsername => {
    // Navigate to the profile screen for the selected user
    navigation.navigate('Profile', { username: selectedUsername });
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={followStyles.userItem}
      onPress={() => handleUserPress(item.username)}
      activeOpacity={0.7}
    >
      <ExpoImage
        source={item.profilePictureUrl ? { uri: item.profilePictureUrl } : PLACEHOLDER_PROFILE}
        style={followStyles.userAvatar}
        contentFit="cover"
        transition={200}
      />
      <View style={followStyles.userInfo}>
        <Text style={followStyles.username}>{item.username}</Text>
      </View>
      <TouchableOpacity
        style={[
          followStyles.followButton,
          { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.accent },
        ]}
        onPress={() => handleUnfollow(item.username)}
      >
        <Text style={followStyles.followButtonText}>Following</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const handleUnfollow = async userToUnfollow => {
    try {
      // Confirm before unfollowing
      Alert.alert('Unfollow User', `Are you sure you want to unfollow ${userToUnfollow}?`, [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Unfollow',
          onPress: async () => {
            const result = await ProfileService.toggleFollow(userToUnfollow);
            if (!result.isFollowing) {
              // Remove the unfollowed user from the list
              setFollowing(following.filter(user => user.username !== userToUnfollow));
            }
          },
        },
      ]);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      Alert.alert('Error', 'Failed to unfollow user. Please try again.');
    }
  };

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={followStyles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={followStyles.container}>
      <View style={followStyles.header}>
        <TouchableOpacity style={followStyles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.light} />
        </TouchableOpacity>
        <Text style={followStyles.headerTitle}>{username}'s Following</Text>
        <View style={followStyles.placeholder} />
      </View>

      {error ? (
        <View style={followStyles.errorContainer}>
          <Text style={followStyles.errorText}>{error}</Text>
          <TouchableOpacity style={followStyles.retryButton} onPress={loadFollowing}>
            <Text style={followStyles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : following.length === 0 ? (
        <View style={followStyles.emptyContainer}>
          <Ionicons name="people-outline" size={50} color="#888" />
          <Text style={followStyles.emptyText}>Not following anyone yet</Text>
        </View>
      ) : (
        <FlatList
          data={following}
          renderItem={renderUserItem}
          keyExtractor={item => item.username}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={followStyles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </SafeAreaView>
  );
}
