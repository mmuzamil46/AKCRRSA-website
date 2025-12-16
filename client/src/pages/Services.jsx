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

  // Fetch Services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/services');
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

  const activeService = services.find(s => s._id === activeTabId);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-10">
          <p className="text-secondary font-bold uppercase tracking-wider mb-2">አገልግሎቶች</p>
          <h1 className="text-4xl text-primary font-serif font-bold">አገልግሎቶች እና አስፈላጊ ቅድመ ሁኔታዎች</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
              <div className="bg-primary text-white p-4 font-bold text-lg">
                የአገልግሎት ዓይነቶች
              </div>
              <nav className="divide-y divide-gray-100">
                {services.map((service) => (
                  <button
                    key={service._id}
                    onClick={() => setActiveTabId(service._id)}
                    className={`w-full text-left px-6 py-4 transition-all duration-200 flex items-center justify-between group ${
                      activeTabId === service._id 
                        ? 'bg-blue-50 text-primary font-bold border-l-4 border-primary' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                    }`}
                  >
                    <span>{service.title}</span>
                    <RiArrowRightSLine 
                      className={`transition-transform ${
                        activeTabId === service._id ? 'text-primary' : 'text-gray-400 group-hover:text-primary'
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md p-8"
                >
                  {/* Service Header */}
                  <div className="border-b border-gray-200 pb-6 mb-6">
                    <h2 className="text-3xl font-serif font-bold text-primary mb-3">
                      {activeService.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {activeService.description}
                    </p>
                  </div>

                  {/* Requirements Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <RiCheckboxCircleFill className="text-white" size={24} />
                      </div>
                      <h3 className="font-bold text-xl text-primary">አስፈላጊ ሰነዶች እና መስፈርቶች</h3>
                    </div>
                    
                    {activeService.requirements.length > 0 ? (
                      <ul className="space-y-3">
                        {activeService.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                              {idx + 1}
                            </div>
                            <span className="text-gray-700 leading-relaxed">{req}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 italic">ምንም የተለዩ መስፈርቶች የሉም</p>
                    )}
                  </div>

                  {/* Additional Info Card */}
                  <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-bold text-yellow-800">ማስታወሻ:</span> ለበለጠ መረጃ እና ለአገልግሎት ማግኘት ወደ ቅርብ ወረዳ ቢሮ ይምጡ ወይም በስልክ ያግኙን።
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
