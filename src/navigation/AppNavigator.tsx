import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, Text } from 'react-native';

import { COLORS } from '../constants/theme';

// Import navigators with try-catch to prevent errors
let AuthNavigator: any;
let CustomerNavigator: any;
let ProviderNavigator: any;

try {
  AuthNavigator = require('./AuthNavigator').default;
} catch {
  AuthNavigator = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Auth Navigator Loading...</Text>
    </View>
  );
}

try {
  CustomerNavigator = require('./CustomerNavigator').default;
} catch {
  CustomerNavigator = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Customer Navigator Loading...</Text>
    </View>
  );
}

try {
  ProviderNavigator = require('./ProviderNavigator').default;
} catch {
  ProviderNavigator = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Provider Navigator Loading...</Text>
    </View>
  );
}

// Import screens - using conditional imports to prevent errors
let SplashScreen: any;
let OnboardingScreen: any;

try {
  SplashScreen = require('../screens/shared/SplashScreen').default;
} catch {
  SplashScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
      <Text>Loading...</Text>
    </View>
  );
}

try {
  OnboardingScreen = require('../screens/shared/OnboardingScreen').default;
} catch {
  OnboardingScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
      <Text>Welcome to GharSathi</Text>
    </View>
  );
}

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Customer: undefined;
  Provider: undefined;
  Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  // Simple state management for demo
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userType, setUserType] = React.useState<'customer' | 'provider' | null>(null);

  useEffect(() => {
    // Simulate app initialization
    setTimeout(() => {
      setIsLoading(false);
      setIsAuthenticated(false); // Set to true if you want to skip auth
      setUserType('customer');
    }, 2000);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const getInitialRouteName = (): keyof RootStackParamList => {
    if (!isAuthenticated) {
      return 'Auth';
    }

    return userType === 'customer' ? 'Customer' : 'Provider';
  };

  return (
    <Stack.Navigator
      initialRouteName={getInitialRouteName()}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen 
        name="Splash" 
        component={SplashScreen} 
      />
      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingScreen} 
      />
      <Stack.Screen 
        name="Auth" 
        component={AuthNavigator} 
      />
      <Stack.Screen 
        name="Customer" 
        component={CustomerNavigator} 
      />
      <Stack.Screen 
        name="Provider" 
        component={ProviderNavigator} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
