// src/screens/ProfileScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  // Initial user data
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'user',
    profilePicture: null as string | null,
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  const [tempEmail, setTempEmail] = useState(user.email);

  const handleEditPress = () => {
    if (isEditing) {
      // Save changes
      setUser({
        ...user,
        name: tempName,
        email: tempEmail,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setTempName(user.name);
    setTempEmail(user.email);
    setIsEditing(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUser({ ...user, profilePicture: result.assets[0].uri });
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Camera access is needed to take photos');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUser({ ...user, profilePicture: result.assets[0].uri });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={handleEditPress}>
          <Text style={styles.editButton}>{isEditing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <TouchableOpacity onPress={pickImage} disabled={!isEditing}>
          <View style={styles.avatarContainer}>
            {user.profilePicture ? (
              <Image source={{ uri: user.profilePicture }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={50} color="#fff" />
              </View>
            )}
            {isEditing && (
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            )}
          </View>
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity onPress={takePhoto} style={styles.photoOption}>
            <Text style={styles.photoOptionText}>Take Photo</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={tempName}
              onChangeText={setTempName}
              autoCapitalize="words"
            />
          ) : (
            <Text style={styles.value}>{user.name}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={tempEmail}
              onChangeText={setTempEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Text style={styles.value}>{user.email}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{user.role}</Text>
        </View>
      </View>

      {isEditing && (
        <TouchableOpacity onPress={handleCancelEdit} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  editButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoOption: {
    marginTop: 5,
  },
  photoOptionText: {
    color: '#007AFF',
    fontSize: 14,
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 5,
  },
  cancelButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  cancelButtonText: {
    color: '#ff3b30',
    fontSize: 16,
  },
});

export default ProfileScreen;