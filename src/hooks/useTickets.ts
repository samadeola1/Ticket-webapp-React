import { useContext } from 'react';
import { TicketContext } from '../contexts/TicketContext';

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};