// src/screens/CameraScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../lib/constants';
import AuthService from '../services/AuthService';

export default function CameraScreen() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to take a photo using camera
  const takePhoto = async () => {
    try {
      // Ask for camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera permissions to take photos.', [
          { text: 'OK' },
        ]);
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  // Function to pick an image from library
  const pickImage = async () => {
    try {
      // Ask for media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need media library permissions to select photos.', [
          { text: 'OK' },
        ]);
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
    }
  };

  // Function to submit the post
  const submitPost = async () => {
    if (!image) {
      Alert.alert('Missing Image', 'Please select or take a photo first.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get authentication token
      const token = await AuthService.getToken();

      if (!token) {
        navigation.navigate('Login');
        return;
      }

      // Create form data for image upload
      const formData = new FormData();

      // Get the image name from the URI
      const imageName = image.split('/').pop();

      // Determine image type
      const imageType = imageName.includes('.')
        ? `image/${imageName.split('.').pop()}`
        : 'image/jpeg';

      // Append image to form data
      formData.append('image', {
        uri: Platform.OS === 'ios' ? image.replace('file://', '') : image,
        name: imageName || 'photo.jpg',
        type: imageType,
      });

      // Append caption if available
      if (caption) {
        formData.append('caption', caption);
      }

      // Make API request to create a daily post
      const response = await axios.post(`${API_URL}/daily-posts`, formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Check if the request was successful
      if (response.status === 201) {
        // Return to home screen after successful post
        navigation.goBack();

        // Show success message
        Alert.alert('Success', 'Your daily fit has been posted!');
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      console.error('Error submitting post:', error);

      let errorMessage = 'Failed to post your fit. Please try again.';

      // Extract error message from the response if available
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Fit</Text>
        <TouchableOpacity
          style={[styles.postButton, (!image || isSubmitting) && styles.disabledButton]}
          onPress={submitPost}
          disabled={!image || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {image ? (
          // Show selected image
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.changeImageButton} onPress={() => setImage(null)}>
              <Ionicons name="refresh" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        ) : (
          // Show camera/gallery options
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.optionButton} onPress={takePhoto}>
              <Ionicons name="camera" size={42} color="#FFF" />
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
              <Ionicons name="images" size={42} color="#FFF" />
              <Text style={styles.optionText}>From Gallery</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Caption Input - Only show when image is selected */}
        {image && (
          <View style={styles.captionContainer}>
            <TextInput
              style={styles.captionInput}
              placeholder="Write a caption..."
              placeholderTextColor="#888"
              value={caption}
              onChangeText={setCaption}
              multiline={true}
              maxLength={150}
            />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
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
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FF8C05',
    borderRadius: 20,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    position: 'relative',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 180,
  },
  optionButton: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#222',
    borderRadius: 12,
    width: 150,
    height: 150,
    justifyContent: 'center',
  },
  optionText: {
    color: '#FFF',
    marginTop: 12,
    fontWeight: '500',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: undefined,
    aspectRatio: 4 / 5,
    resizeMode: 'cover',
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 30,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: '100%',
    position: 'absolute',
    bottom: 85,
  },
  captionInput: {
    color: '#AAA',
    fontSize: 16,
    padding: 12,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    height: 50,
    width: '100%',
  },
});
