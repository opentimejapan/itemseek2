'use client';

import React from 'react';
import { useWebSocket } from '@itemseek/websocket';

export function ConnectionStatus() {
  const { connected, reconnecting } = useWebSocket();

  if (connected) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 py-2 px-4 text-center text-sm ${
      reconnecting ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
    }`}>
      {reconnecting ? 'Reconnecting...' : 'Connection lost. Please check your internet.'}
    </div>
  );
}