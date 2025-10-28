// Define User type
export interface User {
  name: string;
  email: string;
}

// Define Ticket status type
export type TicketStatus = 'open' | 'in_progress' | 'closed' | '';

// Define Ticket type
export interface Ticket {
  id: number; // Using number as derived from Date.now()
  title: string;
  description: string;
  status: TicketStatus;
  createdAt?: string; // Optional creation date
}

// Define Toast type
export type ToastType = 'success' | 'error' | 'info' | '';

export interface ToastState {
    message: string;
    type: ToastType;
    visible: boolean;
}