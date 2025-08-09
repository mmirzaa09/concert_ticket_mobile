import React, {useState} from 'react';
import {View, Text, Button, Alert, StyleSheet} from 'react-native';
import {apiService} from '../services/api/apiService';

const ApiTestComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  const testServerConnection = async () => {
    setIsLoading(true);
    setTestResult('Testing connection...');

    try {
      // Test basic server connectivity
      const response = await fetch('http://localhost:8000');
      const text = await response.text();

      if (response.ok) {
        setTestResult('✅ Server is reachable! Response: ' + text);
      } else {
        setTestResult('❌ Server responded with error: ' + response.status);
      }
    } catch (error) {
      setTestResult('❌ Connection failed: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const testUserRegistration = async () => {
    setIsLoading(true);
    setTestResult('Testing user registration...');

    try {
      const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword123',
        phone_number: '+1234567890',
      };

      const response = await apiService.register(testUser);
      setTestResult(
        '✅ Registration test successful: ' + JSON.stringify(response, null, 2),
      );
    } catch (error) {
      setTestResult('❌ Registration test failed: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const testUserLogin = async () => {
    setIsLoading(true);
    setTestResult('Testing user login...');

    try {
      const credentials = {
        email: 'test@example.com',
        password: 'testpassword123',
      };

      const response = await apiService.login(credentials);
      setTestResult(
        '✅ Login test successful: ' + JSON.stringify(response, null, 2),
      );
    } catch (error) {
      setTestResult('❌ Login test failed: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Connection Test</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Test Server Connection"
          onPress={testServerConnection}
          disabled={isLoading}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Test User Registration"
          onPress={testUserRegistration}
          disabled={isLoading}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Test User Login"
          onPress={testUserLogin}
          disabled={isLoading}
        />
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Result:</Text>
        <Text style={styles.resultText}>{testResult}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
});

export default ApiTestComponent;
