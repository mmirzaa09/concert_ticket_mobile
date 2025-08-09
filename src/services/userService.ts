import {store} from '../store';
import {clearError, resetAuth} from '../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '../constants';

// User Data Helper Functions
export const userService = {
  // Get current user from store
  getCurrentUser: () => {
    const state = store.getState();
    return state.auth.user;
  },

  // Get current token from store
  getToken: () => {
    const state = store.getState();
    return state.auth.token;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const state = store.getState();
    return state.auth.isAuthenticated && !!state.auth.token;
  },

  // Get auth state
  getAuthState: () => {
    const state = store.getState();
    return state.auth;
  },

  // Clear auth error
  clearAuthError: () => {
    store.dispatch(clearError());
  },

  // Logout user (clear store and async storage)
  logout: async () => {
    try {
      // Clear Redux store
      store.dispatch(resetAuth());

      // Clear specific auth data from AsyncStorage
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);

      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  },

  // Save additional user data to AsyncStorage (for backup)
  saveUserDataToStorage: async (userData: any, token: string) => {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.USER_DATA, JSON.stringify(userData)],
        [STORAGE_KEYS.USER_TOKEN, token],
      ]);
      return true;
    } catch (error) {
      console.error('Error saving user data to storage:', error);
      return false;
    }
  },

  // Get user data from AsyncStorage (fallback)
  getUserDataFromStorage: async () => {
    try {
      const [userData, token] = await AsyncStorage.multiGet([
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.USER_TOKEN,
      ]);

      return {
        user: userData[1] ? JSON.parse(userData[1]) : null,
        token: token[1] || null,
      };
    } catch (error) {
      console.error('Error getting user data from storage:', error);
      return {user: null, token: null};
    }
  },

  // Update user profile in store
  updateUserProfile: (updatedUser: any) => {
    // You can dispatch an action here to update user profile
    // For now, this is a placeholder for future profile update functionality
    console.log('Update user profile:', updatedUser);
  },
};

export default userService;
