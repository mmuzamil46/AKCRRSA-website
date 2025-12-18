import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiMailLine, RiEyeLine, RiDeleteBinLine, RiCheckLine, RiInboxArchiveLine } from 'react-icons/ri';

const AdminContactManager = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedMessage, setSelectedMessage] = useState(null);

    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/contact`, config);
            setMessages(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchMessages(); }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/contact/${id}`, { status }, config);
            fetchMessages();
            if (selectedMessage && selectedMessage._id === id) {
                setSelectedMessage({ ...selectedMessage, status });
            }
        } catch (err) {
            alert('Error updating status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this message?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/contact/${id}`, config);
                fetchMessages();
                setSelectedMessage(null);
            } catch (err) {
                alert('Error deleting message');
            }
        }
    };

    const filteredMessages = filter === 'all' 
        ? messages 
        : messages.filter(msg => msg.status === filter);

    const getStatusBadge = (status) => {
        const colors = {
            unread: 'bg-blue-100 text-blue-800',
            read: 'bg-green-100 text-green-800',
            archived: 'bg-gray-100 text-gray-800'
        };
        return (
            <span className={`px-2 py-1 rounded text-xs font-bold ${colors[status]}`}>
                {status.toUpperCase()}
            </span>
        );
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Phone', accessor: 'phone' },
        { header: 'Message', render: (item) => (
            <span className="line-clamp-2">{item.message}</span>
        )},
        { header: 'Status', render: (item) => getStatusBadge(item.status) },
        { header: 'Date', render: (item) => new Date(item.createdAt).toLocaleDateString() }
    ];

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <RiMailLine /> Contact Messages
                </h3>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1 rounded text-sm ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-200'}`}
                    >
                        All ({messages.length})
                    </button>
                    <button 
                        onClick={() => setFilter('unread')}
                        className={`px-3 py-1 rounded text-sm ${filter === 'unread' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        Unread ({messages.filter(m => m.status === 'unread').length})
                    </button>
                    <button 
                        onClick={() => setFilter('read')}
                        className={`px-3 py-1 rounded text-sm ${filter === 'read' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                    >
                        Read ({messages.filter(m => m.status === 'read').length})
                    </button>
                    <button 
                        onClick={() => setFilter('archived')}
                        className={`px-3 py-1 rounded text-sm ${filter === 'archived' ? 'bg-gray-500 text-white' : 'bg-gray-200'}`}
                    >
                        Archived ({messages.filter(m => m.status === 'archived').length})
                    </button>
                </div>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="mt-4">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    {columns.map((col, idx) => (
                                        <th key={idx} className="p-4 font-bold text-gray-600 uppercase text-xs tracking-wider">{col.header}</th>
                                    ))}
                                    <th className="p-4 font-bold text-gray-600 text-right uppercase text-xs tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMessages.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length + 1} className="p-4 text-center text-gray-500 text-sm">
                                            No messages found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMessages.map((item) => (
                                        <tr key={item._id} className="border-b hover:bg-gray-50 transition-colors">
                                            {columns.map((col, idx) => (
                                                <td key={idx} className="p-4 text-sm">
                                                    {col.render ? col.render(item) : item[col.accessor]}
                                                </td>
                                            ))}
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedMessage(item)}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                        title="View"
                                                    >
                                                        <RiEyeLine size={18} />
                                                    </button>
                                                    {item.status !== 'read' && (
                                                        <button
                                                            onClick={() => handleStatusChange(item._id, 'read')}
                                                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                            title="Mark as Read"
                                                        >
                                                            <RiCheckLine size={18} />
                                                        </button>
                                                    )}
                                                    {item.status !== 'archived' && (
                                                        <button
                                                            onClick={() => handleStatusChange(item._id, 'archived')}
                                                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                            title="Archive"
                                                        >
                                                            <RiInboxArchiveLine size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <RiDeleteBinLine size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {filteredMessages.length === 0 ? (
                            <p className="text-center text-gray-500 py-8 text-sm">No messages found.</p>
                        ) : (
                            filteredMessages.map((item) => (
                                <div key={item._id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-0.5">
                                            <h4 className="font-bold text-gray-900">{item.name}</h4>
                                            <p className="text-xs text-blue-600 font-medium">{item.phone}</p>
                                        </div>
                                        {getStatusBadge(item.status)}
                                    </div>

                                    <div className="py-2 px-3 bg-white/50 rounded-lg border border-gray-100">
                                        <p className="text-sm text-gray-600 line-clamp-2 italic">
                                            {item.message}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                        <div className="flex gap-1.5 focus-within:ring-2 focus-within:ring-primary/20 rounded-lg p-0.5">
                                            <button
                                                onClick={() => setSelectedMessage(item)}
                                                className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shadow-sm active:scale-95 transition-transform"
                                                title="መመልከቻ"
                                            >
                                                <RiEyeLine size={18} />
                                            </button>
                                            
                                            {item.status !== 'read' && (
                                                <button
                                                    onClick={() => handleStatusChange(item._id, 'read')}
                                                    className="p-2.5 bg-green-50 text-green-600 rounded-lg shadow-sm active:scale-95 transition-transform"
                                                >
                                                    <RiCheckLine size={18} />
                                                </button>
                                            )}

                                            {item.status !== 'archived' && (
                                                <button
                                                    onClick={() => handleStatusChange(item._id, 'archived')}
                                                    className="p-2.5 bg-gray-100 text-gray-600 rounded-lg shadow-sm active:scale-95 transition-transform"
                                                >
                                                    <RiInboxArchiveLine size={18} />
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2.5 bg-red-50 text-red-600 rounded-lg shadow-sm active:scale-95 transition-transform"
                                            >
                                                <RiDeleteBinLine size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-bold">Message Details</h3>
                            <button onClick={() => setSelectedMessage(null)} className="text-gray-500 hover:text-gray-700">
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-bold">{selectedMessage.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-bold">
                                        <a href={`tel:${selectedMessage.phone}`} className="text-blue-600 hover:underline">
                                            {selectedMessage.phone}
                                        </a>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    {getStatusBadge(selectedMessage.status)}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Date</p>
                                    <p className="font-bold">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Message</p>
                                <p className="bg-gray-50 p-4 rounded whitespace-pre-wrap">{selectedMessage.message}</p>
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t">
                                {selectedMessage.status !== 'read' && (
                                    <button
                                        onClick={() => handleStatusChange(selectedMessage._id, 'read')}
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Mark as Read
                                    </button>
                                )}
                                {selectedMessage.status !== 'archived' && (
                                    <button
                                        onClick={() => handleStatusChange(selectedMessage._id, 'archived')}
                                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                    >
                                        Archive
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminContactManager;
