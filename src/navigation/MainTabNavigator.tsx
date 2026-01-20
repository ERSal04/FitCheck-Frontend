import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import your screens
import HomeScreen from '@/src/screens/HomeScreen';
import ExploreScreen from '@/src/screens/ExploreScreen';
import AddPostScreen from '@/src/screens/AddPostScreen';
import MarketScreen from '@/src/screens/MarketScreen';
import ProfileScreen from '@/src/screens/ProfileScreen';
import PostDetailScreen from '../screens/PostDetailsScreen';
import NotificationsScreen from '../screens/NotificationScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ConversationScreen from '../screens/ConversationScreen';
import CameraScreen from '../screens/CameraScreen';
import FollowersListScreen from '../screens/ProfileSubScreens/FollowersListScreen';
import FollowingListScreen from '../screens/ProfileSubScreens/FollowingListScreen';

// Create a main stack that will contain the tab navigator and shared screens
// This allows navigation to shared screens from any tab
const MainStack = createStackNavigator();

// Create Home stack navigator for Home tab
const HomeStack = createStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeMain" component={HomeScreen} />
  </HomeStack.Navigator>
);

// Create Explore stack
const ExploreStack = createStackNavigator();
const ExploreStackScreen = () => (
  <ExploreStack.Navigator screenOptions={{ headerShown: false }}>
    <ExploreStack.Screen name="ExploreMain" component={ExploreScreen} />
  </ExploreStack.Navigator>
);

// Create Profile stack
const ProfileStack = createStackNavigator();
const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

// Create Market stack
const MarketStack = createStackNavigator();
const MarketStackScreen = () => (
  <MarketStack.Navigator screenOptions={{ headerShown: false }}>
    <MarketStack.Screen name="MarketMain" component={MarketScreen} />
  </MarketStack.Navigator>
);

// Create your tab navigator
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'ellipse';

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Explore') iconName = 'search';
          else if (route.name === 'Post') iconName = 'add-circle';
          else if (route.name === 'Market') iconName = 'shirt';
          else if (route.name === 'Profile') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Explore" component={ExploreStackScreen} />
      <Tab.Screen name="Post" component={AddPostScreen} />
      <Tab.Screen name="Market" component={MarketStackScreen} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  );
};

// Main navigation structure
export default function MainNavigator() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      {/* Put the tab navigator at the root */}
      <MainStack.Screen name="Tabs" component={TabNavigator} />
      {/* Shared screens that can be accessed from any tab */}
      <MainStack.Screen name="PostDetail" component={PostDetailScreen} />
      <MainStack.Screen name="Profile" component={ProfileScreen} />
      <MainStack.Screen name="Notifications" component={NotificationsScreen} />
      <MainStack.Screen name="Messages" component={MessagesScreen} />
      <MainStack.Screen name="Conversation" component={ConversationScreen} />
      <MainStack.Screen name="Camera" component={CameraScreen} />
      {/* New follower/following list screens */}
      <MainStack.Screen
        name="FollowersList"
        component={FollowersListScreen}
        options={{
          headerShown: false,
          presentation: 'card',
        }}
      />
      <MainStack.Screen
        name="FollowingList"
        component={FollowingListScreen}
        options={{
          headerShown: false,
          presentation: 'card',
        }}
      />
    </MainStack.Navigator>
  );
}
