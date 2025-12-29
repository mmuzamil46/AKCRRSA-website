import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiEditLine, RiDeleteBinLine, RiAddLine, RiImageAddLine } from 'react-icons/ri';
import toast from 'react-hot-toast';

const AdminStaffManager = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    role: 'staff',
    image: ''
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/staff`);
      setStaff(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load staff');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload`, formData, config);
      setFormData((prev) => ({ ...prev, image: res.data }));
      setUploading(false);
      toast.success('Image uploaded');
    } catch (err) {
      console.error(err);
      setUploading(false);
      toast.error('Image upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (editing) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/staff/${editing._id}`, formData, config);
        toast.success('Staff updated');
        setEditing(null);
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/staff`, formData, config);
        toast.success('Staff added');
      }
      setFormData({ name: '', position: '', role: 'staff', image: '' });
      fetchStaff();
    } catch (err) {
      console.error(err);
      toast.error(editing ? 'Update failed' : 'Add failed');
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setFormData({
      name: item.name,
      position: item.position,
      role: item.role,
      image: item.image
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    
    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/staff/${id}`, config);
      toast.success('Staff deleted');
      fetchStaff();
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({ name: '', position: '', role: 'staff', image: '' });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 flex items-center gap-2">
        <RiAddLine className="text-primary" /> Manage Staff
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-10 p-6 bg-gray-50 rounded-xl border border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-gray-700">{editing ? 'Edit Staff Member' : 'Add New Staff Member'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position Title</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="e.g. General Manager"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role Type</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="head">Agency Head (ሀላፊ)</option>
              <option value="team_leader">Team Leader (ቡድን መሪ)</option>
              <option value="staff">Standard Staff</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                onChange={handleImageUpload}
                className="hidden"
                id="staff-image-upload"
              />
              <label htmlFor="staff-image-upload" className="cursor-pointer bg-white border border-gray-300 px-4 py-2 rounded shadow-sm text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                <RiImageAddLine /> {uploading ? 'Uploading...' : 'Choose Image'}
              </label>
              {formData.image && <span className="text-xs text-green-600">Image selected</span>}
            </div>
            {formData.image && (
              <img 
                src={formData.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${formData.image}` : formData.image}
                alt="Preview" 
                className="mt-2 h-16 w-16 object-cover rounded-full border"
              />
            )}
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <button
            type="submit"
            disabled={uploading}
            className={`px-6 py-2 rounded text-white font-medium shadow-sm transition-all ${
              uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'
            }`}
          >
            {editing ? 'Update Staff Member' : 'Add Staff Member'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 rounded bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position/Role</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staff.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img 
                        className="h-10 w-10 rounded-full object-cover" 
                        src={item.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${item.image}` : item.image} 
                        alt="" 
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-bold">{item.position}</div>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.role === 'head' ? 'bg-purple-100 text-purple-800' : 
                    item.role === 'team_leader' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.role === 'head' ? 'Head (ሀላፊ)' : item.role === 'team_leader' ? 'Team Leader' : 'Staff'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <RiEditLine size={18} />
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-900">
                    <RiDeleteBinLine size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStaffManager;
