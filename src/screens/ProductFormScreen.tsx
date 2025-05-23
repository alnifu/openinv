// src/screens/ProductFormScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Item, addItem, updateItem, deleteItem } from '../utils/storage';

interface ProductFormScreenProps {
  route: {
    params: {
      mode: 'add' | 'edit';
      product?: Item;
    };
  };
  navigation: any;
}

export default function ProductFormScreen({ route, navigation }: ProductFormScreenProps) {
  const { mode, product } = route.params;
  const isEditing = mode === 'edit';

  const [formData, setFormData] = useState({
    image: product?.image || '',
    itemId: product?.itemId || '',
    itemName: product?.itemName || '',
    category: product?.category || '',
    quantity: product?.quantity?.toString() || '',
    sellingPrice: product?.sellingPrice?.toString() || '',
    notes: product?.notes || '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Product' : 'Add Product',
    });
  }, [navigation, isEditing]);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData(prev => ({ ...prev, image: result.assets[0].uri }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera is required!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData(prev => ({ ...prev, image: result.assets[0].uri }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const validateForm = (): boolean => {
    if (!formData.itemId.trim()) {
      Alert.alert('Error', 'Item ID is required');
      return false;
    }
    if (!formData.itemName.trim()) {
      Alert.alert('Error', 'Item name is required');
      return false;
    }
    if (!formData.category.trim()) {
      Alert.alert('Error', 'Category is required');
      return false;
    }
    if (!formData.quantity.trim() || isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return false;
    }
    if (!formData.sellingPrice.trim() || isNaN(Number(formData.sellingPrice)) || Number(formData.sellingPrice) <= 0) {
      Alert.alert('Error', 'Please enter a valid selling price');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const itemData: Item = {
        id: product?.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        image: formData.image,
        itemId: formData.itemId.trim(),
        itemName: formData.itemName.trim(),
        category: formData.category.trim(),
        quantity: Number(formData.quantity),
        sellingPrice: Number(formData.sellingPrice),
        notes: formData.notes.trim(),
      };

      if (isEditing) {
        await updateItem(itemData);
        Alert.alert('Success', 'Product updated successfully');
      } else {
        await addItem(itemData);
        Alert.alert('Success', 'Product added successfully');
      }

      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', 'Failed to save product');
      console.error('An error occurred:', error.message || error)
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!product) return;

    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.itemName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItem(product.id);
              Alert.alert('Success', 'Product deleted successfully');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete product');
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}
    contentContainerStyle={{ paddingBottom: 80 }}>
      <View style={styles.form}>
        {/* Image Section */}
        <View style={styles.imageSection}>
          <Text style={styles.label}>Product Image</Text>
          {formData.image ? (
            <TouchableOpacity onPress={showImageOptions}>
              <Image source={{ uri: formData.image }} style={styles.productImage} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.imagePlaceholder} onPress={showImageOptions}>
              <Text style={styles.imagePlaceholderText}>+ Add Image</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Item ID */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Item ID (Barcode) *</Text>
          <TextInput
            style={styles.input}
            value={formData.itemId}
            onChangeText={(text) => setFormData(prev => ({ ...prev, itemId: text }))}
            placeholder="Enter item ID"
          />
        </View>

        {/* Item Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Item Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.itemName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, itemName: text }))}
            placeholder="Enter item name"
          />
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category *</Text>
          <TextInput
            style={styles.input}
            value={formData.category}
            onChangeText={(text) => setFormData(prev => ({ ...prev, category: text }))}
            placeholder="Enter category"
          />
        </View>

        {/* Quantity */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quantity *</Text>
          <TextInput
            style={styles.input}
            value={formData.quantity}
            onChangeText={(text) => setFormData(prev => ({ ...prev, quantity: text }))}
            placeholder="Enter quantity"
            keyboardType="numeric"
          />
        </View>

        {/* Selling Price */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Selling Price *</Text>
          <TextInput
            style={styles.input}
            value={formData.sellingPrice}
            onChangeText={(text) => setFormData(prev => ({ ...prev, sellingPrice: text }))}
            placeholder="Enter selling price"
            keyboardType="numeric"
          />
        </View>

        {/* Notes */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
            placeholder="Enter notes (optional)"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            disabled={loading}
          >
            <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButtonText: {
    color: '#333',
  },
});