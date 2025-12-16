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
        imageUrl: '',
        category: 'Other',
        order: 0
    });
    const [bulkUploadData, setBulkUploadData] = useState({
        title: '',
        description: '',
        category: 'Other',
        images: []
    });
    const [uploading, setUploading] = useState(false);
    const [bulkUploading, setBulkUploading] = useState(false);

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
        if (window.confirm('Delete this image?')) {
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
            imageUrl: item.imageUrl,
            category: item.category,
            order: item.order
        });
        setEditId(item._id);
        setShowModal(true);
    };

    const openAddModal = () => {
        setFormData({ title: '', description: '', imageUrl: '', category: 'Other', order: 0 });
        setEditId(null);
        setShowModal(true);
    };

    const openBulkUpload = () => {
        setBulkUploadData({ title: '', description: '', category: 'Other', images: [] });
        setShowBulkUpload(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/gallery/${editId}`, formData, config);
            } else {
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/gallery`, formData, config);
            }
            setShowModal(false);
            setFormData({ title: '', description: '', imageUrl: '', category: 'Other', order: 0 });
            setEditId(null);
            fetchItems();
        } catch (err) {
            alert('Error saving');
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
            setFormData({ ...formData, imageUrl: res.data });
            setUploading(false);
        } catch (err) {
            setUploading(false);
            alert('Upload failed');
        }
    };

    const handleBulkFileChange = async (e) => {
        const files = Array.from(e.target.files);
        setBulkUploading(true);

        try {
            const uploadPromises = files.map(async (file) => {
                const data = new FormData();
                data.append('image', file);
                const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                return res.data; // Just return the URL
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            setBulkUploadData({ ...bulkUploadData, images: uploadedUrls });
            setBulkUploading(false);
        } catch (err) {
            setBulkUploading(false);
            alert('Upload failed');
        }
    };

    const handleBulkSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const createPromises = bulkUploadData.images.map((imageUrl, index) => {
                return axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/gallery`, {
                    title: bulkUploadData.title,
                    description: bulkUploadData.description,
                    imageUrl: imageUrl,
                    category: bulkUploadData.category,
                    order: index
                }, config);
            });

            await Promise.all(createPromises);
            setShowBulkUpload(false);
            setBulkUploadData({ title: '', description: '', category: 'Other', images: [] });
            fetchItems();
        } catch (err) {
            alert('Error saving images');
        }
    };

    const removeBulkImage = (index) => {
        const newImages = bulkUploadData.images.filter((_, i) => i !== index);
        setBulkUploadData({ ...bulkUploadData, images: newImages });
    };

    const columns = [
        { header: 'Image', render: (item) => (
            <img src={`${import.meta.env.VITE_API_BASE_URL}${item.imageUrl}`} alt={item.title} className="h-16 w-16 object-cover rounded" />
        )},
        { header: 'Title', accessor: 'title' },
        { header: 'Category', accessor: 'category' },
        { header: 'Order', accessor: 'order' }
    ];

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between mb-6">
                <h3 className="text-xl font-bold">Gallery Management</h3>
                <div className="flex gap-2">
                    <button 
                        onClick={openBulkUpload} 
                        className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
                    >
                        <RiImageAddLine /> Bulk Upload
                    </button>
                    <button 
                        onClick={openAddModal} 
                        className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-secondary"
                    >
                        <RiAddLine /> Add Single Image
                    </button>
                </div>
            </div>

            {loading ? <p>Loading...</p> : (
                <AdminTable 
                    columns={columns} 
                    data={items} 
                    onEdit={handleEdit}
                    onDelete={handleDelete} 
                />
            )}

            {/* Single Image Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold mb-4">{editId ? 'Edit Image' : 'Add Image'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Title</label>
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-1">Description (Optional)</label>
                                <textarea
                                    className="w-full border p-2 rounded h-20"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-1">Category</label>
                                <select
                                    className="w-full border p-2 rounded"
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

                            <div>
                                <label className="block text-sm font-bold mb-1">Order</label>
                                <input
                                    type="number"
                                    className="w-full border p-2 rounded"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-1">Image</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="flex-grow border p-2 rounded bg-gray-100"
                                        value={formData.imageUrl}
                                        readOnly
                                    />
                                    <label className="cursor-pointer bg-gray-200 p-2 rounded hover:bg-gray-300">
                                        <RiUploadCloud2Line size={24} />
                                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                </div>
                                {formData.imageUrl && (
                                    <img
                                        src={`${import.meta.env.VITE_API_BASE_URL}${formData.imageUrl}`}
                                        alt="Preview"
                                        className="mt-2 h-32 object-cover rounded"
                                    />
                                )}
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary disabled:opacity-50"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bulk Upload Modal */}
            {showBulkUpload && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold mb-4">Bulk Upload Images</h3>
                        <form onSubmit={handleBulkSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Title (for all images)</label>
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded"
                                    value={bulkUploadData.title}
                                    onChange={(e) => setBulkUploadData({ ...bulkUploadData, title: e.target.value })}
                                    placeholder="e.g., Community Event 2024"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-1">Description (for all images)</label>
                                <textarea
                                    className="w-full border p-2 rounded h-20"
                                    value={bulkUploadData.description}
                                    onChange={(e) => setBulkUploadData({ ...bulkUploadData, description: e.target.value })}
                                    placeholder="Describe this collection of images"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-1">Category (applies to all)</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={bulkUploadData.category}
                                    onChange={(e) => setBulkUploadData({ ...bulkUploadData, category: e.target.value })}
                                >
                                    <option>Events</option>
                                    <option>Office</option>
                                    <option>Services</option>
                                    <option>Community</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Select Multiple Images</label>
                                <label className="cursor-pointer bg-primary text-white p-4 rounded hover:bg-secondary flex items-center justify-center gap-2">
                                    <RiUploadCloud2Line size={24} />
                                    {bulkUploading ? 'Uploading...' : 'Choose Images'}
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        onChange={handleBulkFileChange} 
                                        accept="image/*" 
                                        multiple 
                                        disabled={bulkUploading}
                                    />
                                </label>
                            </div>

                            {bulkUploadData.images.length > 0 && (
                                <div>
                                    <p className="font-bold mb-2">{bulkUploadData.images.length} images selected</p>
                                    <div className="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto p-2">
                                        {bulkUploadData.images.map((imageUrl, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={`${import.meta.env.VITE_API_BASE_URL}${imageUrl}`}
                                                    alt={`Upload ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeBulkImage(index)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowBulkUpload(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={bulkUploadData.images.length === 0}
                                    className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary disabled:opacity-50"
                                >
                                    Upload {bulkUploadData.images.length} Images
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
