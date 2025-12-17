import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  RiCheckLine, 
  RiDeleteBinLine, 
  RiBarChartBoxLine, 
  RiStarFill,
  RiUserLine,
  RiMessageLine,
  RiThumbUpLine
} from 'react-icons/ri';

const AdminCommentsManager = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('list'); // 'list' or 'analytics'

  const token = localStorage.getItem('adminToken');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/comments`, config);
      setComments(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/comments/${id}/approve`, {}, config);
      fetchComments();
    } catch (err) {
      alert('Error approving comment');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this comment?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/comments/${id}`, config);
        fetchComments();
      } catch (err) {
        alert('Error deleting comment');
      }
    }
  };

  // Analytics Calculations
  const analytics = {
    total: comments.length,
    approved: comments.filter(c => c.isApproved).length,
    pending: comments.filter(c => !c.isApproved).length,
    averageRating: comments.length > 0 
      ? (comments.reduce((sum, c) => sum + (c.rating || 0), 0) / comments.length).toFixed(1)
      : 0,
    ratingDistribution: {
      5: comments.filter(c => c.rating === 5).length,
      4: comments.filter(c => c.rating === 4).length,
      3: comments.filter(c => c.rating === 3).length,
      2: comments.filter(c => c.rating === 2).length,
      1: comments.filter(c => c.rating === 1).length,
    },
    byService: comments.reduce((acc, comment) => {
      const serviceName = comment.serviceId?.title || 'Unknown';
      if (!acc[serviceName]) {
        acc[serviceName] = { count: 0, totalRating: 0, ratings: [] };
      }
      acc[serviceName].count++;
      acc[serviceName].totalRating += comment.rating || 0;
      acc[serviceName].ratings.push(comment.rating || 0);
      return acc;
    }, {}),
    recentComments: comments.slice(0, 5)
  };

  // Calculate service averages
  Object.keys(analytics.byService).forEach(service => {
    const data = analytics.byService[service];
    data.average = (data.totalRating / data.count).toFixed(1);
  });

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Comments</p>
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
                <span className="text-gray-600 w-16 text-right">{count} ({percentage}%)</span>
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
                <th className="text-center p-3 font-bold">Comments</th>
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
    </div>
  );

  const renderList = () => (
    <div className="space-y-4">
      {comments.length === 0 ? <p className="text-gray-500">No comments found.</p> : (
        comments.map(comment => (
          <div key={comment._id} className={`border p-4 rounded flex justify-between items-start ${comment.isApproved ? 'bg-white border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className="flex-grow">
              <div className="font-bold flex items-center gap-2">
                {comment.user}
                {!comment.isApproved && <span className="text-xs bg-yellow-200 text-yellow-800 px-2 rounded">Pending</span>}
                <div className="flex text-yellow-400 text-sm ml-2">
                  {'★'.repeat(comment.rating || 0)}{'☆'.repeat(5 - (comment.rating || 0))}
                </div>
              </div>
              <div className="text-xs text-gray-500 mb-1">On: {comment.serviceId?.title || 'Unknown Service'}</div>
              <p className="text-gray-600 text-sm mt-1">{comment.content}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(comment.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              {!comment.isApproved && (
                <button 
                  onClick={() => handleApprove(comment._id)}
                  className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  title="Approve"
                >
                  <RiCheckLine />
                </button>
              )}
              <button 
                onClick={() => handleDelete(comment._id)}
                className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                title="Delete"
              >
                <RiDeleteBinLine />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">User Comments</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('list')}
            className={`px-4 py-2 rounded flex items-center gap-2 ${activeView === 'list' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            <RiMessageLine /> Comments List
          </button>
          <button
            onClick={() => setActiveView('analytics')}
            className={`px-4 py-2 rounded flex items-center gap-2 ${activeView === 'analytics' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            <RiBarChartBoxLine /> Analytics
          </button>
        </div>
      </div>

      {loading ? <p>Loading...</p> : (
        activeView === 'analytics' ? renderAnalytics() : renderList()
      )}
    </div>
  );
};

export default AdminCommentsManager;
