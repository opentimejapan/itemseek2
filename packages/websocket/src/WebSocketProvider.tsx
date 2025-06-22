'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useWebSocketStore } from './store';

interface WebSocketContextType {
  socket: Socket | null;
  connected: boolean;
  reconnecting: boolean;
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback?: (...args: any[]) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  connected: false,
  reconnecting: false,
  emit: () => {},
  on: () => {},
  off: () => {},
});

interface WebSocketProviderProps {
  children: React.ReactNode;
  url?: string;
  token?: string;
}

export function WebSocketProvider({ 
  children, 
  url = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3100',
  token 
}: WebSocketProviderProps) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const { setOnlineUsers, addNotification } = useWebSocketStore();

  useEffect(() => {
    if (!token) return;

    // Initialize socket connection
    socketRef.current = io(url, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      console.log('WebSocket connected');
      setConnected(true);
      setReconnecting(false);
      socket.emit('inventory:subscribe');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    });

    socket.on('reconnecting', () => {
      setReconnecting(true);
    });

    socket.on('reconnect', () => {
      console.log('WebSocket reconnected');
      setConnected(true);
      setReconnecting(false);
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    // User events
    socket.on('user:online', (data) => {
      setOnlineUsers((users) => [...users, data.userId]);
    });

    socket.on('user:offline', (data) => {
      setOnlineUsers((users) => users.filter(id => id !== data.userId));
    });

    // Notification events
    socket.on('notification:new', (notification) => {
      addNotification(notification);
      
      // Show browser notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/icon-192x192.png',
          badge: '/icon-72x72.png',
          tag: notification.id,
        });
      }
    });

    // System alerts
    socket.on('notification:system:alert', (alert) => {
      addNotification({
        ...alert,
        type: 'alert',
        persistent: true,
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, url, setOnlineUsers, addNotification]);

  const emit = (event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event: string, callback: (...args: any[]) => void) => {
    socketRef.current?.on(event, callback);
  };

  const off = (event: string, callback?: (...args: any[]) => void) => {
    if (callback) {
      socketRef.current?.off(event, callback);
    } else {
      socketRef.current?.off(event);
    }
  };

  return (
    <WebSocketContext.Provider 
      value={{ 
        socket: socketRef.current, 
        connected, 
        reconnecting,
        emit, 
        on, 
        off 
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within WebSocketProvider');
  }
  return context;
}