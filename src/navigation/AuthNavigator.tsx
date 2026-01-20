import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '@/src/screens/auth_screens/SplashScreen';
import LoginScreen from '@/src/screens/auth_screens/LoginScreen';
import SignupScreen from '@/src/screens/auth_screens/SignupScreen';

// Define the types for our authentication stack parameters
type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
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
    </Stack.Navigator>
  );
};

export default AuthNavigator;
