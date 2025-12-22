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
    hasCategories: false,
    categories: [{ name: '', requirements: '' }] // categories storage as string requirements initially
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
        hasCategories: item.hasCategories || false,
        categories: item.categories && item.categories.length > 0 
            ? item.categories.map(cat => ({
                name: cat.name,
                requirements: cat.requirements.join(', ')
            })) 
            : [{ name: '', requirements: '' }]
    });
    setEditId(item._id);
    setShowModal(true);
  };

  const openAddModal = () => {
    setFormData({ 
        title: '', 
        description: '', 
        icon: 'RiServiceLine', 
        slug: '', 
        requirements: '',
        hasCategories: false,
        categories: [{ name: '', requirements: '' }]
    });
    setEditId(null);
    setShowModal(true);
  };

  const addCategory = () => {
     setFormData({
         ...formData,
         categories: [...formData.categories, { name: '', requirements: '' }]
     });
  };

  const removeCategory = (index) => {
      const newCats = [...formData.categories];
      newCats.splice(index, 1);
      setFormData({ ...formData, categories: newCats });
  };

  const handleCategoryChange = (index, field, value) => {
      const newCats = [...formData.categories];
      newCats[index][field] = value;
      setFormData({ ...formData, categories: newCats });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Process form data for submission
    const submissionData = {
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
        slug: formData.slug,
        hasCategories: formData.hasCategories,
    };

    if (formData.hasCategories) {
        submissionData.categories = formData.categories.map(cat => ({
            name: cat.name,
            requirements: cat.requirements.split(',').map(r => r.trim()).filter(r => r !== '')
        }));
        submissionData.requirements = []; // Clear top-level requirements if using categories
    } else {
        submissionData.requirements = formData.requirements.split(',').map(r => r.trim()).filter(r => r !== '');
        submissionData.categories = [];
    }
    
    try {
      if (editId) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/services/${editId}`, submissionData, config);
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/services`, submissionData, config);
      }
      setShowModal(false);
      fetchServices();
    } catch (err) {
        console.error(err);
        alert('Error saving service');
    }
  };

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Slug', accessor: 'slug' },
    { 
        header: 'Mode', 
        accessor: 'hasCategories',
        render: (val) => val ? <span className="text-blue-600 font-bold">Categorized</span> : <span className="text-gray-500">Simple</span>
    }
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
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-primary border-b pb-2">{editId ? 'Edit Service' : 'Add Service'}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold mb-1">Title</label>
                    <input 
                    type="text" 
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Slug (URL path)</label>
                    <input 
                    type="text" 
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    required
                    />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700">Description</label>
                <textarea 
                  className="w-full border p-3 rounded-lg h-24 focus:ring-2 focus:ring-primary outline-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                ></textarea>
              </div>

              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={formData.hasCategories}
                        onChange={(e) => setFormData({...formData, hasCategories: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    <span className="ml-3 text-sm font-bold text-gray-900 leading-none">Use Sub-Categories (e.g. New, Renewal)</span>
                </label>
              </div>

              {formData.hasCategories ? (
                <div className="space-y-6 border-l-4 border-primary pl-4">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-lg text-primary">Service Categories</h4>
                        <button 
                            type="button"
                            onClick={addCategory}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                        >
                            <RiAddLine /> Add Category
                        </button>
                    </div>
                    {formData.categories.map((cat, index) => (
                        <div key={index} className="bg-white border rounded-lg p-4 relative group shadow-sm">
                            <button 
                                type="button"
                                onClick={() => removeCategory(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                            >
                                &times;
                            </button>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Category Name</label>
                                    <input 
                                        type="text"
                                        className="w-full border p-2 rounded focus:border-primary outline-none"
                                        placeholder="e.g. New (አዲስ)"
                                        value={cat.name}
                                        onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Requirements (Comma separated)</label>
                                    <textarea 
                                        className="w-full border p-2 rounded h-20 focus:border-primary outline-none"
                                        placeholder="Requirement 1, Requirement 2..."
                                        value={cat.requirements}
                                        onChange={(e) => handleCategoryChange(index, 'requirements', e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
              ) : (
                <div className="border-l-4 border-gray-300 pl-4">
                    <label className="block text-sm font-bold mb-1">Requirements (Comma separated)</label>
                    <textarea 
                    className="w-full border p-3 rounded-lg h-32 focus:ring-2 focus:ring-primary outline-none"
                    value={formData.requirements}
                    onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                    placeholder="ID Card, Photo, Payment..."
                    required={!formData.hasCategories}
                    ></textarea>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t mt-8">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-10 py-2.5 bg-primary text-white rounded-xl hover:bg-secondary shadow-lg shadow-primary/20 font-bold"
                >
                  Save Changes
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
