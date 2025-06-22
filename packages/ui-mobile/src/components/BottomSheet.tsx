'use client';

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '../utils/mobile';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  snapPoints?: number[];
  initialSnap?: number;
  backdrop?: boolean;
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [0.5, 0.9],
  initialSnap = 0,
  backdrop = true
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [currentSnap, setCurrentSnap] = useState(initialSnap);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - startY;
    setCurrentY(deltaY);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Determine snap point
    if (currentY > 100) {
      onClose();
    } else if (currentY < -50) {
      // Snap to higher point
      const nextSnap = Math.min(currentSnap + 1, snapPoints.length - 1);
      setCurrentSnap(nextSnap);
    } else if (currentY > 50) {
      // Snap to lower point
      const nextSnap = Math.max(currentSnap - 1, 0);
      setCurrentSnap(nextSnap);
    }
    
    setCurrentY(0);
  };

  const sheetHeight = snapPoints[currentSnap] * 100;

  return (
    <>
      {/* Backdrop */}
      {backdrop && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          'fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50',
          'shadow-2xl transition-transform duration-300',
          'touch-manipulation',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
        style={{
          height: `${sheetHeight}vh`,
          transform: isOpen
            ? `translateY(${isDragging ? currentY : 0}px)`
            : 'translateY(100%)'
        }}
      >
        {/* Handle */}
        <div
          className="absolute top-0 left-0 right-0 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="px-4 py-4 mt-8 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4">
          {children}
        </div>
      </div>
    </>
  );
}