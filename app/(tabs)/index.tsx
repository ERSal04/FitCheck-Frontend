import React from 'react';
import { createStackNavigator, Header } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import SplashScreen from '@/src/screens/auth_screens/SplashScreen';
import LoginScreen from '@/src/screens/auth_screens/LoginScreen';
import SignupScreen from '@/src/screens/auth_screens/SignupScreen';
import VerifyAccount from '@/src/screens/auth_screens/VerifyAccount';
import MainTabNavigator from '@/src/navigation/MainTabNavigator';
import MessagesScreen from '@/src/screens/MessagesScreen';
import VirtualWardrobeScreen from '@/src/screens/VirtualWardrobeScreen';
import SettingsScreen from '@/src/screens/SettingsScreen';
import CameraScreen from '@/src/screens/CameraScreen';
import AIChatScreen from '@/src/screens/AIChatScreen';
import CheckoutScreen from '@/src/screens/CheckOutScreen';
import EditMarketScreen from '@/src/screens/EditMarketScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#4C3A3A' },
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="MainApp" component={MainTabNavigator} />
      <Stack.Screen name="Messages" component={MessagesScreen} />
      {
        <Stack.Screen
          name="VirtualWardrobe"
          component={VirtualWardrobeScreen} /* options={{
    title: 'My Wardrobe',
    // headerStyle: { backgroundColor: '#007bff' }, // Change header background color
    // headerTintColor: '#fff', // Change text color
    headerTitleAlign: 'center', // Center title
    headerShown: true,
  }} */
        />
      }
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Cart" component={CheckoutScreen} />
      <Stack.Screen name="AIChatScreen" component={AIChatScreen} />
      <Stack.Screen name="VerifyAccount" component={VerifyAccount} />
      <Stack.Screen name="EditMarket" component={EditMarketScreen} />
    </Stack.Navigator>
  );
}
