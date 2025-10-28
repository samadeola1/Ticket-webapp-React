// src/hooks/useToast.ts
import { useContext } from 'react';
// Ensure this path is correct, pointing to where ToastContext is exported
import { ToastContext } from '../contexts/ToastContextValue';         // Value import
import type { ToastContextType } from '../contexts/ToastContextValue'; // Type import

// Explicitly define the return type here!
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context; // This is guaranteed to be ToastContextType if no error thrown
};