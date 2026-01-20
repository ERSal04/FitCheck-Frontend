import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import ExploreService from '../services/ExploreService'; // Import your service
import { AddPostStyles } from '../types/styles/addPostStyles/AddPost';

const { width } = Dimensions.get('window');

const categoryOptions = [
  'Streetwear',
  'Minimal',
  'Vintage',
  'Casual',
  'Formal',
  'Athleisure',
  'Y2K',
];

const AddPostScreen = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [inputTag, setInputTag] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [audience, setAudience] = useState('everyone'); // 'everyone' or 'friends'
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submit loading

  const scrollViewRef = useRef(null);
  const captionInputRef = useRef(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
          Alert.alert('Sorry, we need camera and media library permissions to make this work!');
        }
      }
    })();
  }, []);

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [10, 12],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [10, 12],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const addTag = () => {
    if (inputTag.trim() && !taggedUsers.includes(inputTag.trim())) {
      setTaggedUsers([...taggedUsers, inputTag.trim()]);
      setInputTag('');
    }
  };

  const removeTag = index => {
    const newTags = [...taggedUsers];
    newTags.splice(index, 1);
    setTaggedUsers(newTags);
  };

  const handlePost = async () => {
    // Validate input
    if (!image) {
      Alert.alert('Missing Image', 'Please select or take an image for your post.');
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare post data
      const postData = {
        image,
        caption,
        location,
        mentions: taggedUsers,
        category: selectedCategory,
      };

      // Send to backend
      const response = await ExploreService.createPost(postData);

      console.log('Post created successfully:', response);

      // Clear form after successful post
      setImage(null);
      setCaption('');
      setLocation('');
      setTaggedUsers([]);
      setSelectedCategory('');

      // Show success message
      Alert.alert('Success', 'Your post has been shared!', [
        { text: 'OK', onPress: () => {} }, // Removed navigation so user stays on screen
      ]);
    } catch (error) {
      // Handle errors
      console.error('Error creating post:', error);
      Alert.alert('Error', error.message || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
    >
      <View style={AddPostStyles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />

        {/* Header */}
        <View style={AddPostStyles.header}>
          {/* <TouchableOpacity onPress={() => navigation.goBack()} style={AddPostStyles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity> */}
          <Text style={AddPostStyles.headerTitle}>Create Post</Text>
          <TouchableOpacity
            onPress={handlePost}
            style={[
              AddPostStyles.postButton,
              (!image || isSubmitting) && AddPostStyles.postButtonDisabled,
            ]}
            disabled={!image || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text
                style={[
                  AddPostStyles.postButtonText,
                  !image && AddPostStyles.postButtonTextDisabled,
                ]}
              >
                Share
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={AddPostStyles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Image Preview / Selection */}
          <View style={AddPostStyles.imageSection}>
            {image ? (
              <View style={AddPostStyles.imagePreviewContainer}>
                <Image source={{ uri: image }} style={AddPostStyles.imagePreview} />
                <View style={AddPostStyles.imageOverlayButtons}>
                  <TouchableOpacity style={AddPostStyles.imageActionButton} onPress={takePhoto}>
                    <Ionicons name="camera" size={22} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={AddPostStyles.imageActionButton} onPress={pickImage}>
                    <Ionicons name="images" size={22} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={AddPostStyles.imageSelectionContainer}>
                <View style={AddPostStyles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={80} color="#444" />
                  <Text style={AddPostStyles.placeholderText}>
                    Take an Image or Select an Image
                  </Text>
                </View>

                <View style={AddPostStyles.imageSourceButtons}>
                  <TouchableOpacity style={AddPostStyles.imageSourceButton} onPress={takePhoto}>
                    <Ionicons name="camera-outline" size={28} color="#FFF" />
                    <Text style={AddPostStyles.sourceButtonText}>Camera</Text>
                  </TouchableOpacity>
                  <View style={AddPostStyles.buttonDivider} />
                  <TouchableOpacity style={AddPostStyles.imageSourceButton} onPress={pickImage}>
                    <Ionicons name="images-outline" size={28} color="#FFF" />
                    <Text style={AddPostStyles.sourceButtonText}>Gallery</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Caption */}
          <View style={AddPostStyles.inputSection}>
            <Text style={AddPostStyles.inputLabel}>Caption</Text>
            <TextInput
              ref={captionInputRef}
              style={AddPostStyles.captionInput}
              placeholder="Write a caption..."
              placeholderTextColor="#777"
              multiline
              value={caption}
              onChangeText={setCaption}
              onFocus={() => {
                // Make sure the keyboard doesn't cover the input
                setTimeout(() => {
                  if (scrollViewRef.current && captionInputRef.current) {
                    captionInputRef.current.measure((fx, fy, width, height, px, py) => {
                      scrollViewRef.current.scrollToEnd({
                        // y: py - 100, // Scroll position with offset
                        animated: true,
                      });
                    });
                  }
                }, 100);
              }}
            />
          </View>

          {/* Location */}
          <View style={AddPostStyles.inputSection}>
            <Text style={AddPostStyles.inputLabel}>Location</Text>
            <View style={AddPostStyles.locationInputContainer}>
              <Ionicons
                name="location-outline"
                size={20}
                color="#777"
                style={AddPostStyles.locationIcon}
              />
              <TextInput
                style={AddPostStyles.locationInput}
                placeholder="Add location"
                placeholderTextColor="#777"
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          {/* Tag People */}
          {/* <View style={AddPostStyles.inputSection}>
            <Text style={AddPostStyles.inputLabel}>Tag People</Text>
            <View style={AddPostStyles.tagInputContainer}>
              <TextInput
                style={AddPostStyles.tagInput}
                placeholder="Add username"
                placeholderTextColor="#777"
                value={inputTag}
                onChangeText={setInputTag}
                onSubmitEditing={addTag}
              />
              <TouchableOpacity style={AddPostStyles.addTagButton} onPress={addTag}>
                <Text style={AddPostStyles.addTagText}>Add</Text>
              </TouchableOpacity>
            </View>
            
            {taggedUsers.length > 0 && (
              <View style={AddPostStyles.tagsContainer}>
                {taggedUsers.map((tag, index) => (
                  <View key={index} style={AddPostStyles.tagItem}>
                    <Text style={AddPostStyles.tagText}>{tag}</Text>
                    <TouchableOpacity onPress={() => removeTag(index)}>
                      <Ionicons name="close-circle" size={16} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View> */}

          {/* Category Selection */}
          <View style={AddPostStyles.inputSection}>
            <Text style={AddPostStyles.inputLabel}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={AddPostStyles.categoriesContainer}
            >
              {categoryOptions.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    AddPostStyles.categoryItem,
                    selectedCategory === category && AddPostStyles.categoryItemActive,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      AddPostStyles.categoryText,
                      selectedCategory === category && AddPostStyles.categoryTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Audience Selection */}
          {/* <View style={AddPostStyles.inputSection}>
            <Text style={AddPostStyles.inputLabel}>Share with</Text>
            <View style={AddPostStyles.audienceContainer}>
              <TouchableOpacity
                style={[
                  AddPostStyles.audienceOption,
                  audience === 'everyone' && AddPostStyles.audienceOptionActive,
                ]}
                onPress={() => setAudience('everyone')}
              >
                <Ionicons
                  name="globe-outline"
                  size={20}
                  color={audience === 'everyone' ? '#FF8C05' : '#FFF'}
                />
                <Text
                  style={[
                    AddPostStyles.audienceText,
                    audience === 'everyone' && AddPostStyles.audienceTextActive,
                  ]}
                >
                  Everyone
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  AddPostStyles.audienceOption,
                  audience === 'friends' && AddPostStyles.audienceOptionActive,
                ]}
                onPress={() => setAudience('friends')}
              >
                <Ionicons
                  name="people-outline"
                  size={20}
                  color={audience === 'friends' ? '#FF8C05' : '#FFF'}
                />
                <Text
                  style={[
                    AddPostStyles.audienceText,
                    audience === 'friends' && AddPostStyles.audienceTextActive,
                  ]}
                >
                  Just Friends
                </Text>
              </TouchableOpacity>
            </View>
          </View> */}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddPostScreen;
