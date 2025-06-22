'use client';

import React from 'react';
import { cn } from '../utils/mobile';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface MobileNavProps {
  items: NavItem[];
  activeId: string;
  onChange: (id: string) => void;
  position?: 'top' | 'bottom';
}

export function MobileNav({ items, activeId, onChange, position = 'bottom' }: MobileNavProps) {
  return (
    <nav
      className={cn(
        'fixed left-0 right-0 bg-white border-gray-200 z-50',
        position === 'bottom' 
          ? 'bottom-0 border-t safe-area-bottom' 
          : 'top-0 border-b safe-area-top'
      )}
    >
      <div className="flex">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={cn(
              'flex-1 flex flex-col items-center justify-center',
              'min-h-[56px] py-2 px-3 relative touch-manipulation',
              'transition-colors duration-200',
              activeId === item.id
                ? 'text-blue-600'
                : 'text-gray-500 active:bg-gray-50'
            )}
          >
            <div className="relative">
              {item.icon}
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}