// src/navigation/AppTabs.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InventoryScreen from '../screens/InventoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ReportsScreen from '../screens/ReportsScreen';
import SalesScreen from '../screens/SalesScreen';
import StockScreen from '../screens/StockScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const AppTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Inventory"
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          switch (route.name) {
            case 'Inventory':
              iconName = 'ios-list';
              break;
            case 'Profile':
              iconName = 'ios-person';
              break;
            case 'Reports':
              iconName = 'ios-stats-chart';
              break;
            case 'Sales':
              iconName = 'ios-cash';
              break;
            case 'Stock':
              iconName = 'ios-albums';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2f95dc',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Inventory" component={InventoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="Sales" component={SalesScreen} />
      <Tab.Screen name="Stock" component={StockScreen} />
    </Tab.Navigator>
  );
};

export default AppTabs;
