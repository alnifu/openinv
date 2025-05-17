// src/screens/UserForm.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const UserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const handleSave = () => {
    if (!name || !email || !role) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    console.log('User saved:', { name, email, role });
    Alert.alert('Success', 'User saved successfully');
    setName('');
    setEmail('');
    setRole('');
  };

  const handleCancel = () => {
    setName('');
    setEmail('');
    setRole('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>User Form</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Role"
        value={role}
        onChangeText={setRole}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.btnText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserForm;

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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  saveBtn: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
