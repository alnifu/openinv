// src/screens/UserManagementScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import UserCard from '../components/UserCard';
import UserFormModal from '../components/UserFormModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const UserManagementScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Get users from storage
  const getUsersFromStorage = async (): Promise<User[]> => {
    try {
      const usersJson = await AsyncStorage.getItem('users');
      if (usersJson) return JSON.parse(usersJson);
      
      // Default users if none exist
      const defaultUsers = [
        { id: '1', name: 'Juan Dela Cruz', email: 'juan@email.com', role: 'Staff' },
        { id: '2', name: 'Maria Santos', email: 'maria@email.com', role: 'Admin' },
      ];
      await AsyncStorage.setItem('users', JSON.stringify(defaultUsers));
      return defaultUsers;
    } catch (error) {
      throw new Error('Failed to load users');
    }
  };

  // Save users to storage
  const saveUsersToStorage = async (usersList: User[]) => {
    try {
      await AsyncStorage.setItem('users', JSON.stringify(usersList));
    } catch (error) {
      throw new Error('Failed to save users');
    }
  };

  // Load users
  const loadUsers = async () => {
    setLoading(true);
    try {
      const storedUsers = await getUsersFromStorage();
      setUsers(storedUsers);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Handle edit user
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  // Handle add user
  const handleAddUser = () => {
    setSelectedUser({
      id: Math.random().toString(36).substr(2, 9), // Generate random ID
      name: '',
      email: '',
      role: '',
    });
    setIsModalVisible(true);
  };

  // Handle save user
  const handleSaveUser = async (updatedUser: Omit<User, 'id'>) => {
    if (!selectedUser) return;
    
    try {
      let updatedUsers;
      if (users.some(user => user.id === selectedUser.id)) {
        // Update existing user
        updatedUsers = users.map(user =>
          user.id === selectedUser.id ? { ...updatedUser, id: selectedUser.id } : user
        );
      } else {
        // Add new user
        updatedUsers = [...users, { ...updatedUser, id: selectedUser.id }];
      }
      
      await saveUsersToStorage(updatedUsers);
      setUsers(updatedUsers);
      setIsModalVisible(false);
    } catch (err) {
      setError('Failed to save user');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={loadUsers} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onEdit={() => handleEditUser(item)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
  showsHorizontalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadUsers}
      />

      <TouchableOpacity style={styles.addBtn} onPress={handleAddUser}>
        <Text style={styles.addBtnText}>+ Add User</Text>
      </TouchableOpacity>

      <UserFormModal
        visible={isModalVisible}
        user={selectedUser || { id: '', name: '', email: '', role: '' }}
        onSave={handleSaveUser}
        onCancel={() => setIsModalVisible(false)}
      />
    </View>
  );
};

export default UserManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addBtn: {
    backgroundColor: "#28a745",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 40,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});