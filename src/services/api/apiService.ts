import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
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
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      body?: string;
      headers?: Record<string, string>;
    } = {},
    requireAuth: boolean = false,
  ): Promise<ApiResponse<T>> => {
    const url = `${baseURL}${endpoint}`;

    // Create headers (with or without auth)
    const headers = requireAuth
      ? await createAuthHeaders(options.headers)
      : {
          'Content-Type': 'application/json',
          ...options.headers,
        };

    const config: AxiosRequestConfig = {
      url,
      method: options.method || 'GET',
      headers,
      timeout,
      ...(options.body && {
        data:
          options.body instanceof FormData
            ? options.body
            : JSON.parse(options.body),
      }),
    };

    try {
      const response: AxiosResponse = await axios(config);

      return {
        success:
          response.data?.success !== undefined ? response.data.success : true,
        data: response.data?.data || response.data,
        message: response.data?.message,
        status_code: response.status,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle timeout specifically
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout');
        }

        // Handle 401 Unauthorized specifically
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);

          // Trigger session expired callback if available
          if (sessionExpiredCallback) {
            sessionExpiredCallback();
          }

          throw new Error('Session expired. Please login again.');
        }

        // Handle other HTTP errors
        if (error.response) {
          const errorMessage =
            error.response.data?.message ||
            `HTTP ${error.response.status}: ${error.response.statusText}`;
          throw new Error(errorMessage);
        }

        // Handle network errors
        if (error.request) {
          throw new Error('Network error. Please check your connection.');
        }
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

    getOrdersByUserId: (id_user: string): Promise<ApiResponse<any>> =>
      request<any>(
        API_ENDPOINTS.ORDERS_BY_USER.replace(':id_user', id_user),
        {
          method: 'GET',
        },
        true, // requireAuth = true
      ),

    getOrderById: (id_order: string): Promise<ApiResponse<any>> =>
      request<any>(
        API_ENDPOINTS.ORDERS_BY_ID_ORDER.replace(':id_order', id_order),
        {
          method: 'GET',
        },
        true, // requireAuth = true
      ),

    postTransactionPayment: (
      paymentData: FormData,
    ): Promise<ApiResponse<any>> =>
      request<any>(
        API_ENDPOINTS.TRANSACTION_PAYMENT,
        {
          method: 'POST',
          body: paymentData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
        true, // requireAuth = true
      ),
  };
};

export const apiService = createApiService();
