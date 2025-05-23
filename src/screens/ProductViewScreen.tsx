// src/screens/ProductViewScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Item } from '../utils/storage';

interface ProductViewScreenProps {
  route: {
    params: {
      product: Item;
    };
  };
  navigation: any;
}

export default function ProductViewScreen({ route, navigation }: ProductViewScreenProps) {
  const { product } = route.params;

  const handleEdit = () => {
    navigation.navigate('ProductForm', { mode: 'edit', product });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Product Image */}
        {product.image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
          </View>
        )}

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Item Name:</Text>
            <Text style={styles.value}>{product.itemName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Item ID (Barcode):</Text>
            <Text style={styles.value}>{product.itemId}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.value}>{product.category}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Quantity:</Text>
            <Text style={[styles.value, styles.quantityValue]}>{product.quantity}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Selling Price:</Text>
            <Text style={[styles.value, styles.priceValue]}>₱{product.sellingPrice.toFixed(2)}</Text>
          </View>

          {product.notes && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Notes:</Text>
              <Text style={styles.value}>{product.notes}</Text>
            </View>
          )}
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>Edit Product</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailRow: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  quantityValue: {
    color: '#28a745',
    fontWeight: '600',
  },
  priceValue: {
    color: '#28a745',
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});