import { z } from 'zod';

export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  onError?: (error: ApiError) => void;
  onRetry?: (attempt: number, error: ApiError) => void;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any,
    public isNetworkError: boolean = false,
    public isTimeout: boolean = false
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private config: Required<ApiClientConfig>;
  private abortControllers: Map<string, AbortController> = new Map();

  constructor(config: ApiClientConfig) {
    this.config = {
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      onError: () => {},
      onRetry: () => {},
      ...config
    };
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const id = Math.random().toString(36);
    this.abortControllers.set(id, controller);

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      this.abortControllers.delete(id);
      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      this.abortControllers.delete(id);
      
      if (error.name === 'AbortError') {
        throw new ApiError(0, 'Request timeout', null, true, true);
      }
      throw error;
    }
  }

  private async retryRequest(
    url: string,
    options: RequestInit,
    attempt: number = 1
  ): Promise<Response> {
    try {
      return await this.fetchWithTimeout(url, options, this.config.timeout);
    } catch (error: any) {
      const isNetworkError = 
        error instanceof TypeError && error.message.includes('fetch');
      const isTimeout = error instanceof ApiError && error.isTimeout;
      
      // Don't retry on client errors (4xx)
      if (error instanceof ApiError && 
          error.status >= 400 && 
          error.status < 500 &&
          !isTimeout) {
        throw error;
      }

      // Retry on network errors, timeouts, and server errors
      if (attempt < this.config.retries && 
          (isNetworkError || isTimeout || 
           (error instanceof ApiError && error.status >= 500))) {
        
        const delay = this.config.retryDelay * Math.pow(2, attempt - 1);
        const apiError = error instanceof ApiError ? error : 
          new ApiError(0, 'Network error', null, true);
        
        this.config.onRetry(attempt, apiError);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryRequest(url, options, attempt + 1);
      }

      throw error;
    }
  }

  private async request<T>(
    method: string,
    endpoint: string,
    options: {
      body?: any;
      headers?: Record<string, string>;
      schema?: z.ZodSchema<T>;
      skipAuth?: boolean;
    } = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const token = localStorage.getItem('auth-token');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const requestOptions: RequestInit = {
      method,
      headers,
      credentials: 'include'
    };

    if (options.body && method !== 'GET') {
      requestOptions.body = JSON.stringify(options.body);
    }

    try {
      const response = await this.retryRequest(url, requestOptions);

      // Handle non-2xx responses
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = null;
        }

        const error = new ApiError(
          response.status,
          response.statusText,
          errorData
        );
        
        this.config.onError(error);
        throw error;
      }

      // Handle empty responses
      if (response.status === 204) {
        return null as any;
      }

      const data = await response.json();

      // Validate response if schema provided
      if (options.schema) {
        try {
          return options.schema.parse(data);
        } catch (validationError) {
          console.error('Response validation failed:', validationError);
          throw new ApiError(
            500,
            'Invalid response format',
            { validation: validationError }
          );
        }
      }

      return data;
    } catch (error: any) {
      // Convert network errors to ApiError
      if (!(error instanceof ApiError)) {
        const apiError = new ApiError(
          0,
          error.message || 'Network error',
          null,
          true
        );
        this.config.onError(apiError);
        throw apiError;
      }
      
      throw error;
    }
  }

  // HTTP methods
  async get<T>(endpoint: string, options?: {
    headers?: Record<string, string>;
    schema?: z.ZodSchema<T>;
    skipAuth?: boolean;
  }): Promise<T> {
    return this.request<T>('GET', endpoint, options);
  }

  async post<T>(endpoint: string, body?: any, options?: {
    headers?: Record<string, string>;
    schema?: z.ZodSchema<T>;
    skipAuth?: boolean;
  }): Promise<T> {
    return this.request<T>('POST', endpoint, { ...options, body });
  }

  async put<T>(endpoint: string, body?: any, options?: {
    headers?: Record<string, string>;
    schema?: z.ZodSchema<T>;
    skipAuth?: boolean;
  }): Promise<T> {
    return this.request<T>('PUT', endpoint, { ...options, body });
  }

  async patch<T>(endpoint: string, body?: any, options?: {
    headers?: Record<string, string>;
    schema?: z.ZodSchema<T>;
    skipAuth?: boolean;
  }): Promise<T> {
    return this.request<T>('PATCH', endpoint, { ...options, body });
  }

  async delete<T = void>(endpoint: string, options?: {
    headers?: Record<string, string>;
    schema?: z.ZodSchema<T>;
    skipAuth?: boolean;
  }): Promise<T> {
    return this.request<T>('DELETE', endpoint, options);
  }

  // Cancel all pending requests
  cancelAll() {
    this.abortControllers.forEach(controller => controller.abort());
    this.abortControllers.clear();
  }

  // Update configuration
  updateConfig(config: Partial<ApiClientConfig>) {
    this.config = { ...this.config, ...config };
  }
}

// Default instance
export const apiClient = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100/api',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  onError: (error) => {
    console.error('API Error:', error);
    
    // Handle specific errors
    if (error.status === 401) {
      // Unauthorized - clear auth and redirect
      localStorage.removeItem('auth-token');
      window.location.href = '/login';
    } else if (error.status === 503 || error.isNetworkError) {
      // Service unavailable or network error
      // Could trigger offline mode here
    }
  },
  onRetry: (attempt, error) => {
    console.log(`Retrying request (attempt ${attempt}):`, error.message);
  }
});