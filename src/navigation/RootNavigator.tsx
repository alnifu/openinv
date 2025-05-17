import React, { useState, useEffect } from 'react'; // Import useEffect
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import AppTabs from './AppTabs';
import ProfileScreen from '../screens/ProfileScreen';
import UserManagementScreen from '../screens/UserManagementScreen'

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Profile: undefined;
  UserManagement: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen
                {...props}
                onLogin={() => setIsLoggedIn(true)}
              />
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Home" component={AppTabs} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="UserManagement" component={UserManagementScreen} />
            
          </>
        )}
      </Stack.Navigator>
  );
}