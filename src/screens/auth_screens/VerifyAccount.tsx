import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@/src/lib/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from '@/src/services/AuthService';

export default function VerificationCodeScreen() {
  const navigation = useNavigation();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleChange = async (text: string, index: number) => {
    if (text.length > 1) text = text.slice(-1);
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 5) {
      const ref = inputRefs.current[index + 1] as TextInput;
      if (ref) ref.focus();
    }
    if (newCode.every(num => num !== '')) {
      const code = newCode.join('');
      const email = await AsyncStorage.getItem('email');
      if (!email) {
        console.error('Email is not set in local storage');
        return;
      }
      const response = await fetch(API_URL + '/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          verificationCode: code,
        }),
      });
      if (!response) {
        console.error('No response was returned.');
        return;
      }
      const json = await response.json();
      if (!response.ok) {
        console.error('Error in verification response: ' + json.message);
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
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidView}
        >
          <View style={styles.innerContainer}>
            {/* Header */}
            <Text style={styles.headerText}>FIT CHECK</Text>
            <Text style={styles.subHeaderText}>Enter Verification Code</Text>

            {/* Code Input Fields */}
            <View style={styles.codeContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={el => (inputRefs.current[index] = el)}
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={text => handleChange(text, index)}
                  autoFocus={index === 0}
                />
              ))}
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              style={[styles.button, code.includes('') && styles.buttonDisabled]}
              onPress={() => navigation.navigate('Home')}
              disabled={code.includes('')}
            >
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4C3A3A',
  },
  keyboardAvoidView: {
    flex: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 20,
    color: '#FF8C05',
    fontWeight: '500',
    marginBottom: 30,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    width: 50,
    height: 50,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4C3A3A',
    elevation: 5,
  },
  button: {
    backgroundColor: '#FF8C05',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#A67A47',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
