'use client';

import React from 'react';
import { cn } from '../utils/mobile';

interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  pressable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function MobileCard({
  children,
  className,
  onClick,
  pressable = false,
  padding = 'md'
}: MobileCardProps) {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl shadow-sm',
        pressable && 'touch-manipulation cursor-pointer active:scale-[0.98] transition-transform',
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
}