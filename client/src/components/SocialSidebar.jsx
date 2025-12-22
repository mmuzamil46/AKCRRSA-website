import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFacebook, FaTelegram, FaTiktok, FaYoutube, FaXTwitter } from 'react-icons/fa6';
import { RiShareLine, RiCloseLine } from 'react-icons/ri';
import { AnimatePresence } from 'framer-motion';

const SocialSidebar = () => {
    const [links, setLinks] = useState({
        facebook: '/',
        telegram: '/',
        tiktok: '/',
        youtube: '/',
        x: '/'
    });
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/social`);
                setLinks(res.data);
            } catch (err) {
                console.error("Failed to fetch social links", err);
            }
        };
        fetchLinks();
    }, []);

    const socialItems = [
        { icon: <FaFacebook />, url: links.facebook, color: 'bg-[#1877F2]', label: 'Facebook' },
        { icon: <FaTelegram />, url: links.telegram, color: 'bg-[#229ED9]', label: 'Telegram' },
        { icon: <FaTiktok />, url: links.tiktok, color: 'bg-[#000000]', label: 'TikTok' },
        { icon: <FaYoutube />, url: links.youtube, color: 'bg-[#FF0000]', label: 'YouTube' },
        { icon: <FaXTwitter />, url: links.x, color: 'bg-[#000000]', label: 'X' },
    ];

    return (
        <div className="fixed left-6 bottom-6 z-[1000] flex flex-col-reverse items-center gap-3">
            {/* Main Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 border-4 border-white ${
                    isOpen ? 'bg-secondary text-white' : 'bg-primary text-white'
                }`}
            >
                {isOpen ? <RiCloseLine className="text-2xl" /> : <RiShareLine className="text-2xl" />}
            </motion.button>

            {/* Social Icons Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        className="flex flex-col gap-3 p-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl"
                    >
                        {socialItems.map((item, index) => (
                            <motion.a
                                key={index}
                                href={item.url === '/' ? undefined : item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.1, y: -2 }}
                                className={`w-11 h-11 ${item.color} text-white rounded-full flex items-center justify-center shadow-lg transition-transform group relative`}
                            >
                                <span className="text-lg">
                                    {item.icon}
                                </span>
                                
                                {/* Tooltip */}
                                <span className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap hidden md:block shadow-xl">
                                    {item.label}
                                </span>
                            </motion.a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SocialSidebar;
