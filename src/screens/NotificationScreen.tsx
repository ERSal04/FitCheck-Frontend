import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Dummy notification data (6 different types) - using usernames and avatars from the explore page
const notifications = [
  {
    id: '1',
    type: 'like',
    username: 'ashley_123',
    userAvatar: 'https://i.pinimg.com/736x/50/76/09/50760941c7334e3a698b998e66bbff52.jpg',
    content: 'liked your outfit post',
    time: '2m ago',
    postImage: 'https://i.pinimg.com/736x/8c/d2/9c/8cd29cf09d750f664b3dfaded76ade25.jpg',
    isNew: true,
  },
  {
    id: '2',
    type: 'follow',
    username: 'peter_1828',
    userAvatar:
      'https://cdn.shopify.com/s/files/1/1147/7882/files/streetwear-outfit-gray-hoodie_large.png?v=1577115289',
    content: 'started following you',
    time: '15m ago',
    isNew: true,
  },
  {
    id: '3',
    type: 'comment',
    username: 'chloe293',
    userAvatar:
      'https://japan-clothing.com/cdn/shop/products/Robe-Japonaise-Longue--Dento-Teki--Japanstreet-1654951398.jpg?v=1655036417&width=1920',
    content: 'commented: "This outfit is fire! 🔥 Where did you get those shoes?"',
    time: '1h ago',
    postImage: 'https://i.pinimg.com/736x/50/76/09/50760941c7334e3a698b998e66bbff52.jpg',
    isNew: true,
  },
  {
    id: '4',
    type: 'mention',
    username: 'joey_g_123',
    userAvatar:
      'https://video-images.vice.com/_uncategorized/1504333177201-people-in-their-pulling-outfits-body-image-1472659906.jpeg',
    content: 'mentioned you in a comment: "@fashion_king check this style out"',
    time: '3h ago',
    postImage:
      'https://www.usmagazine.com/wp-content/uploads/2018/06/lebron-james.jpg?w=1000&quality=40&strip=all',
    isNew: false,
  },
  {
    id: '5',
    type: 'tag',
    username: 'vanessa290',
    userAvatar: 'https://i.pinimg.com/736x/8c/d2/9c/8cd29cf09d750f664b3dfaded76ade25.jpg',
    content: 'tagged you in a post',
    time: '5h ago',
    postImage: 'https://i.pinimg.com/736x/c9/bb/7f/c9bb7fba10f56f1f68027ab1fb8745e5.jpg',
    isNew: false,
  },
  {
    id: '6',
    type: 'sale',
    username: 'lebron',
    userAvatar:
      'https://www.usmagazine.com/wp-content/uploads/2018/06/lebron-james.jpg?w=1000&quality=40&strip=all',
    content: 'purchased your vintage sneakers for $120',
    time: '1d ago',
    isNew: false,
  },
];

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('All'); // 'All' or 'Sales'

  // Function to render notification based on type
  const renderNotification = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.notificationItem, item.isNew && styles.newNotification]}
        activeOpacity={0.7}
      >
        {/* User Avatar */}
        <Image source={{ uri: item.userAvatar }} style={styles.avatar} />

        {/* Notification Content */}
        <View style={styles.notificationContent}>
          <Text style={styles.notificationText}>
            <Text style={styles.username}>{item.username}</Text> {item.content}
          </Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>

        {/* Post Image (if applicable) */}
        {(item.type === 'like' ||
          item.type === 'comment' ||
          item.type === 'mention' ||
          item.type === 'tag') && (
          <Image source={{ uri: item.postImage }} style={styles.postThumbnail} />
        )}

        {/* Follow Button (if applicable) */}
        {item.type === 'follow' && (
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}> Notifications</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'All' && styles.activeTab]}
          onPress={() => setActiveTab('All')}
        >
          <Text style={[styles.tabText, activeTab === 'All' && styles.activeTabText]}>All</Text>
          {activeTab === 'All' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'Sales' && styles.activeTab]}
          onPress={() => setActiveTab('Sales')}
        >
          <Text style={[styles.tabText, activeTab === 'Sales' && styles.activeTabText]}>Sales</Text>
          {activeTab === 'Sales' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <FlatList
        data={activeTab === 'All' ? notifications : notifications.filter(n => n.type === 'sale')}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.notificationsList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    position: 'relative',
  },
  activeTab: {
    // Active tab styling if needed
  },
  tabText: {
    color: '#999',
    fontWeight: '500',
    fontSize: 14,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 15,
    right: 15,
    height: 2,
    backgroundColor: '#FF8C05',
  },
  notificationsList: {
    paddingVertical: 5,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 0.2,
    borderBottomColor: '#333',
  },
  newNotification: {
    backgroundColor: 'rgba(255, 140, 5, 0.05)', // Subtle highlight for new notifications
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    marginRight: 10,
  },
  notificationText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  username: {
    fontWeight: 'bold',
  },
  timeText: {
    color: '#777',
    fontSize: 12,
    marginTop: 3,
  },
  postThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 4,
  },
  followButton: {
    backgroundColor: '#FF8C05',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default NotificationsScreen;
