import { Entypo } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, TouchableOpacity, Image, LayoutChangeEvent, Alert } from 'react-native';
import { WardrobeListViewStyles } from '../types/styles/wardrobeStyles/WardrobeListViewStyle';
import ApiService from '../services/WardrobeApi';

// Define interfaces
interface WardrobeItem {
  id: string;
  image: string;
  category: string;
  description?: string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

interface WardrobeListProps {
  data: WardrobeItem[];
  isEditing: boolean;
  onDelete?: (id: string) => void; // Optional callback for parent component
  category?: string; // Add optional category prop for filtering
  refreshData?: () => void; // Optional callback to refresh data after deletion
}

const WardrobeList: React.FC<WardrobeListProps> = ({
  data,
  isEditing,
  onDelete,
  category,
  refreshData,
}) => {
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [itemWidth, setItemWidth] = useState(200);
  const [itemSpacing, setItemSpacing] = useState(10);
  const flatListRef = useRef<FlatList>(null);

  // Filter data based on category if provided
  const filteredData = category ? data.filter(item => item.category === category) : data;

  // Calculate the itemWidth based on container height
  useEffect(() => {
    let newWidth = 200; // Default
    if (containerDimensions.height > 250 && containerDimensions.height < 400) {
      newWidth = 300;
    } else if (containerDimensions.height > 400) {
      newWidth = 400;
    }
    setItemWidth(newWidth);
  }, [containerDimensions.height]);

  // Center the first item after layout
  useEffect(() => {
    if (containerDimensions.width > 0 && flatListRef.current && filteredData.length > 0) {
      // Calculate the left padding needed to center the first item
      const leftInset = (containerDimensions.width - itemWidth) / 2;
      // Apply the offset manually after a small delay to ensure layout is complete
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: -leftInset, animated: false });
      }, 100);
    }
  }, [containerDimensions.width, itemWidth, filteredData.length]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerDimensions({ width, height });
  };

  // Handle delete item
  const handleDeleteItem = async (id: string) => {
    try {
      // Confirm deletion with alert
      Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            // Delete item from API
            await ApiService.deleteWardrobeItem(id);

            // Call parent's onDelete if provided
            if (onDelete) {
              onDelete(id);
            }

            // Refresh data if needed
            if (refreshData) {
              refreshData();
            }
          },
          style: 'destructive',
        },
      ]);
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'Failed to delete item. Please try again.');
    }
  };

  // Calculate the dynamic box style
  const getBoxStyle = () => {
    return [
      WardrobeListViewStyles.box,
      containerDimensions.height > 0 ? { height: containerDimensions.height } : null,
      containerDimensions.height > 250 && containerDimensions.height < 400 ? { width: 300 } : null,
      containerDimensions.height > 325 ? { width: 400 } : null,
      { marginHorizontal: itemSpacing / 2 },
    ];
  };

  return (
    <FlatList
      ref={flatListRef}
      onLayout={handleLayout}
      data={filteredData}
      keyExtractor={item => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={itemWidth + itemSpacing}
      decelerationRate="fast"
      snapToAlignment="center"
      contentContainerStyle={WardrobeListViewStyles.listContainer}
      renderItem={({ item }) => (
        <View style={getBoxStyle()}>
          <Image
            source={{ uri: item.image }}
            style={WardrobeListViewStyles.image}
            resizeMode={item.resizeMode || 'contain'}
          />
          {isEditing && (
            <TouchableOpacity
              style={WardrobeListViewStyles.deleteButton}
              onPress={() => handleDeleteItem(item.id)}
            >
              <Entypo name="cross" size={18} color="white" />
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
};

export default WardrobeList;
