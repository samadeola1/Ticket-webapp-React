import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loadUser } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const toastShownRef = useRef(false); // Ref to track if toast was shown

  useEffect(() => {
    // Only load user initially or if user state isn't definitively known
    if (isLoading) {
      loadUser();
      setIsLoading(false);
    }
  }, [loadUser, isLoading]); // Depend on loadUser and isLoading

  // Effect to handle redirection and toast *after* loading state is resolved
  useEffect(() => {
    // Only act if loading is complete AND user is null AND toast hasn't been shown yet
    if (!isLoading && !user && !toastShownRef.current) {
      showToast("❌ You must log in to access this page", "error");
      toastShownRef.current = true; // Mark toast as shown for this instance
    }
    // Reset the ref if the user logs in later while this component might still be mounted (edge case)
    if (user) {
        toastShownRef.current = false;
    }
  }, [isLoading, user, showToast]); // Depend on these states

  if (isLoading) {
    return <div>Loading...</div>; // Show loading indicator
  }

  // If loading is done and there's no user, redirect (toast is handled by useEffect)
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If loading is done and there IS a user, render the children
  return <>{children}</>;
};

export default ProtectedRoute;