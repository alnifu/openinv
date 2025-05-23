// src/navigation/AppTabs.tsx
import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InventoryScreen from '../screens/InventoryScreen';
import ReportsScreen from '../screens/ReportsScreen';
import SalesScreen from '../screens/SalesScreen';
import ScannerScreen from '../screens/ScannerScreen';
import StockScreen from '../screens/StockScreen';
import { Ionicons } from '@expo/vector-icons';
import { Appbar, Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const isAdmin = true;

const CustomHeader = ({ setIsLoggedIn, title }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [iconColor, setIconColor] = useState('#000');
  const navigation = useNavigation();

  const openMenu = () => {
    setMenuVisible(true);
    setIconColor('#2f95dc');
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setIconColor('#000');
  };

  const handleMenuPress = (action) => {
    closeMenu();
    switch (action) {
      case 'profile':
        navigation.navigate('Profile');
        break;
        case 'users':
        navigation.navigate('User');
        break;
      case 'logout':
        setIsLoggedIn(false);
        break;
    }
  };

  return (
    <Appbar.Header>
      <Appbar.Content title={title} />
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <Appbar.Action
            icon="cog-outline"
            color={iconColor}
            onPress={openMenu}
          />
        }
      >
        <Menu.Item onPress={() => handleMenuPress('profile')} title="Profile" />
        {isAdmin && (
          <Menu.Item onPress={() => handleMenuPress('users')} title="User Management" />
        )}
        <Menu.Item onPress={() => handleMenuPress('logout')} title="Log Out" />
      </Menu>
    </Appbar.Header>
  );
};

const AppTabs = ({ setIsLoggedIn }) => {
  return (
    <Tab.Navigator
      initialRouteName="Inventory"
      screenOptions={({ route }) => ({
        header: () => <CustomHeader setIsLoggedIn={setIsLoggedIn} title={route.name} />,
        tabBarIcon: ({ color, size }) => {
          let iconName = '';
          switch (route.name) {
            case 'Inventory':
              iconName = 'list-outline';
              break;
            case 'Reports':
              iconName = 'analytics-outline';
              break;
            case 'Sales':
              iconName = 'card-outline';
              break;
            case 'Scanner':
              iconName = 'qr-code-outline';
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
      <Tab.Screen name="Inventory" component={InventoryScreen} />
      <Tab.Screen name="Scanner" component={ScannerScreen} />

      {isAdmin && <Tab.Screen name="Reports" component={ReportsScreen} />}
      <Tab.Screen name="Sales" component={SalesScreen} />
      <Tab.Screen name="Stock" component={StockScreen} />
    </Tab.Navigator>
  );
};


export default AppTabs;
