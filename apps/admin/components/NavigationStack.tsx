'use client';

import React from 'react';
import { TouchButton } from '@itemseek2/ui-mobile';

interface NavigationStackProps {
  currentView: string;
  canGoBack: boolean;
  onBack: () => void;
  onHome: () => void;
}

export function NavigationStack({ 
  currentView, 
  canGoBack, 
  onBack, 
  onHome 
}: NavigationStackProps) {
  const viewTitles: Record<string, string> = {
    dashboard: 'Admin Dashboard',
    users: 'User Management',
    ai: 'AI Configuration',
    settings: 'Organization Settings',
    monitor: 'System Monitor',
  };

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-200 safe-area-top">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {canGoBack && (
            <TouchButton
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              ←
            </TouchButton>
          )}
          <h1 className="text-xl font-bold text-gray-900">
            {viewTitles[currentView] || currentView}
          </h1>
        </div>
        <TouchButton
          variant="ghost"
          size="sm"
          onClick={onHome}
          className="p-2"
        >
          🏠
        </TouchButton>
      </div>
    </div>
  );
}