// src/screens/StockScreen.tsx

import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import ProductCard from '../components/ProductCard';

const StockScreen = () => {
  const [products, setProducts] = useState([
    { id: '1', name: 'Sample Product 1', stock: 10 },
    { id: '2', name: 'Sample Product 2', stock: 5 },
  ]);

  const handleIncrease = (id: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, stock: (p.stock || 0) + 1 } : p))
    );
  };

  const handleDecrease = (id: string) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id && (p.stock || 0) > 0
          ? { ...p, stock: (p.stock || 0) - 1 }
          : p
      )
    );
  };

  const handleChangeQuantity = (id: string, value: string) => {
    const number = parseInt(value);
    if (isNaN(number)) return;

    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, stock: number } : p))
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stock Control</Text>

      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            showStockControls
            quantity={item.stock || 0}
            onIncrease={() => handleIncrease(item.id)}
            onDecrease={() => handleDecrease(item.id)}
            onChangeQuantity={(val) => handleChangeQuantity(item.id, val)}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default StockScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
});
