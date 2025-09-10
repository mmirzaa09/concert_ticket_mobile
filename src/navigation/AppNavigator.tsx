import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '../types';
import {COLORS} from '../constants';

// Import Screens
import {
  OnboardingScreen,
  LoginScreen,
  RegisterScreen,
  ConcertDetailScreen,
  ConcertInquiryScreen,
  PaymentScreen,
  PaymentInstructionsScreen,
} from '../screens';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: {
          backgroundColor: COLORS.background,
        },
      }}>
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ConcertDetail"
        component={ConcertDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ConcertInquiry"
        component={ConcertInquiryScreen}
        options={{
          title: 'Confirm Your Ticket Purchase',
        }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          title: 'Payment',
        }}
      />
      <Stack.Screen
        name="PaymentInstructions"
        component={PaymentInstructionsScreen}
        options={{
          title: 'Payment Instructions',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
