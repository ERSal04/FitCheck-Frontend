import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function MarketScreen() {
  const navigation = useNavigation();
  const [items, setItems] = useState([
    { id: '1', title: 'Floral Dress', price: '25', image: 'https://via.placeholder.com/100' },
    { id: '2', title: 'Leather Jacket', price: '60', image: 'https://via.placeholder.com/100' },
  ]);

  const [isModalVisible, setModalVisible] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('New');
  const [photos, setPhotos] = useState<string[]>([]);

  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const conditions = ['New', 'Like New', 'Good', 'Fair'];

  const handlePost = () => {
    const newItem = {
      id: Date.now().toString(),
      title,
      price,
      image: photos[0] || 'https://via.placeholder.com/100',
    };
    setItems([newItem, ...items]);
    setModalVisible(false);
    setTitle('');
    setDescription('');
    setPrice('');
    setSelectedCategory('');
    setSize('');
    setCondition('New');
    setPhotos([]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#4C3A3A" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Market</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add New Item</Text>
        </TouchableOpacity>
      </View>

      {/* Items List */}
      <FlatList
        contentContainerStyle={styles.itemList}
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemPrice}>${item.price}</Text>
            </View>
          </View>
        )}
      />

      {/* Modal */}
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Post Item</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#4C3A3A" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            {/* Photos */}
            <Text style={styles.subSectionTitle}>Photos (1-5)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {photos.map((uri, index) => (
                <Image key={index} source={{ uri }} style={styles.photo} />
              ))}
              <TouchableOpacity style={styles.addPhotoButton}>
                <Ionicons name="camera" size={32} color="#4C3A3A" />
                <Text style={styles.addPhotoText}>Add Photos</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Form Inputs */}
            <TextInput
              style={styles.input}
              placeholder="Item Title"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />

            <View style={styles.priceContainer}>
              <Text style={styles.currency}>$</Text>
              <TextInput
                style={[styles.input, styles.priceInput]}
                placeholder="Price"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>

            <View style={styles.categoryContainer}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.selectedCategoryButton,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category && styles.selectedCategoryText,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Size & Condition */}
            <View style={styles.sizeConditionContainer}>
              <View style={styles.sizeContainer}>
                <Text style={styles.subSectionTitle}>Size</Text>
                <View style={styles.sizeButtons}>
                  {sizes.map(s => (
                    <TouchableOpacity
                      key={s}
                      style={[styles.sizeButton, size === s && styles.selectedSizeButton]}
                      onPress={() => setSize(s)}
                    >
                      <Text style={size === s ? styles.selectedSizeText : styles.sizeText}>
                        {s}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.conditionContainer}>
                <Text style={styles.subSectionTitle}>Condition</Text>
                <View style={styles.conditionDropdown}>
                  <Text style={styles.conditionText}>{condition}</Text>
                  <Ionicons name="chevron-down" size={18} color="#4C3A3A" />
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={handlePost} style={styles.postButton}>
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#4C3A3A' },
  addButton: {
    backgroundColor: '#FF8C05',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addButtonText: { color: 'white', fontWeight: '600' },
  itemList: { padding: 16 },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  itemPrice: { fontSize: 14, color: '#888' },

  // Modal + Form Styles
  modalContainer: { flex: 1, backgroundColor: '#FFF' },
  addPhotoButton: {
    width: 120,
    height: 120,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  addPhotoText: { color: '#4C3A3A', marginTop: 8, fontSize: 12 },
  photo: { width: 120, height: 120, borderRadius: 8, marginRight: 8 },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#4C3A3A',
    marginBottom: 16,
  },
  multilineInput: { height: 100, textAlignVertical: 'top' },
  priceContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  currency: { fontSize: 18, fontWeight: 'bold', color: '#4C3A3A', marginRight: 8 },
  priceInput: { flex: 1 },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEE',
    backgroundColor: '#FFF',
  },
  selectedCategoryButton: {
    backgroundColor: '#FF8C05',
    borderColor: '#FF8C05',
  },
  categoryText: { color: '#666', fontSize: 14 },
  selectedCategoryText: { color: 'white', fontWeight: '500' },
  sizeConditionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  sizeContainer: { flex: 1 },
  conditionContainer: { flex: 1 },
  subSectionTitle: { fontSize: 14, color: '#666', marginBottom: 8 },
  sizeButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sizeButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSizeButton: { backgroundColor: '#FF8C05', borderColor: '#FF8C05' },
  sizeText: { color: '#666' },
  selectedSizeText: { color: 'white' },
  conditionDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
  },
  conditionText: { color: '#4C3A3A' },
  postButton: {
    marginTop: 20,
    backgroundColor: '#FF8C05',
    padding: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  postButtonText: { color: 'white', fontWeight: '600' },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48, // adds space for better layout
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4C3A3A',
    textAlign: 'center',
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
});
