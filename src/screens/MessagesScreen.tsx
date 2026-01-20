// src/screens/MessagesScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Sample conversation data
const conversations = [
  {
    id: '1',
    user: 'ashley_123',
    avatar: 'https://i.pinimg.com/736x/50/76/09/50760941c7334e3a698b998e66bbff52.jpg',
    lastMessage: 'Love that new fit! Where did you get those pants?',
    time: '2m ago',
    unread: true,
  },
  {
    id: '2',
    user: 'vanessa290',
    avatar: 'https://i.pinimg.com/736x/8c/d2/9c/8cd29cf09d750f664b3dfaded76ade25.jpg',
    lastMessage: 'Would you be interested in selling that jacket?',
    time: '15m ago',
    unread: false,
  },
  {
    id: '3',
    user: 'joey_g_123',
    avatar:
      'https://video-images.vice.com/_uncategorized/1504333177201-people-in-their-pulling-outfits-body-image-1472659906.jpeg',
    lastMessage: 'Thanks for the style tips! I tried what you suggested.',
    time: '1h ago',
    unread: false,
  },
  {
    id: '4',
    user: 'peter_1828',
    avatar:
      'https://cdn.shopify.com/s/files/1/1147/7882/files/streetwear-outfit-gray-hoodie_large.png?v=1577115289',
    lastMessage: 'Got those sneakers we talked about yesterday!',
    time: '3h ago',
    unread: true,
  },
  {
    id: '5',
    user: 'chloe293',
    avatar:
      'https://japan-clothing.com/cdn/shop/products/Robe-Japonaise-Longue--Dento-Teki--Japanstreet-1654951398.jpg?v=1655036417&width=1920',
    lastMessage: 'Do you have any vintage recommendations?',
    time: '5h ago',
    unread: false,
  },
  {
    id: '6',
    user: 'lebron',
    avatar:
      'https://www.usmagazine.com/wp-content/uploads/2018/06/lebron-james.jpg?w=1000&quality=40&strip=all',
    lastMessage: 'Check out my game day outfit 🏀',
    time: '7h ago',
    unread: false,
  },
  {
    id: '7',
    user: 'vintage_vault',
    avatar: 'https://i.pinimg.com/550x/2c/9a/c8/2c9ac8b9c90e21d9a3dfa01ab5be738a.jpg',
    lastMessage: 'Would love to collaborate on a thrift haul!',
    time: 'Yesterday',
    unread: false,
  },
];

export default function MessagesScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  // Render each conversation item
  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => navigation.navigate('Conversation', { user: item.user })}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />

      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text style={styles.username}>{item.user}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>

        <View style={styles.messageRow}>
          <Text
            style={[styles.messagePreview, item.unread && styles.unreadMessage]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>

          {item.unread && <View style={styles.unreadIndicator} />}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Messages</Text>

        <TouchableOpacity style={styles.newMessageButton}>
          <Ionicons name="create-outline" size={24} color="#FF8C05" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Conversations List */}
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.conversationsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 0 : 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  newMessageButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 12,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#FFF',
    fontSize: 14,
  },
  conversationsList: {
    paddingHorizontal: 15,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },
  conversationInfo: {
    flex: 1,
    marginLeft: 15,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  timeText: {
    fontSize: 12,
    color: '#888',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messagePreview: {
    fontSize: 14,
    color: '#AAA',
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    color: '#FFF',
    fontWeight: '500',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF8C05',
  },
});
