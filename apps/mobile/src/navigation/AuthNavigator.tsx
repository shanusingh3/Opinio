import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  WelcomeScreen,
  PhoneInputScreen,
  OTPVerificationScreen,
} from '@/features/auth/screens';
import { Routes } from './routes';
import { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name={Routes.Auth.Welcome}
        component={WelcomeScreen}
      />
      <Stack.Screen
        name={Routes.Auth.PhoneInput}
        component={PhoneInputScreen}
      />
      <Stack.Screen
        name={Routes.Auth.OTPVerification}
        component={OTPVerificationScreen}
      />
    </Stack.Navigator>
  );
};
