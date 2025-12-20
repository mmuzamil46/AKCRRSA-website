import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaFacebook, FaTelegram, FaTiktok, FaYoutube, FaXTwitter } from 'react-icons/fa6';

const SocialSidebar = () => {
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
        <div className="fixed left-0 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-1">
            {socialItems.map((item, index) => (
                <motion.a
                    key={index}
                    href={item.url === '/' ? undefined : item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ x: -40 }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className={`${item.color} text-white p-3 md:p-4 rounded-r-lg shadow-lg flex items-center justify-center transition-all group relative`}
                    title={item.label}
                >
                    <span className="text-lg md:text-xl group-hover:scale-110 transition-transform">
                        {item.icon}
                    </span>
                    
                    {/* Tooltip for desktop */}
                    <span className="absolute left-full ml-2 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap hidden md:block">
                        {item.label}
                    </span>
                </motion.a>
            ))}
        </div>
    );
};

export default SocialSidebar;
