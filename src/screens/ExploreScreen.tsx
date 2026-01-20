import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ExploreService from '../services/ExploreService';
import { Image as ExpoImage } from 'expo-image';
import COLORS from '../types/styles/colorConstants';

// Get screen dimensions for responsive layout
const { width } = Dimensions.get('window');
const numColumns = 2;
const gap = 2;
const itemWidth = (width - gap * (numColumns + 1)) / numColumns;

// Popular categories for horizontal scrolling section
const categories = [
  { id: '1', name: 'Trending' },
  { id: '2', name: 'Streetwear' },
  { id: '3', name: 'Vintage' },
  { id: '4', name: 'Minimal' },
  { id: '5', name: 'Casual' },
  { id: '6', name: 'Formal' },
  { id: '7', name: 'Athleisure' },
  { id: '8', name: 'Y2K' },
];

const ExploreScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('Trending');
  const [explorePosts, setExplorePosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const pageSize = 10;

  // Function to fetch explore posts
  const fetchPosts = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setIsLoading(true);
      } else if (pageNum > 1) {
        setIsLoadingMore(true);
      }

      const response = await ExploreService.fetchExplorePosts(
        { page: pageNum, limit: pageSize },
        { category: selectedCategory },
      );

      // The backend returns { posts: [...] }
      const posts = response.posts || [];

      // If we got fewer items than requested, there's no more data
      if (posts.length < pageSize) {
        setHasMoreData(false);
      } else {
        setHasMoreData(true);
      }

      if (refresh || pageNum === 1) {
        setExplorePosts(posts);
      } else {
        setExplorePosts(prevPosts => [...prevPosts, ...posts]);
      }

      setPage(pageNum);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Initial fetch posts when component mounts
  useEffect(() => {
    fetchPosts(1, true);
  }, []);

  // Fetch posts when category changes
  useEffect(() => {
    fetchPosts(1, true);
  }, [selectedCategory]);

  const handlePostPress = post => {
    // Extract the post ID
    const postId = post._id || post.id;

    if (postId) {
      // Navigate to PostDetail with only the postId
      navigation.navigate('PostDetail', { postId });
    } else {
      console.error('Post ID missing');
      // Optionally show an alert or toast message
    }
  };

  // Load more posts when reaching the end of the list
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMoreData) {
      fetchPosts(page + 1);
    }
  };

  // Pull to refresh
  const handleRefresh = () => {
    if (!isLoading) {
      fetchPosts(1, true);
    }
  };

  // Render each post item in grid
  const renderPostItem = ({ item }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => handlePostPress(item)}
      activeOpacity={0.9}
    >
      <ExpoImage
        source={{ uri: item.imageUrl }}
        style={styles.postImage}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
    </TouchableOpacity>
  );

  // Render category item
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryItem, selectedCategory === item.name && styles.categoryItemActive]}
      onPress={() => setSelectedCategory(item.name)}
    >
      <Text
        style={[styles.categoryText, selectedCategory === item.name && styles.categoryTextActive]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Render loading footer when loading more posts
  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.accent || '#FF8C05'} />
      </View>
    );
  };

  // Render error message
  const renderError = () => (
    <View style={styles.centeredContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => fetchPosts(1, true)}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  // Render loading state
  const renderLoading = () => (
    <View style={styles.centeredContainer}>
      <ActivityIndicator size="large" color={COLORS.accent || '#FF8C05'} />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search outfits, users, or styles"
          placeholderTextColor="#999"
        />
      </View>

      {/* Categories horizontal scroll */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Posts grid or loading/error state */}
      {isLoading && page === 1 ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : (
        <FlatList
          data={explorePosts}
          renderItem={renderPostItem}
          keyExtractor={item => item._id || item.id}
          numColumns={numColumns}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.postsList}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={isLoading && page === 1}
          onRefresh={handleRefresh}
          ListFooterComponent={renderFooter}
          // Performance optimizations
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={12}
          updateCellsBatchingPeriod={30}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: COLORS.accent || '#FF8C05',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchBar: {
    backgroundColor: '#222',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 40,
    justifyContent: 'center',
    marginHorizontal: 15,
    marginVertical: 10,
  },
  searchInput: {
    color: '#fff',
    fontSize: 14,
  },
  categoriesContainer: {
    paddingVertical: 10,
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#222',
    marginRight: 10,
  },
  categoryItemActive: {
    backgroundColor: COLORS.accent || '#FF8C05',
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
  },
  categoryTextActive: {
    fontWeight: 'bold',
    color: '#fff',
  },
  postsList: {
    paddingHorizontal: gap / 2,
    paddingTop: 10,
  },
  postItem: {
    width: itemWidth,
    height: itemWidth * 1.2,
    margin: gap / 2,
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default ExploreScreen;
