import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { RiCheckboxCircleFill, RiArrowRightSLine } from 'react-icons/ri';

const Services = () => {
  const location = useLocation();
  const [activeTabId, setActiveTabId] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);

  // Fetch Services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/services`);
        setServices(res.data);
        if (res.data.length > 0) {
          if (location.hash) {
            const slug = location.hash.replace('#', '');
            const matchedService = res.data.find(s => s.slug === slug);
            if (matchedService) {
              setActiveTabId(matchedService._id);
            } else {
              setActiveTabId(res.data[0]._id);
            }
          } else if (!activeTabId) {
             setActiveTabId(res.data[0]._id);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching services:", err);
        setLoading(false);
      }
    };

    fetchServices();
  }, [location.hash]);

  // Reset category index when service changes
  useEffect(() => {
    setActiveCategoryIdx(0);
  }, [activeTabId]);

  const activeService = services.find(s => s._id === activeTabId);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-10">
          <p className="text-secondary font-bold uppercase tracking-wider mb-2">አገልግሎቶች</p>
          <h1 className="text-4xl text-primary font-serif font-bold tracking-tight">አገልግሎቶች እና አስፈላጊ ቅድመ ሁኔታዎች</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-24">
              <div className="bg-primary text-white p-5 font-bold text-lg flex items-center gap-2">
                የአገልግሎት ዓይነቶች
              </div>
              <nav className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {services.map((service) => (
                  <button
                    key={service._id}
                    onClick={() => setActiveTabId(service._id)}
                    className={`w-full text-left px-6 py-5 transition-all duration-300 flex items-center justify-between group ${
                      activeTabId === service._id 
                        ? 'bg-blue-50 text-primary font-bold border-l-4 border-primary' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                    }`}
                  >
                    <span className="text-[15px]">{service.title}</span>
                    <RiArrowRightSLine 
                      className={`transition-transform duration-300 ${
                        activeTabId === service._id ? 'text-primary translate-x-1' : 'text-gray-300 group-hover:text-primary group-hover:translate-x-1'
                      }`}
                      size={20}
                    />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode='wait'>
              {activeService && (
                <motion.div
                  key={activeService._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10"
                >
                  {/* Service Header */}
                  <div className="mb-10 text-center md:text-left">
                    <h2 className="text-4xl font-serif font-bold text-primary mb-5 relative inline-block">
                      {activeService.title}
                      <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-secondary rounded-full"></div>
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-lg italic mt-4">
                      {activeService.description}
                    </p>
                  </div>

                  {/* Sub-Categories Tab Implementation */}
                  {activeService.hasCategories && activeService.categories.length > 0 ? (
                    <div className="space-y-8">
                       <div className="flex flex-wrap gap-3 mb-6 p-2 bg-gray-50 rounded-2xl">
                          {activeService.categories.map((cat, index) => (
                             <button
                                key={index}
                                onClick={() => setActiveCategoryIdx(index)}
                                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 border-2 ${
                                    activeCategoryIdx === index 
                                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105' 
                                        : 'bg-white text-gray-500 border-gray-100 hover:border-primary/30 hover:text-primary'
                                }`}
                             >
                                {cat.name}
                             </button>
                          ))}
                       </div>

                       <motion.div
                        key={activeCategoryIdx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl p-8 border border-blue-100/50 shadow-inner"
                       >
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                              <RiCheckboxCircleFill size={28} />
                            </div>
                            <div>
                                <h3 className="font-bold text-2xl text-primary">አስፈላጊ መስፈርቶች</h3>
                                <p className="text-sm text-gray-500 font-medium">ለ{activeService.categories[activeCategoryIdx].name}</p>
                            </div>
                          </div>
                          
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {activeService.categories[activeCategoryIdx].requirements.map((req, idx) => (
                              <motion.li 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={idx} 
                                className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-50 group hover:border-primary/30 transition-all duration-300"
                              >
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-primary rounded-lg flex items-center justify-center text-sm font-black group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                  {idx + 1}
                                </div>
                                <span className="text-gray-700 leading-snug font-medium pt-1">{req}</span>
                              </motion.li>
                            ))}
                          </ul>
                       </motion.div>
                    </div>
                  ) : (
                    /* Simple Requirements Section */
                    <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl p-8 border border-blue-100/50 shadow-inner">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                          <RiCheckboxCircleFill size={28} />
                        </div>
                        <h3 className="font-bold text-2xl text-primary">አስፈላጊ ሰነዶች እና መስፈርቶች</h3>
                      </div>
                      
                      {activeService.requirements.length > 0 ? (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {activeService.requirements.map((req, idx) => (
                            <motion.li 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              key={idx} 
                              className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-50 group hover:border-primary/30 transition-all duration-300"
                            >
                              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-primary rounded-lg flex items-center justify-center text-sm font-black group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                {idx + 1}
                              </div>
                              <span className="text-gray-700 leading-snug font-medium pt-1">{req}</span>
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400 italic text-center py-4">ምንም የተለዩ መስፈርቶች አልተመዘገቡም</p>
                      )}
                    </div>
                  )}

                  {/* Additional Info Card */}
                  <div className="mt-10 bg-amber-50 border-l-8 border-amber-400 p-6 rounded-r-2xl flex items-start gap-4 shadow-sm">
                    <div className="text-amber-500 font-black text-2xl mt-1">!</div>
                    <p className="text-[15px] text-amber-900 leading-relaxed font-medium">
                      <span className="font-black text-amber-900 uppercase tracking-tighter mr-2">ጠቃሚ ማሳሰቢያ:</span> 
                      ለበለጠ መረጃ እና አገልግሎቱን ለማግኘት እባክዎን የቅርብዎ የሚገኘውን የወረዳ ቢሮ ይጎብኙ ወይም በቀጥታ መስመር ያግኙን። አስፈላጊ ሰነዶችን ኦሪጅናል እና ፎቶ ኮፒ ይዘው መምጣትዎን አይዘንጉ።
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
