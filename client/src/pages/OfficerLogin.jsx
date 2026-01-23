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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-blue-600">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Officer Login</h1>
        <p className="text-center text-gray-500 mb-6 font-mono text-sm">Remote Data Entry System</p>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
              placeholder="Enter your username"
              required 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
              placeholder="Enter your password"
              required 
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition-colors shadow-lg">
            Login to Tablet Mode
          </button>
        </form>
      </div>
    </div>
  );
};

export default OfficerLogin;
