import React from 'react';
import {View, Button, Text} from 'react-native';
import {ErrorModal} from '../../components/common';
import {useErrorModal, formatApiError} from '../../hooks/useErrorModal';

const ErrorTestComponent: React.FC = () => {
  const {
    isVisible,
    errorMessage,
    errorTitle,
    statusCode,
    showError,
    hideError,
  } = useErrorModal();

  // Simulate your API error response
  const testApiError = () => {
    const apiResponse = {
      data: null,
      message: 'Invalid credentials',
      status: 'Unauthorized',
      status_code: 401,
    };

    const {message, statusCode: code} = formatApiError(apiResponse);
    showError(message, undefined, code);
  };

  const testServerError = () => {
    const serverResponse = {
      data: null,
      message: 'Internal server error',
      status: 'Internal Server Error',
      status_code: 500,
    };

    const {message, statusCode: code} = formatApiError(serverResponse);
    showError(message, undefined, code);
  };

  const testValidationError = () => {
    const validationResponse = {
      data: null,
      message: 'Email field is required',
      status: 'Unprocessable Entity',
      status_code: 422,
    };

    const {message, statusCode: code} = formatApiError(validationResponse);
    showError(message, undefined, code);
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', padding: 20}}>
      <Text style={{fontSize: 18, marginBottom: 20, textAlign: 'center'}}>
        Test Error Modal with Status Codes
      </Text>

      <Button title="Test 401 - Unauthorized" onPress={testApiError} />
      <View style={{marginVertical: 10}} />

      <Button title="Test 500 - Server Error" onPress={testServerError} />
      <View style={{marginVertical: 10}} />

      <Button
        title="Test 422 - Validation Error"
        onPress={testValidationError}
      />

      <ErrorModal
        visible={isVisible}
        title={errorTitle}
        message={errorMessage}
        statusCode={statusCode}
        onClose={hideError}
      />
    </View>
  );
};

export default ErrorTestComponent;
