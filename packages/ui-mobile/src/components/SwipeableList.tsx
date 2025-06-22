'use client';

import React, { useRef, useState } from 'react';
import { cn } from '../utils/mobile';
import { useSwipe } from '../hooks/useSwipe';

interface SwipeAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  color: 'danger' | 'primary' | 'success';
  onClick: () => void;
}

interface SwipeableListItemProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  onSwipeComplete?: (direction: 'left' | 'right') => void;
}

export function SwipeableListItem({
  children,
  leftActions = [],
  rightActions = [],
  onSwipeComplete
}: SwipeableListItemProps) {
  const [offset, setOffset] = useState(0);
  const [isOpen, setIsOpen] = useState<'left' | 'right' | null>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe({
    onSwipeLeft: () => {
      if (rightActions.length > 0) {
        setIsOpen('right');
        onSwipeComplete?.('left');
      }
    },
    onSwipeRight: () => {
      if (leftActions.length > 0) {
        setIsOpen('left');
        onSwipeComplete?.('right');
      }
    },
    threshold: 50
  });

  const actionColors = {
    danger: 'bg-red-500 text-white',
    primary: 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white'
  };

  const handleActionClick = (action: SwipeAction) => {
    action.onClick();
    setIsOpen(null);
    setOffset(0);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Left actions */}
      {leftActions.length > 0 && (
        <div className="absolute left-0 top-0 bottom-0 flex">
          {leftActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={cn(
                'flex items-center justify-center px-4 min-w-[80px]',
                'transition-opacity duration-200',
                actionColors[action.color],
                isOpen === 'left' ? 'opacity-100' : 'opacity-0'
              )}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Right actions */}
      {rightActions.length > 0 && (
        <div className="absolute right-0 top-0 bottom-0 flex">
          {rightActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={cn(
                'flex items-center justify-center px-4 min-w-[80px]',
                'transition-opacity duration-200',
                actionColors[action.color],
                isOpen === 'right' ? 'opacity-100' : 'opacity-0'
              )}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main content */}
      <div
        ref={itemRef}
        className={cn(
          'relative bg-white transition-transform duration-200',
          'touch-manipulation'
        )}
        style={{
          transform: `translateX(${
            isOpen === 'left' ? '80px' : isOpen === 'right' ? '-80px' : '0'
          })`
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => {
          if (isOpen) {
            setIsOpen(null);
            setOffset(0);
          }
        }}
      >
        {children}
      </div>
    </div>
  );
}

interface SwipeableListProps {
  children: React.ReactNode;
  className?: string;
}

export function SwipeableList({ children, className }: SwipeableListProps) {
  return (
    <div className={cn('divide-y divide-gray-200', className)}>
      {children}
    </div>
  );
}