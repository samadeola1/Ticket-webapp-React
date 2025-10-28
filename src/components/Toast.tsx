import React, { useState, useEffect } from 'react';
import type { ToastType } from '../types'; // Import type (Corrected line)

interface ToastProps {
  message: string;
  type: ToastType;
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Effect to manage transition classes
  useEffect(() => {
    // When message/type changes (and are valid), set visible
    if (message && type) {
      setIsVisible(true);
    } else {
      setIsVisible(false); // Hide if message/type cleared by provider
    }
    // Hiding is primarily controlled by the provider timeout removing the component,
    // but this handles the transition out if needed.
  }, [message, type]);

  const baseClasses = "fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ease";

  // Type mapping for classes
  const typeClasses: Record<ToastType, string> = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    '': 'bg-gray-600' // Default or handle empty type
  };

  // Visibility classes for transition
  const visibilityClasses = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5';

  // Return null if message is empty to avoid rendering empty div briefly
  if (!message) return null;

  return (
    <div className={`${baseClasses} ${typeClasses[type] || typeClasses.info} ${visibilityClasses}`}>
      {message}
    </div>
  );
};

export default Toast;