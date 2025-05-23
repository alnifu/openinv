// src/navigation/RootNavigator.tsx
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import AppTabs from './AppTabs';
import ProfileScreen from '../screens/ProfileScreen';
import UserManagementScreen from '../screens/UserManagementScreen';
import ProductViewScreen from '../screens/ProductViewScreen';
import SalesFormScreen from '../screens/SalesFormScreen';
import SalesViewScreen from '../screens/SalesViewScreen';
import ProductFormScreen from '../screens/ProductFormScreen';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Profile: undefined;
  User: undefined;
  ProductView: undefined;
  ProductForm: undefined;
  SalesForm: undefined;
  SalesView: undefined;
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
            <Stack.Screen name="ProductView" component={ProductViewScreen} />
            <Stack.Screen name="ProductForm" component={ProductFormScreen} />
            <Stack.Screen name="SalesView" component={SalesViewScreen} />
            <Stack.Screen name="SalesForm" component={SalesFormScreen} />
          </>
        )}
      </Stack.Navigator>
  );
}
