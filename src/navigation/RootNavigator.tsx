// src/navigation/RootNavigator.tsx
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import AppTabs from './AppTabs';
import ProfileScreen from '../screens/ProfileScreen';
import UserManagementScreen from '../screens/UserManagementScreen';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Profile: undefined;
  User: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Home">
              {(props) => <AppTabs {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="User" component={UserManagementScreen} />
          </>
        )}
      </Stack.Navigator>
  );
}
