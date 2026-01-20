import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Dummy cart data
const cartItems = [
  {
    id: '1',
    product: 'Blue Sweater',
    price: 50,
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQFzjjQSoj1ZU5l1g8Jhd1zPCuIZYMmnSz0A&s',
  },
  {
    id: '2',
    product: 'White Shirt',
    price: 20,
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiD0lqXl-pV6PAZFFzNdOOfqzBs2IDmNVWJg&s',
  },
];

export default function CheckOutScreen() {
  const navigation = useNavigation();
  const [cart, setCart] = useState(cartItems);

  const removeItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Checkout</Text>
      </View>

      {/* Cart Items List */}
      <FlatList
        data={cart}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.cartImage} />
            <View>
              <Text style={styles.product}>{item.product}</Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Total & Checkout Button */}
      <View style={styles.totalContainer}>
        <Text style={styles.sectionTitle}>Total: ${getTotalPrice()}</Text>
        <Button title="Proceed to Payment" onPress={() => alert('Proceeding to payment')} />
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#191919',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4C3A3A',
    marginLeft: 10,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cartImage: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  product: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  price: {
    fontSize: 14,
    color: '#FF8C05',
  },
  totalContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'white',
  },
};
