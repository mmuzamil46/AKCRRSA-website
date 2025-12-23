import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { RiFacebookCircleFill, RiYoutubeLine, RiTelegram2Line, RiPhoneFill, RiMailFill } from 'react-icons/ri';
import { FaTiktok, FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  const [links, setLinks] = useState({
    facebook: '/',
    telegram: '/',
    tiktok: '/',
    youtube: '/',
    x: '/'
  });

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/social`);
        setLinks(res.data);
      } catch (err) {
        console.error("Failed to fetch footer social links", err);
      }
    };
    fetchLinks();
  }, []);

  return (
    <footer className="bg-[#073a59] text-white pt-12 pb-6">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* About Section */}
        <div>
          <img src="/img/logwhite.JPG" alt="AKCRRSA Addis Ketema Official Logo White" className="w-32 mb-4" /> {/* Ensure this image exists, otherwise need to check name */}
          {/* Note: User had logwhite.JPG in original code. I must ensure I copied it. */}
          <p className="mb-6 leading-relaxed text-sm">
            የአዲስ ከተማ ክፍለ ከተማ የሲቪል ምዝገባ እና የነዋሪነት አገልግሎት ጽ/ቤት
          </p>
          <div className="flex gap-4">
            <a href={links.facebook === '/' ? '#' : links.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors text-xl"><RiFacebookCircleFill /></a>
            <a href={links.telegram === '/' ? '#' : links.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors text-xl"><RiTelegram2Line /></a>
            <a href={links.tiktok === '/' ? '#' : links.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors text-xl"><FaTiktok /></a>
            <a href={links.youtube === '/' ? '#' : links.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors text-xl"><RiYoutubeLine /></a>
            <a href={links.x === '/' ? '#' : links.x} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors text-xl"><FaXTwitter /></a>
          </div>
        </div>

        {/* Quick Links - Services */}
        <div>
          <h3 className="text-lg font-serif font-bold mb-4 border-b-2 border-secondary inline-block pb-1">አገልግሎቶች</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="/services#id" className="hover:text-white hover:translate-x-1 transition-transform inline-block">መታወቂያ</Link></li>
            <li><Link to="/services#birth" className="hover:text-white hover:translate-x-1 transition-transform inline-block">ልደት</Link></li>
            <li><Link to="/services#single" className="hover:text-white hover:translate-x-1 transition-transform inline-block">ያላገባ</Link></li>
            <li><Link to="/services#marriage" className="hover:text-white hover:translate-x-1 transition-transform inline-block">ጋብቻ</Link></li>
            <li><Link to="/services#death" className="hover:text-white hover:translate-x-1 transition-transform inline-block">ሞት</Link></li>
          </ul>
        </div>

        {/* Quick Links - Pages */}
        <div>
          <h3 className="text-lg font-serif font-bold mb-4 border-b-2 border-secondary inline-block pb-1">ገጾች</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="/" className="hover:text-white hover:translate-x-1 transition-transform inline-block">መነሻገፅ</Link></li>
            <li><Link to="/news" className="hover:text-white hover:translate-x-1 transition-transform inline-block">ምን አዲስ</Link></li>
            <li><Link to="/documents" className="hover:text-white hover:translate-x-1 transition-transform inline-block">ሰነዶች</Link></li>
            <li><Link to="/woredas" className="hover:text-white hover:translate-x-1 transition-transform inline-block">ወረዳዎች</Link></li>
            <li><Link to="/feedback" className="hover:text-white hover:translate-x-1 transition-transform inline-block">አስተያየት</Link></li>
            <li><Link to="/about" className="hover:text-white hover:translate-x-1 transition-transform inline-block">ስለእኛ</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-serif font-bold mb-4 border-b-2 border-secondary inline-block pb-1">አድራሻ</h3>
          <p className="text-sm text-gray-300 mb-4 leading-relaxed">
            አዲስ ከተማ ክፍለ ከተማ አስተዳደር ህንጻ፤ ከመድሀኒያለም ት/ቤት ወደ መሳለሚያ በሚወስደው መንገድ ከራስ ሀይሉ ስፖርት ማዕከል ጎን።
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <RiPhoneFill className="text-secondary" />
              <a href="tel:+251112590992" className="text-sm hover:text-white">+251112590992</a>
            </li>
            <li className="flex items-center gap-3">
              <RiMailFill className="text-secondary" />
              <a href="mailto:addisketemawosagnkunete@gmail.com" className="text-sm hover:text-white">addisketemawosagnkunete@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
        <p>&copy; 2023 CRRSAAK / Zhell tech inc. All rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
