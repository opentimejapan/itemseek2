import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { 
  ApiResponse, 
  User, 
  Organization, 
  InventoryItem,
  LoginInput,
  SignupInput,
  AuthTokens,
  CreateInventoryItemInput,
  UpdateInventoryItemInput
} from '@itemseek2/shared';

export class ItemSeekAPIClient {
  private client: AxiosInstance;
  private authToken?: string;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use((config) => {
      if (this.authToken) {
        config.headers.Authorization = `Bearer ${this.authToken}`;
      }
      return config;
    });

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          this.authToken = undefined;
          // Trigger re-authentication
          window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || error);
      }
    );
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  clearAuthToken() {
    this.authToken = undefined;
  }

  // Auth endpoints
  async login(data: LoginInput): Promise<ApiResponse<AuthTokens & { user: User }>> {
    return this.client.post('/auth/login', data);
  }

  async signup(data: SignupInput): Promise<ApiResponse<AuthTokens & { user: User }>> {
    return this.client.post('/auth/signup', data);
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
    this.clearAuthToken();
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    return this.client.post('/auth/refresh', { refreshToken });
  }

  // User endpoints
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.client.get('/users/me');
  }

  async updateCurrentUser(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.client.patch('/users/me', data);
  }

  // Organization endpoints
  async getOrganization(): Promise<ApiResponse<Organization>> {
    return this.client.get('/organization');
  }

  async updateOrganization(data: Partial<Organization>): Promise<ApiResponse<Organization>> {
    return this.client.patch('/organization', data);
  }

  // Inventory endpoints
  async getInventoryItems(params?: any): Promise<ApiResponse<InventoryItem[]>> {
    return this.client.get('/inventory', { params });
  }

  async getInventoryItem(id: string): Promise<ApiResponse<InventoryItem>> {
    return this.client.get(`/inventory/${id}`);
  }

  async createInventoryItem(data: CreateInventoryItemInput): Promise<ApiResponse<InventoryItem>> {
    return this.client.post('/inventory', data);
  }

  async updateInventoryItem(id: string, data: UpdateInventoryItemInput): Promise<ApiResponse<InventoryItem>> {
    return this.client.patch(`/inventory/${id}`, data);
  }

  async deleteInventoryItem(id: string): Promise<ApiResponse<void>> {
    return this.client.delete(`/inventory/${id}`);
  }

  async updateInventoryQuantity(id: string, quantity: number): Promise<ApiResponse<InventoryItem>> {
    return this.client.post(`/inventory/${id}/quantity`, { quantity });
  }

  // Generic request method for custom endpoints
  async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.client.request(config);
  }
}

// Export singleton instance
export const apiClient = new ItemSeekAPIClient();

// Export hooks for React
export { useAPI } from './hooks/useAPI';
export { useAuth } from './hooks/useAuth';