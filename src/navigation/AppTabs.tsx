// src/navigation/AppTabs.tsx
import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import InventoryScreen from "../screens/InventoryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ReportsScreen from "../screens/ReportsScreen";
import SalesScreen from "../screens/SalesScreen";
import StockScreen from "../screens/StockScreen";
import { Ionicons } from "@expo/vector-icons";
import { Appbar, Menu } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/Authcontext";
const Tab = createBottomTabNavigator();

const isAdmin = true;

const CustomHeader = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [iconColor, setIconColor] = useState("#000");
  const navigation = useNavigation();
  const { signOut } = useAuth(); // Get signOut function from auth context

  const openMenu = () => {
    setMenuVisible(true);
    setIconColor("#2f95dc");
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setIconColor("#000");
  };

  const handleMenuPress = (action: string) => {
    closeMenu();
    switch (action) {
      case "profile":
        navigation.navigate("Profile");
        break;
      case "users":
        // navigate to user management if applicable
        break;
      case "logout":
        handleLogout();
        break;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(); // Call the signOut function
      // Navigation to login is handled by the auth state change in RootNavigator
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Logout Failed", "There was an error logging out. Please try again.");
    }
  };

  return (
    <Appbar.Header>
      <Appbar.Content title="" />
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
        <Menu.Item onPress={() => handleMenuPress("profile")} title="Profile" />
        {isAdmin && (
          <Menu.Item
            onPress={() => handleMenuPress("users")}
            title="User Management"
          />
        )}
        <Menu.Item onPress={() => handleMenuPress("logout")} title="Log Out" />
      </Menu>
    </Appbar.Header>
  );
};

const AppTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Inventory"
      screenOptions={({ route }) => ({
        header: () => <CustomHeader />,
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          switch (route.name) {
            case "Inventory":
              iconName = "list-outline";
              break;
            case "Reports":
              iconName = "analytics-outline";
              break;
            case "Sales":
              iconName = "card-outline";
              break;
            case "Stock":
              iconName = "cube-outline";
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2f95dc",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Inventory" component={InventoryScreen} />
      {isAdmin && <Tab.Screen name="Reports" component={ReportsScreen} />}
      <Tab.Screen name="Sales" component={SalesScreen} />
      <Tab.Screen name="Stock" component={StockScreen} />
    </Tab.Navigator>
  );
};

export default AppTabs;