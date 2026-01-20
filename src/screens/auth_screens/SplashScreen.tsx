import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../types/navigation';

type SplashScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Splash'>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const translateY = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateY }],
          },
        ]}
      >
        {/* Stacked Logo Text */}
        <View style={styles.logoTextContainer}>
          <Text style={[styles.logoText, { color: '#FFFFFF' }]}>FIT CHECK</Text>
          <Text style={[styles.logoText, { color: '#FF8C05', top: 2 }]}>FIT CHECK</Text>
          <Text style={[styles.logoText, { color: '#B697C7', top: 4 }]}>FIT CHECK</Text>
        </View>

        <Text style={styles.tagline}>WHERE OUTFITS CONNECT</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.signupButton]}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4C3A3A',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 50, // Add padding to lift content up slightly
  },
  logoTextContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    position: 'absolute',
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  tagline: {
    color: '#FFFFFF',
    fontSize: 16,
    letterSpacing: 4,
    marginBottom: 50,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#FF8C05',
    padding: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  signupButton: {
    backgroundColor: '#B697C7',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default SplashScreen;
