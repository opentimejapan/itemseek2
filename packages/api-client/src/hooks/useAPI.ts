import { useState, useCallback } from 'react';
import { apiClient } from '../index';
import type { ApiResponse } from '@itemseek2/shared';

export function useAPI<T, P = any>(
  apiCall: (params?: P) => Promise<ApiResponse<T>>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (params?: P) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall(params);
      if (response.success && response.data) {
        setData(response.data);
        return response.data;
      } else {
        throw new Error(response.error?.message || 'API call failed');
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
}