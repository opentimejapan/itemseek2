import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /Android/.test(navigator.userAgent);
}

export function getViewportHeight(): number {
  if (typeof window === 'undefined') return 0;
  
  // Account for mobile browser chrome
  return window.innerHeight || document.documentElement.clientHeight;
}

export function preventDoubleTapZoom(element: HTMLElement) {
  let lastTap = 0;
  
  element.addEventListener('touchend', (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    
    if (tapLength < 500 && tapLength > 0) {
      e.preventDefault();
    }
    
    lastTap = currentTime;
  });
}

export function enableSmoothScroll(element: HTMLElement) {
  element.style.webkitOverflowScrolling = 'touch';
  element.style.overscrollBehavior = 'contain';
}