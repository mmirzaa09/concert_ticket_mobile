import React from 'react';
import {Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TabParamList} from '../types';
import {COLORS} from '../constants';

// Import Screens
import HomeScreen from '../screens/home/HomeScreen';
import HistoryScreen from '../screens/tickets/HistoryScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

// Icon components
const HomeIcon: React.FC<{color: string; size: number}> = ({color, size}) => (
  <Text style={{fontSize: size, color}}>🏠</Text>
);

const HistoryIcon: React.FC<{color: string; size: number}> = ({
  color,
  size,
}) => <Text style={{fontSize: size, color}}>📅</Text>;

const ProfileIcon: React.FC<{color: string; size: number}> = ({
  color,
  size,
}) => <Text style={{fontSize: size, color}}>👤</Text>;

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.primary,
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: HomeIcon,
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: HistoryIcon,
          tabBarLabel: 'History',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ProfileIcon,
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
