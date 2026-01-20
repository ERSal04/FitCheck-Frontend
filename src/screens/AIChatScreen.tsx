import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Switch,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Make sure axios is installed
import AsyncStorage from '@react-native-async-storage/async-storage'; // For token storage
import { API_URL } from '../lib/constants';
import AuthService from '../services/AuthService';

const { width, height } = Dimensions.get('window');

const AIChatScreen = () => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "👗 Hello! I'm your fashion assistant. Ask me about styling, trends, or outfit ideas from your wardrobe!",
      sender: 'AI',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useWardrobe, setUseWardrobe] = useState(true);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'User',
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      setIsLoading(true);

      // Get token using your AuthService
      const token = await AuthService.getToken();

      if (!token) {
        Alert.alert('Please log in', 'You need to be logged in to use the fashion assistant.');
        navigation.navigate('Login');
        return;
      }

      // Make API call to backend
      const response = await axios.post(
        `${API_URL}/api/fashion-chat`,
        { message: input, useWardrobe },
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        },
      );

      // Add AI response with the structured data
      const aiMessage = {
        id: Date.now().toString() + '-ai',
        text: response.data.text,
        sender: 'AI',
        outfits: response.data.outfits || [],
        wardrobeItems: response.data.wardrobeItems || [],
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = {
        id: Date.now().toString() + '-error',
        text: '🚫 Connection error. Please check your internet and try again.',
        sender: 'AI',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Find wardrobe item by ID
  const findItemById = (itemId, wardrobeItems) => {
    return wardrobeItems.find(item => item.itemId === itemId);
  };

  // Render a single outfit
  const renderOutfit = (outfit, wardrobeItems) => {
    return (
      <View style={styles.outfitContainer}>
        <Text style={styles.outfitTitle}>{outfit.name}</Text>
        <Text style={styles.outfitDescription}>{outfit.description}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.itemsScroll}>
          {outfit.items.map((itemId, index) => {
            const item = findItemById(itemId, wardrobeItems);

            if (!item) return null;

            return (
              <View key={index} style={styles.itemContainer}>
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.itemImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.itemImage, styles.noImagePlaceholder]}>
                    <Ionicons name="shirt-outline" size={40} color="#555" />
                  </View>
                )}
                <Text style={styles.itemCategory}>{item.category}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  // If no outfits, show all wardrobe items
  const renderWardrobeItems = wardrobeItems => {
    return (
      <View style={styles.wardrobeItemsContainer}>
        <Text style={styles.wardrobeTitle}>Items from your wardrobe:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.itemsScroll}>
          {wardrobeItems.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.itemImage, styles.noImagePlaceholder]}>
                  <Ionicons name="shirt-outline" size={40} color="#555" />
                </View>
              )}
              <Text style={styles.itemCategory}>{item.category}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fashion Assistant</Text>
        <View style={styles.headerIcons} />
      </View>

      {/* Mode Toggle */}
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Use my wardrobe for recommendations</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#7A5C8D' }}
          thumbColor={useWardrobe ? '#FFFFFF' : '#f4f3f4'}
          onValueChange={setUseWardrobe}
          value={useWardrobe}
        />
      </View>

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.scrollView}
        renderItem={({ item }) => (
          <View
            style={[
              styles.postContainer,
              item.sender === 'User' ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <View style={styles.userInfoContainer}>
              <View style={styles.userAvatar}>
                <Ionicons
                  name={item.sender === 'User' ? 'person' : 'sparkles'}
                  size={32}
                  color={item.sender === 'User' ? '#FF8C05' : '#7A5C8D'}
                />
              </View>
              <Text style={styles.username}>{item.sender === 'User' ? 'You' : 'Fashion AI'}</Text>
            </View>

            <Text style={styles.caption}>{item.text}</Text>

            {/* Show outfits if available */}
            {item.outfits && item.outfits.length > 0 && item.wardrobeItems && (
              <View style={styles.outfitsContainer}>
                {item.outfits.map((outfit, index) => (
                  <View key={index}>{renderOutfit(outfit, item.wardrobeItems)}</View>
                ))}
              </View>
            )}

            {/* If no outfits but wardrobeItems exist, show all items */}
            {(!item.outfits || item.outfits.length === 0) &&
              item.wardrobeItems &&
              item.wardrobeItems.length > 0 &&
              renderWardrobeItems(item.wardrobeItems)}

            {item.sender === 'AI' && isLoading && (
              <ActivityIndicator size="small" color="#7A5C8D" style={styles.loading} />
            )}
          </View>
        )}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={<View style={{ height: 20 }} />}
      />

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask about fashion..."
          placeholderTextColor="#AAAAAA"
          value={input}
          onChangeText={setInput}
          multiline
          editable={!isLoading}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton} disabled={isLoading}>
          <Ionicons name="send" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  toggleLabel: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  postContainer: {
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#111111',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222222',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  caption: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    marginBottom: 16,
  },
  outfitsContainer: {
    marginTop: 8,
  },
  outfitContainer: {
    marginBottom: 16,
    backgroundColor: '#222222',
    borderRadius: 8,
    padding: 12,
  },
  outfitTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  outfitDescription: {
    color: '#DDDDDD',
    fontSize: 14,
    marginBottom: 12,
  },
  itemsScroll: {
    marginBottom: 8,
  },
  itemContainer: {
    marginRight: 12,
    width: 120,
    alignItems: 'center',
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#333333',
    marginBottom: 4,
  },
  itemCategory: {
    color: '#FFFFFF',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  noImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wardrobeItemsContainer: {
    marginTop: 12,
    backgroundColor: '#222222',
    borderRadius: 8,
    padding: 12,
  },
  wardrobeTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    padding: 12,
    margin: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#222222',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 14,
    color: '#FFFFFF',
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#FF8C05',
    padding: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  userMessage: {
    borderColor: '#FF8C05',
    borderWidth: 1,
  },
  aiMessage: {
    borderColor: '#7A5C8D',
    borderWidth: 1,
  },
  loading: {
    marginTop: 8,
  },
});

export default AIChatScreen;
