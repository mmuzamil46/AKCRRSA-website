import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiAddLine } from 'react-icons/ri';
import AdminTable from '../../components/AdminTable';

const AdminServicesManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'RiServiceLine',
    slug: '',
    requirements: '',
  });

  const token = localStorage.getItem('adminToken');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/services`);
      setServices(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/services/${id}`, config);
        fetchServices();
      } catch (err) {
        alert('Error deleting service');
      }
    }
  };

  const handleEdit = (item) => {
    setFormData({
        title: item.title,
        description: item.description,
        icon: item.icon || 'RiServiceLine',
        slug: item.slug,
        requirements: item.requirements ? item.requirements.join(', ') : '',
    });
    setEditId(item._id);
    setShowModal(true);
  };

  const openAddModal = () => {
    setFormData({ title: '', description: '', icon: 'RiServiceLine', slug: '', requirements: '' });
    setEditId(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requirementsArray = formData.requirements.split(',').map(r => r.trim());
    
    try {
      if (editId) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/services/${editId}`, {
            ...formData,
            requirements: requirementsArray
        }, config);
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/services`, {
            ...formData,
            requirements: requirementsArray
        }, config);
      }
      setShowModal(false);
      setFormData({ title: '', description: '', icon: 'RiServiceLine', slug: '', requirements: '' });
      setEditId(null);
      fetchServices();
    } catch (err) {
        console.log(err);
      alert('Error saving service');
    }
  };

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Slug', accessor: 'slug' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between mb-6">
        <h3 className="text-xl font-bold">Services</h3>
        <button 
          onClick={openAddModal}
          className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-secondary transition-colors"
        >
          <RiAddLine /> Add Service
        </button>
      </div>

      {loading ? <p>Loading...</p> : (
        <AdminTable 
          columns={columns} 
          data={services} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <h3 className="text-2xl font-bold mb-4">{editId ? 'Edit Service' : 'Add Service'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                    <label className="block text-sm font-bold mb-1">Slug (ID like 'birth')</label>
                    <input 
                    type="text" 
                    className="w-full border p-2 rounded"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    required
                    />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-1">Description</label>
                <textarea 
                  className="w-full border p-2 rounded h-24"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Icon (Remix Icon Name)</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  placeholder="RiServiceLine"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Requirements (Comma separated)</label>
                <textarea 
                  className="w-full border p-2 rounded h-20"
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  placeholder="ID Card, Photo, Payment..."
                  required
                ></textarea>
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
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServicesManager;
