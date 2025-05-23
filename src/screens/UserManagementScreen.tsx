// src/screens/UserManagementScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import UserCard from '../components/UserCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Mock function to simulate getting users from AsyncStorage
const getUsersFromStorage = async (): Promise<User[]> => {
  // In a real app, you would do:
  // const usersJson = await AsyncStorage.getItem('users');
  // return usersJson ? JSON.parse(usersJson) : [];
  
  // For now, we'll simulate a delay and return dummy data
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { id: '1', name: 'Juan Dela Cruz', email: 'juan@email.com', role: 'Staff' },
    { id: '2', name: 'Maria Santos', email: 'maria@email.com', role: 'Manager' },
  ];
};

const UserManagementScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const storedUsers = await getUsersFromStorage();
        setUsers(storedUsers);
      } catch (err) {
        setError('Failed to load users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEditUser = (user: User) => {
    console.log('Edit user:', user);
    // navigate to user form or show modal here
  };

  const handleAddUser = () => {
    console.log('Add new user');
    // navigate to user form or show modal here
  };

  const refreshUsers = async () => {
    setLoading(true);
    try {
      const storedUsers = await getUsersFromStorage();
      setUsers(storedUsers);
    } catch (err) {
      setError('Failed to refresh users');
      console.error(err);
    } finally {
      setLoading(false);
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
        <TouchableOpacity onPress={refreshUsers} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>User Management</Text>

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
        refreshing={loading}
        onRefresh={refreshUsers}
      />

      <TouchableOpacity style={styles.addBtn} onPress={handleAddUser}>
        <Text style={styles.addBtnText}>+ Add User</Text>
      </TouchableOpacity>
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
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
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