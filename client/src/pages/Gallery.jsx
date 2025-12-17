import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { RiImageLine, RiCloseLine } from 'react-icons/ri';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = ['All', 'Events', 'Office', 'Services', 'Community', 'Other'];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/gallery`);
        setItems(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredItems = selectedCategory === 'All' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-secondary font-bold uppercase tracking-wider mb-2">የፎቶ አውደ ርዕይ</p>
          <h1 className="text-4xl text-primary font-serif font-bold mb-4">የፎቶ አውደ ርዕይ</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            የቢሮአችንን እንቅስቃሴዎች፣ ዝግጅቶች እና አገልግሎቶች በምስል ይመልከቱ።
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <RiImageLine size={64} className="mx-auto mb-4 opacity-50" />
            <p>ምንም ፎቶዎች የሉም።</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.imageUrl.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${item.imageUrl}` : item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-200 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                  {item.category}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <RiCloseLine size={40} />
            </button>
            <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedImage.imageUrl.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${selectedImage.imageUrl}` : selectedImage.imageUrl}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
              <div className="bg-white p-6 rounded-b-lg">
                <h2 className="text-2xl font-bold text-primary mb-2">{selectedImage.title}</h2>
                {selectedImage.description && (
                  <p className="text-gray-600">{selectedImage.description}</p>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                    {selectedImage.category}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {new Date(selectedImage.createdAt).toLocaleDateString('am-ET')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
