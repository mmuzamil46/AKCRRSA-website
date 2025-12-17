import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RiMapPin2Line, RiUser3Line, RiPhoneLine } from 'react-icons/ri';
import axios from 'axios';

const Woredas = () => {
  const [woredas, setWoredas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWoredas = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/woredas`);
        setWoredas(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching woredas:', err);
        setLoading(false);
      }
    };

    fetchWoredas();
  }, []);

  if (loading) return <div className="min-h-screen py-20 text-center">Loading Woredas...</div>;

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-secondary font-bold uppercase tracking-wider mb-2">አድራሻ</p>
          <h1 className="text-4xl text-primary font-serif font-bold">የወረዳ ጽ/ቤቶች አድራሻ</h1>
        </div>

        <div className="space-y-16">
          {woredas.map((woreda, index) => (
            <motion.div
              key={woreda._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 items-center bg-gray-50 rounded-2xl overflow-hidden shadow-sm`}
            >
              {/* Map Section */}
              <div className="w-full lg:w-1/2 h-[400px]">
                <iframe 
                  src={woreda.mapUrl} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${woreda.name} Map`}
                ></iframe>
              </div>

              {/* Info Section */}
              <div className="w-full lg:w-1/2 p-8 lg:p-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white rounded-full text-primary shadow-sm">
                    <RiMapPin2Line size={24} />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-primary">{woreda.name}</h2>
                </div>
                
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  {woreda.description}
                </p>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">የስራ አስኪያጅ መረጃ</h3>
                  <div className="flex items-start gap-4">
                     <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                        {/* Placeholder or actual image if available */}
                        <RiUser3Line className="w-full h-full p-3 text-gray-400" />
                     </div>
                     <div>
                        <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">
                           <RiUser3Line className="text-secondary" />
                           {woreda.managerName}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                           <RiPhoneLine className="text-secondary" />
                           {woreda.managerPhone}
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Woredas;
