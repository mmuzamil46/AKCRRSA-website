import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFacebook, FaTelegram, FaTiktok, FaYoutube, FaXTwitter } from 'react-icons/fa6';
import { toast } from 'react-hot-toast';

const AdminSocialManager = () => {
    const [settings, setSettings] = useState({
        facebook: '',
        telegram: '',
        tiktok: '',
        youtube: '',
        x: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const token = localStorage.getItem('adminToken');
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    };

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/social`);
                setSettings(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load social settings");
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/social`, settings, config);
            toast.success("Social settings updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-10">Loading settings...</div>;

    const socialFields = [
        { name: 'facebook', label: 'Facebook URL', icon: <FaFacebook className="text-blue-600" /> },
        { name: 'telegram', label: 'Telegram URL', icon: <FaTelegram className="text-sky-500" /> },
        { name: 'tiktok', label: 'TikTok URL', icon: <FaTiktok className="text-black" /> },
        { name: 'youtube', label: 'YouTube URL', icon: <FaYoutube className="text-red-600" /> },
        { name: 'x', label: 'X (Twitter) URL', icon: <FaXTwitter className="text-black" /> }
    ];

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            <div className="mb-8 border-b pb-4">
                <h3 className="text-2xl font-bold text-gray-800">Social Media Settings</h3>
                <p className="text-gray-500 text-sm mt-1">
                    Manage the links for the sticky sidebar and footer social icons. 
                    Leave as "/" to redirect to home.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {socialFields.map((field) => (
                        <div key={field.name} className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                {field.icon} {field.label}
                            </label>
                            <input
                                type="text"
                                name={field.name}
                                value={settings[field.name]}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                        </div>
                    ))}
                </div>

                <div className="pt-6 border-t mt-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-primary text-white font-bold py-3 px-10 rounded-xl hover:bg-secondary transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Social Settings"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSocialManager;
