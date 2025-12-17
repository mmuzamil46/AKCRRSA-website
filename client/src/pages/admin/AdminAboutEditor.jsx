import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiSaveLine, RiUploadCloud2Line } from 'react-icons/ri';

const AdminAboutEditor = () => {
    const [content, setContent] = useState({
        title: '',
        subtitle: '',
        heroImage: '',
        mainContent: '',
        vision: '',
        mission: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/about`);
            setContent(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccessMessage('');

        try {
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/about`, content, config);
            setSuccessMessage('Content updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            alert('Error updating content');
        } finally {
            setSaving(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const data = new FormData();
        data.append('image', file);
        setUploading(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setContent({ ...content, heroImage: res.data });
            setUploading(false);
        } catch (err) {
            setUploading(false);
            alert('Upload failed');
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-6">Edit About Page Content</h3>

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">Title</label>
                        <input
                            type="text"
                            className="w-full border p-3 rounded"
                            value={content.title}
                            onChange={(e) => setContent({ ...content, title: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Subtitle</label>
                        <input
                            type="text"
                            className="w-full border p-3 rounded"
                            value={content.subtitle}
                            onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">Hero Image</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-grow border p-3 rounded bg-gray-100"
                            value={content.heroImage}
                            readOnly
                        />
                        <label className="cursor-pointer bg-gray-200 p-3 rounded hover:bg-gray-300 flex items-center gap-2">
                            <RiUploadCloud2Line size={24} />
                            {uploading ? 'Uploading...' : 'Upload'}
                            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                        </label>
                    </div>
                    {content.heroImage && (
                        <img
                            src={content.heroImage.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${content.heroImage}` : content.heroImage}
                            alt="Hero"
                            className="mt-2 h-32 object-cover rounded"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">Main Content (ማን ነን?)</label>
                    <textarea
                        className="w-full border p-3 rounded h-40"
                        value={content.mainContent}
                        onChange={(e) => setContent({ ...content, mainContent: e.target.value })}
                        required
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">Vision (ራዕይ)</label>
                    <textarea
                        className="w-full border p-3 rounded h-32"
                        value={content.vision}
                        onChange={(e) => setContent({ ...content, vision: e.target.value })}
                        required
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">Mission (ተልዕኮ)</label>
                    <textarea
                        className="w-full border p-3 rounded h-32"
                        value={content.mission}
                        onChange={(e) => setContent({ ...content, mission: e.target.value })}
                        required
                    ></textarea>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-primary text-white px-6 py-3 rounded hover:bg-secondary transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <RiSaveLine size={20} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminAboutEditor;
