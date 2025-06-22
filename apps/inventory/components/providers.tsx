'use client';

import { ReactNode, useEffect, useState } from 'react';
import { WebSocketProvider } from '@itemseek/websocket';
import { getCookie } from '../lib/auth';

export function Providers({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Get auth token from cookie
    const authToken = getCookie('auth-token');
    setToken(authToken);
  }, []);

  if (!token) {
    return <>{children}</>;
  }

  return (
    <WebSocketProvider token={token}>
      {children}
    </WebSocketProvider>
  );
}