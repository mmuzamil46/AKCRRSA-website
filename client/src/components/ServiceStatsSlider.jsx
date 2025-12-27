import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import axios from 'axios';
import { RiNumbersFill, RiLineChartFill } from 'react-icons/ri';

const ServiceStatsSlider = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.1 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stats/cumulative`);
        // Duplicate the stats to create a seamless loop if there are enough items
        // Or just use the original if it's small.
        // For a sliding effect, we want a long row.
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || stats.length === 0) return null;

  // Animation variants for the marquee effect
  const marqueeVariants = {
    animate: {
      x: [0, -1000], // This will be adjusted based on item count
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 30, // Slow sliding
          ease: "linear",
        },
      },
    },
  };

  // Double the stats for seamless loop
  const displayStats = [...stats, ...stats, ...stats];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden" ref={containerRef}>
      <div className="container mx-auto px-4 mb-10">
        <div className="flex items-center justify-between mb-8 border-l-4 border-primary pl-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary flex items-center gap-3">
              <RiLineChartFill className="text-secondary" />
              የበጀት ዓመቱ አፈጻጸም በቁጥር (Cumulative Performance)
            </h2>
            <p className="text-gray-500 mt-2">እስካሁን በክፍለ ከተማው የተሰጡ አገልግሎቶች ጠቅላላ ድምር</p>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden py-5">
        <motion.div 
          className="flex gap-6 whitespace-nowrap"
          animate={{ x: [0, -2000] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
          style={{ width: 'fit-content' }}
        >
          {displayStats.map((stat, index) => (
            <div 
              key={index} 
              className="inline-block w-72 md:w-80 bg-white p-8 rounded-2xl shadow-lg border border-primary/5 hover:border-primary/20 transition-all hover:shadow-2xl hover:-translate-y-2 group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl group-hover:bg-primary group-hover:text-white transition-colors">
                  <RiNumbersFill />
                </div>
                <h3 className="text-lg font-bold text-gray-800 break-words line-clamp-2">
                  {stat.serviceName}
                </h3>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl font-bold text-primary mb-1">
                  {stat.totalCount.toLocaleString()}
                </span>
                <span className="text-sm text-secondary font-medium uppercase tracking-widest">አገልግሎቶች</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400 italic">መረጃው የተመሳሰለው: {new Date(stat.lastUpdated).toLocaleDateString()}</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceStatsSlider;
