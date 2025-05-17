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
              iconName = 'list-outline'; 
              break;
            case 'Profile':
              iconName = 'person-circle-outline'; 
              break;
            case 'Reports':
              iconName = 'analytics-outline'; 
              break;
            case 'Sales':
              iconName = 'card-outline'; 
              break;
            case 'Stock':
              iconName = 'cube-outline';
              break;
          }
          

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2f95dc',
        tabBarInactiveTintColor: 'gray',
      })}
    >
    
      <Tab.Screen name="Inventory" component={InventoryScreen} options={{ tabBarLabel: 'Inventory' }} />
<Tab.Screen name="Reports" component={ReportsScreen} options={{ tabBarLabel: 'Reports' }} />
<Tab.Screen name="Sales" component={SalesScreen} options={{ tabBarLabel: 'Sales' }} />
<Tab.Screen name="Stock" component={StockScreen} options={{ tabBarLabel: 'Stock' }} />
{/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}

    </Tab.Navigator>
  );
};

export default AppTabs;
