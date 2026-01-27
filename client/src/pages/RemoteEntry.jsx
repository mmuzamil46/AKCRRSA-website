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

  // Dashboard State
  const [stats, setStats] = useState({
      total: 0,
      today: 0,
      byService: {},
      byGender: {},
      recent: []
  });

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

    // Trigger stats fetch after loading info
    fetchStats(parsedInfo);
  }, [navigate]);

   const fetchStats = async (info) => {
        if (!info) return;
        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL 
                ? `${import.meta.env.VITE_API_BASE_URL}/api/ontime-reg/stats` 
                : '/api/ontime-reg/stats';
            
            const res = await axios.get(apiUrl, {
                params: {
                    woreda: info.woreda,
                    hospitalName: info.hospitalName
                }
            });
            setStats(res.data);
        } catch (err) {
            console.error("Failed to fetch stats", err);
        }
    };

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
        fetchStats(officerInfo); // Refresh stats
      }, 2000);

    } catch (error) {
      console.error('Error submitting report:', error);
      setMessage(error.response?.data?.message || 'ስህተት ተፈጥሯል (Error occurred).');
    } finally {
      setLoading(false);
    }
  };

  if (!officerInfo) return null;

  const OfficerNavbar = () => (
      <nav className="flex justify-between items-center bg-white shadow-sm p-4 mb-6 rounded-xl border border-gray-100">
          <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {officerInfo.fullName?.charAt(0).toUpperCase() || 'O'}
              </div>
              <div>
                  <h3 className="font-bold text-gray-800 text-lg">{officerInfo.fullName}</h3>
                  <div className="flex items-center gap-2">
                       <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Officer</span>
                       <span className="text-xs text-gray-500">| {officerInfo.woreda}</span>
                  </div>
              </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 font-semibold text-sm flex items-center gap-2 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
          >
              Logout 
              <span>›</span>
          </button>
      </nav>
  );

  const StatCard = ({ title, value, icon, colorClass }) => (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10`}>
                  <span className={`text-2xl ${colorClass.replace('bg-', 'text-')}`}>{icon}</span>
              </div>
              <span className="text-3xl font-bold text-gray-800">{value}</span>
          </div>
          <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
      </div>
  );

  if (!selectedType) {
    return (
      <div className="remote-container max-w-5xl mx-auto p-4">
        <OfficerNavbar />
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard 
                title="Total Reports" 
                value={stats.total} 
                icon="📊" 
                colorClass="bg-blue-500" 
            />
            <StatCard 
                title="Today's Entries" 
                value={stats.today} 
                icon="📅" 
                colorClass="bg-green-500" 
            />
            <StatCard 
                title="Births Registered" 
                value={stats.byService['ልደት'] || 0} 
                icon="👶" 
                colorClass="bg-purple-500" 
            />
            <StatCard 
                title="Deaths Registered" 
                value={stats.byService['ሞት'] || 0} 
                icon="⚰️" 
                colorClass="bg-gray-600" 
            />
        </div>

        <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">New Registration</h2>
            <p className="text-gray-500">Select a service category to start a new report.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            className="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 text-left"
            onClick={() => handleTypeSelect('ልደት')}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 flex flex-col h-full">
                <span className="text-4xl mb-4 bg-green-100 w-16 h-16 flex items-center justify-center rounded-2xl text-green-600">👶</span>
                <span className="text-xl font-bold text-gray-800 mb-1">ልደት (Birth)</span>
                <span className="text-sm text-gray-500">Register new birth certificate</span>
                <div className="mt-auto pt-4 flex items-center text-green-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Start Report →
                </div>
            </div>
          </button>

          <button 
            className="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 text-left"
            onClick={() => handleTypeSelect('ሞት')}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 flex flex-col h-full">
                <span className="text-4xl mb-4 bg-gray-200 w-16 h-16 flex items-center justify-center rounded-2xl text-gray-600">⚰️</span>
                <span className="text-xl font-bold text-gray-800 mb-1">ሞት (Death)</span>
                <span className="text-sm text-gray-500">Register new death certificate</span>
                <div className="mt-auto pt-4 flex items-center text-gray-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Start Report →
                </div>
            </div>
          </button>

          <button 
            className="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 text-left"
            onClick={() => handleTypeSelect('ፍቺ')}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 flex flex-col h-full">
                <span className="text-4xl mb-4 bg-red-100 w-16 h-16 flex items-center justify-center rounded-2xl text-red-600">💔</span>
                <span className="text-xl font-bold text-gray-800 mb-1">ፍቺ (Divorce)</span>
                <span className="text-sm text-gray-500">Register new divorce certificate</span>
                <div className="mt-auto pt-4 flex items-center text-red-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Start Report →
                </div>
            </div>
          </button>
        </div>

        {/* Recent Submissions */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    Recent Activity
                </h3>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 py-1 bg-gray-50 rounded-full">Live Updates</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-[#fcfdff] text-gray-400 text-xs font-black uppercase tracking-widest border-b border-gray-50">
                        <tr>
                            <th className="px-6 py-4">Reference No</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Gender</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {stats.recent && stats.recent.length > 0 ? (
                            stats.recent.map((rpt, idx) => (
                                <tr key={rpt._id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4 font-mono font-bold text-blue-600">{rpt.referenceNumber}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            rpt.serviceName === 'ልደት' ? 'bg-green-100 text-green-700' :
                                            rpt.serviceName === 'ሞት' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {rpt.serviceName}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">{rpt.gender}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                            Synced
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-gray-400 font-medium">No recent activity found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
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

      {message && <div className={`message ${message.includes('Error') || message.includes('exists') ? 'error' : 'success'}`}>{message}</div>}

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
