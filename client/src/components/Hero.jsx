import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [manager, setManager] = useState(null);
  const [showFullMessage, setShowFullMessage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [bannerRes, managerRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/banners`),
                axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/manager`)
            ]);
            
            if (bannerRes.data.length > 0) {
                setSlides(bannerRes.data);
            } else {
                setSlides([{
                    image: '/img/slide-1.jpg',
                    title: 'የአዲስ ከተማ ክፍለ ከተማ',
                    subtitle: 'የሲቪል ምዝገባ እና የነዋሪነት አገልግሎት ጽ/ቤት',
                }]);
            }
            
            setManager(managerRes.data);
        } catch (err) {
            console.error(err);
             setSlides([{
                image: '/img/slide-1.jpg',
                title: 'የአዲስ ከተማ ክፍለ ከተማ',
                subtitle: 'የሲቪል ምዝገባ እና የነዋሪነት አገልግሎት ጽ/ቤት',
            }]);
        }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (slides.length > 1) {
        const timer = setInterval(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }
  }, [slides.length]);

  if (slides.length === 0) return null;

  const truncateMessage = (text, maxLength = 180) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <section className="relative w-full overflow-hidden bg-gray-900 flex flex-col">
      {/* Banner Section */}
      <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
            {slides.map((slide, index) => (
                <div 
                    key={index}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0'}`}
                    style={{ 
                        backgroundImage: `url(${slide.image.startsWith('/uploads') || slide.image.startsWith('/') ? `${import.meta.env.VITE_API_BASE_URL}${slide.image}` : slide.image})` 
                    }}
                />
            ))}
            <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4 py-12">
            <motion.h1 
                key={`h1-${current}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-4"
            >
              {slides[current].title}
            </motion.h1>
            <motion.p
                key={`p-${current}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-base md:text-xl lg:text-2xl mb-8 font-light max-w-2xl"
            >
              {slides[current].subtitle}
            </motion.p>
            
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex gap-4"
            >
                <Link to="/news" className="px-6 py-2.5 bg-primary border-2 border-primary text-white rounded-full hover:bg-transparent hover:border-white transition-all font-bold text-sm md:text-base">
                    ይጎብኙ
                </Link>
                <Link to="/about" className="px-6 py-2.5 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-primary transition-all font-bold text-sm md:text-base">
                    ተጨማሪ ያንብቡ
                </Link>
            </motion.div>
        </div>
      </div>

      {/* Manager Section - Now Below the Banner */}
      {manager && (
        <div className="w-full bg-white border-t-8 border-primary relative overflow-hidden py-12 md:py-16">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full -ml-24 -mb-24" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16 max-w-6xl mx-auto">
                    {/* Manager Image */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 rounded-3xl overflow-hidden shadow-2xl ring-8 ring-primary/5 transition-transform hover:scale-105 duration-300"
                    >
                        <img 
                            src={manager.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${manager.image}` : manager.image} 
                            alt={manager.name}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Manager Content */}
                    <div className="flex-grow text-center md:text-left">
                        <div className="mb-6">
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-serif">{manager.name}</h3>
                            <p className="text-primary font-bold text-lg uppercase tracking-widest">{manager.title}</p>
                            <div className="h-1.5 w-24 bg-primary/20 rounded mt-4 mx-auto md:mx-0" />
                        </div>

                        <div className="relative">
                            <span className="absolute -top-10 -left-6 text-8xl text-primary/10 font-serif pointer-events-none">"</span>
                            <div className="text-gray-700 leading-relaxed italic text-lg md:text-xl mb-6 relative z-10">
                                {showFullMessage ? manager.message : truncateMessage(manager.message, 250)}
                            </div>
                            
                            {manager.message.length > 250 && (
                                <button 
                                    onClick={() => setShowFullMessage(!showFullMessage)}
                                    className="px-6 py-2 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all focus:outline-none mb-6 text-sm"
                                >
                                    {showFullMessage ? 'ቀንስ (Read Less)' : 'ተጨማሪ ያንብቡ (Read More)'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </section>

  );
};

export default Hero;
