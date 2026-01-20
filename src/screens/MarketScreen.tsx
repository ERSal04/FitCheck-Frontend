// src/screens/MarketScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Modal,
  TextInput,
  FlatList,
  Button,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';

type Post = {
  id: string;
  aspectRatio: number;
  product: string;
  image: string;
  width: number;
  height: number;
  resizeMode: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  price?: number;
  description?: string;
};

const posts: Post[] = [
  {
    id: '1',
    aspectRatio: 1,
    product: 'Blue Sweater',
    price: 50,
    description: 'Soft cotton sweater in ocean blue',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQFzjjQSoj1ZU5l1g8Jhd1zPCuIZYMmnSz0A&s',
    width: 300,
    height: 300,
    resizeMode: 'cover',
  },
  {
    id: '2',
    aspectRatio: 1,
    product: 'White Shirt',
    price: 20,
    description: 'White shirt with fun decal',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiD0lqXl-pV6PAZFFzNdOOfqzBs2IDmNVWJg&s',
    width: 300,
    height: 300,
    resizeMode: 'cover',
  },
  {
    id: '3',
    aspectRatio: 1,
    product: 'Baggy Jeans',
    price: 45,
    description: 'Dark wash baggy jeans',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJaYsXzYUAyHAAyBGEcQOs3wIkJkG1VwebMA&s',
    width: 300,
    height: 300,
    resizeMode: 'cover',
  },
  {
    id: '4',
    aspectRatio: 1,
    product: 'Tech Jacket',
    price: 100,
    description: 'Black tech jacket with white accents',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDMtQkbzE_ohsVDtwyvQPjZ28S4PfAJQHiJg&s',
    width: 300,
    height: 300,
    resizeMode: 'cover',
  },
  {
    id: '5',
    aspectRatio: 1,
    product: 'Bomber Jacket',
    price: 25,
    description: 'Blue and white bomber jacket',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT83USBWvSf2WtCcjJyXAGbowG2TmPyoDmRkw&s',
    width: 300,
    height: 300,
    resizeMode: 'cover',
  },
  {
    id: '6',
    aspectRatio: 1,
    product: 'Baggy Jorts',
    price: 15,
    description: 'Destressed jorts',
    image:
      'data:image/jpeg;base64,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',
    width: 300,
    height: 300,
    resizeMode: 'cover',
  },
  {
    id: '7',
    aspectRatio: 1,
    product: 'Red Baggy Shirt',
    price: 10,
    description: 'Y2K style red shirt',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOoYPATO9z2-kXv-g4XpdZMweWGifM1BVkvw&s',
    width: 300,
    height: 300,
    resizeMode: 'cover',
  },
  {
    id: '8',
    aspectRatio: 1,
    product: 'Stlyed Jeans',
    price: 75,
    description: 'Jeans with a Jason Mask decal',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0szASNOUk600AQZuyHZfn2NZ35fEBOBBhUA&s',
    width: 300,
    height: 300,
    resizeMode: 'cover',
  },
];

type FilterModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  priceRange: { min: number; max: number };
  setPriceRange: (range: { min: number; max: number }) => void;
};

const FilterModal = ({
  visible,
  onClose,
  onApply,
  categories,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
}: FilterModalProps) => (
  <Modal visible={visible} animationType="fade" transparent>
    <View style={styles.modalBackdrop}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Filters</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#4C3A3A" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoryContainer}>
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategoryButton,
                ]}
                onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.selectedCategoryText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Range</Text>
          <View style={styles.priceRangeContainer}>
            <Text style={styles.priceText}>
              ${priceRange.min} - ${priceRange.max}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1000}
              step={10}
              value={priceRange.max}
              onValueChange={value => setPriceRange({ ...priceRange, max: value })}
              minimumTrackTintColor="#FF8C05"
              maximumTrackTintColor="#EEE"
              thumbTintColor="#FF8C05"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setSelectedCategory(null);
              setPriceRange({ min: 0, max: 1000 });
            }}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={onApply}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const categories = ['Sweaters', 'Shirts', 'Jeans', 'Jackets', 'Bags'];

export default function MarketScreen() {
  const navigation = useNavigation();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [tempPriceRange, setTempPriceRange] = useState(priceRange);
  const [tempCategory, setTempCategory] = useState(selectedCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const scaleValue = useRef(new Animated.Value(0)).current;

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = tempCategory
      ? post.product.toLowerCase().includes(tempCategory.toLowerCase())
      : true;
    const matchesPrice =
      post.price !== undefined &&
      post.price >= tempPriceRange.min &&
      post.price <= tempPriceRange.max;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  function renderItem({ item }: { item: Post }) {
    return (
      <TouchableOpacity
        style={styles.postContainer}
        onPress={() => {
          setSelectedPost(item);
          Animated.spring(scaleValue, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
          }).start();
        }}
      >
        <Image source={{ uri: item.image }} style={styles.postImage} />
        <Text style={styles.product}>{item.product}</Text>
        <Text style={styles.price}>${item.price?.toFixed(2)}</Text>
      </TouchableOpacity>
    );
  }

  function closeDetail() {
    Animated.spring(scaleValue, {
      toValue: 0,
      friction: 5,
      useNativeDriver: true,
    }).start(() => {
      setSelectedPost(null);
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>FITCHECK</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditMarket')}
        >
          <Ionicons name="create" size={24} color="#4C3A3A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
          <Ionicons name="options" size={24} color="#4C3A3A" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={() => {
          setPriceRange(tempPriceRange);
          setSelectedCategory(tempCategory);
          setShowFilterModal(false);
        }}
        categories={categories}
        selectedCategory={tempCategory}
        setSelectedCategory={setTempCategory}
        priceRange={tempPriceRange}
        setPriceRange={setTempPriceRange}
      />

      <FlatList
        data={filteredPosts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
      />

      <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Cart')}>
        <Ionicons name="cart" size={28} color="white" />
      </TouchableOpacity>

      {selectedPost && (
        <Animated.View style={[styles.detailModal, { transform: [{ scale: scaleValue }] }]}>
          <Image source={{ uri: selectedPost.image }} style={styles.detailImage} />
          <Text style={styles.detailTitle}>{selectedPost.product}</Text>
          <Text style={styles.detailDescription}>{selectedPost.description}</Text>
          <Text style={styles.detailPrice}>${selectedPost.price?.toFixed(2)}</Text>
          <Button
            title="Add to Cart"
            onPress={() => {
              /* Add to cart logic */
            }}
          />
          <TouchableOpacity style={styles.closeDetailButton} onPress={closeDetail}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  editButton: {
    marginRight: -200,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4C3A3A',
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#4C3A3A',
    fontSize: 16,
  },
  gridContainer: {
    paddingHorizontal: 8,
  },
  postContainer: {
    flex: 1,
    margin: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    elevation: 2,
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  product: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4C3A3A',
    padding: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF8C05',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  cartButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#FF8C05',
    padding: 16,
    borderRadius: 30,
    elevation: 5,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4C3A3A',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4C3A3A',
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEE',
    backgroundColor: '#FFF',
  },
  selectedCategoryButton: {
    backgroundColor: '#FF8C05',
    borderColor: '#FF8C05',
  },
  categoryText: {
    color: '#666',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: '500',
  },
  priceRangeContainer: {
    marginTop: 8,
  },
  priceText: {
    color: '#4C3A3A',
    fontSize: 16,
    marginBottom: 16,
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#FF8C05',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#EEE',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  detailModal: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    right: '5%',
    backgroundColor: 'white',
    padding: 20,
    elevation: 5,
  },
  detailImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginBottom: 10,
    borderRadius: 12,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4C3A3A',
  },
  detailDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  detailPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF8C05',
    marginBottom: 16,
  },
  closeDetailButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
  },
});
