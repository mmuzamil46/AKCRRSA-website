import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import { Link } from 'react-router-dom';
import { RiIdCardFill, RiFileWarningFill, RiCake2Fill, RiHeartAddFill, RiHealthBookFill } from 'react-icons/ri';
import axios from 'axios';

const Home = () => {
  const [newsItems, setNewsItems] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/news`);
        // Get latest 3 news items
        setNewsItems(res.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching news:', err);
      }
    };

    fetchNews();
  }, []);

  const services = [
    { name: 'መታወቂያ', icon: <RiIdCardFill />, link: '/services#id' },
    { name: 'ልደት', icon: <RiCake2Fill />, link: '/services#birth' },
    { name: 'ያላገባ', icon: <RiFileWarningFill />, link: '/services#single' },
    { name: 'ጋብቻ', icon: <RiHeartAddFill />, link: '/services#marriage' },
    { name: 'ሞት', icon: <RiHealthBookFill />, link: '/services#death' },
  ];

  return (
    <>
      <Hero />
      
      {/* News Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-primary font-serif font-bold mb-4 relative inline-block">
              ምን አዲስ?
              <span className="absolute -top-6 -left-4 w-12 h-8 bg-gradient-to-br from-primary to-white opacity-20 -z-10 rounded-tl-xl rounded-br-xl transform rotate-12"></span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              ጽ/ቤቱን እና አገልግሎቱን የተመለከቱ አዲስ መረጃዎችን ከዚህ ገጽ ያገኛሉ!!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item) => (
              <div key={item._id} className="bg-white rounded-lg overflow-hidden shadow-lg border hover:shadow-2xl transition-shadow border-primary/10">
                <div className="relative">
                  <img src={item.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${item.image}` : item.image} alt={item.title} className="w-full h-48 object-cover" />
                  <span className="absolute top-0 left-0 bg-primary text-white px-4 py-1 text-sm font-medium">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-primary mb-2 font-serif">{item.title}</h4>
                  <p className="text-gray-500 mb-4 line-clamp-3 text-sm">
                    {item.content}
                  </p>
                  <Link to={`/news/${item._id}`} className="inline-block px-6 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors text-sm">
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Services Section */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-secondary font-bold uppercase tracking-wider mb-2">አገልግሎቶች</p>
            <h2 className="text-4xl text-primary font-serif font-bold">
              አገልግሎቶች እና አስፈላጊ ቅድመ ሁኔታዎች
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {services.map((service, idx) => (
              <Link 
                key={idx} 
                to={service.link}
                className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="text-5xl text-primary mb-4 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-700 group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
