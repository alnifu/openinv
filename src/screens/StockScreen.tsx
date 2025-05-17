// src/screens/StockScreen.tsx

import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

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

  const renderItem = ({ item }: { item: { id: string; name: string; stock: number } }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>

      <TextInput
        style={styles.quantityInput}
        keyboardType="numeric"
        value={item.stock.toString()}
        onChangeText={(val) => handleChangeQuantity(item.id, val)}
      />

      <View style={styles.buttonGroup}>
        <TouchableOpacity onPress={() => handleIncrease(item.id)} style={styles.btn}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDecrease(item.id)} style={styles.btn}>
          <Text style={styles.btnText}>−</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stock Control</Text>

      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={renderItem}
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  name: {
    flex: 1.5,
    fontSize: 16,
    fontWeight: '500',
  },
  quantityInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    textAlign: 'center',
    borderRadius: 6,
    marginHorizontal: 8,
    backgroundColor: '#fff',
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  btn: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 4,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
