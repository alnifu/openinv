// src/screens/SalesScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AddSaleForm from '../components/AddSaleForm';
import { Picker } from '@react-native-picker/picker';
import {
  SoldItem,
  getSoldItems,
  addSoldItem,
  getItems,
  updateItem,
} from '../utils/storage';
import uuid from 'react-native-uuid';

interface SalesCardProps {
  soldItem: SoldItem;
  onView: () => void;
  onEdit: () => void;
}

const SalesCard: React.FC<SalesCardProps> = ({ soldItem, onView, onEdit }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.salesInfo}>
          <Text style={styles.itemName}>{soldItem.itemName}</Text>
          <Text style={styles.category}>Category: {soldItem.category}</Text>
          <Text style={styles.itemId}>Barcode: {soldItem.itemId}</Text>
          <Text style={styles.quantitySold}>Qty Sold: {soldItem.quantitySold}</Text>
          <Text style={styles.totalSale}>Total Sale: ₱{soldItem.priceSold.toFixed(2)}</Text>
          <Text style={styles.dateSold}>Date: {formatDate(soldItem.dateSold)}</Text>
        </View>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.viewButton} onPress={onView}>
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default function SalesScreen({ navigation }: any) {
  const [soldItems, setSoldItems] = useState<SoldItem[]>([]);
  const [newPrice, setNewPrice] = useState('');
  const [filteredSoldItems, setFilteredSoldItems] = useState<SoldItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'category' | 'quantity'>('date');
  const [isAddSaleModalVisible, setAddSaleModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // New state for Add Sale form inputs
  const [newBarcode, setNewBarcode] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD

  // Load sold items from storage
  const loadSoldItems = async () => {
    try {
      const items = await getSoldItems();
      setSoldItems(items);
      setFilteredSoldItems(items);
    } catch (error) {
      Alert.alert('Error', 'Failed to load sales data');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSoldItems();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSoldItems();
    setRefreshing(false);
  };

  useEffect(() => {
    let filtered = soldItems.filter(
      (item) =>
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.itemId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.dateSold).getTime() - new Date(a.dateSold).getTime();
        case 'name':
          return a.itemName.localeCompare(b.itemName);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'quantity':
          return b.quantitySold - a.quantitySold;
        default:
          return 0;
      }
    });

    setFilteredSoldItems(filtered);
  }, [soldItems, searchQuery, sortBy]);

  const handleView = (soldItem: SoldItem) => {
    navigation.navigate('SalesView', { soldItem });
  };

  const handleEdit = (soldItem: SoldItem) => {
    navigation.navigate('SalesForm', { mode: 'edit', soldItem });
  };

  const renderSalesCard = ({ item }: { item: SoldItem }) => (
    <SalesCard soldItem={item} onView={() => handleView(item)} onEdit={() => handleEdit(item)} />
  );

  // Calculate summary
  const totalItemsSold = filteredSoldItems.reduce((sum, item) => sum + item.quantitySold, 0);
  const todaysSales = filteredSoldItems.filter((item) => {
    const today = new Date().toDateString();
    const itemDate = new Date(item.dateSold).toDateString();
    return today === itemDate;
  });
  const todaysTotalItems = todaysSales.reduce((sum, item) => sum + item.quantitySold, 0);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredSoldItems}
        keyExtractor={(item) => item.id}
        renderItem={renderSalesCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <>
            {/* Summary Section */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Today's Sales</Text>
                <Text style={styles.summaryValue}>{todaysTotalItems} items</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Total Sales</Text>
                <Text style={styles.summaryValue}>{totalItemsSold} items</Text>
              </View>
            </View>
  
            {/* Add Sale Button */}
            <TouchableOpacity style={styles.addButton} onPress={() => setAddSaleModalVisible(true)}>
              <Text style={styles.addButtonText}>Add New Sale</Text>
            </TouchableOpacity>
  
            <AddSaleForm
              visible={isAddSaleModalVisible}
              onClose={() => setAddSaleModalVisible(false)}
              onSaleAdded={loadSoldItems}
            />
  
            {/* Search & Sort */}
            <TextInput
              style={styles.searchBar}
              placeholder="Search sales..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
  
            <View style={styles.sortContainer}>
              <Text style={styles.sortLabel}>Sort by:</Text>
              <Picker selectedValue={sortBy} style={styles.picker} onValueChange={setSortBy}>
                <Picker.Item label="Date" value="date" />
                <Picker.Item label="Name" value="name" />
                <Picker.Item label="Category" value="category" />
                <Picker.Item label="Quantity" value="quantity" />
              </Picker>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No sales records found</Text>
          </View>
        }
      />
    </View>
  );
}  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    flex: 1,
    marginHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 12,
    color: '#444',
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  salesInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 6,
    color: '#222',
  },
  category: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  itemId: {
    fontSize: 12,
    marginBottom: 4,
    color: '#999',
  },
  quantitySold: {
    fontSize: 14,
    marginBottom: 4,
    color: '#444',
    fontWeight: '600',
  },
  totalSale: {
    fontSize: 16,
    marginBottom: 6,
    color: '#28a745',
    fontWeight: '700',
  },
  dateSold: {
    fontSize: 12,
    color: '#999',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  viewButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  listContainer: {
    paddingBottom: 30,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});
