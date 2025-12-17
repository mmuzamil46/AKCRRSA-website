import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/banners`);
            if (res.data.length > 0) {
                setSlides(res.data);
            } else {
                // Fallback slides
                setSlides([
                    {
                        image: '/img/slide-1.jpg',
                        title: 'የአዲስ ከተማ ክፍለ ከተማ',
                        subtitle: 'የሲቪል ምዝገባ እና የነዋሪነት አገልግሎት ጽ/ቤት',
                    }
                ]);
            }
        } catch (err) {
            console.error(err);
             // Fallback on error
             setSlides([
                {
                    image: '/img/slide-1.jpg',
                    title: 'የአዲስ ከተማ ክፍለ ከተማ',
                    subtitle: 'የሲቪል ምዝገባ እና የነዋሪነት አገልግሎት ጽ/ቤት',
                }
            ]);
        }
    };
    fetchBanners();
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
    <section className="relative h-[80vh] w-full overflow-hidden bg-gray-900">
      <AnimatePresence mode='wait'>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].image.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${slides[current].image}` : slides[current].image})` }} 
            // Note: If using local uploads, prepend domain. If simple URL (like fallback), handle carefully. 
            // Better logic: check if starts with /uploads.
          >
             {/* Creating a smarter style prop in render */}
          </div>
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
      </AnimatePresence>
      
      {/* Re-rendering properly to fix the style bug above */}
       <div 
            className="absolute inset-0 z-0"
        >
             {slides.map((slide, index) => (
                 <div 
                    key={index}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0'}`}
                    style={{ 
                        backgroundImage: `url(${slide.image.startsWith('/uploads') || slide.image.startsWith('/') ? `${import.meta.env.VITE_API_BASE_URL}${slide.image}` : slide.image})` 
                    }}
                 />
             ))}
             <div className="absolute inset-0 bg-black/50" />
        </div>

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4">
        <motion.h1 
          key={`h1-${current}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-4xl md:text-6xl font-serif font-bold mb-4"
        >
          {slides[current].title}
        </motion.h1>
        <motion.p
          key={`p-${current}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-lg md:text-2xl mb-8 font-light"
        >
          {slides[current].subtitle}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex gap-4"
        >
            {slides[current].link ? (
                 <a href={slides[current].link} className="px-8 py-3 bg-primary border-2 border-primary text-white rounded-full hover:bg-transparent hover:border-white transition-all font-bold">
                    Learn More
                 </a>
            ) : (
                <>
                <Link to="/news" className="px-8 py-3 bg-primary border-2 border-primary text-white rounded-full hover:bg-transparent hover:border-white transition-all font-bold">
                    ይጎብኙ
                </Link>
                <Link to="/about" className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-primary transition-all font-bold">
                    ተጨማሪ ያንብቡ
                </Link>
                </>
            )}
         
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
