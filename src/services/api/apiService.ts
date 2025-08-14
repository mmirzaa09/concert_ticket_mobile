import {APP_CONFIG, API_ENDPOINTS} from '../../constants';
import {ApiResponse, LoginCredentials} from '../../types';

class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = APP_CONFIG.API_BASE_URL;
    this.timeout = APP_CONFIG.API_TIMEOUT;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Handle non-JSON responses
        const textData = await response.text();
        console.log('Non-JSON response:', textData);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // For non-JSON success responses, wrap in our format
        data = {success: true, data: textData, message: 'Success'};
      }

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      // Transform server response to match our ApiResponse format
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
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<ApiResponse<any>> {
    const result = await this.request<any>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    console.log('check result:', result);
    return result;
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone_number: string;
  }): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUsers(token: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(API_ENDPOINTS.USERS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Concert endpoints
  async getConcerts(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(API_ENDPOINTS.CONCERTS);
  }

  async getConcertById(id: string): Promise<ApiResponse<any>> {
    const endpoint = API_ENDPOINTS.CONCERT_DETAIL.replace(':id', id);
    return this.request<any>(endpoint);
  }

  // Ticket endpoints
  async purchaseTicket(data: {
    concertId: string;
    quantity: number;
  }): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.PURCHASE_TICKET, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyTickets(userId: string): Promise<ApiResponse<any[]>> {
    const endpoint = API_ENDPOINTS.MY_TICKETS.replace(':userId', userId);
    return this.request<any[]>(endpoint);
  }

  // Queue endpoints
  async joinQueue(concertId: string): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.JOIN_QUEUE, {
      method: 'POST',
      body: JSON.stringify({concertId}),
    });
  }

  async getQueueStatus(concertId: string): Promise<ApiResponse<any>> {
    const endpoint = API_ENDPOINTS.QUEUE_STATUS.replace(
      ':concertId',
      concertId,
    );
    return this.request<any>(endpoint);
  }

  async leaveQueue(concertId: string): Promise<ApiResponse<any>> {
    return this.request<any>(API_ENDPOINTS.LEAVE_QUEUE, {
      method: 'POST',
      body: JSON.stringify({concertId}),
    });
  }
}

export const apiService = new ApiService();
