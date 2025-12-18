import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaUserTie, FaHeading, FaParagraph, FaImage, FaSave } from 'react-icons/fa';

const AdminManagerMessage = () => {
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        message: '',
        image: ''
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchManager();
    }, []);

    const fetchManager = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/manager`);
            if (data) {
                setFormData({
                    name: data.name || '',
                    title: data.title || '',
                    message: data.message || '',
                    image: data.image || ''
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        setUploading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload`, uploadData, config);
            setFormData({ ...formData, image: data.url || data }); // Handle both formats
            toast.success('ፎቶው በተሳካ ሁኔታ ተጭኗል');
        } catch (err) {
            console.error(err);
            toast.error('ፎቶ መጫን አልተቻለም');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/manager`, formData, config);
            toast.success('መረጃው በተሳካ ሁኔታ ተቀይሯል');
        } catch (err) {
            console.error(err);
            toast.error('መረጃውን ለመቀየር አልተቻለም');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="bg-primary p-6 text-white">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <FaUserTie /> የጽህፈት ቤት ኃላፊ መልዕክት ማስተካከያ
                    </h2>
                    <p className="opacity-90">በዋናው ገጽ ላይ የሚታየውን የኃላፊ መልዕክት እና ፎቶ እዚህ መቀየር ይችላሉ።</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-gray-700 font-medium flex items-center gap-2">
                                <FaUserTie className="text-primary" /> ስም
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="የኃላፊው ስም"
                                required
                            />
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-gray-700 font-medium flex items-center gap-2">
                                <FaHeading className="text-primary" /> የሥራ ድርሻ
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="ለምሳሌ፡ የጽህፈት ቤት ኃላፊ"
                                required
                            />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <label className="text-gray-700 font-medium flex items-center gap-2">
                            <FaParagraph className="text-primary" /> መልዕክት
                        </label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg h-40 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="ለሕዝብ የሚተላለፍ መልዕክት..."
                            required
                        />
                    </div>

                    {/* Photo Upload */}
                    <div className="space-y-2">
                        <label className="text-gray-700 font-medium flex items-center gap-2">
                            <FaImage className="text-primary" /> ፎቶ
                        </label>
                        <div className="flex items-start gap-6">
                            {formData.image && (
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-xl border-4 border-gray-100 shadow-lg"
                                />
                            )}
                            <div className="flex-1">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                                />
                                <p className="mt-2 text-xs text-gray-500 italic">አስተያየት፡ ካሬ ፎቶ (Square) ቢሆን ይመረጣል።</p>
                                {uploading && <p className="text-primary text-sm mt-1 animate-pulse dark:text-gray-600">በመጫን ላይ...</p>}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-top">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full md:w-auto px-8 py-3 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg active:scale-95 ${loading ? 'opacity-70' : ''}`}
                        >
                            {loading ? 'በመቀየር ላይ...' : (
                                <>
                                    <FaSave /> መረጃውን አዘምን
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminManagerMessage;
