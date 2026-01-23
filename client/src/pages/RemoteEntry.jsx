import React, { useState } from 'react';
import axios from 'axios';
import './RemoteEntry.css';

const RemoteEntry = () => {
  const [selectedType, setSelectedType] = useState(null);
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

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setMessage('');
    setFormData(prev => ({ ...prev, referenceNumber: '', gender: '' }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Assuming the API is relative or configured in axios defaults for this project
      // If deployed separately, user might need to adjust base URL.
      // For AKCRRSA, it likely uses a proxy or configured base URL.
      // We'll trust relative path '/api/ontime-reg' if proxy exists, or absolute if needed.
      // Given typical setups, '/api/ontime-reg' is safest if proxy is set up.
      // If not, we might need `${import.meta.env.VITE_API_URL}/api/ontime-reg`
      
      const apiUrl = import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL}/api/ontime-reg` 
        : '/api/ontime-reg';

      await axios.post(apiUrl, {
        serviceName: selectedType,
        ...formData
      });

      setMessage('በተሳካ ሁኔታ ተመዝግቧል (Registered Successfully)!');
      setTimeout(() => {
        setSelectedType(null); // Reset to main screen
        setFormData({ ...formData, referenceNumber: '', gender: '' });
        setMessage('');
      }, 2000);

    } catch (error) {
      console.error('Error submitting report:', error);
      setMessage('ስህተት ተፈጥሯል (Error occurred).');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedType) {
    return (
      <div className="remote-container">
        <h1>Remote Reporting</h1>
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

        <div className="form-group">
            <label>ወረዳ (Woreda)</label>
            <input 
                type="text" 
                name="woreda" 
                value={formData.woreda} 
                onChange={handleChange} 
                required 
                placeholder="Enter Woreda"
            />
        </div>

        {(selectedType === 'ልደት' || selectedType === 'ሞት') && (
          <div className="form-group">
            <label>የጤና ተቋም ስም (Hospital Name)</label>
            <input
              type="text"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              placeholder="Enter Hospital Name"
            />
          </div>
        )}

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
