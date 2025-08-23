import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../types';
import {apiService} from '../services/api/apiService';
import {STORAGE_KEYS} from '../constants';

// Auth State Interface
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitializing: boolean;
}

// Auth Actions
type AuthAction =
  | {type: 'INIT_START'}
  | {type: 'INIT_SUCCESS'; payload: {user: User; token: string}}
  | {type: 'INIT_FAILURE'}
  | {type: 'LOGIN_START'}
  | {type: 'LOGIN_SUCCESS'; payload: {user: User; token: string}}
  | {type: 'LOGIN_FAILURE'}
  | {type: 'LOGOUT'}
  | {type: 'SET_LOADING'; payload: boolean};

// Initial State
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  isInitializing: true,
};

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'INIT_START':
      return {
        ...state,
        isInitializing: true,
      };
    case 'INIT_SUCCESS':
      return {
        ...state,
        isInitializing: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'INIT_FAILURE':
      return {
        ...state,
        isInitializing: false,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Auth Context Interface
interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    dispatch({type: 'INIT_START'});
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          // Validate user object has required fields
          if (user && user.id && user.email && user.name) {
            dispatch({
              type: 'INIT_SUCCESS',
              payload: {user, token},
            });
          } else {
            await AsyncStorage.multiRemove([
              STORAGE_KEYS.USER_TOKEN,
              STORAGE_KEYS.USER_DATA,
            ]);
            dispatch({type: 'INIT_FAILURE'});
          }
        } catch (parseError) {
          // Clear corrupted data
          await AsyncStorage.multiRemove([
            STORAGE_KEYS.USER_TOKEN,
            STORAGE_KEYS.USER_DATA,
          ]);
          dispatch({type: 'INIT_FAILURE'});
        }
      } else {
        dispatch({type: 'INIT_FAILURE'});
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      dispatch({type: 'INIT_FAILURE'});
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    dispatch({type: 'LOGIN_START'});
    try {
      // Call real API
      const response = await apiService.login({email, password});

      // Debug: Log the actual response structure

      if (response.success && response.data) {
        // Handle different possible response structures
        let user;
        let token;

        // Check if data has token and user properties
        if (response.data.token && response.data.user) {
          token = response.data.token;
          user = response.data.user;
        }
        // Check if data has token and other user fields directly
        else if (response.data.token) {
          token = response.data.token;
          // Create user object from response data
          user = {
            id: response.data.id || response.data.user_id || '1',
            email: response.data.email || email,
            name: response.data.name || response.data.username || 'User',
            avatar: response.data.avatar || response.data.profile_picture,
            createdAt:
              response.data.created_at ||
              response.data.createdAt ||
              new Date().toISOString(),
          };
        }
        // Fallback if structure is different
        else {
          throw new Error('Invalid response format from server');
        }

        // Validate that we have required user data
        if (!user || !token) {
          throw new Error('Missing user data or token in response');
        }

        // Store user data in AsyncStorage
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify(user),
        );

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {user, token},
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      dispatch({type: 'LOGIN_FAILURE'});
      throw error;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<void> => {
    dispatch({type: 'LOGIN_START'});
    try {
      // Call real API
      const response = await apiService.register({
        name,
        email,
        password,
        phone_number: '', // You might want to collect this in registration form
      });

      // Debug: Log the actual response structure

      if (response.success && response.data) {
        // Handle different possible response structures (same as login)
        let user;
        let token;

        // Check if data has token and user properties
        if (response.data.token && response.data.user) {
          token = response.data.token;
          user = response.data.user;
        }
        // Check if data has token and other user fields directly
        else if (response.data.token) {
          token = response.data.token;
          // Create user object from response data
          user = {
            id: response.data.id || response.data.user_id || '1',
            email: response.data.email || email,
            name: response.data.name || response.data.username || name,
            avatar: response.data.avatar || response.data.profile_picture,
            createdAt:
              response.data.created_at ||
              response.data.createdAt ||
              new Date().toISOString(),
          };
        }
        // Fallback if structure is different
        else {
          throw new Error('Invalid response format from server');
        }

        // Validate that we have required user data
        if (!user || !token) {
          throw new Error('Missing user data or token in response');
        }

        // Store user data in AsyncStorage
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify(user),
        );

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {user, token},
        });
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      dispatch({type: 'LOGIN_FAILURE'});
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call API service logout to clear storage
      await apiService.logout();

      // Clear user data from AsyncStorage
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);

      // Update local state
      dispatch({type: 'LOGOUT'});
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local state and storage
      try {
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      } catch (storageError) {
        console.error('Storage cleanup error:', storageError);
      }
      dispatch({type: 'LOGOUT'});
    }
  };

  const value: AuthContextType = {
    state,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
