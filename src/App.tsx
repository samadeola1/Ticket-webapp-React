import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => { // Typed as FC
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      {/* Added pt-[80px] roughly equal to navbar height + padding, adjust if needed */}
      <main className="flex-grow max-w-[1440px] w-full mx-auto p-6 pt-[80px]">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> }
          />
          <Route
            path="/tickets"
            element={ <ProtectedRoute> <Tickets /> </ProtectedRoute> }
          />
          {/* Optional: Add 404 Route */}
          {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
        </Routes>
      </main>
      <Footer />
      {/* Toast is rendered within ToastProvider */}
    </div>
  );
}

export default App;