import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { RiImageLine, RiCloseLine } from 'react-icons/ri';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

    const openLightbox = (item) => {
        setSelectedItem(item);
        setCurrentImageIndex(0);
    };

    const nextImage = (e) => {
        e.stopPropagation();
        if (!selectedItem) return;
        setCurrentImageIndex((prev) => (prev + 1) % selectedItem.images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        if (!selectedItem) return;
        setCurrentImageIndex((prev) => (prev - 1 + selectedItem.images.length) % selectedItem.images.length);
    };

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-secondary font-bold uppercase tracking-[0.2em] mb-3 text-sm"
                    >
                        የፎቶ አውደ ርዕይ (Gallery)
                    </motion.p>
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl text-primary font-serif font-bold mb-6"
                    >
                        የፎቶ አውደ ርዕይ
                    </motion.h1>
                    <div className="h-1.5 w-24 bg-primary/20 rounded-full mx-auto mb-6" />
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        የቢሮአችንን እንቅስቃሴዎች፣ ዝግጅቶች እና አገልግሎቶች በምስል ይመልከቱ።
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 transform active:scale-95 shadow-sm ${
                                selectedCategory === category
                                    ? 'bg-primary text-white shadow-primary/30 scale-105'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 hover:-translate-y-1'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-gray-500 font-medium italic">ምስሎችን በመጫን ላይ...</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-3xl shadow-inner border border-gray-100">
                        <RiImageLine size={80} className="mx-auto mb-6 text-gray-300" />
                        <p className="text-gray-500 text-xl">ምንም ፎቶዎች አልተገኙም።</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredItems.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                viewport={{ once: true }}
                                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                                onClick={() => openLightbox(item)}
                            >
                                <div className="aspect-[4/3] overflow-hidden relative">
                                    <img
                                        src={item.images[0]?.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${item.images[0]}` : item.images[0]}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    
                                    {/* Multi-image indicator badge */}
                                    {item.images.length > 1 && (
                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-2xl flex items-center gap-2 text-xs font-bold border border-white/20 shadow-lg">
                                            <RiImageLine />
                                            <span>{item.images.length} Photos</span>
                                        </div>
                                    )}

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                        <h3 className="font-serif font-bold text-2xl text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{item.title}</h3>
                                        {item.description && (
                                            <p className="text-white/80 text-sm line-clamp-2 mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{item.description}</p>
                                        )}
                                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-primary-light font-bold bg-white/20 backdrop-blur-sm self-start px-3 py-1 rounded-full">
                                            {item.category}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 md:p-8">
                                    <h3 className="font-sans font-bold text-gray-900 group-hover:text-primary transition-colors duration-300 truncate">{item.title}</h3>
                                    <p className="text-gray-500 text-xs mt-1 uppercase tracking-wider font-bold">{item.category}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Advanced Lightbox Carousel Modal */}
                <AnimatePresence>
                    {selectedItem && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 md:p-10 select-none"
                            onClick={() => setSelectedItem(null)}
                        >
                            {/* Close Button */}
                            <button
                                className="absolute top-6 right-6 text-white/50 hover:text-white hover:scale-110 transition-all z-[110]"
                                onClick={() => setSelectedItem(null)}
                            >
                                <RiCloseLine size={48} />
                            </button>

                            <div className="relative w-full max-w-6xl h-full flex flex-col justify-center gap-6" onClick={(e) => e.stopPropagation()}>
                                {/* Carousel Content */}
                                <div className="relative flex-grow flex items-center justify-center group/nav overflow-hidden rounded-3xl bg-black/20">
                                    {/* Navigation Buttons */}
                                    {selectedItem.images.length > 1 && (
                                        <>
                                            <button 
                                                onClick={prevImage}
                                                className="absolute left-4 z-10 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full opacity-0 group-hover/nav:opacity-100 transition-all"
                                            >
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                                            </button>
                                            <button 
                                                onClick={nextImage}
                                                className="absolute right-4 z-10 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full opacity-0 group-hover/nav:opacity-100 transition-all"
                                            >
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                                            </button>
                                        </>
                                    )}

                                    {/* Main Image */}
                                    <motion.img
                                        key={currentImageIndex}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        src={selectedItem.images[currentImageIndex]?.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${selectedItem.images[currentImageIndex]}` : selectedItem.images[currentImageIndex]}
                                        alt={selectedItem.title}
                                        className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
                                    />

                                    {/* Counter */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-xs font-bold tracking-widest border border-white/10">
                                        {currentImageIndex + 1} / {selectedItem.images.length}
                                    </div>
                                </div>

                                {/* Item Info Card */}
                                <motion.div 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6"
                                >
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest">
                                                {selectedItem.category}
                                            </span>
                                            <span className="text-gray-400 text-sm font-medium">
                                                {new Date(selectedItem.createdAt).toLocaleDateString('am-ET', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-serif font-extrabold text-primary mb-3">
                                            {selectedItem.title}
                                        </h2>
                                        {selectedItem.description && (
                                            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
                                                {selectedItem.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Thumbnails Preview for multi-image */}
                                    {selectedItem.images.length > 1 && (
                                        <div className="flex gap-2 overflow-x-auto pb-2 self-start md:self-center">
                                            {selectedItem.images.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                                    className={`w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                                >
                                                    <img 
                                                        src={img.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${img}` : img} 
                                                        className="w-full h-full object-cover" 
                                                        alt="thumb" 
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Gallery;
