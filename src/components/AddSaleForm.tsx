import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { getItems, updateItem, addSoldItem } from '../utils/storage';
import uuid from 'react-native-uuid';

interface AddSaleFormProps {
  visible: boolean;
  onClose: () => void;
  onSaleAdded: () => void;
  initialBarcode?: string;

}

const AddSaleForm: React.FC<AddSaleFormProps> = ({visible, onClose, onSaleAdded, initialBarcode = '',
}) => {
  const [barcode, setBarcode] = useState(initialBarcode);
  const [quantity, setQuantity] = useState('');


  const getLocalDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (`0${now.getMonth() + 1}`).slice(-2);
    const day = (`0${now.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };
  
  const [date, setDate] = useState(getLocalDate());
  
  useEffect(() => {
    setBarcode(initialBarcode);
  }, [initialBarcode]);

  const handleAddSale = async () => {
    if (!barcode.trim()) {
      Alert.alert('Validation Error', 'Please enter the item barcode');
      return;
    }
    if (!quantity.trim() || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid quantity');
      return;
    }
    if (!date) {
      Alert.alert('Validation Error', 'Please enter a valid sale date');
      return;
    }

    try {
      const quantityToSell = Number(quantity);
      const items = await getItems();
      const item = items.find((i) => i.itemId === barcode.trim());

      if (!item) {
        Alert.alert('Error', 'Item with this barcode not found in inventory.');
        return;
      }
      if (item.quantity < quantityToSell) {
        Alert.alert('Error', `Not enough stock. Available: ${item.quantity}`);
        return;
      }

      const updatedItem = { ...item, quantity: item.quantity - quantityToSell };
      await updateItem(updatedItem);

      const newSoldItem = {
        id: uuid.v4().toString(),
        itemId: item.itemId,
        itemName: item.itemName,
        category: item.category,
        quantitySold: quantityToSell,
        dateSold: new Date(date).toISOString(),
        priceSold: item.sellingPrice * quantityToSell
      };
      await addSoldItem(newSoldItem);


      setBarcode('');
      setQuantity('');
      setDate(getLocalDate());
      Alert.alert('Success', 'Sale recorded and inventory updated.');
      onSaleAdded();
      onClose();
    } catch (error) {
      console.error('Error adding sale:', error);
      Alert.alert('Error', 'Failed to add sale');
    }
  };

  return (
    <Modal visible={visible} transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Add New Sale</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter item barcode"
            value={barcode}
            onChangeText={setBarcode}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Quantity sold"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Date sold (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
          />

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.button} onPress={handleAddSale}>
              <Text style={styles.buttonText}>Add Sale</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddSaleForm;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
