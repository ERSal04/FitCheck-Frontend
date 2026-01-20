// src/screens/HomeScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AuthService from '../services/AuthService';
import { API_URL } from '../lib/constants';

// Get screen dimensions for responsive layout
const { width } = Dimensions.get('window');

// Star rating component
const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const Star = ({ filled, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.3,
        useNativeDriver: true,
        friction: 3,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 3,
      }),
    ]).start();
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.starButton}>
      <AnimatedIcon
        name={filled ? 'star' : 'star-outline'}
        size={26}
        color="#FF8C05"
        style={{ transform: [{ scale }] }}
      />
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const [dailyPosts, setDailyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const [userRated, setUserRated] = useState({});
  const [error, setError] = useState(null);

  const formatTimestamp = timestamp => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    }
  };

  const fetchDailyPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await AuthService.getToken();

      if (!token) {
        navigation.navigate('Login');
        return;
      }

      const response = await axios.get(`${API_URL}/daily-posts`, {
        headers: { Authorization: token },
      });

      if (response.data && response.data.data) {
        const formattedPosts = await Promise.all(
          response.data.data.map(async post => {
            let username = 'Unknown User';
            let userAvatar = 'https://via.placeholder.com/40';

            if (post.userId && typeof post.userId === 'object') {
              username = post.userId.username || username;
              userAvatar = post.userId.profilePictureUrl || userAvatar;
            }

            if (post.userRating) {
              setRatings(prev => ({ ...prev, [post._id]: post.userRating }));
              setUserRated(prev => ({ ...prev, [post._id]: true }));
            }

            return {
              id: post._id,
              user: username,
              image: post.imageUrl,
              timestamp: formatTimestamp(post.timestamp || post.createdAt),
              caption: post.caption || '',
              userAvatar,
              averageRating: post.averageRating || 0,
              totalRatings: post.totalRatings || 0,
            };
          }),
        );

        setDailyPosts(formattedPosts);
      } else {
        setError('Failed to load posts. Try again later.');
      }
    } catch (err) {
      console.error('Error fetching daily posts:', err);
      setError('Failed to load posts. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (postId, rating) => {
    try {
      const token = await AuthService.getToken();
      if (!token) {
        navigation.navigate('Login');
        return;
      }

      const currentRating = ratings[postId];
      const isSameRating = currentRating === rating;

      const ratingToSend = isSameRating ? 0 : rating;

      const response = await axios.post(
        `${API_URL}/daily-posts/${postId}/rate`,
        { rating: ratingToSend },
        { headers: { Authorization: token } },
      );

      if (isSameRating) {
        setRatings(prev => {
          const newRatings = { ...prev };
          delete newRatings[postId];
          return newRatings;
        });
        setUserRated(prev => {
          const newUserRated = { ...prev };
          delete newUserRated[postId];
          return newUserRated;
        });
      } else {
        setRatings(prev => ({ ...prev, [postId]: rating }));
        setUserRated(prev => ({ ...prev, [postId]: true }));
      }

      setDailyPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                averageRating: parseFloat(response.data.averageRating),
                totalRatings: response.data.totalRatings,
              }
            : post,
        ),
      );
    } catch (err) {
      console.error('Error submitting rating:', err);
      Alert.alert('Error', 'Failed to submit rating. Please try again.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchDailyPosts();
    }, []),
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>FITCHECK</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('VirtualWardrobe')}
          >
            <Ionicons name="shirt-outline" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={26} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Messages')}
          >
            <Ionicons name="chatbubble-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>Daily Fits</Text>
        <Text style={styles.sectionSubtitle}>Last 24 hours</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          loading && !dailyPosts.length ? { flex: 1, justifyContent: 'center' } : null
        }
        refreshControl={
    <RefreshControl
      refreshing={loading}
      onRefresh={fetchDailyPosts}
      tintColor="#FF8C05"
      colors={['#FF8C05']}
    />
  }
      >
        {loading && !dailyPosts.length ? (
          <ActivityIndicator size="large" color="#FF8C05" />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchDailyPosts}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : dailyPosts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="images-outline" size={64} color="#444" />
            <Text style={styles.emptyText}>No daily fits yet</Text>
            <Text style={styles.emptySubtext}>Be the first to post your outfit today!</Text>
          </View>
        ) : (
          dailyPosts.map(post => (
            <View key={post.id} style={styles.postContainer}>
              <TouchableOpacity
                style={styles.userInfoContainer}
                onPress={() => navigation.navigate('Profile', { username: post.user })}
              >
                <Image source={{ uri: post.userAvatar }} style={styles.userAvatar} />
                <View style={styles.userTextContainer}>
                  <Text style={styles.username}>{post.user}</Text>
                  <Text style={styles.timestamp}>{post.timestamp}</Text>
                </View>
              </TouchableOpacity>

              <Image source={{ uri: post.image }} style={styles.postImage} />
              <Text style={styles.caption}>{post.caption}</Text>

              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={`${post.id}-star-${star}`}
                      filled={star <= (ratings[post.id] ?? post.userRating ?? 0)}
                      onPress={() => handleRating(post.id, star)}
                    />
                  ))}
                  <Text style={styles.averageText}>
                    {post.averageRating.toFixed(1)} / 5 ({post.totalRatings}{' '}
                    {post.totalRatings === 1 ? 'rating' : 'ratings'})
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />
            </View>
          ))
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      <TouchableOpacity style={styles.cameraButton} onPress={() => navigation.navigate('Camera')}>
        <Ionicons name="camera" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 20,
    padding: 4,
  },
  sectionTitleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#AAAAAA',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  postContainer: {
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userTextContainer: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 2,
  },
  postImage: {
    width: '100%',
    height: width * 1.3,
    borderRadius: 8,
    marginBottom: 12,
  },
  caption: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  ratingContainer: {
    marginTop: 4,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 6,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starButton: {
    marginRight: 8,
  },
  averageText: {
    fontSize: 14,
    color: '#FF8C05',
    marginLeft: 10,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  divider: {
    height: 1,
    backgroundColor: '#222222',
    marginTop: 16,
    marginBottom: 8,
  },
  bottomPadding: {
    height: 100,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF8C05',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#FF8C05',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  errorText: {
    color: '#FF8C05',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF8C05',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 10,
  },
});
