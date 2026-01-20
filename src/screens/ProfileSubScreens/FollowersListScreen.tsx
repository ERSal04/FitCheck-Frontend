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

export default function FollowersListScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { username } = route.params || {};

  const [isLoading, setIsLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadFollowers();
    }, [username]),
  );

  const loadFollowers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!username) {
        throw new Error('Username is required');
      }

      const followersData = await ProfileService.getFollowers(username);
      setFollowers(followersData);
    } catch (err) {
      console.error('Error loading followers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load followers');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadFollowers();
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
        style={[followStyles.followButton, item.isFollowing && followStyles.followingButton]}
        onPress={() => handleFollowToggle(item.username, item.isFollowing)}
      >
        <Text style={followStyles.followButtonText}>
          {item.isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const handleFollowToggle = async (userToFollow, currentlyFollowing) => {
    try {
      const result = await ProfileService.toggleFollow(userToFollow);

      // Update the list to reflect the new follow status
      setFollowers(
        followers.map(follower =>
          follower.username === userToFollow
            ? { ...follower, isFollowing: result.isFollowing }
            : follower,
        ),
      );
    } catch (error) {
      console.error('Error toggling follow:', error);
      Alert.alert('Error', 'Failed to update follow status. Please try again.');
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
        <Text style={followStyles.headerTitle}>{username}'s Followers</Text>
        <View style={followStyles.placeholder} />
      </View>

      {error ? (
        <View style={followStyles.errorContainer}>
          <Text style={followStyles.errorText}>{error}</Text>
          <TouchableOpacity style={followStyles.retryButton} onPress={loadFollowers}>
            <Text style={followStyles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : followers.length === 0 ? (
        <View style={followStyles.emptyContainer}>
          <Ionicons name="people-outline" size={50} color="#888" />
          <Text style={followStyles.emptyText}>No followers yet</Text>
        </View>
      ) : (
        <FlatList
          data={followers}
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
