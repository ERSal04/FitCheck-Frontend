import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import PopUpStyles from '../types/styles/wardrobeStyles/AddContentDialogStyle';

// Import ApiService
import ApiService from '../services/WardrobeApi';

// Define categories
type CategoryType =
  | 'fulloutfit'
  | 'tops'
  | 'bottoms'
  | 'outerwear'
  | 'shoes'
  | 'jewelry'
  | 'hats'
  | '';

interface ItemData {
  id: string;
  image: string;
  description: string;
  category: CategoryType;
}

interface PopupDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (item: ItemData) => void;
  initialCategory?: CategoryType; // Add initialCategory prop
}

const PopupDialog: React.FC<PopupDialogProps> = ({ visible, onClose, onSave, initialCategory }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('');
  const [step, setStep] = useState<'initial' | 'details'>('initial');
  const [isUploading, setIsUploading] = useState(false);

  // Set the category when initialCategory changes or when the modal opens
  useEffect(() => {
    if (visible && initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [visible, initialCategory]);

  // Reset form when dialog is closed
  useEffect(() => {
    if (!visible) {
      // Only reset if not using initialCategory
      if (!initialCategory) {
        setSelectedCategory('');
      }
      // Always reset these
      setSelectedImage(null);
      setDescription('');
      setStep('initial');
    }
  }, [visible, initialCategory]);

  // Categories with display names
  const categories: { value: CategoryType; label: string }[] = [
    { value: 'fulloutfit', label: 'Full Outfit' },
    { value: 'tops', label: 'Tops' },
    { value: 'bottoms', label: 'Bottoms' },
    { value: 'outerwear', label: 'Outerwear' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'hats', label: 'Hats' },
  ];

  // Open Camera
  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Camera access is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setStep('details');
    }
  };

  // Open Photo Library
  const openGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Photo library access is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setStep('details');
    }
  };

  // Remove the selected image and go back to options
  const removeImage = () => {
    setSelectedImage(null);
    setDescription('');
    // Don't reset category if initialCategory is provided
    if (!initialCategory) {
      setSelectedCategory('');
    }
    setStep('initial');
  };

  // Upload the image to the backend
  const uploadToBackend = async () => {
    if (!selectedImage || !selectedCategory) {
      Alert.alert('Missing Information', 'Please select an image and category.');
      return false;
    }

    setIsUploading(true);

    try {
      const result = await ApiService.addWardrobeItem({
        image: selectedImage,
        category: selectedCategory,
        description: description,
      });

      return result;
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Upload Failed', 'Could not upload to virtual wardrobe. Please try again.');
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Confirm/Save
  const handleConfirm = async () => {
    if (!selectedImage) {
      Alert.alert('Missing Image', 'Please select an image');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Missing Category', 'Please select a category');
      return;
    }

    // Upload to backend
    const uploadResult = await uploadToBackend();

    if (uploadResult) {
      // If upload was successful, use the ID from the server response
      if (onSave) {
        const newItem: ItemData = {
          id: uploadResult.id || Date.now().toString(),
          image: selectedImage,
          description: description,
          category: selectedCategory,
        };

        onSave(newItem);
      }

      // Reset and close
      Alert.alert('Success', 'Item added to your virtual wardrobe!');
      removeImage();
      onClose();
    }
  };

  // Reset everything when modal closes
  const handleClose = () => {
    removeImage();
    onClose();
  };

  // Find the label for a category value
  const getCategoryLabel = (value: CategoryType) => {
    const category = categories.find(cat => cat.value === value);
    return category ? category.label : '';
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[PopUpStyles.modalContainer, { justifyContent: 'center' }]}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={PopUpStyles.modalContent}>
              {/* Close Button */}
              <TouchableOpacity style={PopUpStyles.closeButton} onPress={handleClose}>
                <Text style={PopUpStyles.closeButtonText}>X</Text>
              </TouchableOpacity>

              <Text style={PopUpStyles.modalTitle}>
                {step === 'initial'
                  ? initialCategory
                    ? `Add to ${getCategoryLabel(initialCategory)}`
                    : 'Add to Virtual Wardrobe'
                  : 'Item Details'}
              </Text>

              <ScrollView
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ width: '100%' }}
                keyboardShouldPersistTaps="handled"
              >
                {/* Step 1: Image Selection */}
                {step === 'initial' && (
                  <View style={PopUpStyles.optionsContainer}>
                    <TouchableOpacity style={PopUpStyles.optionButton} onPress={openCamera}>
                      <Text style={PopUpStyles.buttonText}>Take a Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={PopUpStyles.optionButton} onPress={openGallery}>
                      <Text style={PopUpStyles.buttonText}>Choose from Library</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Step 2: Details & Category */}
                {step === 'details' && selectedImage && (
                  <View style={PopUpStyles.detailsContainer}>
                    {/* Preview Image */}
                    <Image source={{ uri: selectedImage }} style={PopUpStyles.imagePreview} />

                    {/* Description Input */}
                    <TextInput
                      style={PopUpStyles.input}
                      placeholder="Enter a description..."
                      placeholderTextColor="#B697c7"
                      value={description}
                      onChangeText={setDescription}
                      multiline
                    />

                    {/* Category Selection - Only show if no initialCategory is provided */}
                    {!initialCategory && (
                      <>
                        <Text style={PopUpStyles.categoryLabel}>Select a category:</Text>
                        <View style={PopUpStyles.categoryContainer}>
                          {categories.map(category => (
                            <TouchableOpacity
                              key={category.value}
                              style={[
                                PopUpStyles.categoryButton,
                                selectedCategory === category.value &&
                                  PopUpStyles.selectedCategoryButton,
                              ]}
                              onPress={() => setSelectedCategory(category.value)}
                            >
                              <Text
                                style={[
                                  PopUpStyles.categoryButtonText,
                                  selectedCategory === category.value &&
                                    PopUpStyles.selectedCategoryText,
                                ]}
                              >
                                {category.label}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </>
                    )}

                    {/* Action Buttons */}
                    <View style={PopUpStyles.actionButtonsContainer}>
                      <TouchableOpacity
                        style={PopUpStyles.removeButton}
                        onPress={removeImage}
                        disabled={isUploading}
                      >
                        <Text style={PopUpStyles.buttonText}>Retake</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[PopUpStyles.confirmButton, isUploading && { opacity: 0.7 }]}
                        onPress={handleConfirm}
                        disabled={isUploading}
                      >
                        <Text style={PopUpStyles.buttonText}>
                          {isUploading
                            ? 'Uploading...'
                            : initialCategory
                              ? `Add to ${getCategoryLabel(initialCategory)}`
                              : 'Add to Wardrobe'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default PopupDialog;
