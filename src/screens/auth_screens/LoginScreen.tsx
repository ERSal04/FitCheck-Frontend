import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import AuthService from '@/src/services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/src/lib/constants';
import ApiService from '@/src/services/WardrobeApi';

type LoginScreenProps = {
  navigation: NavigationProp<any>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(API_URL + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const json = await response.json();
      // console.log(json);

      if (!response.ok) {
        console.error('Error in login response: ' + json.message);
        return;
      }

      // Store authentication token
      await AuthService.setToken(json.token);
      // Store user data
      if (json.user) {
        await AuthService.setUserData({
          id: json.user._id,
          username: json.user.username,
          email: json.user.email,
        });
      }

      navigation.navigate('MainApp');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Bypass Login
  // const handleLogin = async () => {
  //   try {
  //     // Use hardcoded credentials
  //     const hardcodedEmail = 'elijahr.salgado@calbaptist.edu';
  //     const hardcodedPassword = 'Password1';

  //     const response = await fetch(API_URL + '/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         email: hardcodedEmail,
  //         password: hardcodedPassword,
  //       }),
  //     });

  //     const json = await response.json();

  //     if (!response.ok) {
  //       console.error('Error in login response: ' + json.message);
  //       return;
  //     }

  //     // Store authentication token
  //     await AuthService.setToken(json.token);
  //     // Store user data
  //     if (json.user) {
  //       await AuthService.setUserData({
  //         id: json.user._id,
  //         username: json.user.username,
  //         email: json.user.email,
  //       });
  //     }

  //     navigation.navigate('MainApp');
  //   } catch (error) {
  //     console.error('Login failed:', error);
  //   }
  // };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidView}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>FIT CHECK</Text>
            <Text style={styles.subHeaderText}>Welcome Back!</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4C3A3A',
  },
  keyboardAvoidView: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 24,
    color: '#FF8C05',
    fontWeight: '500',
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#B697C7',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#FF8C05',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  signupText: {
    color: '#FF8C05',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
