import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  RiStarFill,
  RiBarChartBoxLine, 
  RiUserLine,
  RiMessageLine,
  RiThumbUpLine,
  RiCheckLine,
  RiCloseLine,
  RiEyeLine
} from 'react-icons/ri';

const AdminFeedbackManager = () => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [activeView, setActiveView] = useState('list'); // 'list' or 'analytics'

    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchFeedback = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/feedback`, config);
            setFeedback(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchFeedback(); }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/feedback/${id}`, { status }, config);
            fetchFeedback();
            setSelectedFeedback(null);
        } catch (err) {
            alert('Error updating status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this feedback?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/feedback/${id}`, config);
                fetchFeedback();
            } catch (err) {
                alert('Error deleting feedback');
            }
        }
    };

    const filteredFeedback = filter === 'all' 
        ? feedback 
        : feedback.filter(item => item.status === filter);

    // Analytics Calculations
    const analytics = {
        total: feedback.length,
        approved: feedback.filter(f => f.status === 'approved').length,
        pending: feedback.filter(f => f.status === 'pending').length,
        rejected: feedback.filter(f => f.status === 'rejected').length,
        averageRating: feedback.length > 0 
            ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
            : 0,
        ratingDistribution: {
            5: feedback.filter(f => f.rating === 5).length,
            4: feedback.filter(f => f.rating === 4).length,
            3: feedback.filter(f => f.rating === 3).length,
            2: feedback.filter(f => f.rating === 2).length,
            1: feedback.filter(f => f.rating === 1).length,
        },
        byService: feedback.reduce((acc, item) => {
            const serviceName = item.serviceType;
            if (!acc[serviceName]) {
                acc[serviceName] = { count: 0, totalRating: 0, ratings: [] };
            }
            acc[serviceName].count++;
            acc[serviceName].totalRating += item.rating;
            acc[serviceName].ratings.push(item.rating);
            return acc;
        }, {}),
        byWoreda: feedback.reduce((acc, item) => {
            const woredaName = item.woredaOffice;
            if (!acc[woredaName]) {
                acc[woredaName] = { count: 0, totalRating: 0, ratings: [] };
            }
            acc[woredaName].count++;
            acc[woredaName].totalRating += item.rating;
            acc[woredaName].ratings.push(item.rating);
            return acc;
        }, {})
    };

    // Calculate averages
    Object.keys(analytics.byService).forEach(service => {
        const data = analytics.byService[service];
        data.average = (data.totalRating / data.count).toFixed(1);
    });
    Object.keys(analytics.byWoreda).forEach(woreda => {
        const data = analytics.byWoreda[woreda];
        data.average = (data.totalRating / data.count).toFixed(1);
    });

    const renderStars = (rating) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <RiStarFill 
                        key={star} 
                        className={star <= rating ? 'text-yellow-400' : 'text-gray-300'} 
                        size={16} 
                    />
                ))}
            </div>
        );
    };

    const getStatusBadge = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };
        return (
            <span className={`px-2 py-1 rounded text-xs font-bold ${colors[status]}`}>
                {status.toUpperCase()}
            </span>
        );
    };

    const renderAnalytics = () => (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm">Total Feedback</p>
                            <p className="text-3xl font-bold mt-1">{analytics.total}</p>
                        </div>
                        <RiMessageLine size={40} className="opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm">Approved</p>
                            <p className="text-3xl font-bold mt-1">{analytics.approved}</p>
                        </div>
                        <RiThumbUpLine size={40} className="opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-100 text-sm">Pending</p>
                            <p className="text-3xl font-bold mt-1">{analytics.pending}</p>
                        </div>
                        <RiUserLine size={40} className="opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm">Avg Rating</p>
                            <p className="text-3xl font-bold mt-1 flex items-center gap-1">
                                {analytics.averageRating} <RiStarFill size={24} />
                            </p>
                        </div>
                        <RiBarChartBoxLine size={40} className="opacity-80" />
                    </div>
                </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4">Rating Distribution</h3>
                <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map(rating => {
                        const count = analytics.ratingDistribution[rating];
                        const percentage = analytics.total > 0 ? (count / analytics.total * 100).toFixed(1) : 0;
                        return (
                            <div key={rating} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 w-20">
                                    <span className="font-bold">{rating}</span>
                                    <RiStarFill className="text-yellow-400" />
                                </div>
                                <div className="flex-grow bg-gray-200 rounded-full h-6 overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full flex items-center justify-end pr-2 text-white text-xs font-bold"
                                        style={{ width: `${percentage}%` }}
                                    >
                                        {percentage > 5 && `${percentage}%`}
                                    </div>
                                </div>
                                <span className="text-gray-600 w-20 text-right">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Service Performance */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4">Service Performance</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-3 font-bold">Service</th>
                                <th className="text-center p-3 font-bold">Feedback Count</th>
                                <th className="text-center p-3 font-bold">Avg Rating</th>
                                <th className="text-left p-3 font-bold">Rating Bar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(analytics.byService)
                                .sort((a, b) => b[1].count - a[1].count)
                                .map(([service, data]) => (
                                    <tr key={service} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium">{service}</td>
                                        <td className="p-3 text-center">{data.count}</td>
                                        <td className="p-3 text-center">
                                            <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-bold">
                                                {data.average} <RiStarFill size={14} />
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                                                <div 
                                                    className="bg-gradient-to-r from-green-400 to-green-500 h-full"
                                                    style={{ width: `${(data.average / 5) * 100}%` }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Woreda Performance */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4">Woreda Office Performance</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-3 font-bold">Woreda Office</th>
                                <th className="text-center p-3 font-bold">Feedback Count</th>
                                <th className="text-center p-3 font-bold">Avg Rating</th>
                                <th className="text-left p-3 font-bold">Rating Bar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(analytics.byWoreda)
                                .sort((a, b) => parseFloat(b[1].average) - parseFloat(a[1].average))
                                .map(([woreda, data]) => (
                                    <tr key={woreda} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium">{woreda}</td>
                                        <td className="p-3 text-center">{data.count}</td>
                                        <td className="p-3 text-center">
                                            <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-bold">
                                                {data.average} <RiStarFill size={14} />
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                                                <div 
                                                    className="bg-gradient-to-r from-blue-400 to-blue-500 h-full"
                                                    style={{ width: `${(data.average / 5) * 100}%` }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderList = () => {
        const columns = [
            { header: 'Service', accessor: 'serviceType' },
            { header: 'Office', accessor: 'woredaOffice' },
            { header: 'Rating', render: (item) => renderStars(item.rating) },
            { header: 'User', accessor: 'userName' },
            { header: 'Status', render: (item) => getStatusBadge(item.status) },
            { header: 'Date', render: (item) => new Date(item.createdAt).toLocaleDateString() }
        ];

        return (
            <div className="mt-4">
                {/* Desktop Table */}
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
                            {filteredFeedback.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + 1} className="p-4 text-center text-gray-500">
                                        No feedback found.
                                    </td>
                                </tr>
                            ) : (
                                filteredFeedback.map((item) => (
                                    <tr key={item._id} className="border-b hover:bg-gray-50 transition-colors">
                                        {columns.map((col, idx) => (
                                            <td key={idx} className="p-4 text-sm">
                                                {col.render ? col.render(item) : item[col.accessor]}
                                            </td>
                                        ))}
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedFeedback(item)}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <RiEyeLine size={18} />
                                                </button>
                                                {item.status !== 'approved' && (
                                                    <button
                                                        onClick={() => handleStatusChange(item._id, 'approved')}
                                                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <RiCheckLine size={18} />
                                                    </button>
                                                )}
                                                {item.status !== 'rejected' && (
                                                    <button
                                                        onClick={() => handleStatusChange(item._id, 'rejected')}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <RiCloseLine size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card List */}
                <div className="md:hidden space-y-4">
                    {filteredFeedback.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No feedback found.</p>
                    ) : (
                        filteredFeedback.map((item) => (
                            <div key={item._id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-gray-900">{item.serviceType}</h4>
                                        <p className="text-xs text-gray-500">{item.woredaOffice}</p>
                                    </div>
                                    {getStatusBadge(item.status)}
                                </div>
                                
                                <div className="flex items-center justify-between py-2 border-y border-gray-200/50">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">User</p>
                                        <p className="text-sm font-medium">{item.userName}</p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Rating</p>
                                        {renderStars(item.rating)}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedFeedback(item)}
                                            className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg flex items-center gap-1 text-sm font-bold"
                                        >
                                            <RiEyeLine size={16} /> ዝርዝር
                                        </button>
                                        <div className="flex border-l border-gray-200 pl-2 gap-1">
                                            {item.status !== 'approved' && (
                                                <button
                                                    onClick={() => handleStatusChange(item._id, 'approved')}
                                                    className="p-2 bg-green-50 text-green-600 rounded-lg"
                                                >
                                                    <RiCheckLine size={20} />
                                                </button>
                                            )}
                                            {item.status !== 'rejected' && (
                                                <button
                                                    onClick={() => handleStatusChange(item._id, 'rejected')}
                                                    className="p-2 bg-red-50 text-red-600 rounded-lg"
                                                >
                                                    <RiCloseLine size={20} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Feedback Management</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveView('list')}
                        className={`px-4 py-2 rounded flex items-center gap-2 ${activeView === 'list' ? 'bg-primary text-white' : 'bg-gray-200'}`}
                    >
                        <RiMessageLine /> Feedback List
                    </button>
                    <button
                        onClick={() => setActiveView('analytics')}
                        className={`px-4 py-2 rounded flex items-center gap-2 ${activeView === 'analytics' ? 'bg-primary text-white' : 'bg-gray-200'}`}
                    >
                        <RiBarChartBoxLine /> Analytics
                    </button>
                </div>
            </div>

            {!loading && activeView === 'list' && (
                <div className="flex gap-2 mb-4">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1 rounded text-sm ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-200'}`}
                    >
                        All ({feedback.length})
                    </button>
                    <button 
                        onClick={() => setFilter('pending')}
                        className={`px-3 py-1 rounded text-sm ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                    >
                        Pending ({feedback.filter(f => f.status === 'pending').length})
                    </button>
                    <button 
                        onClick={() => setFilter('approved')}
                        className={`px-3 py-1 rounded text-sm ${filter === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                    >
                        Approved ({feedback.filter(f => f.status === 'approved').length})
                    </button>
                    <button 
                        onClick={() => setFilter('rejected')}
                        className={`px-3 py-1 rounded text-sm ${filter === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                    >
                        Rejected ({feedback.filter(f => f.status === 'rejected').length})
                    </button>
                </div>
            )}

            {loading ? <p>Loading...</p> : (
                activeView === 'analytics' ? renderAnalytics() : renderList()
            )}

            {/* Detail Modal */}
            {selectedFeedback && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-bold">Feedback Details</h3>
                            <button onClick={() => setSelectedFeedback(null)}>
                                <RiCloseLine size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Service Type</p>
                                    <p className="font-bold">{selectedFeedback.serviceType}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Office</p>
                                    <p className="font-bold">{selectedFeedback.woredaOffice}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">User Name</p>
                                    <p className="font-bold">{selectedFeedback.userName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-bold">{selectedFeedback.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Rating</p>
                                    {renderStars(selectedFeedback.rating)}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    {getStatusBadge(selectedFeedback.status)}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Comment</p>
                                <p className="bg-gray-50 p-4 rounded">{selectedFeedback.comment}</p>
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t">
                                {selectedFeedback.status !== 'approved' && (
                                    <button
                                        onClick={() => handleStatusChange(selectedFeedback._id, 'approved')}
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Approve
                                    </button>
                                )}
                                {selectedFeedback.status !== 'rejected' && (
                                    <button
                                        onClick={() => handleStatusChange(selectedFeedback._id, 'rejected')}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Reject
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

export default AdminFeedbackManager;
