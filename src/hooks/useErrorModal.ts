import {useState, useCallback} from 'react';

interface UseErrorModalReturn {
  isVisible: boolean;
  errorMessage: string;
  errorTitle: string;
  statusCode: number | undefined;
  showError: (message: string, title?: string, statusCode?: number) => void;
  hideError: () => void;
  retry: (() => void) | undefined;
  setRetryFunction: (retryFn: () => void) => void;
}

export const useErrorModal = (): UseErrorModalReturn => {
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorTitle, setErrorTitle] = useState('Error');
  const [statusCode, setStatusCode] = useState<number | undefined>(undefined);
  const [retry, setRetry] = useState<(() => void) | undefined>(undefined);

  const showError = useCallback(
    (message: string, title = 'Error', code?: number) => {
      setErrorMessage(message);
      setErrorTitle(title);
      setStatusCode(code);
      setIsVisible(true);
    },
    [],
  );

  const hideError = useCallback(() => {
    setIsVisible(false);
    setErrorMessage('');
    setStatusCode(undefined);
    setRetry(undefined);
  }, []);

  const setRetryFunction = useCallback((retryFn: () => void) => {
    setRetry(() => retryFn);
  }, []);

  return {
    isVisible,
    errorMessage,
    errorTitle,
    statusCode,
    showError,
    hideError,
    retry,
    setRetryFunction,
  };
};

// Helper function to format API errors
export const formatApiError = (
  error: any,
): {message: string; statusCode?: number} => {
  // Handle your API response format
  if (error && typeof error === 'object') {
    // Your API format: {"data": null, "message": "Invalid credentials", "status": "Unauthorized", "status_code": 401}
    if (error.message && error.status_code) {
      return {
        message: error.message,
        statusCode: error.status_code,
      };
    }

    // Handle other error formats
    if (error.response?.data) {
      const responseData = error.response.data;
      return {
        message: responseData.message || 'An error occurred',
        statusCode: responseData.status_code || error.response.status,
      };
    }

    // Handle error object with message
    if (error.message) {
      return {
        message: error.message,
        statusCode: error.status || error.statusCode,
      };
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {message: error};
  }

  // Handle network errors
  if (error?.name === 'NetworkError') {
    return {
      message: 'Please check your internet connection and try again.',
      statusCode: 0,
    };
  }

  // Handle timeout errors
  if (error?.name === 'TimeoutError') {
    return {
      message: 'Request timed out. Please try again.',
      statusCode: 408,
    };
  }

  // Default error
  return {message: 'An unexpected error occurred. Please try again.'};
};

export default useErrorModal;
