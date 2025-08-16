import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ProviderTabParamList, ProviderStackParamList } from '../types';

// Import screens (placeholder implementations)
import ProviderDashboardScreen from '../screens/provider/ProviderDashboardScreen';
import ProviderJobsScreen from '../screens/provider/ProviderJobsScreen';
import ProviderEarningsScreen from '../screens/provider/ProviderEarningsScreen';
import ProviderProfileScreen from '../screens/provider/ProviderProfileScreen';
import ProviderSupportScreen from '../screens/provider/ProviderSupportScreen';

const Tab = createBottomTabNavigator<ProviderTabParamList>();
const Stack = createStackNavigator<ProviderStackParamList>();

// Tab Navigator
const ProviderTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#6C757D',
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={ProviderDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen 
        name="Jobs" 
        component={ProviderJobsScreen}
        options={{
          tabBarLabel: 'Jobs',
        }}
      />
      <Tab.Screen 
        name="Earnings" 
        component={ProviderEarningsScreen}
        options={{
          tabBarLabel: 'Earnings',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProviderProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
      <Tab.Screen 
        name="Support" 
        component={ProviderSupportScreen}
        options={{
          tabBarLabel: 'Support',
        }}
      />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const ProviderNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="ProviderTabs" 
        component={ProviderTabNavigator} 
      />
      {/* Add other stack screens here like JobDetails, Navigation, etc. */}
    </Stack.Navigator>
  );
};

export default ProviderNavigator;
