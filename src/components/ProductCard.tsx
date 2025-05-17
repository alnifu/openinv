// src/components/ProductCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

interface Product {
  id?: string;
  name: string;
  price: string;
  category: string;
  quantity: string;
}

interface Props {
  product: Product;
  onView?: () => void;
  onEdit?: () => void;
  showStockControls?: boolean;
  quantity?: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
  onChangeQuantity?: (qty: string) => void;
}

const ProductCard: React.FC<Props> = ({
  product,
  onView,
  onEdit,
  showStockControls = false,
  quantity = 0,
  onIncrease,
  onDecrease,
  onChangeQuantity,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.productName}>{product.name}</Text>

      {showStockControls ? (
        <View style={styles.stockControl}>
          <TouchableOpacity style={styles.stockBtn} onPress={onDecrease}>
            <Text style={styles.btnText}>-</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.qtyInput}
            value={quantity.toString()}
            keyboardType="numeric"
            onChangeText={onChangeQuantity}
          />

          <TouchableOpacity style={styles.stockBtn} onPress={onIncrease}>
            <Text style={styles.btnText}>+</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.viewBtn} onPress={onView}>
            <Text style={styles.btnText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f4f4f4',
    padding: 14,
    marginBottom: 12,
    borderRadius: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  viewBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  editBtn: {
    backgroundColor: '#ff9500',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  stockControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stockBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  qtyInput: {
    width: 50,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 4,
    fontSize: 16,
  },
});
