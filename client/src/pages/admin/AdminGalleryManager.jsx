import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiAddLine, RiUploadCloud2Line, RiImageAddLine } from 'react-icons/ri';
import AdminTable from '../../components/AdminTable';

const AdminGalleryManager = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showBulkUpload, setShowBulkUpload] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        images: [],
        category: 'Other',
        order: 0
    });
    const [uploading, setUploading] = useState(false);

    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchItems = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/gallery`);
            setItems(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchItems(); }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this gallery entry?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/gallery/${id}`, config);
                fetchItems();
            } catch (err) {
                alert('Error deleting');
            }
        }
    };

    const handleEdit = (item) => {
        setFormData({
            title: item.title,
            description: item.description,
            images: item.images || (item.imageUrl ? [item.imageUrl] : []),
            category: item.category,
            order: item.order
        });
        setEditId(item._id);
        setShowModal(true);
    };

    const openAddModal = () => {
        setFormData({ title: '', description: '', images: [], category: 'Other', order: 0 });
        setEditId(null);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.images.length === 0) {
            return alert('Please upload at least one image');
        }

        try {
            if (editId) {
                await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/gallery/${editId}`, formData, config);
            } else {
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/gallery`, formData, config);
            }
            setShowModal(false);
            setFormData({ title: '', description: '', images: [], category: 'Other', order: 0 });
            setEditId(null);
            fetchItems();
        } catch (err) {
            alert('Error saving gallery entry');
        }
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        setUploading(true);
        try {
            const uploadPromises = files.map(async (file) => {
                const data = new FormData();
                data.append('image', file);
                const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload`, data);
                return res.data.url || res.data; // Handle both response formats
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            setFormData(prev => ({ 
                ...prev, 
                images: [...prev.images, ...uploadedUrls] 
            }));
            setUploading(false);
        } catch (err) {
            setUploading(false);
            alert('Upload failed');
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const columns = [
        { header: 'Cover', render: (item) => {
            const images = item.images || (item.imageUrl ? [item.imageUrl] : []);
            const cover = images[0];
            return (
                <div className="relative w-16 h-16">
                    <img 
                        src={cover?.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${cover}` : cover} 
                        alt={item.title} 
                        className="w-full h-full object-cover rounded border border-gray-200" 
                    />
                    {images.length > 1 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                            {images.length}
                        </span>
                    )}
                </div>
            )
        }},
        { header: 'Title', accessor: 'title' },
        { header: 'Category', accessor: 'category' },
        { header: 'Images', render: (item) => (item.images?.length || (item.imageUrl ? 1 : 0)) + ' photos' }
    ];

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between mb-6 items-center">
                <h3 className="text-xl font-bold text-gray-800">Gallery Management</h3>
                <button 
                    onClick={openAddModal} 
                    className="bg-primary text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-secondary transition-all shadow-md active:scale-95"
                >
                    <RiAddLine size={20} /> Add New Entry
                </button>
            </div>

            {loading ? <p>Loading...</p> : (
                <AdminTable 
                    columns={columns} 
                    data={items} 
                    onEdit={handleEdit}
                    onDelete={handleDelete} 
                />
            )}

            {/* Centralized Upload Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-extrabold text-gray-900">{editId ? 'Edit Gallery Entry' : 'Create New Entry'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Event Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                                    <select
                                        className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>Events</option>
                                        <option>Office</option>
                                        <option>Services</option>
                                        <option>Community</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description (Optional)</label>
                                <textarea
                                    className="w-full border border-gray-300 p-3 rounded-xl h-24 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Tell more about this entry..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Upload Images</label>
                                <label className={`cursor-pointer border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <RiUploadCloud2Line size={40} className="text-primary" />
                                    <span className="font-bold text-gray-600">{uploading ? 'Uploading...' : 'Click to select or drag images'}</span>
                                    <span className="text-xs text-gray-400">Multiple images supported</span>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        onChange={handleFileChange} 
                                        accept="image/*" 
                                        multiple 
                                    />
                                </label>
                            </div>

                            {formData.images.length > 0 && (
                                <div className="space-y-3">
                                    <p className="font-bold text-gray-700">{formData.images.length} Photos Selected</p>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        {formData.images.map((url, index) => (
                                            <div key={index} className="relative group aspect-square">
                                                <img
                                                    src={url.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${url}` : url}
                                                    alt={`Upload ${index + 1}`}
                                                    className="w-full h-full object-cover rounded-xl shadow-sm border border-white"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full shadow-md hover:bg-red-600 transition-colors"
                                                >
                                                    ✕
                                                </button>
                                                {index === 0 && (
                                                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">Cover</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formData.images.length === 0}
                                    className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-secondary transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                >
                                    {editId ? 'Save Changes' : 'Create Entry'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminGalleryManager;
