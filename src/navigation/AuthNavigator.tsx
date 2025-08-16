import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from '../types';

// Import auth screens with type assertions to help TypeScript service
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import OtpVerificationScreen from '../screens/auth/OtpVerificationScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';
import CompleteProfileScreen from '../screens/auth/CompleteProfileScreen';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen} 
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen} 
      />
      <Stack.Screen 
        name="OtpVerification" 
        component={OtpVerificationScreen} 
      />
      <Stack.Screen 
        name="RoleSelection" 
        component={RoleSelectionScreen} 
      />
      <Stack.Screen 
        name="CompleteProfile" 
        component={CompleteProfileScreen} 
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
