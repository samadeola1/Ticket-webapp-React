// src/contexts/ToastContext.tsx
import React, { useState, useCallback } from 'react';
import Toast from '../components/Toast';
import type { ToastState, ToastType } from '../types';
import { ToastContext } from './ToastContextValue';         // Value import
import type { ToastContextType } from './ToastContextValue'; // Type import

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({ message: '', type: '', visible: false });

  const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 3000) => {
    setToast({ message, type, visible: true });

    setTimeout(() => {
      setToast((currentToast) =>
        currentToast.message === message && currentToast.type === type
          ? { message: '', type: '', visible: false }
          : currentToast
      );
    }, duration);
  }, []);

  // Prepare the context value object
  const contextValue: ToastContextType = { showToast };

  return (
    // Provide the value object matching ToastContextType
    <ToastContext.Provider value={contextValue}>
      {children}
      {toast.visible && <Toast message={toast.message} type={toast.type} />}
    </ToastContext.Provider>
  );
};

// IMPORTANT: No need to export ToastContext from this file anymore