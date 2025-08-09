import {useErrorModal, formatApiError} from '../hooks/useErrorModal';

// Service Error Handler - can be used in any component
export const useServiceErrorHandler = () => {
  const errorModal = useErrorModal();

  const handleServiceError = (error: any, customMessage?: string) => {
    if (customMessage) {
      errorModal.showError(customMessage);
      return;
    }

    const {message, statusCode} = formatApiError(error);
    errorModal.showError(message, undefined, statusCode);
  };

  const handleNetworkError = () => {
    errorModal.showError(
      'Unable to connect to the server. Please check your internet connection and try again.',
      'Network Error',
      0,
    );
  };

  const handleAuthError = () => {
    errorModal.showError(
      'Your session has expired. Please log in again.',
      'Authentication Required',
      401,
    );
  };

  const handleServerError = () => {
    errorModal.showError(
      'The server is currently unavailable. Please try again later.',
      'Server Error',
      500,
    );
  };

  const handleValidationError = (message: string) => {
    errorModal.showError(message, 'Validation Error', 422);
  };

  return {
    ...errorModal,
    handleServiceError,
    handleNetworkError,
    handleAuthError,
    handleServerError,
    handleValidationError,
  };
};

export default useServiceErrorHandler;
