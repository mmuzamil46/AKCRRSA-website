import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiAddLine, RiUploadCloud2Line } from 'react-icons/ri';
import AdminTable from '../../components/AdminTable';

const AdminBannerManager = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        image: '',
        link: '',
        order: 0,
    });
    const [uploading, setUploading] = useState(false);

    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchBanners = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/banners`, config);
            setBanners(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchBanners(); }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this banner?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/banners/${id}`, config);
                fetchBanners();
            } catch (err) {
                alert('Error deleting banner');
            }
        }
    };

    const handleEdit = (item) => {
        setFormData({
            title: item.title,
            subtitle: item.subtitle,
            image: item.image,
            link: item.link,
            order: item.order,
        });
        setEditId(item._id);
        setShowModal(true);
    };

    const openAddModal = () => {
        setFormData({ title: '', subtitle: '', image: '', link: '', order: 0 });
        setEditId(null);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/banners/${editId}`, formData, config);
            } else {
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/banners`, formData, config);
            }
            setShowModal(false);
            setFormData({ title: '', subtitle: '', image: '', link: '', order: 0 });
            setEditId(null);
            fetchBanners();
        } catch (err) {
            alert('Error saving banner');
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const data = new FormData();
        data.append('image', file);
        setUploading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload?type=banner`, data);
            setFormData({ ...formData, image: res.data });
            setUploading(false);
        } catch (err) {
            setUploading(false);
            alert('Upload failed');
        }
    };

    const columns = [
        { header: 'Order', accessor: 'order' },
        { header: 'Title', accessor: 'title' },
        { header: 'Image', render: (item) => <img src={item.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${item.image}` : item.image} alt="banner" className="h-10 w-20 object-cover rounded" /> }
    ];

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between mb-6">
                <h3 className="text-xl font-bold">Home Banners</h3>
                <button    
                    onClick={openAddModal}
                    className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-secondary">
                    <RiAddLine /> Add Banner
                </button>
            </div>
            {loading ? <p>Loading...</p> : (
                <AdminTable 
                    columns={columns} 
                    data={banners} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                />
            )}
            
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-lg p-6">
                        <h3 className="text-2xl font-bold mb-4">{editId ? 'Edit Banner' : 'Add Banner'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Title</label>
                                <input type="text" className="w-full border p-2 rounded" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Subtitle</label>
                                <input type="text" className="w-full border p-2 rounded" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Image</label>
                                <div className="flex gap-2">
                                    <input type="text" className="w-full border p-2 rounded bg-gray-100" value={formData.image} readOnly />
                                    <label className="cursor-pointer bg-gray-200 p-2 rounded"><RiUploadCloud2Line size={24} />
                                        <input type="file" className="hidden" onChange={handleFileChange} />
                                    </label>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-bold mb-1">Order</label><input type="number" className="w-full border p-2 rounded" value={formData.order} onChange={e => setFormData({...formData, order: Number(e.target.value)})} /></div>
                                <div><label className="block text-sm font-bold mb-1">Link</label><input type="text" className="w-full border p-2 rounded" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} /></div>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" disabled={uploading} className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBannerManager;
