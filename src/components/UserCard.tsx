// src/components/UserCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  onEdit: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{user.name}</Text>
        <TouchableOpacity onPress={onEdit} style={styles.editButton} testID="edit-button">
          <MaterialIcons name="edit" size={20} color="#555" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.email}>{user.email}</Text>
      <View style={styles.roleContainer}>
        <Text style={styles.role}>Role: {user.role}</Text>
      </View>
    </View>
  );
};


export default UserCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3, // for Android shadow
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  email: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  roleContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  role: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    padding: 4,
    marginLeft: 8,
  },
});
