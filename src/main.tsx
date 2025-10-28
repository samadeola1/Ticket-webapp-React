// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { TicketProvider } from './contexts/TicketContext.tsx';
import { ToastProvider } from './contexts/ToastContext.tsx';

// Get the root element using the correct ID from index.html
const rootElement = document.getElementById('root');

// Check if the root element exists before rendering
if (!rootElement) {
  // Throw a more specific error if the element isn't found
  throw new Error("Failed to find the root element with ID 'root'. Check your index.html file.");
} else {
  // Render the app only if the root element exists
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <TicketProvider>
              <App />
            </TicketProvider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </React.StrictMode>,
  );
}