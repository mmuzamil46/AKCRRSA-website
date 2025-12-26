import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiAddLine } from 'react-icons/ri';
import AdminTable from '../../components/AdminTable';

const AdminWoredasManager = () => {
    const [woredas, setWoredas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      mapUrl: '',
      managerName: '',
      managerPhone: '',
      population: '',
      lat: '',
      lng: '',
    });
  
    const token = localStorage.getItem('adminToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
  
    const fetchWoredas = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/woredas`);
        setWoredas(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchWoredas();
    }, []);
  
    const handleDelete = async (id) => {
      if (window.confirm('Are you sure you want to delete this woreda?')) {
        try {
          await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/woredas/${id}`, config);
          fetchWoredas();
        } catch (err) {
          alert('Error deleting woreda');
        }
      }
    };

    const handleEdit = (item) => {
        setFormData({
            name: item.name,
            description: item.description,
            mapUrl: item.mapUrl,
            managerName: item.managerName,
            managerPhone: item.managerPhone,
            population: item.population || '',
            lat: item.lat || '',
            lng: item.lng || '',
        });
        setEditId(item._id);
        setShowModal(true);
    };

    const openAddModal = () => {
        setFormData({ name: '', description: '', mapUrl: '', managerName: '', managerPhone: '', population: '', lat: '', lng: '' });
        setEditId(null);
        setShowModal(true);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (editId) {
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/woredas/${editId}`, formData, config);
        } else {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/woredas`, formData, config);
        }
        setShowModal(false);
        setFormData({ name: '', description: '', mapUrl: '', managerName: '', managerPhone: '', population: '', lat: '', lng: '' });
        setEditId(null);
        fetchWoredas();
      } catch (err) {
        alert('Error saving woreda');
      }
    };
  
    const columns = [
      { header: 'Woreda Name', accessor: 'name' },
      { header: 'Population', accessor: 'population' },
      { header: 'Manager', accessor: 'managerName' },
      { header: 'Phone', accessor: 'managerPhone' },
    ];
  
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between mb-6">
          <h3 className="text-xl font-bold">Woreda Offices</h3>
          <button 
            onClick={openAddModal}
            className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-secondary transition-colors"
          >
            <RiAddLine /> Add Woreda
          </button>
        </div>
  
        {loading ? <p>Loading...</p> : (
          <AdminTable 
            columns={columns} 
            data={woredas} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
  
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4">{editId ? 'Edit Woreda' : 'Add Woreda'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Name</label>
                  <input 
                    type="text" 
                    className="w-full border p-2 rounded"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
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
                    <label className="block text-sm font-bold mb-1">Google Maps Embed URL</label>
                    <input 
                      type="text" 
                      className="w-full border p-2 rounded"
                      value={formData.mapUrl}
                      onChange={(e) => setFormData({...formData, mapUrl: e.target.value})}
                      required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Manager Name</label>
                        <input 
                        type="text" 
                        className="w-full border p-2 rounded"
                        value={formData.managerName}
                        onChange={(e) => setFormData({...formData, managerName: e.target.value})}
                        required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Manager Phone</label>
                        <input 
                        type="text" 
                        className="w-full border p-2 rounded"
                        value={formData.managerPhone}
                        onChange={(e) => setFormData({...formData, managerPhone: e.target.value})}
                        required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Population</label>
                        <input 
                        type="number" 
                        className="w-full border p-2 rounded"
                        value={formData.population}
                        onChange={(e) => setFormData({...formData, population: e.target.value})}
                        required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Latitude</label>
                        <input 
                        type="number" 
                        step="any"
                        className="w-full border p-2 rounded"
                        value={formData.lat}
                        onChange={(e) => setFormData({...formData, lat: e.target.value})}
                        required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Longitude</label>
                        <input 
                        type="number" 
                        step="any"
                        className="w-full border p-2 rounded"
                        value={formData.lng}
                        onChange={(e) => setFormData({...formData, lng: e.target.value})}
                        required
                        />
                    </div>
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
  
  export default AdminWoredasManager;
