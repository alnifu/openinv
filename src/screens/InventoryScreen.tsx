// src/screens/InventoryScreen.tsx

import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ProductCard from '../components/ProductCard';

const InventoryScreen = () => {
  const [products, setProducts] = useState([
    { id: '1', name: 'Sample Product 1', stock: 10 },
    { id: '2', name: 'Sample Product 2', stock: 5 },
    // You can replace this with fetched data
  ]);

  const handleAddProduct = () => {
    Alert.alert('Add Product', 'Redirect to Product Form');
    // TODO: navigation.navigate('ProductFormScreen', { mode: 'add' });
  };

  const handleView = (product: any) => {
    Alert.alert('View Product', `Viewing: ${product.name}`);
  };

  const handleEdit = (product: any) => {
    Alert.alert('Edit Product', `Editing: ${product.name}`);
    // TODO: navigation.navigate('ProductFormScreen', { mode: 'edit', product });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
        <Text style={styles.addButtonText}>+ Add Product</Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onView={() => handleView(item)}
            onEdit={() => handleEdit(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default InventoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
});
