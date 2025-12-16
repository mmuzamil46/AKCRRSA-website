import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/news`);
        setNews(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching news:', err);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div className="min-h-screen py-20 text-center">Loading News...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-secondary font-bold uppercase tracking-wider mb-2">ዜናዎች</p>
          <h1 className="text-4xl text-primary font-serif font-bold">ወቅታዊ መረጃዎች እና ዜናዎች</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${item.image}` : item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">{new Date(item.date).toLocaleDateString()}</div>
                <h3 className="text-xl font-bold text-primary mb-3 line-clamp-2">{item.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {item.content}
                </p>
                <Link to={`/news/${item._id}`} className="text-secondary font-bold hover:text-primary transition-colors">
                  ተጨማሪ ያንብቡ &rarr;
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
