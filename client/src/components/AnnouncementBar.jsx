import React, { useState, useEffect } from 'react';
import { RiAlertFill, RiInformationFill, RiCheckboxCircleFill, RiCloseLine } from 'react-icons/ri';

const AnnouncementBar = ({ announcements, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-rotate if multiple announcements
    useEffect(() => {
        if (announcements.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % announcements.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [announcements.length]);

    if (!announcements || announcements.length === 0) return null;

    const current = announcements[currentIndex];
    
    const getBgColor = (type) => {
        switch(type) {
            case 'danger': return 'bg-red-600';
            case 'warning': return 'bg-yellow-500';
            case 'success': return 'bg-green-600';
            default: return 'bg-blue-600';
        }
    };

    const getIcon = (type) => {
        switch(type) {
            case 'danger': return <RiAlertFill />;
            case 'warning': return <RiAlertFill />;
            case 'success': return <RiCheckboxCircleFill />;
            default: return <RiInformationFill />;
        }
    };

    return (
        <div className={`${getBgColor(current.type)} text-white px-4 py-2 fixed top-0 left-0 w-full z-[60] transition-colors duration-500`}>
            <div className="container mx-auto flex items-center justify-center text-sm md:text-base font-medium">
                <span className="mr-2 text-lg">{getIcon(current.type)}</span>
                <p className="text-center">{current.text}</p>
            </div>
            <button 
                onClick={onClose}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/20 rounded-full"
            >
                <RiCloseLine size={20} />
            </button>
        </div>
    );
};

export default AnnouncementBar;
