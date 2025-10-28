import React from 'react';

const Footer: React.FC = () => { // Typed as FC
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 py-6 mt-20 border-t" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-[1440px] mx-auto text-center px-4 text-gray-600">
        <p className="text-sm">&copy; {currentYear} Ticketly. All rights reserved.</p>
        <p className="text-xs mt-2">Made with ❤️ by Samuel Deola</p>
      </div>
    </footer>
  );
};

export default Footer;