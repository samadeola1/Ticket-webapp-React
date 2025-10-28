// src/contexts/ToastContextValue.ts
import { createContext } from 'react';
import type { ToastType } from '../types';

// Define context value shape
export interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

// Create and export context with a default value (or undefined)
export const ToastContext = createContext<ToastContextType | undefined>(undefined);