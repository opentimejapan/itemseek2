'use client';

import React, { useEffect } from 'react';
import { cn } from '../utils/mobile';
import { TouchButton } from './TouchButton';

interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }[];
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export function MobileModal({
  isOpen,
  onClose,
  title,
  children,
  actions = [],
  size = 'md'
}: MobileModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    full: 'max-w-full mx-4'
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'fixed inset-x-4 top-1/2 -translate-y-1/2 z-50',
          'transition-all duration-300',
          sizes[size],
          'mx-auto',
          isOpen
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-95 pointer-events-none'
        )}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto overscroll-contain">
            {children}
          </div>

          {/* Actions */}
          {actions.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
              {actions.map((action, index) => (
                <TouchButton
                  key={index}
                  variant={action.variant || 'primary'}
                  onClick={action.onClick}
                  fullWidth
                >
                  {action.label}
                </TouchButton>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}