// src/screens/InventoryScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Image,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { Item, getItems, deleteItem } from "../utils/storage";

interface ProductCardProps {
  product: Item;
  onView: () => void;
  onEdit: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onView, onEdit }) => (
  <View style={styles.card}>
    <View style={styles.cardContent}>
      {product.image ? (
        <Image source={{ uri: product.image }} style={styles.productImage} />
      ) : (
        <View style={[styles.productImage, styles.imagePlaceholder]}>
          <Text style={styles.imagePlaceholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.itemName}</Text>
        <Text style={styles.productCategory}>Category: {product.category}</Text>
        <Text style={styles.productId}>ID: {product.itemId}</Text>
        <Text style={styles.productQuantity}>Qty: {product.quantity}</Text>
        <Text style={styles.productPrice}>₱{product.sellingPrice.toFixed(2)}</Text>
        {product.notes ? (
          <Text style={styles.productNotes} numberOfLines={2}>
            Notes: {product.notes}
          </Text>
        ) : null}
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

export default function InventoryScreen({ navigation }: any) {
  const [products, setProducts] = useState<Item[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "name" | "category" | "quantity" | "price"
  >("name");
  const [refreshing, setRefreshing] = useState(false);

  // Load products from storage
  const loadProducts = async () => {
    try {
      const items = await getItems();
      setProducts(items);
      setFilteredProducts(items);
    } catch (error: any) {
      Alert.alert("Error", "Failed to load products");
      console.error("An error occurred:", error.message || error);
    }
  };

  // Refresh products when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  // Filter and sort products
  useEffect(() => {
    let filtered = products.filter(
      (product) =>
        product.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.itemId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.itemName.localeCompare(b.itemName);
        case "category":
          return a.category.localeCompare(b.category);
        case "quantity":
          return b.quantity - a.quantity;
        case "price":
          return b.sellingPrice - a.sellingPrice;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, sortBy]);

  const handleAddProduct = () => {
    navigation.navigate("ProductForm", { mode: "add" });
  };

  const handleView = (product: Item) => {
    navigation.navigate("ProductView", { product });
  };

  const handleEdit = (product: Item) => {
    navigation.navigate("ProductForm", { mode: "edit", product });
  };

  const handleDelete = (product: Item) => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${product.itemName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteItem(product.id);
              await loadProducts();
              Alert.alert("Success", "Product deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to delete product");
            }
          },
        },
      ]
    );
  };

  const renderProductCard = ({ item }: { item: Item }) => (
    <ProductCard
      product={item}
      onView={() => handleView(item)}
      onEdit={() => handleEdit(item)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search products..."
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
          <Picker.Item label="Name" value="name" />
          <Picker.Item label="Category" value="category" />
          <Picker.Item label="Quantity" value="quantity" />
          <Picker.Item label="Price" value="price" />
        </Picker>
      </View>
  
      {/* Products List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProductCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
      />
  
      {/* Add Product Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
        <Text style={styles.addButtonText}>+ Add Product</Text>
      </TouchableOpacity>
    </View>
  );
}
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    searchBar: {
      backgroundColor: "#fff",
      borderRadius: 8,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 16,
      fontSize: 16,
      borderWidth: 1,
      borderColor: "#ddd",
    },
    sortContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: 8,
      paddingHorizontal: 14,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: "#ddd",
    },
    sortLabel: {
      fontSize: 14,
      fontWeight: "600",
      marginRight: 10,
      color: "#444",
    },
    picker: {
      flex: 1,
      height: 50,
      color: "#333",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 16,
      marginBottom: 14,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    cardContent: {
      flexDirection: "row",
      marginBottom: 12,
    },
    productImage: {
      width: 70,
      height: 70,
      borderRadius: 10,
      marginRight: 14,
      backgroundColor: "#f0f0f0",
    },
    imagePlaceholder: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#e0e0e0",
    },
    imagePlaceholderText: {
      color: "#888",
      fontSize: 12,
    },
    productInfo: {
      flex: 1,
      justifyContent: "space-between",
    },
    productName: {
      fontSize: 18,
      fontWeight: "700",
      color: "#222",
      marginBottom: 6,
    },
    productCategory: {
      fontSize: 14,
      color: "#666",
      marginBottom: 2,
    },
    productId: {
      fontSize: 12,
      color: "#999",
      marginBottom: 2,
    },
    productQuantity: {
      fontSize: 14,
      color: "#444",
      fontWeight: "600",
      marginBottom: 2,
    },
    productPrice: {
      fontSize: 16,
      color: "#28a745",
      fontWeight: "700",
      marginBottom: 6,
    },
    productNotes: {
      fontSize: 12,
      color: "#666",
      fontStyle: "italic",
    },
    cardActions: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    viewButton: {
      backgroundColor: "#007bff",
      paddingVertical: 10,
      borderRadius: 6,
      flex: 1,
      marginRight: 8,
      alignItems: "center",
    },
    editButton: {
      backgroundColor: "#28a745",
      paddingVertical: 10,
      borderRadius: 6,
      flex: 1,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "700",
    },
    addButton: {
      backgroundColor: "#28a745",
      paddingVertical: 18,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 14,
      marginBottom: 20,
    },
    addButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "700",
    },
    listContainer: {
      paddingBottom: 30,
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 50,
    },
    emptyText: {
      fontSize: 16,
      color: "#888",
    },
  });
  