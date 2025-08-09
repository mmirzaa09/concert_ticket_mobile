import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {User, LoginCredentials} from '../../types';
import {apiService} from '../../services/api/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '../../constants';

// Helper function to save user data to AsyncStorage
const saveUserToStorage = async (user: User, token: string) => {
  try {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.USER_DATA, JSON.stringify(user)],
      [STORAGE_KEYS.USER_TOKEN, token],
    ]);
  } catch (error) {
    console.error('Error saving user data to AsyncStorage:', error);
  }
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, {rejectWithValue}) => {
    try {
      const response = await apiService.login(credentials);
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      const userData = response.data;

      // Transform the response to match our User interface
      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        avatar: userData.avatar,
        createdAt: userData.created_at || new Date().toISOString(),
      };

      const token = userData.token;

      // Save to AsyncStorage
      await saveUserToStorage(user, token);

      return {
        user,
        token,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Login failed',
      );
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    userData: {
      name: string;
      email: string;
      password: string;
      phone_number: string;
    },
    {rejectWithValue},
  ) => {
    try {
      const response = await apiService.register(userData);

      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }

      const userResponse = response.data;

      // Transform the response to match our User interface
      const user: User = {
        id: userResponse.id.toString(),
        email: userResponse.email,
        name: userResponse.name,
        avatar: userResponse.avatar,
        createdAt: userResponse.created_at || new Date().toISOString(),
      };

      // For registration, we need to login after successful registration
      const loginResponse = await apiService.login({
        email: userData.email,
        password: userData.password,
      });

      const token = loginResponse.data.token;

      // Save to AsyncStorage
      await saveUserToStorage(user, token);

      return {
        user,
        token,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Registration failed',
      );
    }
  },
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  try {
    // Clear AsyncStorage
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
    return null;
  } catch (error) {
    console.error('Error during logout:', error);
    return null;
  }
});

// Action to restore user data from AsyncStorage on app start
export const restoreUserSession = createAsyncThunk(
  'auth/restoreUserSession',
  async (_, {rejectWithValue}) => {
    try {
      const [userData, token] = await AsyncStorage.multiGet([
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.USER_TOKEN,
      ]);

      if (userData[1] && token[1]) {
        return {
          user: JSON.parse(userData[1]),
          token: token[1],
        };
      }

      return null;
    } catch (error) {
      return rejectWithValue('Failed to restore session');
    }
  },
);

// Initial state
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    resetAuth: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: builder => {
    // Login cases
    builder
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      })
      // Register cases
      .addCase(registerUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      })
      // Logout cases
      .addCase(logoutUser.pending, state => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      // Restore session cases
      .addCase(restoreUserSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      });
  },
});

export const {clearError, resetAuth} = authSlice.actions;
export default authSlice.reducer;
