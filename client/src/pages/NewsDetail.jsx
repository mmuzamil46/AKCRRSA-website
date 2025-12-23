import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { RiArrowLeftLine, RiCalendarLine } from 'react-icons/ri';
import SEO from '../components/SEO';

const NewsDetail = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [recentNews, setRecentNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [newsRes, allNewsRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/news/${id}`),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/news`)
                ]);
                setNews(newsRes.data);
                // Filter current news and take recent 5
                setRecentNews(allNewsRes.data.filter(item => item._id !== id).slice(0, 5));
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!news) return <div className="text-center py-20">News content not found.</div>;

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <SEO 
                title={news.title} 
                description={news.content.substring(0, 160)}
                image={news.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${news.image}` : news.image}
                url={`https://akcrrsa-website.vercel.app/news/${news._id}`}
            />
            <div className="container mx-auto px-4 max-w-7xl">
                <Link to="/news" className="inline-flex items-center gap-2 text-primary font-bold mb-6 hover:text-secondary">
                    <RiArrowLeftLine /> Back to News
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar - Recent News (Left) */}
                    <div className="lg:col-span-1 order-2 lg:order-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Recent News</h3>
                            <div className="space-y-6">
                                {recentNews.map((item) => (
                                    <Link key={item._id} to={`/news/${item._id}`} className="block group">
                                        <div className="h-32 overflow-hidden rounded-lg mb-2">
                                            <img 
                                                src={item.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${item.image}` : item.image} 
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <h4 className="font-bold text-gray-700 group-hover:text-primary line-clamp-2 text-sm mb-1">{item.title}</h4>
                                        <div className="flex items-center text-xs text-gray-500 gap-1">
                                            <RiCalendarLine />
                                            <span>{new Date(item.date).toLocaleDateString()}</span>
                                        </div>
                                    </Link>
                                ))}
                                {recentNews.length === 0 && <p className="text-sm text-gray-500">No other news found.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Main Content (Right) */}
                    <div className="lg:col-span-3 order-1 lg:order-2">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            {/* Main Image */}
                            {news.image && (
                                <div className="w-full h-[400px]">
                                    <img 
                                        src={news.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${news.image}` : news.image} 
                                        alt={news.title} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="p-8 lg:p-12">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <RiCalendarLine className="text-secondary" />
                                        <span className="text-sm font-semibold">{new Date(news.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                
                                <h1 className="text-3xl lg:text-4xl font-serif font-bold text-gray-800 mb-6 leading-tight">
                                    {news.title}
                                </h1>

                                <div className="prose max-w-none text-gray-600 leading-relaxed text-lg whitespace-pre-line mb-8">
                                    {news.content}
                                </div>

                                {/* Gallery */}
                                {news.images && news.images.length > 0 && (
                                    <div className="mt-10 pt-10 border-t border-gray-100">
                                        <h3 className="text-2xl font-bold mb-6 text-gray-800">Gallery</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {news.images.map((img, idx) => (
                                                <div key={idx} className="rounded-lg overflow-hidden h-64 shadow-md hover:shadow-xl transition-shadow">
                                                    <img 
                                                        src={img.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${img}` : img} 
                                                        alt={`Gallery ${idx+1}`} 
                                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;
