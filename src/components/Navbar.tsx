import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => { // Explicitly type as Functional Component
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { user, logout: authLogout, loadUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadUser(); // Load user state on initial mount
  }, [loadUser]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    authLogout();
    closeMenu();
    navigate('/');
  };

  // The JSX remains the same as the JS version
  return (
    <nav className="fixed w-full bg-white shadow z-50">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition" onClick={closeMenu}>
          Ticketly
        </Link>

        <div className="hidden md:flex flex-1 justify-center items-center space-x-6">
          <Link to="/" className="hover:text-indigo-600 transition font-medium">Home</Link>
          <Link to="/dashboard" className="hover:text-indigo-600 transition font-medium">Dashboard</Link>
          <Link to="/tickets" className="hover:text-indigo-600 transition font-medium">Tickets</Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-700 font-medium">👋 Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-transform hover:scale-105">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-transform hover:scale-105 shadow">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button onClick={toggleMenu} className="md:hidden text-gray-700 focus:outline-none">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <Link to="/" className="block px-6 py-3 border-b hover:bg-indigo-50" onClick={closeMenu}>Home</Link>
          <Link to="/dashboard" className="block px-6 py-3 border-b hover:bg-indigo-50" onClick={closeMenu}>Dashboard</Link>
          <Link to="/tickets" className="block px-6 py-3 border-b hover:bg-indigo-50" onClick={closeMenu}>Tickets</Link>
          {user ? (
            <>
              <span className="block px-6 py-3 border-b">👋 Hi, {user.name}</span>
              <button onClick={handleLogout} className="w-full text-left px-6 py-3 border-b text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-6 py-3 border-b text-indigo-600" onClick={closeMenu}>Login</Link>
              <Link to="/signup" className="block px-6 py-3 border-b text-white bg-indigo-600" onClick={closeMenu}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;