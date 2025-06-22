'use client';

import React from 'react';
import { cn } from '../utils/mobile';

interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  haptic?: boolean;
}

export function TouchButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  haptic = true,
  className,
  onClick,
  ...props
}: TouchButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Haptic feedback for mobile
    if (haptic && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    onClick?.(e);
  };

  const variants = {
    primary: 'bg-blue-600 text-white active:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 active:bg-gray-300',
    danger: 'bg-red-600 text-white active:bg-red-700',
    ghost: 'bg-transparent text-gray-700 active:bg-gray-100'
  };

  const sizes = {
    sm: 'min-h-[44px] px-4 text-sm', // 44px minimum for touch
    md: 'min-h-[48px] px-6 text-base',
    lg: 'min-h-[56px] px-8 text-lg'
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'touch-manipulation select-none rounded-lg font-medium',
        'transition-all duration-150 active:scale-95',
        'flex items-center justify-center gap-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}