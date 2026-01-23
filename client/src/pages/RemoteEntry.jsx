import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RemoteEntry.css';

const RemoteEntry = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [officerInfo, setOfficerInfo] = useState(null);
  const [formData, setFormData] = useState({
    referenceNumber: '',
    gender: '',
    woreda: '',
    hospitalName: '',
    courtName: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Protect Route & Load Officer Info
  useEffect(() => {
    const token = localStorage.getItem('officerToken');
    const info = localStorage.getItem('officerInfo');

    if (!token || !info) {
      navigate('/officer-login');
      return;
    }

    const parsedInfo = JSON.parse(info);
    setOfficerInfo(parsedInfo);
    
    // Auto-fill constant data
    setFormData(prev => ({
        ...prev,
        woreda: parsedInfo.woreda || '',
        hospitalName: parsedInfo.hospitalName || ''
    }));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('officerToken');
    localStorage.removeItem('officerInfo');
    navigate('/officer-login');
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setMessage('');
    // Reset variable fields but keep constants
    setFormData(prev => ({ 
        ...prev, 
        referenceNumber: '', 
        gender: '',
        // Ensure constants persist
        woreda: officerInfo?.woreda || '',
        hospitalName: officerInfo?.hospitalName || ''
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL 
        ? `${import.meta.env.VITE_API_BASE_URL}/api/ontime-reg` 
        : '/api/ontime-reg';

      await axios.post(apiUrl, {
        serviceName: selectedType,
        ...formData
      });

      setMessage('በተሳካ ሁኔታ ተመዝግቧል (Registered Successfully)!');
      setTimeout(() => {
        setSelectedType(null); // Reset to main screen
        setFormData(prev => ({ 
            ...prev, 
            referenceNumber: '', 
            gender: '' 
        }));
        setMessage('');
      }, 2000);

    } catch (error) {
      console.error('Error submitting report:', error);
      setMessage('ስህተት ተፈጥሯል (Error occurred).');
    } finally {
      setLoading(false);
    }
  };

  if (!officerInfo) return null; // Loading state

  // Navigation Bar for Officer
  const OfficerNavbar = () => (
      <nav className="flex justify-between items-center bg-white shadow-md p-4 mb-6 rounded-lg">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                  {officerInfo.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                  <h3 className="font-bold text-gray-800">{officerInfo.fullName}</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Officer</span>
              </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 font-semibold text-sm flex items-center gap-1"
          >
              Logout 
              <span className="text-xl">›</span>
          </button>
      </nav>
  );

  if (!selectedType) {
    return (
      <div className="remote-container">
        <OfficerNavbar />
        <h1 className="text-3xl font-bold mb-2">Remote Reporting</h1>
        <p className="text-gray-500 mb-8">Select the type of report you want to register.</p>
        
        <div className="button-grid">
          <button className="large-btn birth" onClick={() => handleTypeSelect('ልደት')}>
            <span className="icon">👶</span>
            <span className="label">ልደት (Birth)</span>
          </button>
          <button className="large-btn death" onClick={() => handleTypeSelect('ሞት')}>
            <span className="icon">⚰️</span>
            <span className="label">ሞት (Death)</span>
          </button>
          <button className="large-btn divorce" onClick={() => handleTypeSelect('ፍቺ')}>
            <span className="icon">💔</span>
            <span className="label">ፍቺ (Divorce)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="remote-container form-view">
      <div className="header">
        <button className="back-btn" onClick={() => setSelectedType(null)}>← Back</button>
        <h2>{selectedType} መመዝገቢያ</h2>
      </div>

      {message && <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

      <form onSubmit={handleSubmit} className="remote-form">
        <div className="form-group">
            <label>ቀን (Date)</label>
            <input 
                type="date" 
                name="date" 
                value={formData.date} 
                onChange={handleChange} 
                required 
            />
        </div>

        <div className="form-group">
          <label>የመዝገብ ቁጥር (Reference No)</label>
          <input
            type="text"
            name="referenceNumber"
            value={formData.referenceNumber}
            onChange={handleChange}
            required
            placeholder="Enter reference number"
            className="large-input"
          />
        </div>

        <div className="form-group">
          <label>ጾታ (Gender)</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.gender === 'ወንድ' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="gender"
                value="ወንድ"
                checked={formData.gender === 'ወንድ'}
                onChange={handleChange}
                required
              />
              ወንድ (Male)
            </label>
            <label className={`radio-btn ${formData.gender === 'ሴት' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="gender"
                value="ሴት"
                checked={formData.gender === 'ሴት'}
                onChange={handleChange}
                required
              />
              ሴት (Female)
            </label>
          </div>
        </div>

        {/* Read-Only Auto-Filled Fields */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
                <label className="text-gray-500 text-sm">ወረዳ (Woreda)</label>
                <input 
                    type="text" 
                    name="woreda" 
                    value={formData.woreda} 
                    readOnly
                    className="bg-transparent border-none font-bold text-gray-700 p-0 focus:ring-0"
                />
            </div>

            {(selectedType === 'ልደት' || selectedType === 'ሞት') && (
            <div className="form-group">
                <label className="text-gray-500 text-sm">የጤና ተቋም ስም (Hospital)</label>
                <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    readOnly
                    className="bg-transparent border-none font-bold text-gray-700 p-0 focus:ring-0"
                    placeholder="Not Assigned"
                />
            </div>
            )}
        </div>

        {selectedType === 'ፍቺ' && (
          <div className="form-group">
            <label>የፍርድ ቤት ስም (Court Name)</label>
            <input
              type="text"
              name="courtName"
              value={formData.courtName}
              onChange={handleChange}
              placeholder="Enter Court Name"
            />
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'እየመዘገበ ነው...' : 'መዝግብ (Submit)'}
        </button>
      </form>
    </div>
  );
};

export default RemoteEntry;
