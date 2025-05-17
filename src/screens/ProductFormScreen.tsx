// src/screens/ProductForm.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  
} from 'react-native';

interface Product {
  id?: string;
  name: string;
  price: string;
  category: string;
  quantity: string;
}

const ProductForm = ({ navigation, route }) => {
  // Existing product data if editing
  const existingProduct = route.params?.product;
  
  const [product, setProduct] = useState<Product>({
    name: existingProduct?.name || '',
    price: existingProduct?.price?.toString() || '',
    category: existingProduct?.category || 'general',
    quantity: existingProduct?.quantity?.toString() || '0',
  });

  const [errors, setErrors] = useState({
    name: false,
    price: false,
    quantity: false,
  });

  const categories = [
    'general',
    'electronics',
    'clothing',
    'food',
    'furniture',
    'books',
    'toys',
  ];

  const validateForm = () => {
    const newErrors = {
      name: product.name.trim() === '',
      price: isNaN(parseFloat(product.price)) || parseFloat(product.price) <= 0,
      quantity: isNaN(parseInt(product.quantity)) || parseInt(product.quantity) < 0,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please check your inputs');
      return;
    }

    // In a real app, you would save to your backend here
    const newProduct = {
      ...product,
      price: parseFloat(product.price),
      quantity: parseInt(product.quantity),
    };

    console.log('Submitting product:', newProduct);
    Alert.alert(
      'Success', 
      existingProduct ? 'Product updated!' : 'Product added!',
      [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]
    );
  };

  const handleChange = (field: keyof Product, value: string) => {
    setProduct(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {existingProduct ? 'Edit Product' : 'Add New Product'}
      </Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={product.name}
          onChangeText={(text) => handleChange('name', text)}
          placeholder="Enter product name"
        />
        {errors.name && <Text style={styles.errorText}>Product name is required</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Price *</Text>
        <TextInput
          style={[styles.input, errors.price && styles.inputError]}
          value={product.price}
          onChangeText={(text) => handleChange('price', text)}
          placeholder="0.00"
          keyboardType="decimal-pad"
        />
        {errors.price && <Text style={styles.errorText}>Please enter a valid price</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={product.category}
            style={styles.picker}
            onValueChange={(itemValue) => handleChange('category', itemValue)}
          >
            {categories.map((cat) => (
              <Picker.Item key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)} value={cat} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Initial Quantity *</Text>
        <TextInput
          style={[styles.input, errors.quantity && styles.inputError]}
          value={product.quantity}
          onChangeText={(text) => handleChange('quantity', text)}
          placeholder="0"
          keyboardType="numeric"
        />
        {errors.quantity && <Text style={styles.errorText}>Please enter a valid quantity</Text>}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {existingProduct ? 'Update Product' : 'Add Product'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ProductForm;