import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {apiService} from '../services/api/apiService';
import {COLORS} from '../constants';
import {responsiveFontSize, spacing} from '../utils';

export const SessionTestComponent: React.FC = () => {
  const {state, logout} = useAuth();

  const testApiCall = async () => {
    try {
      const result = await apiService.getConcerts();
      Alert.alert('Success', 'API call successful');
      console.log('API Result:', result);
    } catch (error: any) {
      Alert.alert('Error', error.message);
      console.error('API Error:', error);
    }
  };

  const simulateSessionExpiry = () => {
    Alert.alert(
      'Test Session Expiry',
      'This will simulate a session expiration. Continue?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Yes',
          onPress: () => {
            apiService.simulateSessionExpiration();
          },
        },
      ],
    );
  };

  const manualLogout = async () => {
    try {
      await logout();
      Alert.alert('Success', 'Logged out successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session Management Test</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Auth Status:</Text>
        <Text
          style={[
            styles.statusValue,
            state.isAuthenticated
              ? styles.authenticated
              : styles.notAuthenticated,
          ]}>
          {state.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
        </Text>
      </View>

      <View style={styles.userContainer}>
        <Text style={styles.statusLabel}>User:</Text>
        <Text style={styles.statusValue}>
          {state.user ? state.user.name : 'None'}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={testApiCall}>
        <Text style={styles.buttonText}>Test Protected API Call</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.warningButton]}
        onPress={simulateSessionExpiry}>
        <Text style={styles.buttonText}>Simulate Session Expiry</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.dangerButton]}
        onPress={manualLogout}>
        <Text style={styles.buttonText}>Manual Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  title: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    color: COLORS.gold,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statusLabel: {
    fontSize: responsiveFontSize(16),
    color: COLORS.textSecondary,
  },
  statusValue: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    color: COLORS.text,
  },
  authenticated: {
    color: COLORS.success,
  },
  notAuthenticated: {
    color: COLORS.error,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  warningButton: {
    backgroundColor: COLORS.warning,
  },
  dangerButton: {
    backgroundColor: COLORS.error,
  },
  buttonText: {
    fontSize: responsiveFontSize(14),
    fontWeight: '600',
    color: COLORS.text,
  },
});
