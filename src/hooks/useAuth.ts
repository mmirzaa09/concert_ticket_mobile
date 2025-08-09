import {useAppSelector, useAppDispatch} from '../store/hooks';
import {restoreUserSession, logoutUser} from '../store/slices/authSlice';
import {useEffect} from 'react';

// Custom hook for managing user authentication
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(state => state.auth);

  // Restore user session on app start
  useEffect(() => {
    if (!authState.isAuthenticated && !authState.isLoading) {
      dispatch(restoreUserSession());
    }
  }, [dispatch, authState.isAuthenticated, authState.isLoading]);

  const logout = async () => {
    await dispatch(logoutUser());
  };

  return {
    // Current user data
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,

    // Actions
    logout,

    // Helper functions
    getUserId: () => authState.user?.id,
    getUserEmail: () => authState.user?.email,
    getUserName: () => authState.user?.name,
    hasToken: () => !!authState.token,
  };
};

export default useAuth;
