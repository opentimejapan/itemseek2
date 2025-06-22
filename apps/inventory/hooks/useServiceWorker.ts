'use client';

import { useEffect, useState } from 'react';

export function useServiceWorker() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.log('Service Workers not supported');
      return;
    }

    // Register service worker
    const registerSW = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        setRegistration(reg);
        console.log('Service Worker registered:', reg);

        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          }
        });

        // Check for updates periodically
        setInterval(() => {
          reg.update();
        }, 60000); // Check every minute
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    };

    registerSW();

    // Listen for online/offline status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for messages from service worker
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'SYNC_SUCCESS') {
        // Handle successful background sync
        console.log('Background sync successful:', event.data.action);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, []);

  const updateServiceWorker = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  const cacheUrls = (urls: string[]) => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_URLS',
        urls
      });
    }
  };

  const clearCache = async () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CLEAR_CACHE'
      });
    }
  };

  return {
    registration,
    isOffline,
    updateAvailable,
    updateServiceWorker,
    cacheUrls,
    clearCache
  };
}