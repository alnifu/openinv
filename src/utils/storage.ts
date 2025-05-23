// src/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Item {
  id: string;
  image?: string;
  itemId: string; // For barcode functionality
  itemName: string;
  category: string;
  quantity: number;
  sellingPrice: number;
  notes?: string;
}

export interface SoldItem {
  id: string;
  itemId: string;
  itemName: string;
  category: string;
  quantitySold: number;
  dateSold: string;
  priceSold: number;
}

const ITEMS_KEY = '@inventory_items';
const SOLD_ITEMS_KEY = '@sold_items';

// Item Management
export const saveItems = async (items: Item[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving items:', error);
    throw error;
  }
};

export const getItems = async (): Promise<Item[]> => {
  try {
    const itemsJson = await AsyncStorage.getItem(ITEMS_KEY);
    return itemsJson ? JSON.parse(itemsJson) : [];
  } catch (error) {
    console.error('Error getting items:', error);
    return [];
  }
};

export const addItem = async (item: Item): Promise<void> => {
  try {
    const items = await getItems();
    items.push(item);
    await saveItems(items);
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
};

export const updateItem = async (updatedItem: Item): Promise<void> => {
  try {
    const items = await getItems();
    const index = items.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      items[index] = updatedItem;
      await saveItems(items);
    }
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

export const deleteItem = async (itemId: string): Promise<void> => {
  try {
    const items = await getItems();
    const filteredItems = items.filter(item => item.id !== itemId);
    await saveItems(filteredItems);
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

// Sold Items Management
export const saveSoldItems = async (soldItems: SoldItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(SOLD_ITEMS_KEY, JSON.stringify(soldItems));
  } catch (error) {
    console.error('Error saving sold items:', error);
    throw error;
  }
};

export const getSoldItems = async (): Promise<SoldItem[]> => {
    try {
      const soldItemsJson = await AsyncStorage.getItem(SOLD_ITEMS_KEY);
      const parsed: SoldItem[] = soldItemsJson ? JSON.parse(soldItemsJson) : [];
  
      // Remove any that are missing priceSold or quantitySold
      const cleaned = parsed.filter(
        item =>
          item.itemId &&
          item.quantitySold != null &&
          typeof item.priceSold === 'number' &&
          !isNaN(item.priceSold)
      );
  
      // If cleanup removed anything, save it
      if (cleaned.length !== parsed.length) {
        await saveSoldItems(cleaned);
      }
  
      return cleaned;
    } catch (error) {
      console.error('Error getting sold items:', error);
      return [];
    }
  };
  

export const addSoldItem = async (soldItem: SoldItem): Promise<void> => {
  try {
    const soldItems = await getSoldItems();
    soldItems.push(soldItem);
    await saveSoldItems(soldItems);
  } catch (error) {
    console.error('Error adding sold item:', error);
    throw error;
  }
};

export const updateSoldItem = async (updatedSoldItem: SoldItem): Promise<void> => {
  try {
    const soldItems = await getSoldItems();
    const index = soldItems.findIndex(item => item.id === updatedSoldItem.id);
    if (index !== -1) {
      soldItems[index] = updatedSoldItem;
      await saveSoldItems(soldItems);
    }
  } catch (error) {
    console.error('Error updating sold item:', error);
    throw error;
  }
};

export const deleteSoldItem = async (soldItemId: string): Promise<void> => {
  try {
    const soldItems = await getSoldItems();
    const filteredSoldItems = soldItems.filter(item => item.id !== soldItemId);
    await saveSoldItems(filteredSoldItems);
  } catch (error) {
    console.error('Error deleting sold item:', error);
    throw error;
  }
};

// Utility function to sell items (reduce inventory and add to sold items)
export const sellItem = async (itemId: string, quantityToSell: number): Promise<boolean> => {
  try {
    const items = await getItems();
    const item = items.find(i => i.id === itemId);
    
    if (!item || item.quantity < quantityToSell) {
      return false; // Not enough stock
    }
    
    // Update inventory
    item.quantity -= quantityToSell;
    await updateItem(item);
    
    // Add to sold items
    const soldItem: SoldItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      itemId: item.itemId,
      itemName: item.itemName,
      category: item.category,
      quantitySold: quantityToSell,
      dateSold: new Date().toISOString(),
      priceSold: item.sellingPrice, // ✅ Add this line
    };
    
    await addSoldItem(soldItem);
    return true;
  } catch (error) {
    console.error('Error selling item:', error);
    return false;
  }
};