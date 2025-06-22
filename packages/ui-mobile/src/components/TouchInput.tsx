'use client';

import React, { forwardRef } from 'react';
import { cn } from '../utils/mobile';

interface TouchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const TouchInput = forwardRef<HTMLInputElement, TouchInputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full min-h-[48px] px-4 rounded-lg border',
              'text-base touch-manipulation',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              'disabled:bg-gray-100 disabled:text-gray-500',
              icon && 'pl-12',
              error
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

TouchInput.displayName = 'TouchInput';