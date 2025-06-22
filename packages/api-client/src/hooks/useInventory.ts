'use client';

import useSWR, { mutate } from 'swr';
import { z } from 'zod';
import { apiClient, ApiError } from '../apiClient';
import { useOfflineQueue } from '@itemseek2/inventory/hooks/useOfflineQueue';
import { useWebSocketStore } from '@itemseek/websocket';

// Schemas
const inventoryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string(),
  barcode: z.string().optional(),
  quantity: z.number(),
  minQuantity: z.number(),
  maxQuantity: z.number().optional(),
  unit: z.string(),
  category: z.string(),
  subcategory: z.string().optional(),
  location: z.string(),
  sublocation: z.string().optional(),
  cost: z.number().optional(),
  price: z.number().optional(),
  supplier: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
  expiryDate: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

const inventoryListSchema = z.object({
  success: z.boolean(),
  data: z.array(inventoryItemSchema),
  metadata: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number()
  })
});

export type InventoryItem = z.infer<typeof inventoryItemSchema>;

// Custom fetcher with error handling
const inventoryFetcher = async (url: string) => {
  try {
    const response = await apiClient.get(url, {
      schema: inventoryListSchema
    });
    return response.data;
  } catch (error) {
    if (error instanceof ApiError && error.isNetworkError) {
      // Return cached data if available
      const cachedData = localStorage.getItem(`cache:${url}`);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    }
    throw error;
  }
};

// Hook for inventory list
export function useInventory(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  location?: string;
  lowStock?: boolean;
}) {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.category) queryParams.append('category', params.category);
  if (params?.location) queryParams.append('location', params.location);
  if (params?.lowStock) queryParams.append('lowStock', 'true');

  const url = `/inventory${queryParams.toString() ? `?${queryParams}` : ''}`;

  const { data, error, isLoading, isValidating } = useSWR(
    url,
    inventoryFetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // Refresh every 30 seconds
      onSuccess: (data) => {
        // Cache data for offline use
        localStorage.setItem(`cache:${url}`, JSON.stringify(data));
      },
      onError: (error) => {
        console.error('Inventory fetch error:', error);
      }
    }
  );

  return {
    items: data || [],
    isLoading,
    isValidating,
    error,
    isOffline: error instanceof ApiError && error.isNetworkError
  };
}

// Hook for single inventory item
export function useInventoryItem(itemId: string | null) {
  const url = itemId ? `/inventory/${itemId}` : null;

  const { data, error, isLoading } = useSWR(
    url,
    async (url) => {
      const response = await apiClient.get(url);
      return response.data;
    },
    {
      revalidateOnFocus: false
    }
  );

  return {
    item: data,
    isLoading,
    error
  };
}

// Hook for inventory mutations
export function useInventoryMutations() {
  const { addToQueue } = useOfflineQueue();
  const { addNotification } = useWebSocketStore();

  const createItem = async (data: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await apiClient.post('/inventory', data);
      
      // Optimistically update cache
      mutate(
        (key) => typeof key === 'string' && key.startsWith('/inventory'),
        undefined,
        { revalidate: true }
      );
      
      addNotification({
        id: `create-success-${Date.now()}`,
        type: 'success',
        title: 'Item Created',
        message: `${data.name} has been added to inventory`,
        timestamp: new Date()
      });
      
      return response.data;
    } catch (error) {
      if (error instanceof ApiError && error.isNetworkError) {
        // Queue for offline sync
        await addToQueue({
          type: 'CREATE',
          endpoint: '/inventory',
          method: 'POST',
          data
        });
        
        // Optimistically add to local state
        const tempItem = {
          ...data,
          id: `temp-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Update cache
        mutate(
          '/inventory',
          (current: any) => ({
            ...current,
            data: [...(current?.data || []), tempItem]
          }),
          false
        );
        
        return tempItem;
      }
      
      addNotification({
        id: `create-error-${Date.now()}`,
        type: 'error',
        title: 'Failed to Create Item',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
      
      throw error;
    }
  };

  const updateItem = async (itemId: string, data: Partial<InventoryItem>) => {
    try {
      const response = await apiClient.patch(`/inventory/${itemId}`, data);
      
      // Update cache
      mutate(
        (key) => typeof key === 'string' && key.startsWith('/inventory'),
        undefined,
        { revalidate: true }
      );
      
      return response.data;
    } catch (error) {
      if (error instanceof ApiError && error.isNetworkError) {
        // Queue for offline sync
        await addToQueue({
          type: 'UPDATE',
          endpoint: `/inventory/${itemId}`,
          method: 'PATCH',
          data
        });
        
        // Optimistically update cache
        mutate(
          '/inventory',
          (current: any) => ({
            ...current,
            data: current?.data?.map((item: InventoryItem) =>
              item.id === itemId ? { ...item, ...data } : item
            )
          }),
          false
        );
      }
      
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number, reason?: string) => {
    try {
      const response = await apiClient.post(`/inventory/${itemId}/quantity`, {
        quantity,
        reason
      });
      
      // Update cache
      mutate(
        (key) => typeof key === 'string' && key.startsWith('/inventory'),
        undefined,
        { revalidate: true }
      );
      
      return response.data;
    } catch (error) {
      if (error instanceof ApiError && error.isNetworkError) {
        // Queue for offline sync
        await addToQueue({
          type: 'UPDATE',
          endpoint: `/inventory/${itemId}/quantity`,
          method: 'POST',
          data: { quantity, reason }
        });
        
        // Optimistically update
        mutate(
          '/inventory',
          (current: any) => ({
            ...current,
            data: current?.data?.map((item: InventoryItem) =>
              item.id === itemId ? { ...item, quantity } : item
            )
          }),
          false
        );
      }
      
      throw error;
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      await apiClient.delete(`/inventory/${itemId}`);
      
      // Update cache
      mutate(
        (key) => typeof key === 'string' && key.startsWith('/inventory'),
        undefined,
        { revalidate: true }
      );
      
      addNotification({
        id: `delete-success-${Date.now()}`,
        type: 'success',
        title: 'Item Deleted',
        message: 'Item has been removed from inventory',
        timestamp: new Date()
      });
    } catch (error) {
      if (error instanceof ApiError && error.isNetworkError) {
        // Queue for offline sync
        await addToQueue({
          type: 'DELETE',
          endpoint: `/inventory/${itemId}`,
          method: 'DELETE'
        });
        
        // Optimistically remove from cache
        mutate(
          '/inventory',
          (current: any) => ({
            ...current,
            data: current?.data?.filter((item: InventoryItem) => item.id !== itemId)
          }),
          false
        );
      } else {
        addNotification({
          id: `delete-error-${Date.now()}`,
          type: 'error',
          title: 'Failed to Delete Item',
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date()
        });
      }
      
      throw error;
    }
  };

  return {
    createItem,
    updateItem,
    updateQuantity,
    deleteItem
  };
}