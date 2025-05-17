// src/screens/UserManagementScreen.tsx

import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import UserCard from '../components/UserCard';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const dummyUsers: User[] = [
  { id: '1', name: 'Juan Dela Cruz', email: 'juan@email.com', role: 'Staff' },
  { id: '2', name: 'Maria Santos', email: 'maria@email.com', role: 'Manager' },
];

const UserManagementScreen = () => {
  const handleEditUser = (user: User) => {
    console.log('Edit user:', user);
    // navigate to user form or show modal here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>User Management</Text>

      <FlatList
        data={dummyUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onEdit={() => handleEditUser(item)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      <TouchableOpacity style={styles.addBtn}>
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
});
