'use client';

import { useEffect, useCallback } from 'react';
import { useWebSocketContext } from './WebSocketProvider';

export function useWebSocket(events?: Record<string, (...args: any[]) => void>) {
  const { socket, connected, reconnecting, emit, on, off } = useWebSocketContext();

  useEffect(() => {
    if (!events || !socket) return;

    // Register event listeners
    Object.entries(events).forEach(([event, handler]) => {
      on(event, handler);
    });

    // Cleanup
    return () => {
      Object.entries(events).forEach(([event, handler]) => {
        off(event, handler);
      });
    };
  }, [events, socket, on, off]);

  const emitEvent = useCallback((event: string, data?: any) => {
    emit(event, data);
  }, [emit]);

  return {
    socket,
    connected,
    reconnecting,
    emit: emitEvent,
    on,
    off,
  };
}