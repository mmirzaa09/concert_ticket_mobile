import {APP_CONFIG, API_ENDPOINTS} from '../../constants';
import {ApiResponse, LoginCredentials} from '../../types';

const createApiService = () => {
  const baseURL = APP_CONFIG.API_BASE_URL;
  const timeout = APP_CONFIG.API_TIMEOUT;

  const request = async <T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> => {
    const url = `${baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
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
        throw new Error(
          data.message || `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      return {
        success: data.success || true,
        data: data.data || data,
        message: data.message,
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
    login: (credentials: LoginCredentials): Promise<ApiResponse<any>> =>
      request<any>(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

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

    getConcerts: (): Promise<ApiResponse<any[]>> =>
      request<any[]>(API_ENDPOINTS.CONCERTS, {
        method: 'GET',
      }),

    getConcertById: (id: string): Promise<ApiResponse<any>> =>
      request<any>(API_ENDPOINTS.CONCERT_DETAIL.replace(':id', id)),

    purchaseTicket: (data: {
      concertId: string;
      quantity: number;
    }): Promise<ApiResponse<any>> =>
      request<any>(API_ENDPOINTS.PURCHASE_TICKET, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getMyTickets: (userId: string): Promise<ApiResponse<any[]>> =>
      request<any[]>(API_ENDPOINTS.MY_TICKETS.replace(':userId', userId)),

    joinQueue: (concertId: string): Promise<ApiResponse<any>> =>
      request<any>(API_ENDPOINTS.JOIN_QUEUE, {
        method: 'POST',
        body: JSON.stringify({concertId}),
      }),

    getQueueStatus: (concertId: string): Promise<ApiResponse<any>> =>
      request<any>(API_ENDPOINTS.QUEUE_STATUS.replace(':concertId', concertId)),

    leaveQueue: (concertId: string): Promise<ApiResponse<any>> =>
      request<any>(API_ENDPOINTS.LEAVE_QUEUE, {
        method: 'POST',
        body: JSON.stringify({concertId}),
      }),
  };
};

export const apiService = createApiService();
