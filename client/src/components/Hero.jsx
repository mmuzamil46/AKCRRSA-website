import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [manager, setManager] = useState(null);

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

  return (
    <section className="relative w-full overflow-hidden bg-gray-900 flex flex-col md:flex-row min-h-[600px] md:h-[80vh]">
      {/* Banner Section */}
      <div className="relative flex-grow h-[400px] md:h-full overflow-hidden">
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

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4">
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

      {/* Manager Section */}
      {manager && (
        <div className="w-full md:w-[350px] lg:w-[450px] bg-white flex flex-col justify-center p-8 md:p-10 border-t-8 md:border-t-0 md:border-l-8 border-primary relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full -ml-12 -mb-12" />

            <div className="relative z-10">
                <div className="mb-6 flex flex-col items-center md:items-start">
                    <div className="w-24 h-w-24 md:w-32 md:h-32 rounded-2xl overflow-hidden mb-4 shadow-xl ring-4 ring-primary/10">
                        <img 
                            src={manager.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${manager.image}` : manager.image} 
                            alt={manager.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1 font-serif">{manager.name}</h3>
                    <p className="text-primary font-bold text-sm uppercase tracking-wider">{manager.title}</p>
                </div>

                <div className="relative">
                    <span className="absolute -top-4 -left-2 text-6xl text-primary/10 font-serif">"</span>
                    <p className="text-gray-700 leading-relaxed italic text-sm md:text-base mb-6 relative z-10">
                        {manager.message}
                    </p>
                    <div className="h-1 w-20 bg-primary/20 rounded" />
                </div>
            </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
