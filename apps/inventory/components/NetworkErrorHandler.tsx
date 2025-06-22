'use client';

import React, { useEffect, useState } from 'react';
import { useServiceWorker } from '../hooks/useServiceWorker';
import { useOfflineQueue } from '../hooks/useOfflineQueue';
import { TouchButton } from '@itemseek2/ui-mobile';

export function NetworkErrorHandler() {
  const { isOffline, updateAvailable, updateServiceWorker } = useServiceWorker();
  const { getQueueSize, processQueue } = useOfflineQueue();
  const [queueSize, setQueueSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const checkQueue = async () => {
      const size = await getQueueSize();
      setQueueSize(size);
    };

    checkQueue();
    const interval = setInterval(checkQueue, 5000);

    return () => clearInterval(interval);
  }, [getQueueSize]);

  const handleSync = async () => {
    setIsProcessing(true);
    try {
      await processQueue();
      const newSize = await getQueueSize();
      setQueueSize(newSize);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOffline && queueSize === 0 && !updateAvailable) {
    return null;
  }

  return (
    <>
      {/* Offline indicator */}
      {isOffline && (
        <div className="fixed bottom-24 left-4 right-4 z-30">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  You're offline
                </p>
                <p className="mt-1 text-sm text-yellow-700">
                  Changes will be synced when connection is restored
                  {queueSize > 0 && ` (${queueSize} pending)`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sync button when back online with pending changes */}
      {!isOffline && queueSize > 0 && (
        <div className="fixed bottom-24 left-4 right-4 z-30">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Sync available
                </p>
                <p className="text-sm text-blue-700">
                  {queueSize} pending {queueSize === 1 ? 'change' : 'changes'}
                </p>
              </div>
              <TouchButton
                size="sm"
                variant="primary"
                onClick={handleSync}
                disabled={isProcessing}
              >
                {isProcessing ? 'Syncing...' : 'Sync Now'}
              </TouchButton>
            </div>
          </div>
        </div>
      )}

      {/* Update available */}
      {updateAvailable && (
        <div className="fixed top-16 left-4 right-4 z-40">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">
                  Update available
                </p>
                <p className="text-sm text-green-700">
                  A new version is ready to install
                </p>
              </div>
              <TouchButton
                size="sm"
                variant="primary"
                onClick={updateServiceWorker}
              >
                Update
              </TouchButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}