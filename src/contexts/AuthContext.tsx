/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useCallback } from 'react'; // Removed ReactNode from here
import type { User } from '../types'; // Keep type-only import for User

// Define the shape of the user stored in localStorage (including password for signup/login check)
interface StoredUser extends User {
    password?: string; // Password should ideally be hashed in a real app
}

// Define the shape of the signup result
interface SignupResult {
    success: boolean;
    error?: string;
}

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  login: (email: string) => boolean; // Returns success status
  logout: () => void;
  signup: (name: string, email: string, password: string) => SignupResult;
  loadUser: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode; // Correct: Use React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const loadUser = useCallback(() => {
    try {
      const sessionString = localStorage.getItem("ticketapp_session");
      if (!sessionString) {
          setUser(null);
          return;
      }
      const session: User = JSON.parse(sessionString); // Assume stored session matches User type
      if (session && session.email && session.name) {
        setUser({ name: session.name, email: session.email });
      } else {
        setUser(null);
        localStorage.removeItem("ticketapp_session");
      }
    } catch (error) {
      console.error("Failed to load user session:", error);
      setUser(null);
      localStorage.removeItem("ticketapp_session");
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback((email: string): boolean => {
    try {
      const usersString = localStorage.getItem("ticketapp_users") || "[]";
      const users: StoredUser[] = JSON.parse(usersString);
      const currentUser = users.find((u) => u.email === email);
      // IMPORTANT: In a real app, compare hashed passwords!
      // This is simplified for demonstration based on the original code.
       if (!currentUser) return false; // Simplified check based on original code

      const userData: User = { name: currentUser.name, email: currentUser.email };
      setUser(userData);
      localStorage.setItem("ticketapp_session", JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    const userEmail = user?.email; // Capture email before setting user to null
    setUser(null);
    localStorage.removeItem("ticketapp_session");
     if (userEmail) {
       localStorage.removeItem(`tickets_${userEmail}`); // Clear tickets on logout
     }
  }, [user]);

  const signup = useCallback((name: string, email: string, password: string): SignupResult => {
    try {
      const usersString = localStorage.getItem("ticketapp_users") || "[]";
      const users: StoredUser[] = JSON.parse(usersString);

      if (users.some(u => u.email === email)) {
        return { success: false, error: "Email already exists" };
      }

      // NOTE: Storing plain password is insecure. Hash passwords in real applications.
      const newUser: StoredUser = { name, email, password };
      users.push(newUser);
      localStorage.setItem("ticketapp_users", JSON.stringify(users));

      // Automatically login after signup
      const loggedIn = login(email);
      return { success: loggedIn };

    } catch (error) {
      console.error("Signup failed:", error);
      return { success: false, error: "An unexpected error occurred during signup." };
    }
  }, [login]); // Login dependency

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};