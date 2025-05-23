// src/screens/SalesFormScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SoldItem, updateSoldItem, deleteSoldItem } from '../utils/storage';

interface SalesFormScreenProps {
  route: {
    params: {
      mode: 'edit';
      soldItem: SoldItem;
    };
  };
  navigation: any;
}

export default function SalesFormScreen({ route, navigation }: SalesFormScreenProps) {
  const { soldItem } = route.params;

  const [formData, setFormData] = useState({
    itemId: soldItem.itemId,
    itemName: soldItem.itemName,
    category: soldItem.category,
    quantitySold: soldItem.quantitySold.toString(),
    dateSold: new Date(soldItem.dateSold).toISOString().split('T')[0], // Format as YYYY-MM-DD
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: 'Edit Sale',
    });
  }, [navigation]);

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
    if (!formData.quantitySold.trim() || isNaN(Number(formData.quantitySold)) || Number(formData.quantitySold) <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity sold');
      return false;
    }
    if (!formData.dateSold) {
      Alert.alert('Error', 'Date sold is required');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const updatedSoldItem: SoldItem = {
        ...soldItem,
        itemId: formData.itemId.trim(),
        itemName: formData.itemName.trim(),
        category: formData.category.trim(),
        quantitySold: Number(formData.quantitySold),
        dateSold: new Date(formData.dateSold).toISOString(),
      };

      await updateSoldItem(updatedSoldItem);
      Alert.alert('Success', 'Sale record updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update sale record');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Sale Record',
      `Are you sure you want to delete this sale record for "${soldItem.itemName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSoldItem(soldItem.id);
              Alert.alert('Success', 'Sale record deleted successfully');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete sale record');
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
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Item ID */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Item ID *</Text>
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

        {/* Quantity Sold */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quantity Sold *</Text>
          <TextInput
            style={styles.input}
            value={formData.quantitySold}
            onChangeText={(text) => setFormData(prev => ({ ...prev, quantitySold: text }))}
            placeholder="Enter quantity sold"
            keyboardType="numeric"
          />
        </View>

        {/* Date Sold */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date Sold *</Text>
          <TextInput
            style={styles.input}
            value={formData.dateSold}
            onChangeText={(text) => setFormData(prev => ({ ...prev, dateSold: text }))}
            placeholder="YYYY-MM-DD"
          />
          <Text style={styles.helperText}>Format: YYYY-MM-DD (e.g., 2024-01-15)</Text>
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

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
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
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
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