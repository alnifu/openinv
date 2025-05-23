// src/screens/SalesViewScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SoldItem } from '../utils/storage';

interface SalesViewScreenProps {
  route: {
    params: {
      soldItem: SoldItem;
    };
  };
  navigation: any;
}

export default function SalesViewScreen({ route, navigation }: SalesViewScreenProps) {
  const { soldItem } = route.params;

  const handleEdit = () => {
    navigation.navigate('SalesForm', { mode: 'edit', soldItem });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };
  };

  const { date } = formatDate(soldItem.dateSold);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Sale Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>Sale Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Item Name:</Text>
            <Text style={styles.value}>{soldItem.itemName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Item ID (Barcode):</Text>
            <Text style={styles.value}>{soldItem.itemId}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.value}>{soldItem.category}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Quantity Sold:</Text>
            <Text style={[styles.value, styles.quantityValue]}>{soldItem.quantitySold}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Date Sold:</Text>
            <Text style={styles.value}>{date}</Text>
          </View>
          <View style={styles.endRow}>
            <Text style={styles.label}>Total Sales:</Text>
            <Text style={styles.value}>{soldItem.priceSold}</Text>
          </View>
          
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>Edit Sale Record</Text>
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailRow: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  endRow: {
    marginBottom: 16,
    paddingBottom: 12,
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