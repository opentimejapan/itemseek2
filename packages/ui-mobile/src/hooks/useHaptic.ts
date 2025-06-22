'use client';

import { useCallback } from 'react';

export type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error';

export function useHaptic() {
  const triggerHaptic = useCallback((type: HapticFeedbackType = 'light') => {
    if (!('vibrate' in navigator)) return;

    const patterns: Record<HapticFeedbackType, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 30,
      selection: 5,
      success: [10, 100, 20],
      warning: [20, 50, 20],
      error: [30, 100, 30, 100, 30]
    };

    try {
      navigator.vibrate(patterns[type]);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }, []);

  return { triggerHaptic };
}