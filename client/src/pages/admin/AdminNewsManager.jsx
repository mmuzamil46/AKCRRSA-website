import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiAddLine, RiUploadCloud2Line, RiCloseCircleLine } from 'react-icons/ri';
import AdminTable from '../../components/AdminTable';

const AdminNewsManager = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    images: [],
  });
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem('adminToken');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchNews = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/news`);
      setNews(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/news/${id}`, config);
        fetchNews();
      } catch (err) {
        alert('Error deleting news');
      }
    }
  };

  const handleEdit = (item) => {
    setFormData({
        title: item.title,
        content: item.content,
        image: item.image,
        images: item.images || []
    });
    setEditId(item._id);
    setShowModal(true);
  };

  const openAddModal = () => {
    setFormData({ title: '', content: '', image: '', images: [] });
    setEditId(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
         await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/news/${editId}`, formData, config);
      } else {
         await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/news`, formData, config);
      }
      setShowModal(false);
      setFormData({ title: '', content: '', image: '', images: [] });
      setEditId(null);
      fetchNews();
    } catch (err) {
      alert('Error saving news');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append('image', file);
    setUploading(true);

    try {
        const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload`, uploadData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        setFormData(prev => ({ ...prev, image: data }));
        setUploading(false);
    } catch (error) {
        console.error(error);
        setUploading(false);
        alert('File upload failed');
    }
  };

  const handleMultipleFilesChange = async (e) => {
    const files = Array.from(e.target.files);
    const uploadData = new FormData();
    files.forEach(file => {
        uploadData.append('images', file);
    });
    setUploading(true);

    try {
        const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload/multiple`, uploadData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        setFormData(prev => ({ ...prev, images: [...prev.images, ...data] }));
        setUploading(false);
    } catch (error) {
        console.error(error);
        setUploading(false);
        alert('Files upload failed');
    }
  };

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Date', render: (item) => new Date(item.date).toLocaleDateString() },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between mb-6">
        <h3 className="text-xl font-bold">News Articles</h3>
        <button 
          onClick={openAddModal}
          className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-secondary transition-colors"
        >
          <RiAddLine /> Add News
        </button>
      </div>

      {loading ? <p>Loading...</p> : (
        <AdminTable 
          columns={columns} 
          data={news} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">{editId ? 'Edit News' : 'Add News'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Content</label>
                <textarea 
                  className="w-full border p-2 rounded h-32"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  required
                ></textarea>
              </div>

              {/* Main Image Upload */}
              <div>
                <label className="block text-sm font-bold mb-1">Main Image</label>
                <div className="flex items-center gap-4">
                    <input 
                    type="text" 
                    className="w-full border p-2 rounded bg-gray-100"
                    value={formData.image}
                    readOnly
                    placeholder="Image URL"
                    />
                    <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 p-2 rounded text-gray-700">
                        <RiUploadCloud2Line size={24} />
                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                </div>
                {uploading && <p className="text-xs text-blue-500 mt-1">Uploading...</p>}
              </div>

              {/* Gallery Upload */}
              <div>
                <label className="block text-sm font-bold mb-1">Gallery Images (Multiple)</label>
                <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-gray-700 flex items-center gap-2 w-full justify-center">
                        <RiUploadCloud2Line size={24} /> Upload Images
                        <input type="file" className="hidden" onChange={handleMultipleFilesChange} multiple accept="image/*" />
                    </label>
                </div>
                
                {/* Preview Gallery URLs */}
                {formData.images.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                        <p>{formData.images.length} images uploaded.</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {formData.images.map((img, idx) => (
                                <div key={idx} className="relative group">
                                    <img src={img.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${img}` : img} alt="Preview" className="w-16 h-16 object-cover rounded" />
                                    <button 
                                        type="button"
                                        onClick={() => setFormData(p => ({...p, images: p.images.filter((_, i) => i !== idx)}))}
                                        className="absolute -top-1 -right-1 text-red-500 bg-white rounded-full p-0.5 shadow hidden group-hover:block"
                                    >
                                        <RiCloseCircleLine />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNewsManager;
