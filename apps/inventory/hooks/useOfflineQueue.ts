'use client';

import { useEffect, useRef } from 'react';
import { useWebSocketStore } from '@itemseek/websocket';

interface QueuedAction {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  endpoint: string;
  method: string;
  data?: any;
  timestamp: number;
  retries: number;
}

const DB_NAME = 'itemseek-offline';
const STORE_NAME = 'pending-actions';

export function useOfflineQueue() {
  const dbRef = useRef<IDBDatabase | null>(null);
  const { addNotification } = useWebSocketStore();

  useEffect(() => {
    // Initialize IndexedDB
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => {
      console.error('Failed to open IndexedDB');
    };

    request.onsuccess = () => {
      dbRef.current = request.result;
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('type', 'type', { unique: false });
      }
    };

    // Process queue when coming back online
    const handleOnline = () => {
      processQueue();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
      if (dbRef.current) {
        dbRef.current.close();
      }
    };
  }, [addNotification]);

  const addToQueue = async (action: Omit<QueuedAction, 'id' | 'timestamp' | 'retries'>) => {
    if (!dbRef.current) return;

    const queuedAction: QueuedAction = {
      ...action,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      retries: 0
    };

    const transaction = dbRef.current.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    try {
      await new Promise((resolve, reject) => {
        const request = store.add(queuedAction);
        request.onsuccess = resolve;
        request.onerror = reject;
      });

      addNotification({
        id: `offline-action-${queuedAction.id}`,
        type: 'info',
        title: 'Action Queued',
        message: 'This action will be synced when you\'re back online',
        timestamp: new Date()
      });

      // Register for background sync if available
      if ('sync' in registration) {
        await (registration as any).sync.register('sync-inventory');
      }
    } catch (error) {
      console.error('Failed to queue action:', error);
    }
  };

  const processQueue = async () => {
    if (!dbRef.current || !navigator.onLine) return;

    const transaction = dbRef.current.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = async () => {
      const actions = request.result as QueuedAction[];
      
      for (const action of actions) {
        try {
          const response = await fetch(action.endpoint, {
            method: action.method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
            },
            body: action.data ? JSON.stringify(action.data) : undefined
          });

          if (response.ok) {
            // Remove from queue
            await removeFromQueue(action.id);
            
            addNotification({
              id: `sync-success-${action.id}`,
              type: 'success',
              title: 'Sync Complete',
              message: `${action.type} action synced successfully`,
              timestamp: new Date()
            });
          } else if (response.status >= 400 && response.status < 500) {
            // Client error - remove from queue as it won't succeed
            await removeFromQueue(action.id);
            
            addNotification({
              id: `sync-error-${action.id}`,
              type: 'error',
              title: 'Sync Failed',
              message: `${action.type} action failed: ${response.statusText}`,
              timestamp: new Date()
            });
          } else {
            // Server error - retry later
            await updateRetryCount(action.id);
          }
        } catch (error) {
          // Network error - retry later
          await updateRetryCount(action.id);
        }
      }
    };
  };

  const removeFromQueue = async (id: string) => {
    if (!dbRef.current) return;

    const transaction = dbRef.current.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(id);
  };

  const updateRetryCount = async (id: string) => {
    if (!dbRef.current) return;

    const transaction = dbRef.current.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      const action = request.result as QueuedAction;
      if (action) {
        action.retries += 1;
        
        // Remove after 3 retries
        if (action.retries >= 3) {
          store.delete(id);
          
          addNotification({
            id: `sync-failed-${id}`,
            type: 'error',
            title: 'Sync Failed',
            message: 'Action could not be synced after multiple attempts',
            timestamp: new Date(),
            persistent: true
          });
        } else {
          store.put(action);
        }
      }
    };
  };

  const getQueueSize = async (): Promise<number> => {
    if (!dbRef.current) return 0;

    return new Promise((resolve) => {
      const transaction = dbRef.current!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.count();
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        resolve(0);
      };
    });
  };

  return {
    addToQueue,
    processQueue,
    getQueueSize
  };
}