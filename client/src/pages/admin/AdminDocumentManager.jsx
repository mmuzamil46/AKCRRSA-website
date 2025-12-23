import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiAddLine, RiUploadCloud2Line } from 'react-icons/ri';
import AdminTable from '../../components/AdminTable';

const AdminDocumentManager = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', fileUrl: '', category: 'Other' });
    const [uploading, setUploading] = useState(false);
    const [reindexing, setReindexing] = useState(false);

    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/documents`);
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
                await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/documents/${id}`, config);
                fetchData();
            } catch (err) {
                alert('Error deleting');
            }
        }
    };

    const handleEdit = (item) => {
        setFormData({
            title: item.title,
            description: item.description,
            fileUrl: item.fileUrl,
            category: item.category
        });
        setEditId(item._id);
        setShowModal(true);
    };

    const openAddModal = () => {
        setFormData({ title: '', description: '', fileUrl: '', category: 'Other' });
        setEditId(null);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/documents/${editId}`, formData, config);
            } else {
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/documents`, formData, config);
            }
            setShowModal(false);
            setFormData({ title: '', description: '', fileUrl: '', category: 'Other' });
            setEditId(null);
            fetchData();
        } catch (err) {
            alert('Error saving');
        }
    };

    const handleReindex = async () => {
        if (!window.confirm('This will re-process all documents for the chatbot. Proceed?')) return;
        setReindexing(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/documents/reindex`, {}, config);
            alert('Indexing started in the background.');
        } catch (err) {
            alert('Error starting re-index');
        } finally {
            setReindexing(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const data = new FormData();
        data.append('image', file); // API expects 'image' field even for docs
        setUploading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData({ ...formData, fileUrl: res.data });
            setUploading(false);
        } catch (err) {
            setUploading(false);
            alert('Upload failed');
        }
    };

    const columns = [
        { header: 'Title', accessor: 'title' },
        { header: 'Category', accessor: 'category' },
        { header: 'File', render: (item) => <a href={item.fileUrl.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${item.fileUrl}` : item.fileUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline">View</a> }
    ];

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between mb-6">
                <h3 className="text-xl font-bold">Documents</h3>
                <div className="flex gap-2">
                    <button 
                        onClick={handleReindex} 
                        disabled={reindexing}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-200 disabled:opacity-50"
                    >
                        {reindexing ? 'Indexing...' : <><RiUploadCloud2Line /> Re-index All</>}
                    </button>
                    <button onClick={openAddModal} className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-secondary">
                        <RiAddLine /> Add Document
                    </button>
                </div>
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
                        <h3 className="text-2xl font-bold mb-4">{editId ? 'Edit Document' : 'Add Document'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Title</label>
                                <input type="text" className="w-full border p-2 rounded" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Category</label>
                                <select className="w-full border p-2 rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                    <option>Regulation</option>
                                    <option>Form</option>
                                    <option>Report</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Description</label>
                                <textarea className="w-full border p-2 rounded" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">File (PDF/Doc)</label>
                                <div className="flex gap-2">
                                    <input type="text" className="w-full border p-2 rounded bg-gray-100" value={formData.fileUrl} readOnly />
                                    <label className="cursor-pointer bg-gray-200 p-2 rounded"><RiUploadCloud2Line size={24} />
                                        <input type="file" className="hidden" onChange={handleFileChange} />
                                    </label>
                                </div>
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

export default AdminDocumentManager;
