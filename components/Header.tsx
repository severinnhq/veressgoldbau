import React from 'react';
import { Mail, Phone } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full sticky top-0 z-50" style={{ backgroundColor: '#302f2f' }}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/uploads/logo.png"
            alt="Logo"
            className="h-25 w-auto object-contain"
          />
        </div>

        {/* Contact info */}
        <div className="flex space-x-8 text-white text-sm md:text-base font-medium">
          <a href="mailto:info@example.com" className="flex items-center hover:text-blue-400 transition-colors">
            <Mail className="w-5 h-5 mr-2" />
            info@example.com
          </a>
          <a href="tel:+36123456789" className="flex items-center hover:text-blue-400 transition-colors">
            <Phone className="w-5 h-5 mr-2" />
            +36 1 234 56789
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
