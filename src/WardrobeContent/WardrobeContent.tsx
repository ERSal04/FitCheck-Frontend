import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import WardrobeList from '../components/WardrobeListView';
import VWContentStyles from '../types/styles/wardrobeStyles/VWContentStyle';
import CustomAddButton from '../components/AddButton';
import PopupDialog from './AddContentDialog';
import ApiService from '../services/WardrobeApi';
import AuthService from '../services/AuthService';

export const FullOutfit = ({ isEditing, username }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isOwnWardrobe, setIsOwnWardrobe] = useState(false);

  // Check if filtered data is empty, not the entire dataset
  const hasFilteredData = data.filter(item => item.category === 'fulloutfit').length > 0;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        //Check if is own wardrobe
        const userData = await AuthService.getUserData();
        setIsOwnWardrobe(!username || username === userData?.username);

        const response = await ApiService.getWardrobeItems('fulloutfit', username);

        // Transform the data to match what WardrobeList expects
        if (response && response.data) {
          const transformedData = response.data.map(item => ({
            id: item._id,
            image: item.imageUrl,
            category: item.category,
            description: item.description,
          }));
          setData(transformedData);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error('Error loading outfits:', error);
        Alert.alert('Error', 'Failed to load outfits. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [username]);

  // Function to handle deleting an item
  const handleDelete = async id => {
    try {
      await ApiService.deleteWardrobeItem(id);
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete item. Please try again.');
    }
  };

  const handleSave = newItem => {
    // Transform the new item to match your list component's expectations
    const transformedItem = {
      id: newItem.id,
      image: newItem.image || newItem.imageUrl, // Handle both formats
      category: newItem.category,
      description: newItem.description,
    };
    setData([...data, transformedItem]);
  };

  if (loading) {
    return (
      <View
        style={[
          VWContentStyles.contentContainer,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color="#B697c7" />
      </View>
    );
  }

  return (
    <View style={VWContentStyles.contentContainer}>
      <SafeAreaView style={VWContentStyles.contentContainer}>
        {hasFilteredData ? (
          <View style={VWContentStyles.flatListWrapper}>
            <WardrobeList
              data={data}
              isEditing={isEditing && isOwnWardrobe}
              onDelete={handleDelete}
              category="fulloutfit"
            />
          </View>
        ) : (
          <View style={VWContentStyles.addOutfitContainer}>
            {isOwnWardrobe ? (
              // Show add button only for own wardrobe
              <>
                <Text style={VWContentStyles.addOutfitText}>Add Outfit</Text>
                <CustomAddButton onPress={() => setModalVisible(true)} />
              </>
            ) : (
              // Show empty state message for other users' wardrobes
              <Text style={VWContentStyles.addOutfitText}>No outfits added yet</Text>
            )}
          </View>
        )}
      </SafeAreaView>
      <PopupDialog
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        initialCategory="fulloutfit"
      />
    </View>
  );
};

export const TwoPiece = ({ isEditing, username }) => {
  const [topsData, setTopsData] = useState([]);
  const [bottomsData, setBottomsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isOwnWardrobe, setIsOwnWardrobe] = useState(false);

  // Check if filtered data exists for each category
  const topsHasData = topsData.filter(item => item.category === 'tops').length > 0;
  const bottomsHasData = bottomsData.filter(item => item.category === 'bottoms').length > 0;

  // Fetch data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        //Check if is own wardrobe
        const userData = await AuthService.getUserData();
        setIsOwnWardrobe(!username || username === userData?.username);

        const [topsResponse, bottomsResponse] = await Promise.all([
          ApiService.getWardrobeItems('tops', username),
          ApiService.getWardrobeItems('bottoms', username),
        ]);

        // Transform tops data
        const transformedTops =
          topsResponse && topsResponse.data
            ? topsResponse.data.map(item => ({
                id: item._id,
                image: item.imageUrl,
                category: item.category,
                description: item.description,
              }))
            : [];

        // Transform bottoms data
        const transformedBottoms =
          bottomsResponse && bottomsResponse.data
            ? bottomsResponse.data.map(item => ({
                id: item._id,
                image: item.imageUrl,
                category: item.category,
                description: item.description,
              }))
            : [];

        setTopsData(transformedTops);
        setBottomsData(transformedBottoms);
      } catch (error) {
        console.error('Error loading outfits:', error);
        Alert.alert('Error', 'Failed to load outfits. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [username]);

  const handleTopsDelete = async id => {
    try {
      await ApiService.deleteWardrobeItem(id);
      setTopsData(topsData.filter(item => item.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete item. Please try again.');
    }
  };

  const handleBottomsDelete = async id => {
    try {
      await ApiService.deleteWardrobeItem(id);
      setBottomsData(bottomsData.filter(item => item.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete item. Please try again.');
    }
  };

  const handleAddButtonPress = category => {
    setActiveCategory(category);
    setModalVisible(true);
  };

  const handleSave = newItem => {
    // Transform the new item
    const transformedItem = {
      id: newItem.id,
      image: newItem.image || newItem.imageUrl,
      category: newItem.category,
      description: newItem.description,
    };

    // Add to the appropriate array based on category
    if (newItem.category === 'tops') {
      setTopsData([...topsData, transformedItem]);
    } else if (newItem.category === 'bottoms') {
      setBottomsData([...bottomsData, transformedItem]);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          VWContentStyles.contentContainer,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color="#B697c7" />
      </View>
    );
  }

  return (
    <View style={VWContentStyles.contentContainer}>
      <SafeAreaView style={VWContentStyles.contentContainer}>
        {topsHasData ? (
          <View style={VWContentStyles.flatListWrapper}>
            <WardrobeList
              data={topsData}
              isEditing={isEditing && isOwnWardrobe}
              onDelete={handleTopsDelete}
              category="tops"
            />
          </View>
        ) : (
          <View style={VWContentStyles.addOutfitContainer}>
            {isOwnWardrobe ? (
              // Show add button only for own wardrobe
              <>
                <Text style={VWContentStyles.addOutfitText}>Add Outfit</Text>
                <CustomAddButton onPress={() => setModalVisible(true)} />
              </>
            ) : (
              // Show empty state message for other users' wardrobes
              <Text style={VWContentStyles.addOutfitText}>No outfits added yet</Text>
            )}
          </View>
        )}
      </SafeAreaView>
      <SafeAreaView style={VWContentStyles.contentContainer}>
        {bottomsHasData ? (
          <View style={VWContentStyles.flatListWrapper}>
            <WardrobeList
              data={bottomsData}
              isEditing={isEditing && isOwnWardrobe}
              onDelete={handleBottomsDelete}
              category="bottoms"
            />
          </View>
        ) : (
          <View style={VWContentStyles.addOutfitContainer}>
            {isOwnWardrobe ? (
              // Show add button only for own wardrobe
              <>
                <Text style={VWContentStyles.addOutfitText}>Add Outfit</Text>
                <CustomAddButton onPress={() => setModalVisible(true)} />
              </>
            ) : (
              // Show empty state message for other users' wardrobes
              <Text style={VWContentStyles.addOutfitText}>No outfits added yet</Text>
            )}
          </View>
        )}
      </SafeAreaView>
      <PopupDialog
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setActiveCategory(null);
        }}
        onSave={handleSave}
        initialCategory={activeCategory}
      />
    </View>
  );
};

export const ThreePiece = ({ isEditing, username }) => {
  const [topsData, setTopsData] = useState([]);
  const [bottomsData, setBottomsData] = useState([]);
  const [outerWearData, setOWData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isOwnWardrobe, setIsOwnWardrobe] = useState(false);

  // Check if filtered data exists for each category
  const topsHasData = topsData.filter(item => item.category === 'tops').length > 0;
  const bottomsHasData = bottomsData.filter(item => item.category === 'bottoms').length > 0;
  const OWHasData = outerWearData.filter(item => item.category === 'outerwear').length > 0;

  // Fetch data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        //Check if is own wardrobe
        const userData = await AuthService.getUserData();
        setIsOwnWardrobe(!username || username === userData?.username);

        const [topsResponse, bottomsResponse, outerwearResponse] = await Promise.all([
          ApiService.getWardrobeItems('tops', username),
          ApiService.getWardrobeItems('bottoms', username),
          ApiService.getWardrobeItems('outerwear', username),
        ]);

        // Transform tops data
        const transformedTops =
          topsResponse && topsResponse.data
            ? topsResponse.data.map(item => ({
                id: item._id,
                image: item.imageUrl,
                category: item.category,
                description: item.description,
              }))
            : [];

        // Transform bottoms data
        const transformedBottoms =
          bottomsResponse && bottomsResponse.data
            ? bottomsResponse.data.map(item => ({
                id: item._id,
                image: item.imageUrl,
                category: item.category,
                description: item.description,
              }))
            : [];

        // Transform outerwear data
        const transformedOuterwear =
          outerwearResponse && outerwearResponse.data
            ? outerwearResponse.data.map(item => ({
                id: item._id,
                image: item.imageUrl,
                category: item.category,
                description: item.description,
              }))
            : [];

        setTopsData(transformedTops);
        setBottomsData(transformedBottoms);
        setOWData(transformedOuterwear);
      } catch (error) {
        console.error('Error loading wardrobe items:', error);
        Alert.alert('Error', 'Failed to load wardrobe items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [username]);

  const handleTopsDelete = async id => {
    try {
      await ApiService.deleteWardrobeItem(id);
      setTopsData(topsData.filter(item => item.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete item. Please try again.');
    }
  };

  const handleBottomsDelete = async id => {
    try {
      await ApiService.deleteWardrobeItem(id);
      setBottomsData(bottomsData.filter(item => item.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete item. Please try again.');
    }
  };

  const handleOWDelete = async id => {
    try {
      await ApiService.deleteWardrobeItem(id);
      setOWData(outerWearData.filter(item => item.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete item. Please try again.');
    }
  };

  const handleAddButtonPress = category => {
    setActiveCategory(category);
    setModalVisible(true);
  };

  const handleSave = newItem => {
    // Transform the new item
    const transformedItem = {
      id: newItem.id,
      image: newItem.image || newItem.imageUrl,
      category: newItem.category,
      description: newItem.description,
    };

    // Add to the appropriate array based on category
    if (newItem.category === 'tops') {
      setTopsData([...topsData, transformedItem]);
    } else if (newItem.category === 'bottoms') {
      setBottomsData([...bottomsData, transformedItem]);
    } else if (newItem.category === 'outerwear') {
      setOWData([...outerWearData, transformedItem]);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          VWContentStyles.contentContainer,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color="#B697c7" />
      </View>
    );
  }

  return (
    <View style={VWContentStyles.contentContainer}>
      <SafeAreaView style={VWContentStyles.contentContainer}>
        {OWHasData ? (
          <View style={VWContentStyles.flatListWrapper}>
            <WardrobeList
              data={outerWearData}
              isEditing={isEditing && isOwnWardrobe}
              onDelete={handleOWDelete}
              category="outerwear"
            />
          </View>
        ) : (
          <View style={VWContentStyles.addOutfitContainer}>
            {isOwnWardrobe ? (
              // Show add button only for own wardrobe
              <>
                <Text style={VWContentStyles.addOutfitText}>Add Outfit</Text>
                <CustomAddButton onPress={() => setModalVisible(true)} />
              </>
            ) : (
              // Show empty state message for other users' wardrobes
              <Text style={VWContentStyles.addOutfitText}>No outfits added yet</Text>
            )}
          </View>
        )}
      </SafeAreaView>
      <SafeAreaView style={VWContentStyles.contentContainer}>
        {topsHasData ? (
          <View style={VWContentStyles.flatListWrapper}>
            <WardrobeList
              data={topsData}
              isEditing={isEditing && isOwnWardrobe}
              onDelete={handleTopsDelete}
              category="tops"
            />
          </View>
        ) : (
          <View style={VWContentStyles.addOutfitContainer}>
            {isOwnWardrobe ? (
              // Show add button only for own wardrobe
              <>
                <Text style={VWContentStyles.addOutfitText}>Add Outfit</Text>
                <CustomAddButton onPress={() => setModalVisible(true)} />
              </>
            ) : (
              // Show empty state message for other users' wardrobes
              <Text style={VWContentStyles.addOutfitText}>No outfits added yet</Text>
            )}
          </View>
        )}
      </SafeAreaView>
      <SafeAreaView style={VWContentStyles.contentContainer}>
        {bottomsHasData ? (
          <View style={VWContentStyles.flatListWrapper}>
            <WardrobeList
              data={bottomsData}
              isEditing={isEditing && isOwnWardrobe}
              onDelete={handleBottomsDelete}
              category="bottoms"
            />
          </View>
        ) : (
          <View style={VWContentStyles.addOutfitContainer}>
            {isOwnWardrobe ? (
              // Show add button only for own wardrobe
              <>
                <Text style={VWContentStyles.addOutfitText}>Add Outfit</Text>
                <CustomAddButton onPress={() => setModalVisible(true)} />
              </>
            ) : (
              // Show empty state message for other users' wardrobes
              <Text style={VWContentStyles.addOutfitText}>No outfits added yet</Text>
            )}
          </View>
        )}
      </SafeAreaView>
      <PopupDialog
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setActiveCategory(null);
        }}
        onSave={handleSave}
        initialCategory={activeCategory}
      />
    </View>
  );
};

export const Accessories = ({ isEditing, username }) => {
  const [jewelryData, setJewelryData] = useState([]);
  const [hatsData, setHatsData] = useState([]);
  const [shoesData, setShoesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isOwnWardrobe, setIsOwnWardrobe] = useState(false);

  // Check if filtered data exists for each category
  const jewelryHasData = jewelryData.filter(item => item.category === 'jewelry').length > 0;
  const hatsHasData = hatsData.filter(item => item.category === 'hats').length > 0;
  const shoesHasData = shoesData.filter(item => item.category === 'shoes').length > 0;

  const windowHeight = Dimensions.get('window').height;

  // Fetch data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        //Check if is own wardrobe
        const userData = await AuthService.getUserData();
        setIsOwnWardrobe(!username || username === userData?.username);

        const [jewelryResponse, hatsResponse, shoesResponse] = await Promise.all([
          ApiService.getWardrobeItems('jewelry', username),
          ApiService.getWardrobeItems('hats', username),
          ApiService.getWardrobeItems('shoes', username),
        ]);

        // Transform jewelry data
        const transformedJewelry =
          jewelryResponse && jewelryResponse.data
            ? jewelryResponse.data.map(item => ({
                id: item._id,
                image: item.imageUrl,
                category: item.category,
                description: item.description,
              }))
            : [];

        // Transform hats data
        const transformedHats =
          hatsResponse && hatsResponse.data
            ? hatsResponse.data.map(item => ({
                id: item._id,
                image: item.imageUrl,
                category: item.category,
                description: item.description,
              }))
            : [];

        // Transform shoes data
        const transformedShoes =
          shoesResponse && shoesResponse.data
            ? shoesResponse.data.map(item => ({
                id: item._id,
                image: item.imageUrl,
                category: item.category,
                description: item.description,
              }))
            : [];

        setJewelryData(transformedJewelry);
        setHatsData(transformedHats);
        setShoesData(transformedShoes);
      } catch (error) {
        console.error('Error loading accessories:', error);
        Alert.alert('Error', 'Failed to load accessories. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [username]);

  const handleJewelryDelete = async id => {
    try {
      await ApiService.deleteWardrobeItem(id);
      setJewelryData(jewelryData.filter(item => item.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete item. Please try again.');
    }
  };

  const handleHatsDelete = async id => {
    try {
      await ApiService.deleteWardrobeItem(id);
      setHatsData(hatsData.filter(item => item.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete item. Please try again.');
    }
  };

  const handleShoesDelete = async id => {
    try {
      await ApiService.deleteWardrobeItem(id);
      setShoesData(shoesData.filter(item => item.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete item. Please try again.');
    }
  };

  const handleAddButtonPress = category => {
    setActiveCategory(category);
    setModalVisible(true);
  };

  const handleSave = newItem => {
    // Transform the new item
    const transformedItem = {
      id: newItem.id,
      image: newItem.image || newItem.imageUrl,
      category: newItem.category,
      description: newItem.description,
    };

    // Add to the appropriate array based on category
    if (newItem.category === 'jewelry') {
      setJewelryData([...jewelryData, transformedItem]);
    } else if (newItem.category === 'hats') {
      setHatsData([...hatsData, transformedItem]);
    } else if (newItem.category === 'shoes') {
      setShoesData([...shoesData, transformedItem]);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          VWContentStyles.contentContainer,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color="#B697c7" />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, width: '100%' }}
      contentContainerStyle={{ minHeight: windowHeight }}
    >
      <View style={VWContentStyles.contentContainer}>
        <SafeAreaView style={VWContentStyles.contentContainer}>
          {jewelryHasData ? (
            <View style={VWContentStyles.flatListWrapper}>
              <WardrobeList
                data={jewelryData}
                isEditing={isEditing && isOwnWardrobe}
                onDelete={handleJewelryDelete}
                category="jewelry"
              />
            </View>
          ) : (
            <View style={VWContentStyles.addOutfitContainer}>
              {isOwnWardrobe ? (
                // Show add button only for own wardrobe
                <>
                  <Text style={VWContentStyles.addOutfitText}>Add Outfit</Text>
                  <CustomAddButton onPress={() => setModalVisible(true)} />
                </>
              ) : (
                // Show empty state message for other users' wardrobes
                <Text style={VWContentStyles.addOutfitText}>No outfits added yet</Text>
              )}
            </View>
          )}
        </SafeAreaView>
        <SafeAreaView style={VWContentStyles.contentContainer}>
          {hatsHasData ? (
            <View style={VWContentStyles.flatListWrapper}>
              <WardrobeList
                data={hatsData}
                isEditing={isEditing && isOwnWardrobe}
                onDelete={handleHatsDelete}
                category="hats"
              />
            </View>
          ) : (
            <View style={VWContentStyles.addOutfitContainer}>
              {isOwnWardrobe ? (
                // Show add button only for own wardrobe
                <>
                  <Text style={VWContentStyles.addOutfitText}>Add Outfit</Text>
                  <CustomAddButton onPress={() => setModalVisible(true)} />
                </>
              ) : (
                // Show empty state message for other users' wardrobes
                <Text style={VWContentStyles.addOutfitText}>No outfits added yet</Text>
              )}
            </View>
          )}
        </SafeAreaView>
        <SafeAreaView style={VWContentStyles.contentContainer}>
          {shoesHasData ? (
            <View style={VWContentStyles.flatListWrapper}>
              <WardrobeList
                data={shoesData}
                isEditing={isEditing && isOwnWardrobe}
                onDelete={handleShoesDelete}
                category="shoes"
              />
            </View>
          ) : (
            <View style={VWContentStyles.addOutfitContainer}>
              {isOwnWardrobe ? (
                // Show add button only for own wardrobe
                <>
                  <Text style={VWContentStyles.addOutfitText}>Add Outfit</Text>
                  <CustomAddButton onPress={() => setModalVisible(true)} />
                </>
              ) : (
                // Show empty state message for other users' wardrobes
                <Text style={VWContentStyles.addOutfitText}>No outfits added yet</Text>
              )}
            </View>
          )}
        </SafeAreaView>
        <PopupDialog
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setActiveCategory(null);
          }}
          onSave={handleSave}
          initialCategory={activeCategory}
        />
      </View>
    </ScrollView>
  );
};
