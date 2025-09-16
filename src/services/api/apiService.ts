import AsyncStorage from '@react-native-async-storage/async-storage';
import {APP_CONFIG, API_ENDPOINTS, STORAGE_KEYS} from '../../constants';
import {ApiResponse, LoginCredentials} from '../../types';

// Global callback for session expiration
let sessionExpiredCallback: (() => void) | null = null;

export const setSessionExpiredCallback = (callback: () => void) => {
  sessionExpiredCallback = callback;
};

const createApiService = () => {
  const baseURL = APP_CONFIG.API_BASE_URL;
  const timeout = APP_CONFIG.API_TIMEOUT;

  // Helper function to get JWT token
  const getAuthToken = async (): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      return token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  // Helper function to create authenticated headers
  const createAuthHeaders = async (
    additionalHeaders: Record<string, string> = {},
  ): Promise<Record<string, string>> => {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...additionalHeaders,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    console.log('Auth Headers:', headers);
    return headers;
  };

  const request = async <T>(
    endpoint: string,
    options: RequestInit = {},
    requireAuth: boolean = false,
  ): Promise<ApiResponse<T>> => {
    const url = `${baseURL}${endpoint}`;

    // Create headers (with or without auth)
    const headers = requireAuth
      ? await createAuthHeaders(options.headers as Record<string, string>)
      : {
          'Content-Type': 'application/json',
          ...(options.headers as Record<string, string>),
        };

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textData = await response.text();
        console.log('Non-JSON response:', textData);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        data = {success: true, data: textData, message: 'Success'};
      }

      if (!response.ok) {
        // Handle 401 Unauthorized specifically
        if (response.status === 401) {
          // Clear token and redirect to login
          await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);

          // Trigger session expired callback if available
          if (sessionExpiredCallback) {
            sessionExpiredCallback();
          }

          throw new Error('Session expired. Please login again.');
        }

        throw new Error(
          data.message || `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      return {
        success: data.success || true,
        data: data.data || data,
        message: data.message,
        status_code: response.status,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw new Error(
        error instanceof Error ? error.message : 'Unknown error occurred',
      );
    }
  };

  return {
    // Auth methods
    login: async (credentials: LoginCredentials): Promise<ApiResponse<any>> => {
      const response = await request<any>(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      // Store JWT token after successful login
      if (response.success && response.data.token) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_TOKEN,
          response.data.token,
        );
      }

      return response;
    },

    register: (userData: {
      name: string;
      email: string;
      password: string;
      phone_number: string;
    }): Promise<ApiResponse<any>> =>
      request<any>(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    logout: async (): Promise<void> => {
      try {
        // Clear all authentication related data
        await AsyncStorage.multiRemove([
          STORAGE_KEYS.USER_TOKEN,
          STORAGE_KEYS.USER_DATA,
        ]);
      } catch (error) {
        console.error('Error during logout:', error);
      }
    },

    // Concert methods with auth
    getConcerts: (): Promise<ApiResponse<any[]>> =>
      request<any[]>(
        API_ENDPOINTS.CONCERTS,
        {
          method: 'GET',
        },
        true,
      ), // requireAuth = true

    getConcertById: (id: string): Promise<ApiResponse<any>> =>
      request<any>(
        API_ENDPOINTS.CONCERT_DETAIL.replace(':id', id),
        {method: 'GET'},
        true, // Public endpoint, no auth required
      ),

    // Payment methods with auth
    getPaymentMethods: (): Promise<ApiResponse<any[]>> =>
      request<any[]>(
        API_ENDPOINTS.PAYMENT_METHODS,
        {
          method: 'GET',
        },
        true,
      ), // requireAuth = true

    getPaymentMethodById: (id: number): Promise<ApiResponse<any>> =>
      request<any>(
        API_ENDPOINTS.PAYMENT_METHOD_BY_ID.replace(':id', id.toString()),
        {
          method: 'GET',
        },
        true, // requireAuth = true
      ),

    postInquiryOrder: (orderData: {
      id_concert: string;
      quantity: number;
      total_price: number;
    }): Promise<ApiResponse<any>> =>
      request<any>(
        API_ENDPOINTS.ORDER_INQUIRY,
        {
          method: 'POST',
          body: JSON.stringify(orderData),
        },
        true, // requireAuth = true
      ),
  };
};

export const apiService = createApiService();
