import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OfficerLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Use VITE_API_BASE_URL consistent with the project
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const { data } = await axios.post(`${baseUrl}/api/officers/login`, {
        username,
        password,
      });

      // Store token separately if needed, or just session
      localStorage.setItem('officerToken', data.token);
      localStorage.setItem('officerInfo', JSON.stringify(data));
      
      // Redirect to Remote Entry
      navigate('/remote-entry');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Username or Password');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>
      
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 relative z-10">
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-lg mb-6 transform rotate-12">
                <span className="text-4xl text-white transform -rotate-12">📋</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Officer Access</h1>
            <p className="text-gray-500 font-medium">Remote Data Registration Portal</p>
        </div>
        
        {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-8 text-sm flex items-center gap-3 animate-shake">
               <span className="text-lg">⚠️</span>
               <p className="font-semibold">{error}</p>
            </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Username</label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-500 focus:outline-none transition-all font-medium text-gray-800"
                    placeholder="Enter your username"
                    required 
                />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-500 focus:outline-none transition-all font-medium text-gray-800"
                    placeholder="••••••••"
                    required 
                />
            </div>
          </div>

          <button 
            type="submit" 
            className="group w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-4 rounded-2xl hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-3 active:scale-95"
          >
            Authenticate
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Addis Ketema Subcity CRRSA</p>
        </div>
      </div>
    </div>
  );
};

export default OfficerLogin;
