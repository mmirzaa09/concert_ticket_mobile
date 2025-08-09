import React, {createContext, useContext, useReducer, ReactNode} from 'react';
import {User} from '../types';

// Auth State Interface
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Auth Actions
type AuthAction =
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
};

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
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
  logout: () => void;
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

  const login = async (email: string, password: string): Promise<void> => {
    dispatch({type: 'LOGIN_START'});
    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const mockUser: User = {
        id: '1',
        email,
        name: 'John Doe',
        createdAt: new Date().toISOString(),
      };
      
      const mockToken = 'mock-jwt-token';
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {user: mockUser, token: mockToken},
      });
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
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const mockUser: User = {
        id: '1',
        email,
        name,
        createdAt: new Date().toISOString(),
      };
      
      const mockToken = 'mock-jwt-token';
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {user: mockUser, token: mockToken},
      });
    } catch (error) {
      dispatch({type: 'LOGIN_FAILURE'});
      throw error;
    }
  };

  const logout = (): void => {
    dispatch({type: 'LOGOUT'});
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
