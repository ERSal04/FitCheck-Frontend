import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { FullOutfit, TwoPiece, ThreePiece, Accessories } from '../WardrobeContent/WardrobeContent';
import { WardrobeStyles } from '../types/styles/wardrobeStyles/WardrobeScreenStyle';
import AIChatScreen from './AIChatScreen';
import CustomAddButton from '../components/AddButton';
import PopupDialog from '../WardrobeContent/AddContentDialog';
import AuthService from '../services/AuthService';

export default function VirtualWardrobeScreen({ route }) {
  //Create the variables
  const filters = ['Full', 'Two Piece', 'Three Piece', 'Accessories'];
  //Set the Add Content Dialog to false (Does not show)
  const [modalVisible, setModalVisible] = useState(false);
  const { username } = route.params || {};
  const [isOwnWardrobe, setIsOwnWardrobe] = useState(false);

  //Navigation to go back to Profile screen and Ai screen
  const navigation = useNavigation();

  //Sets the state of the filters to display the full outfits by default
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode

  //NEED TO: Create Icons for better filtering
  //Declare the Icons for the associated filters
  const filterIcons = {
    Full: ['human'],
    'Two Piece': ['tshirt-crew', 'tshirt-crew'], // Two icons for Two Piece
    'Three Piece': ['layers-triple'],
    Accessories: ['sunglasses', 'necklace'], // Two icons for Accessories
  };

  useEffect(() => {
    const checkOwnWardrobe = async () => {
      const userData = await AuthService.getUserData();
      setIsOwnWardrobe(!username || username === userData?.username);
    };
    checkOwnWardrobe();
  }, [username]);

  //Funtion to display selected wardrobe. Passes the isEditing state to toggle edit mode
  const renderSelectedWardrobe = () => {
    switch (selectedFilter) {
      case 'Full':
        return <FullOutfit isEditing={isEditing} username={username} />;
      case 'Two Piece':
        return <TwoPiece isEditing={isEditing} username={username} />;
      case 'Three Piece':
        return <ThreePiece isEditing={isEditing} username={username} />;
      case 'Accessories':
        return <Accessories isEditing={isEditing} username={username} />;
      default:
        return <FullOutfit isEditing={isEditing} username={username} />;
    }
  };

  return (
    <View style={WardrobeStyles.container}>
      {/* Back Button */}
      <TouchableOpacity style={WardrobeStyles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {/* AI Chat Screen Button */}
      <TouchableOpacity
        style={WardrobeStyles.chatButton}
        onPress={() => navigation.navigate(AIChatScreen)}
      >
        <MaterialCommunityIcons name="robot-happy-outline" size={24} color="white" />
      </TouchableOpacity>

      {/* Title of the screen */}
      <Text style={WardrobeStyles.title}>Virtual Wardrobe</Text>

      {/* filter buttons mapping */}
      <View style={WardrobeStyles.filterContainer}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              WardrobeStyles.filterButton,
              selectedFilter === filter && WardrobeStyles.activeFilterButton,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            {Array.isArray(filterIcons[filter]) ? (
              <View style={WardrobeStyles.multiIconContainer}>
                {filterIcons[filter].map((iconName, index) => (
                  <MaterialCommunityIcons
                    key={index}
                    name={iconName}
                    size={24}
                    color={selectedFilter === filter ? 'black' : 'white'}
                    style={index > 0 ? WardrobeStyles.secondIcon : null}
                  />
                ))}
              </View>
            ) : (
              <MaterialCommunityIcons
                name={filterIcons[filter]}
                size={30}
                color={selectedFilter === filter ? 'black' : 'black'}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Toggle Edit Mode Button */}
      <View style={WardrobeStyles.actionButtonsContainer}>
        {isOwnWardrobe && (
          <TouchableOpacity
            style={[WardrobeStyles.editButton, isEditing && WardrobeStyles.editButtonActive]}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text style={WardrobeStyles.editButtonText}>
              {isEditing ? 'Done Editing' : 'Edit Items'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Add Item Button (Right of Edit Button) */}
        {isOwnWardrobe && <CustomAddButton onPress={() => setModalVisible(true)} />}
        <PopupDialog visible={modalVisible} onClose={() => setModalVisible(false)} />
      </View>

      {/* Display the Selected Wardrobe */}
      <View style={WardrobeStyles.wardrobeContainer}>{renderSelectedWardrobe()}</View>
    </View>
  );
}
