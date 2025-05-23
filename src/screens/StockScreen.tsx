import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  RefreshControl,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getItems, updateItem } from '../utils/storage';
import { Item } from '../utils/storage';

export default function StockScreen() {
  const [products, setProducts] = useState<Item[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Item[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'quantity' | 'price'>('name');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const items = await getItems();
      setProducts(items);
      setFilteredProducts(items);
    } catch (error) {
      Alert.alert('Error', 'Failed to load products');
      console.error(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  // Filter & Sort
  useEffect(() => {
    let filtered = products.filter(
      (product) =>
        product.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.itemId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.itemName.localeCompare(b.itemName);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'quantity':
          return b.quantity - a.quantity;
        case 'price':
          return b.sellingPrice - a.sellingPrice;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, sortBy]);

  const updateQuantity = async (id: string, change: number) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;

    const newQuantity = Math.max(product.quantity + change, 0);
    const updatedProduct = { ...product, quantity: newQuantity };

    try {
      await updateItem(updatedProduct);
      const updatedList = products.map(item =>
        item.id === id ? updatedProduct : item
      );
      setProducts(updatedList);
    } catch (error) {
      Alert.alert('Error', 'Failed to update quantity');
      console.error(error);
    }
  };

  const renderProduct = ({ item }: { item: Item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.productImage} />
        ) : (
          <View style={[styles.productImage, styles.imagePlaceholder]}>
            <Text style={styles.imagePlaceholderText}>No Image</Text>
          </View>
        )}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.itemName}</Text>
          <Text style={styles.productCategory}>Category: {item.category}</Text>
          <Text style={styles.productId}>ID: {item.itemId}</Text>
          <Text style={styles.productPrice}>₱{item.sellingPrice.toFixed(2)}</Text>
  
          <View style={styles.quantityRow}>
            <Text style={styles.productQuantityLabel}>Quantity:</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, -1)}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
  
  
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
  
      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <Picker
          selectedValue={sortBy}
          style={styles.picker}
          onValueChange={(itemValue) => setSortBy(itemValue)}
        >
          <Picker.Item label="Name" value="name" />
          <Picker.Item label="Category" value="category" />
          <Picker.Item label="Quantity" value="quantity" />
          <Picker.Item label="Price" value="price" />
        </Picker>
      </View>
  
      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
      />
    </View>
  );
}
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    searchBar: {
      backgroundColor: '#fff',
      borderRadius: 8,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 16,
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    sortContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 8,
      paddingHorizontal: 14,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    sortLabel: {
      fontSize: 14,
      fontWeight: '600',
      marginRight: 10,
      color: '#444',
    },
    picker: {
      flex: 1,
      height: 50,
      color: '#333',
    },
    listContainer: {
      paddingBottom: 30,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 16,
      marginBottom: 14,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    cardContent: {
      flexDirection: 'row',
    },
    productImage: {
      width: 70,
      height: 70,
      borderRadius: 10,
      marginRight: 14,
      backgroundColor: '#f0f0f0',
    },
    imagePlaceholder: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#e0e0e0',
    },
    imagePlaceholderText: {
      color: '#888',
      fontSize: 12,
    },
    productInfo: {
      flex: 1,
      justifyContent: 'space-between',
    },
    productName: {
      fontSize: 18,
      fontWeight: '700',
      color: '#222',
      marginBottom: 6,
    },
    productCategory: {
      fontSize: 14,
      color: '#666',
      marginBottom: 2,
    },
    productId: {
      fontSize: 12,
      color: '#999',
      marginBottom: 4,
    },
    productPrice: {
      fontSize: 16,
      color: '#28a745',
      fontWeight: '700',
      marginBottom: 6,
    },
    productQuantityLabel: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 6,
      color: '#444',
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    quantityButton: {
      width: 70,
      height: 40,
      borderRadius: 8,
      backgroundColor: '#28a745',
      justifyContent: 'center',
      alignItems: 'center',
    },
    quantityButtonText: {
      color: '#fff',
      fontSize: 20,
      fontWeight: '700',
    },
    quantityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    
    quantityValue: {
      width: 44,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '700',
      color: '#333',
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 50,
    },
    emptyText: {
      fontSize: 16,
      color: '#888',
    },
  });
  