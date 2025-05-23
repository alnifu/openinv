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
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { SoldItem, getSoldItems, deleteSoldItem } from '../utils/storage';

interface SalesCardProps {
  soldItem: SoldItem;
  onView: () => void;
  onEdit: () => void;
}

const SalesCard: React.FC<SalesCardProps> = ({ soldItem, onView, onEdit }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.salesInfo}>
          <Text style={styles.itemName}>{soldItem.itemName}</Text>
          <Text style={styles.category}>Category: {soldItem.category}</Text>
          <Text style={styles.itemId}>ID: {soldItem.itemId}</Text>
          <Text style={styles.quantitySold}>Qty Sold: {soldItem.quantitySold}</Text>
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
  const [filteredSoldItems, setFilteredSoldItems] = useState<SoldItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'category' | 'quantity'>('date');
  const [refreshing, setRefreshing] = useState(false);

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

  // Refresh sold items when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadSoldItems();
    }, [])
  );

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadSoldItems();
    setRefreshing(false);
  };

  // Filter and sort sold items
  useEffect(() => {
    let filtered = soldItems.filter(item =>
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort sold items
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
    <SalesCard
      soldItem={item}
      onView={() => handleView(item)}
      onEdit={() => handleEdit(item)}
    />
  );

  // Calculate total sales summary
  const totalItemsSold = filteredSoldItems.reduce((sum, item) => sum + item.quantitySold, 0);
  const todaysSales = filteredSoldItems.filter(item => {
    const today = new Date().toDateString();
    const itemDate = new Date(item.dateSold).toDateString();
    return today === itemDate;
  });
  const todaysTotalItems = todaysSales.reduce((sum, item) => sum + item.quantitySold, 0);

  return (
    <View style={styles.container}>
      {/* Sales Summary */}
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

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search sales..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <Picker
          selectedValue={sortBy}
          style={styles.picker}
          onValueChange={(itemValue) => setSortBy(itemValue)}
        >
          <Picker.Item label="Date" value="date" />
          <Picker.Item label="Name" value="name" />
          <Picker.Item label="Category" value="category" />
          <Picker.Item label="Quantity" value="quantity" />
        </Picker>
      </View>

      {/* Sales List */}
      <FlatList
        data={filteredSoldItems}
        keyExtractor={(item) => item.id}
        renderItem={renderSalesCard}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
    borderRadius: 8,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    marginBottom: 12,
  },
  salesInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  itemId: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  quantitySold: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  dateSold: {
    fontSize: 12,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});