import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiAddLine } from 'react-icons/ri';
import AdminTable from '../../components/AdminTable';

const AdminAnnouncementManager = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ text: '', type: 'info', expiryDate: '' });

    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/announcements`, config);
            setData(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/announcements/${id}`, config);
                fetchData();
            } catch (err) {
                alert('Error deleting');
            }
        }
    };

    const handleEdit = (item) => {
        const expiryDateValue = item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '';
        setFormData({ text: item.text, type: item.type, expiryDate: expiryDateValue });
        setEditId(item._id);
        setShowModal(true);
    };

    const openAddModal = () => {
        setFormData({ text: '', type: 'info', expiryDate: '' });
        setEditId(null);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/announcements/${editId}`, formData, config);
            } else {
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/announcements`, formData, config);
            }
            setShowModal(false);
            setFormData({ text: '', type: 'info', expiryDate: '' });
            setEditId(null);
            fetchData();
        } catch (err) {
            alert('Error saving');
        }
    };

    const columns = [
        { header: 'Text', accessor: 'text' },
        { header: 'Type', render: (item) => <span className={`px-2 py-1 rounded text-xs text-white ${item.type === 'danger' ? 'bg-red-500' : item.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}>{item.type}</span> },
        { header: 'Expires', render: (item) => item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'Never' },
        { header: 'Active', render: (item) => item.isActive ? 'Yes' : 'No' }
    ];

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between mb-6">
                <h3 className="text-xl font-bold">Announcements</h3>
                <button onClick={openAddModal} className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-secondary">
                    <RiAddLine /> Add
                </button>
            </div>
            {loading ? <p>Loading...</p> : (
                <AdminTable 
                    columns={columns} 
                    data={data} 
                    onEdit={handleEdit}
                    onDelete={handleDelete} 
                />
            )}
            
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-lg p-6">
                        <h3 className="text-2xl font-bold mb-4">{editId ? 'Edit Announcement' : 'Add Announcement'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Text</label>
                                <textarea className="w-full border p-2 rounded" value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Type</label>
                                <select className="w-full border p-2 rounded" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                    <option value="info">Info (Blue)</option>
                                    <option value="warning">Warning (Yellow)</option>
                                    <option value="danger">Danger (Red)</option>
                                    <option value="success">Success (Green)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Expiry Date (Optional)</label>
                                <input 
                                    type="date" 
                                    className="w-full border p-2 rounded" 
                                    value={formData.expiryDate} 
                                    onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                                />
                                <p className="text-xs text-gray-500 mt-1">Leave empty for no expiry. Announcement will auto-hide after this date.</p>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAnnouncementManager;
