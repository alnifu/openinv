// src/screens/SalesScreen.tsx

import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';

interface Sale {
  id: string;
  productName: string;
  quantity: number;
  date: string;
}

const dummySalesData: Sale[] = [
  { id: '1', productName: 'Product A', quantity: 2, date: '2025-05-01' },
  { id: '2', productName: 'Product B', quantity: 1, date: '2025-05-03' },
  { id: '3', productName: 'Product C', quantity: 5, date: '2025-05-05' },
];

const SalesScreen = () => {
  const [sales, setSales] = useState<Sale[]>(dummySalesData);

  const renderItem = ({ item }: { item: Sale }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.productName}>{item.productName}</Text>
      <Text style={styles.details}>Quantity: {item.quantity}</Text>
      <Text style={styles.details}>Date: {item.date}</Text>
    </View>
  );

  const clearSales = () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to clear all sales?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => setSales([]) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sales Records</Text>

      {sales.length === 0 ? (
        <Text style={styles.emptyText}>No sales records available.</Text>
      ) : (
        <FlatList
          data={sales}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}

      <TouchableOpacity style={styles.clearBtn} onPress={clearSales}>
        <Text style={styles.clearBtnText}>Clear Sales</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SalesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
  },
  details: {
    fontSize: 14,
    color: '#555',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
  clearBtn: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  clearBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
