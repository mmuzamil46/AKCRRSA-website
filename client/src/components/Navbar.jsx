import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiMenu3Line, RiCloseLine, RiArrowDownSLine } from 'react-icons/ri';
import AnnouncementBar from './AnnouncementBar';
import axios from 'axios';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/announcements/public`);
            setAnnouncements(res.data);
        } catch (err) {
            console.error("Failed to fetch announcements");
        }
    };
    fetchAnnouncements();
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const navLinks = [
    { title: 'መነሻገፅ', path: '/' },
    { title: 'ምንአዲስ', path: '/news' },
    // Services is a dropdown
    { title: 'ወረዳዎች', path: '/woredas' },
    { title: 'ስለእኛ', path: '/about' },
    { title: 'ያግኙን', path: '/contact' },
  ];

  const serviceLinks = [
    { title: 'መታወቂያ', path: '/services#id' },
    { title: 'ያላገባ', path: '/services#single' },
    { title: 'ልደት', path: '/services#birth' },
    { title: 'ጋብቻ', path: '/services#marriage' },
    { title: 'ሞት', path: '/services#death' },
    { title: 'ሌሎች...', path: '/services' },
  ];

  const isActive = (path) => location.pathname === path;

  // Determine effective top margin
  const hasAnnouncement = showAnnouncement && announcements.length > 0;

  return (
    <>
      {hasAnnouncement && (
        <AnnouncementBar 
            announcements={announcements} 
            onClose={() => setShowAnnouncement(false)} 
        />
      )}
      <nav className={`fixed w-full z-50 bg-white shadow-md font-sans top-0 ${hasAnnouncement ? 'mt-[40px] md:mt-[44px]' : ''}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 relative">
          <img src="/img/logo.JPG" alt="Logo" className="h-10 md:h-12 w-auto object-contain" />
          <span className="absolute -top-2 -right-12 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
            v1.2.5
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center font-bold text-primary">
          <Link to="/" className={`hover:text-secondary ${isActive('/') ? 'text-secondary' : ''}`}>መነሻገፅ</Link>
          <Link to="/news" className={`hover:text-secondary ${isActive('/news') ? 'text-secondary' : ''}`}>ምንአዲስ</Link>

          
          {/* Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-secondary focus:outline-none">
              አገልግሎቶች <RiArrowDownSLine />
            </button>
            <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-md py-2 hidden group-hover:block border-t-2 border-primary">
              {serviceLinks.map((link, idx) => (
                <Link 
                  key={idx} 
                  to={link.path} 
                  className="block px-4 py-2 hover:bg-accent hover:text-primary transition-colors text-sm"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/woredas" className={`hover:text-secondary ${isActive('/woredas') ? 'text-secondary' : ''}`}>ወረዳዎች</Link>
          <Link to="/feedback" className={`hover:text-secondary ${isActive('/feedback') ? 'text-secondary' : ''}`}>አስተያየት</Link>
          <Link to="/about" className={`hover:text-secondary ${isActive('/about') ? 'text-secondary' : ''}`}>ስለእኛ</Link>
          <Link to="/gallery" className={`hover:text-secondary ${isActive('/gallery') ? 'text-secondary' : ''}`}>አውደ ርዕይ</Link>
           <Link to="/documents" className={`hover:text-secondary ${isActive('/documents') ? 'text-secondary' : ''}`}>ሰነዶች</Link>
          
          <Link to="/contact" className="px-5 py-2 bg-primary text-white rounded-full hover:bg-secondary transition-colors">
            ያግኙን
          </Link>
          
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-2xl text-primary" onClick={toggleMenu}>
          {isOpen ? <RiCloseLine /> : <RiMenu3Line />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="flex flex-col py-4 px-4 space-y-4 font-bold text-primary">
              <Link to="/" onClick={toggleMenu} className="hover:text-secondary">መነሻገፅ</Link>
              <Link to="/news" onClick={toggleMenu} className="hover:text-secondary">ምንአዲስ</Link>
             
              <Link to="/gallery" onClick={toggleMenu} className="hover:text-secondary">አውደ ርዕይ</Link>
              
              {/* Mobile Accordion for Services */}
              <div>
                <button onClick={toggleDropdown} className="flex justify-between items-center w-full hover:text-secondary">
                  አገልግሎቶች <RiArrowDownSLine className={`transform transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pl-4 mt-2 space-y-2 border-l-2 border-gray-100"
                  >
                    {serviceLinks.map((link, idx) => (
                      <Link 
                        key={idx} 
                        to={link.path} 
                        onClick={toggleMenu}
                        className="block text-sm font-normal hover:text-secondary"
                      >
                        {link.title}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>

              <Link to="/woredas" onClick={toggleMenu} className="hover:text-secondary">ወረዳዎች</Link>
              <Link to="/feedback" onClick={toggleMenu} className="hover:text-secondary">አስተያየት</Link>
              <Link to="/about" onClick={toggleMenu} className="hover:text-secondary">ስለእኛ</Link>
               <Link to="/documents" onClick={toggleMenu} className="hover:text-secondary">ሰነዶች</Link>
              <Link to="/contact" onClick={toggleMenu} className="hover:text-secondary block w-full text-center py-2 bg-primary text-white rounded-md">ያግኙን</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </>
  );
};

export default Navbar;
