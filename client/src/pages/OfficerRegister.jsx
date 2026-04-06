import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const OfficerRegister = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    phone: '',
    password: '',
    woreda: '',
    hospitalName: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      // We send role "Staff" or "User" default. The backend defaults to "User".
      const { data } = await axios.post(`${baseUrl}/api/officers`, formData);

      // Successfully registered, now redirect to login or login them implicitly
      navigate('/officer-login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>
      
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-100 relative z-10">
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-lg mb-6 transform -rotate-12">
                <span className="text-4xl text-white transform rotate-12">✨</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-500 font-medium">Remote Officer Registration</p>
        </div>
        
        {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-8 text-sm flex items-center gap-3 animate-shake">
               <span className="text-lg">⚠️</span>
               <p className="font-semibold">{error}</p>
            </div>
        )}
        
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-50 group-focus-within:opacity-100 transition-opacity">📝</span>
                  <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-14 pr-5 py-4 bg-gray-50/50 border border-gray-100 rounded-3xl focus:ring-[6px] focus:ring-green-100 focus:bg-white focus:border-green-500 focus:outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                      placeholder="e.g. Abebe Kebede"
                      required 
                  />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-50 group-focus-within:opacity-100 transition-opacity">👤</span>
                  <input 
                      type="text" 
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-14 pr-5 py-4 bg-gray-50/50 border border-gray-100 rounded-3xl focus:ring-[6px] focus:ring-green-100 focus:bg-white focus:border-green-500 focus:outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                      placeholder="Choose a username"
                      required 
                  />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Phone</label>
              <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-50 group-focus-within:opacity-100 transition-opacity">📞</span>
                  <input 
                      type="text" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-14 pr-5 py-4 bg-gray-50/50 border border-gray-100 rounded-3xl focus:ring-[6px] focus:ring-green-100 focus:bg-white focus:border-green-500 focus:outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                      placeholder="e.g. 0911..."
                      required 
                  />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-50 group-focus-within:opacity-100 transition-opacity">🔒</span>
                  <input 
                      type="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-14 pr-5 py-4 bg-gray-50/50 border border-gray-100 rounded-3xl focus:ring-[6px] focus:ring-green-100 focus:bg-white focus:border-green-500 focus:outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                      placeholder="••••••••"
                      required 
                  />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Woreda</label>
              <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-50 group-focus-within:opacity-100 transition-opacity">📍</span>
                  <input 
                      type="text" 
                      name="woreda"
                      value={formData.woreda}
                      onChange={handleChange}
                      className="w-full pl-14 pr-5 py-4 bg-gray-50/50 border border-gray-100 rounded-3xl focus:ring-[6px] focus:ring-green-100 focus:bg-white focus:border-green-500 focus:outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                      placeholder="e.g. Woreda 01"
                      required 
                  />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Hospital / Station Name</label>
              <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-50 group-focus-within:opacity-100 transition-opacity">🏥</span>
                  <input 
                      type="text" 
                      name="hospitalName"
                      value={formData.hospitalName}
                      onChange={handleChange}
                      className="w-full pl-14 pr-5 py-4 bg-gray-50/50 border border-gray-100 rounded-3xl focus:ring-[6px] focus:ring-green-100 focus:bg-white focus:border-green-500 focus:outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                      placeholder="Facility name"
                      required 
                  />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="group w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black py-5 rounded-3xl hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-green-500/10 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'Creating Account...' : 'Register'}
            {!loading && <span className="text-xl group-hover:translate-x-1 transition-transform">➡️</span>}
          </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 font-semibold">
              Already have an account?{' '}
              <Link to="/officer-login" className="text-green-600 hover:text-green-700 hover:underline decoration-2 underline-offset-4 transition-all">
                Login here
              </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default OfficerRegister;
