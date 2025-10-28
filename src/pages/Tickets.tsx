import React, { useState } from 'react';
import { useTickets } from '../hooks/useTickets';
import { useToast } from '../hooks/useToast';
import { X } from 'lucide-react';
import type { Ticket, TicketStatus } from '../types'; // Type imports

type TicketFormData = Omit<Ticket, 'id' | 'createdAt'> & { id: number | null };

const Tickets: React.FC = () => {
  const { tickets, createTicket, updateTicket, deleteTicket: contextDeleteTicket } = useTickets();
  const { showToast } = useToast();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const initialFormState: TicketFormData = { id: null, title: '', description: '', status: '' };
  const [currentTicket, setCurrentTicket] = useState<TicketFormData>(initialFormState);
  const [errors, setErrors] = useState({ title: '', status: '' });


  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentTicket(initialFormState);
    setErrors({ title: '', status: '' });
    setShowModal(true);
  };

  const openEditModal = (ticket: Ticket) => {
    setIsEditing(true);
    setCurrentTicket({ ...ticket });
    setErrors({ title: '', status: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const finalValue = name === 'status' ? value as TicketStatus : value;
    setCurrentTicket(prev => ({ ...prev, [name]: finalValue }));
     if (errors[name as keyof typeof errors]) {
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };

   const validateForm = (): boolean => {
     let valid = true;
     const newErrors = { title: '', status: '' };
     if (!currentTicket.title.trim()) {
        newErrors.title = "Title is required";
        valid = false;
     }
      if (!currentTicket.status) {
        newErrors.status = "Status is required";
        valid = false;
      }
      setErrors(newErrors);
      return valid;
  }

  const handleSaveTicket = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     if (!validateForm()) return;

    if (isEditing && currentTicket.id !== null) {
      updateTicket(currentTicket as Ticket);
      showToast('✅ Ticket updated successfully!', 'success');
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...newTicketData } = currentTicket; // Ignore unused 'id'
      createTicket(newTicketData);
      showToast('✅ Ticket created successfully!', 'success');
    }
    closeModal();
  };

  const handleDeleteTicket = (id: number) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      contextDeleteTicket(id);
      showToast('✅ Ticket deleted successfully!', 'success');
    }
  };

  const getStatusClass = (status: TicketStatus): string => {
    switch (status) {
      case 'open': return 'text-green-600';
      case 'in_progress': return 'text-amber-500';
      case 'closed': return 'text-gray-500';
      default: return 'text-gray-700';
    }
  };

   const formatStatus = (status: TicketStatus): string => {
        if (!status) return '-';
        return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
   }

  return (
     <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white px-6 pt-6 pb-10"> {/* Adjusted pt */}
      <div className="max-w-[1440px] mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Your Tickets</h1>
          <button onClick={openCreateModal} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition whitespace-nowrap">
            + Create Ticket
          </button>
        </header>

         {tickets.length === 0 ? (
           <p className="text-center text-gray-500 mt-10">No tickets yet. Create one to get started!</p>
        ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tickets.map((ticket) => (
                <div key={ticket.id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition relative flex flex-col justify-between">
                    <div>
                        <h2 className="font-semibold text-lg text-gray-800 break-words">{ticket.title}</h2>
                        <p className="text-gray-600 mt-2 break-words">{ticket.description || 'No description'}</p>
                        <p className="text-sm mt-2">
                        Status:{' '}
                        <span className={`font-medium ${getStatusClass(ticket.status)}`}>
                             {formatStatus(ticket.status)}
                        </span>
                        </p>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                        <button onClick={() => openEditModal(ticket)} className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition text-sm">Edit</button>
                        <button onClick={() => handleDeleteTicket(ticket.id)} className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm">Delete</button>
                    </div>
                </div>
                ))}
            </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl max-w-md w-full relative">
             <button onClick={closeModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Ticket' : 'Create Ticket'}</h2>
            <form onSubmit={handleSaveTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                    name="title" value={currentTicket.title} onChange={handleChange} type="text"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                 />
                 {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    name="description" value={currentTicket.description} onChange={handleChange} rows={3}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                    name="status" value={currentTicket.status} onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    required
                >
                  <option value="" disabled>Select status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
                 {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">{isEditing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;