import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { CustomerTabParamList, CustomerStackParamList } from '../types';

// Import existing screens
import CustomerHomeScreen from '../screens/customer/CustomerHomeScreen';
import CustomerSearchScreen from '../screens/customer/CustomerSearchScreen';
import CustomerBookingsScreen from '../screens/customer/CustomerBookingsScreen';
import CustomerProfileScreen from '../screens/customer/CustomerProfileScreen';
import CustomerSupportScreen from '../screens/customer/CustomerSupportScreen';

// Phase 2 screens
import CategoryListScreen from '../screens/customer/CategoryListScreen';
import ServiceListScreen from '../screens/customer/ServiceListScreen';
import ServiceDetailScreen from '../screens/customer/ServiceDetailScreen';
import BookingFlowScreen from '../screens/customer/BookingFlowScreen';
import PaymentScreen from '../screens/customer/PaymentScreen';
import ProviderDetailScreen from '../screens/customer/ProviderDetailScreen';

const Tab = createBottomTabNavigator<CustomerTabParamList>();
const Stack = createStackNavigator<CustomerStackParamList>();

// Tab Navigator
const CustomerTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#6C757D',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={CustomerHomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={CustomerSearchScreen}
        options={{
          tabBarLabel: 'Search',
        }}
      />
      <Tab.Screen 
        name="Bookings" 
        component={CustomerBookingsScreen}
        options={{
          tabBarLabel: 'Bookings',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={CustomerProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
      <Tab.Screen 
        name="Support" 
        component={CustomerSupportScreen}
        options={{
          tabBarLabel: 'Support',
        }}
      />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const CustomerNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="CustomerTabs" 
        component={CustomerTabNavigator} 
      />
      {/* Phase 2 Navigation Screens */}
      <Stack.Screen 
        name="CategoryList" 
        component={CategoryListScreen} 
      />
      <Stack.Screen 
        name="ServiceList" 
        component={ServiceListScreen} 
      />
      <Stack.Screen 
        name="ServiceDetail" 
        component={ServiceDetailScreen} 
      />
      <Stack.Screen 
        name="BookingFlow" 
        component={BookingFlowScreen} 
      />
      <Stack.Screen 
        name="PaymentScreen" 
        component={PaymentScreen} 
      />
      <Stack.Screen 
        name="ProviderDetail" 
        component={ProviderDetailScreen} 
      />
    </Stack.Navigator>
  );
};

export default CustomerNavigator;
