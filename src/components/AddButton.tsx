import { Entypo } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AddButtonStyles } from '../types/styles/wardrobeStyles/AddButtonStyle';

// This file is a reusable button with a Squared Plus Icon. It is used in the Virtual Wardrobe to add pictures to the wardrobe

const CustomAddButton = ({
  //Default onPress Function
  onPress = () => console.log('Pressed Button'),
}) => {
  return (
    //Returns the button
    <TouchableOpacity style={[AddButtonStyles.AddClothingButton]} onPress={onPress}>
      {<Entypo name="squared-plus" size={22} color={'white'} />}
    </TouchableOpacity>
  );
};

export default CustomAddButton;
