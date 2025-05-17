// src/components/UserCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type UserCardProps = {
  name: string;
  email: string;
  role?: string; // Optional: user role like "owner", "staff"
};

const UserCard: React.FC<UserCardProps> = ({ name, email, role }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
      {role && <Text style={styles.role}>Role: {role}</Text>}
    </View>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, // for Android shadow
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#555',
  },
  role: {
    marginTop: 6,
    fontSize: 12,
    fontStyle: 'italic',
    color: '#888',
  },
});
