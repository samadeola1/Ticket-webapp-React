import React, { createContext, useState, useEffect, useCallback } from 'react'; // Removed ReactNode from here
import { useAuth } from '../hooks/useAuth';
import type { Ticket } from '../types'; // Keep type-only import for Ticket

// Type for the ticket data used for creation (ID is generated)
type NewTicketData = Omit<Ticket, 'id' | 'createdAt'>;

// Define the context value shape
interface TicketContextType {
  tickets: Ticket[];
  createTicket: (ticketData: NewTicketData) => void;
  updateTicket: (updatedTicket: Ticket) => void;
  deleteTicket: (id: number) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const TicketContext = createContext<TicketContextType | undefined>(undefined);

interface TicketProviderProps {
  children: React.ReactNode; // Correct: Use React.ReactNode here
}

export const TicketProvider: React.FC<TicketProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const getStorageKey = useCallback((): string | null => {
    return user ? `tickets_${user.email}` : null;
  }, [user]);

  // Load tickets
  useEffect(() => {
    const key = getStorageKey();
    if (key) {
      try {
        const storedTicketsString = localStorage.getItem(key) || "[]";
        const storedTickets: Ticket[] = JSON.parse(storedTicketsString);
        setTickets(storedTickets);
      } catch (error) {
        console.error("Failed to load tickets:", error);
        setTickets([]);
      }
    } else {
      setTickets([]);
    }
  }, [user, getStorageKey]);

  // Save tickets
  const saveTickets = useCallback((updatedTickets: Ticket[]) => {
    const key = getStorageKey();
    if (key) {
      try {
        localStorage.setItem(key, JSON.stringify(updatedTickets));
      } catch (error) {
        console.error("Failed to save tickets:", error);
      }
    }
  }, [getStorageKey]);

  // Create ticket
  const createTicket = useCallback((ticketData: NewTicketData) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now(), // Generate ID
      createdAt: new Date().toISOString(),
    };
    setTickets(prevTickets => {
      const updated = [...prevTickets, newTicket];
      saveTickets(updated);
      return updated;
    });
  }, [saveTickets]);

  // Update ticket
  const updateTicket = useCallback((updatedTicket: Ticket) => {
    setTickets(prevTickets => {
      const index = prevTickets.findIndex((t) => t.id === updatedTicket.id);
      if (index !== -1) {
        const updated = [...prevTickets];
        updated[index] = { ...updatedTicket }; // Ensure immutability
        saveTickets(updated);
        return updated;
      }
      return prevTickets; // No change if not found
    });
  }, [saveTickets]);

  // Delete ticket
  const deleteTicket = useCallback((id: number) => {
    setTickets(prevTickets => {
      const updated = prevTickets.filter((t) => t.id !== id);
      saveTickets(updated);
      return updated;
    });
  }, [saveTickets]);

  return (
    <TicketContext.Provider value={{ tickets, createTicket, updateTicket, deleteTicket }}>
      {children}
    </TicketContext.Provider>
  );
};