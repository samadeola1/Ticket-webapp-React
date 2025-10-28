import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTickets } from '../hooks/useTickets';
import { ClipboardList, CheckCircle, Clock, Archive } from 'lucide-react'; // Value imports
import type { LucideProps } from 'lucide-react'; // Type import

// Define Stat type
interface StatInfo {
    title: string;
    value: number;
    color: string;
    icon: React.ComponentType<LucideProps>; // Type for Lucide icon component
}


const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { tickets } = useTickets();

  const stats = useMemo((): StatInfo[] => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in_progress').length;
    const closed = tickets.filter(t => t.status === 'closed').length;

    // Direct mapping to components
    return [
      { title: 'Total Tickets', value: total, color: 'text-indigo-500', icon: ClipboardList },
      { title: 'Open Tickets', value: open, color: 'text-green-500', icon: Clock },
      { title: 'In Progress', value: inProgress, color: 'text-amber-500', icon: Archive },
      { title: 'Closed Tickets', value: closed, color: 'text-gray-500', icon: CheckCircle },
    ];
  }, [tickets]);

  const userName = user?.name || 'User';

  // JSX is the same, using IconComponent correctly
  return (
     <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white px-6 pt-6 pb-10">
      <div className="max-w-[1440px] mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Welcome Back, <span className="text-indigo-600">{userName}</span> 👋
          </h1>
          <p className="text-gray-600">Here’s an overview of your ticket activity.</p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => {
            const IconComponent = stat.icon; // Get the component reference
            return (
              <div key={stat.title} className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition hover:-translate-y-1">
                <div className={`text-4xl mb-2 inline-block ${stat.color}`}>
                  <IconComponent size={36} strokeWidth={1.5}/> {/* Render the component */}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
            );
          })}
        </section>

        <section className="bg-white shadow-lg rounded-2xl p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Manage Your Tickets</h2>
            <p className="text-gray-600 max-w-md">
              Create, edit, and track tickets seamlessly. Stay organized and on top of your workflow.
            </p>
          </div>
          <Link to="/tickets" className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition text-lg font-semibold">
            Go to Tickets
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;