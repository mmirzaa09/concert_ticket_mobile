import {useEffect, useState} from 'react';
import {useAuth} from '../context/AuthContext';
import {setSessionExpiredCallback} from '../services/api/apiService';
import {NavigationService} from '../services/NavigationService';

export const useSessionManager = () => {
  const {logout} = useAuth();
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  const handleSessionExpiredConfirm = async () => {
    setShowSessionExpired(false);

    try {
      // Log out the user
      await logout();

      // Navigate to login screen
      NavigationService.reset('Login');
    } catch (error) {
      console.error('Error during session expiry logout:', error);
      // Force navigation to login even if logout fails
      NavigationService.reset('Login');
    }
  };

  useEffect(() => {
    // Set up the session expired callback
    const handleSessionExpired = () => {
      // Show session expired modal
      setShowSessionExpired(true);
    };

    // Register the callback with the API service
    setSessionExpiredCallback(handleSessionExpired);

    // Cleanup function
    return () => {
      setSessionExpiredCallback(() => {});
    };
  }, [logout]);

  return {
    showSessionExpired,
    handleSessionExpiredConfirm,
  };
};
