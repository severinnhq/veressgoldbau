import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';

const Header = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowHeader(false); // hide on scroll down
      } else {
        setShowHeader(true); // show on scroll up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`w-full flex justify-center top-4 z-50 fixed transition-all duration-500 ease-in-out ${
        showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20'
      }`}
    >
      <div
        className="px-6 py-2 flex items-center justify-between rounded-full shadow-lg w-[90%] md:w-auto"
        style={{ backgroundColor: '#302f2f' }}
      >
        {/* Logo */}
        <a
          href="https://veressgoldbau369.hu/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          <img
            src="/uploads/logo.png"
            alt="Logo"
            className="h-12 md:h-14 w-auto object-contain"
          />
        </a>

        {/* Phone number only */}
        <a
          href="tel:+36703614340"
          className="flex items-center ml-4 text-white text-sm md:text-base font-medium hover:text-blue-400 transition-colors"
        >
          <Phone className="w-5 h-5 mr-2" />
          +36 70 361 4340
        </a>
      </div>
    </header>
  );
};

export default Header;
