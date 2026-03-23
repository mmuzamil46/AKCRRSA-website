import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
  const [reportDates, setReportDates] = useState({ start: '', end: '' });
  const [isGenerating, setIsGenerating] = useState(false);
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

  const generatePDFReport = async () => {
    if (!reportDates.start || !reportDates.end) {
        setMessage('እባክዎ መነሻ እና መድረሻ ቀን ያስገቡ (Please select start and end dates)');
        return;
    }
    setIsGenerating(true);
    setMessage('');

    try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL 
            ? `${import.meta.env.VITE_API_BASE_URL}/api/ontime-reg/reports` 
            : '/api/ontime-reg/reports';
            
        const res = await axios.get(apiUrl, {
            params: {
                woreda: officerInfo.woreda,
                hospitalName: officerInfo.hospitalName,
                startDate: reportDates.start,
                endDate: reportDates.end
            }
        });
        
        const data = res.data;
        if (data.length === 0) {
            setMessage('በተመረጠው ቀን ምንም መረጃ የለም (No records found for selected dates)');
            setIsGenerating(false);
            return;
        }

        const services = ['ልደት', 'ሞት', 'ፍቺ'];
        const aggregated = {};
        services.forEach(s => aggregated[s] = {});
        
        data.forEach(item => {
            const sName = item.serviceName;
            if (!aggregated[sName]) return;
            const dateStr = new Date(item.date).toISOString().split('T')[0];
            
            if (!aggregated[sName][dateStr]) {
                aggregated[sName][dateStr] = { male: 0, female: 0, total: 0 };
            }
            
            if (item.gender === 'ወንድ') aggregated[sName][dateStr].male += 1;
            else if (item.gender === 'ሴት') aggregated[sName][dateStr].female += 1;
            aggregated[sName][dateStr].total += 1;
        });

        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Daily Report Summary', 14, 20);
        
        doc.setFontSize(12);
        doc.text(`Woreda: ${officerInfo.woreda}`, 14, 28);
        
        let currentY = 36;
        if (officerInfo.hospitalName) {
            doc.text(`Hospital: ${officerInfo.hospitalName}`, 14, 34);
            doc.text(`Date Range: ${reportDates.start} to ${reportDates.end}`, 14, 40);
            currentY = 46;
        } else {
            doc.text(`Date Range: ${reportDates.start} to ${reportDates.end}`, 14, 34);
        }

        // Add a helper for English titles
        const serviceNames_EN = {
            'ልደት': 'Birth Registration',
            'ሞት': 'Death Registration',
            'ፍቺ': 'Divorce Registration'
        };
        
        let hasData = false;
        services.forEach(s => {
            const tableData = [];
            for (const date in aggregated[s]) {
                tableData.push([
                    date,
                    aggregated[s][date].male,
                    aggregated[s][date].female,
                    aggregated[s][date].total
                ]);
            }
            // Sort by Date
            tableData.sort((a,b) => a[0].localeCompare(b[0]));
            
            if (tableData.length > 0) {
                hasData = true;
                doc.setFontSize(14);
                // jsPDF default font doesn't support Amharic well, so we use English fallback
                doc.text(`Service: ${serviceNames_EN[s] || s}`, 14, currentY);
                currentY += 5;
                
                doc.autoTable({
                    startY: currentY,
                    head: [['Date', 'Male', 'Female', 'Total']],
                    body: tableData,
                    theme: 'grid',
                    headStyles: { fillColor: [41, 128, 185] },
                    styles: { font: 'helvetica' }
                });
                currentY = doc.lastAutoTable.finalY + 15;
                
                if (currentY > 250) {
                    doc.addPage();
                    currentY = 20;
                }
            }
        });

        if (!hasData) {
            doc.text('No actual breakdown data matched criteria.', 14, currentY);
        }
        
        doc.save(`DailyReport_${officerInfo.woreda}_${reportDates.start}_${reportDates.end}.pdf`);
        setMessage('በተሳካ ሁኔታ ሪፖርት ተፈጥሯል (Report generated successfully)!');

    } catch (error) {
        console.error('Error generating report:', error);
        setMessage('ስህተት ተፈጥሯል (Error occurred while generating report).');
    } finally {
        setIsGenerating(false);
    }
  };

  if (!officerInfo) return null;

  // Mobile-Optimized Header
  const OfficerNavbar = () => (
      <nav className="flex justify-between items-center bg-white shadow-sm p-3 mb-4 rounded-b-2xl md:rounded-2xl border-b md:border border-gray-100 -mx-4 md:mx-0">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md">
                  {officerInfo.fullName?.charAt(0).toUpperCase() || 'O'}
              </div>
              <div className="flex flex-col">
                  <h3 className="font-black text-gray-900 leading-tight text-sm md:text-lg truncate max-w-[150px] md:max-w-none">
                    {officerInfo.fullName}
                  </h3>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">
                    {officerInfo.woreda} Woreda
                  </span>
              </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1 font-bold text-xs"
          >
              Logout
              <span className="text-lg">🚪</span>
          </button>
      </nav>
  );

  const StatCard = ({ title, value, icon, colorClass }) => (
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className={`p-2.5 md:p-3 rounded-xl ${colorClass} bg-opacity-10 mb-2 md:mb-3`}>
              <span className={`text-xl md:text-2xl ${colorClass.replace('bg-', 'text-')}`}>{icon}</span>
          </div>
          <span className="text-xl md:text-3xl font-black text-gray-900">{value}</span>
          <h4 className="text-gray-400 text-[10px] md:text-xs font-black uppercase tracking-widest mt-1">{title}</h4>
      </div>
  );

  const RecentActivityMobile = () => (
    <div className="space-y-3 mt-4">
        {stats.recent && stats.recent.length > 0 ? (
            stats.recent.map((rpt) => (
                <div key={rpt._id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                            rpt.serviceName === 'ልደት' ? 'bg-green-50 text-green-600' :
                            rpt.serviceName === 'ሞት' ? 'bg-gray-50 text-gray-600' : 'bg-red-50 text-red-600'
                        }`}>
                            {rpt.serviceName === 'ልደት' ? '👶' : rpt.serviceName === 'ሞት' ? '⚰️' : '💔'}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-mono font-black text-gray-900 text-sm">{rpt.referenceNumber}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{rpt.serviceName} • {rpt.gender}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-black text-green-600 uppercase">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Synced
                    </div>
                </div>
            ))
        ) : (
            <div className="text-center py-8 text-gray-400 font-bold text-sm bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                No recent activity.
            </div>
        )}
    </div>
  );

  if (!selectedType) {
    return (
      <div className="min-h-screen bg-[#f8fbff] px-4 pb-8">
        <div className="max-w-5xl mx-auto">
            <OfficerNavbar />
            
            {/* Stats Grid - 2x2 on mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-2">
                <StatCard title="Total" value={stats.total} icon="📊" colorClass="bg-blue-500" />
                <StatCard title="Today" value={stats.today} icon="📅" colorClass="bg-green-500" />
                <StatCard title="Births" value={stats.byService['ልደት'] || 0} icon="👶" colorClass="bg-purple-500" />
                <StatCard title="Deaths" value={stats.byService['ሞት'] || 0} icon="⚰️" colorClass="bg-gray-600" />
            </div>

            <div className="mt-8 mb-4">
                <h2 className="text-lg md:text-2xl font-black text-gray-900">Registration</h2>
                <p className="text-gray-500 text-xs md:text-sm font-medium">Select a category to record data.</p>
            </div>
            
            {/* Service Buttons - Improved for Touch */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                <button 
                    className="flex items-center p-4 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all active:scale-[0.98]"
                    onClick={() => handleTypeSelect('ልደት')}
                >
                    <div className="w-14 h-14 bg-green-100 text-green-600 flex items-center justify-center rounded-2xl text-2xl mr-4 shadow-inner">👶</div>
                    <div className="text-left">
                        <h3 className="font-black text-gray-900 text-lg">ልደት</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Birth Registration</p>
                    </div>
                </button>

                <button 
                    className="flex items-center p-4 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all active:scale-[0.98]"
                    onClick={() => handleTypeSelect('ሞት')}
                >
                    <div className="w-14 h-14 bg-gray-200 text-gray-600 flex items-center justify-center rounded-2xl text-2xl mr-4 shadow-inner">⚰️</div>
                    <div className="text-left">
                        <h3 className="font-black text-gray-900 text-lg">ሞት</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Death Registration</p>
                    </div>
                </button>

                <button 
                    className="flex items-center p-4 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all active:scale-[0.98]"
                    onClick={() => handleTypeSelect('ፍቺ')}
                >
                    <div className="w-14 h-14 bg-red-100 text-red-600 flex items-center justify-center rounded-2xl text-2xl mr-4 shadow-inner">💔</div>
                    <div className="text-left">
                        <h3 className="font-black text-gray-900 text-lg">ፍቺ</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Divorce Registration</p>
                    </div>
                </button>
            </div>

            {/* Daily Report Generation */}
            <div className="mt-10 bg-white p-5 md:p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex flex-col mb-4">
                    <h3 className="font-black text-gray-900 text-lg">Daily PDF Report</h3>
                    <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest">Select date range to generate aggregate report</p>
                </div>
                
                {message && !selectedType && (
                    <div className={`p-3 rounded-xl mb-4 text-xs font-bold flex items-center gap-2 ${
                        message.includes('Error') || message.includes('No records') || message.includes('እባክዎ') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                    }`}>
                        {message}
                    </div>
                )}
                
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1 mb-1 block">Start Date</label>
                        <input 
                            type="date" 
                            className="w-full bg-gray-50 border border-gray-200 p-3 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-gray-700"
                            value={reportDates.start}
                            onChange={(e) => setReportDates({...reportDates, start: e.target.value})}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1 mb-1 block">End Date</label>
                        <input 
                            type="date" 
                            className="w-full bg-gray-50 border border-gray-200 p-3 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-gray-700"
                            value={reportDates.end}
                            onChange={(e) => setReportDates({...reportDates, end: e.target.value})}
                        />
                    </div>
                    <div className="flex-1 flex items-end">
                        <button 
                            onClick={generatePDFReport}
                            disabled={isGenerating}
                            className={`w-full text-white font-black p-3 rounded-2xl md:h-[50px] shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
                                isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 shadow-gray-200'
                            }`}
                        >
                            {isGenerating ? 'Generating...' : 'Download PDF 📄'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Activity - Mobile Card View */}
            <div className="mt-10">
                <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="font-black text-gray-900 text-lg">Recent Reports</h3>
                    <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">Live</span>
                </div>
                <RecentActivityMobile />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 p-4 flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl text-gray-600 text-xl" onClick={() => setSelectedType(null)}>←</button>
        <div className="flex flex-col">
            <h2 className="text-lg font-black text-gray-900">{selectedType} መመዝገቢያ</h2>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">New Entry Form</span>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {message && (
            <div className={`p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-3 animate-bounce ${
                message.includes('Error') || message.includes('exists') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'
            }`}>
                <span className="text-xl">{message.includes('Error') ? '❌' : '✅'}</span>
                {message}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="bg-gray-50/50 p-5 rounded-[2rem] border border-gray-100 space-y-5">
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-black text-gray-700 ml-1">Reg. Date</label>
                        <input 
                            type="date" 
                            name="date" 
                            value={formData.date} 
                            onChange={handleChange} 
                            className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-gray-800"
                            required 
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-black text-gray-700 ml-1">Reference Number</label>
                        <input
                            type="text"
                            name="referenceNumber"
                            value={formData.referenceNumber}
                            onChange={handleChange}
                            required
                            placeholder=""
                            className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-black text-gray-700 ml-1">Gender</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className={`p-4 rounded-2xl border-2 transition-all font-black flex items-center justify-center gap-2 ${
                                    formData.gender === 'ወንድ' ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-500'
                                }`}
                                onClick={() => setFormData({...formData, gender: 'ወንድ'})}
                            >
                                👨 ወንድ
                            </button>
                            <button
                                type="button"
                                className={`p-4 rounded-2xl border-2 transition-all font-black flex items-center justify-center gap-2 ${
                                    formData.gender === 'ሴት' ? 'bg-pink-500 border-pink-500 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-500'
                                }`}
                                onClick={() => setFormData({...formData, gender: 'ሴት'})}
                            >
                                👩 ሴት
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-5 bg-blue-50/30 rounded-[2rem] border border-blue-100 space-y-4">
                    <div className="flex flex-col">
                        <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1 mb-1">Registration Woreda</label>
                        <span className="text-lg font-black text-gray-800 ml-1">{formData.woreda}</span>
                    </div>

                    {(selectedType === 'ልደት' || selectedType === 'ሞት') && (
                        <div className="flex flex-col">
                            <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1 mb-1">Health Facility</label>
                            <span className="text-lg font-black text-gray-800 ml-1">{formData.hospitalName || 'Not Assigned'}</span>
                        </div>
                    )}

                    {selectedType === 'ፍቺ' && (
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-black text-gray-700 ml-1">Court Name</label>
                            <input
                                type="text"
                                name="courtName"
                                value={formData.courtName}
                                onChange={handleChange}
                                placeholder="Enter Court Name"
                                className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-gray-800"
                            />
                        </div>
                    )}
                </div>
            </div>

            <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black py-5 rounded-3xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                disabled={loading}
            >
                {loading ? (
                    <span className="flex items-center gap-2 animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        Registering...
                    </span>
                ) : (
                    <>
                        Complete Registration
                        <span className="text-xl">✨</span>
                    </>
                )}
            </button>
            
            <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Secured Mobile Entry Portal
            </p>
        </form>
      </div>
    </div>
  );
};

export default RemoteEntry;
