import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiSendPlaneFill, RiStarFill, RiChatSmile2Line } from 'react-icons/ri';
import { motion } from 'framer-motion';

const Feedback = () => {
    const [formData, setFormData] = useState({
      userName: '',
      phone: '',
      serviceType: 'Civil Registration',
      woredaOffice: 'Other',
      rating: 5,
      comment: ''
    });
  const [woredas, setWoredas] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch Options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [wRes, sRes] = await Promise.all([
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/woredas`),
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/services`)
        ]);
        setWoredas(wRes.data);
        setServices(sRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/feedback`, formData);
      setSuccess(true);
      setFormData({ userName: '', phone: '', serviceType: 'Civil Registration', woredaOffice: 'Other', rating: 5, comment: '' });
    } catch (err) {
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <RiChatSmile2Line className="text-6xl text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-serif font-bold text-gray-800">ሀሳብ አስተያየትዎ ዋጋ አለው!</h1>
          <p className="text-gray-600 mt-2">ሀሳብ አስተያየት አልያም ቅሬታዎን በዚህ በኩል ያድርሱን</p>
        </div>

        {success ? (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-green-100 border border-green-400 text-green-700 px-4 py-8 rounded-lg text-center shadow-lg">
            <h3 className="text-2xl font-bold mb-2">እናመሰግናልን!</h3>
            <p>ሀሳብ አስተያየትዎ ደርሶናል!</p>
            <button onClick={() => setSuccess(false)} className="mt-4 underline">Submit another</button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 space-y-6">
            
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ስም (ከፈለጉ)</label>
                <input 
                  type="text" 
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                  placeholder="John Doe"
                  value={formData.userName}
                  onChange={e => setFormData({...formData, userName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ስልክ ቁጥር (ከፈለጉ)</label>
                <input 
                  type="tel" 
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                  placeholder="0911234567"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            {/* Service & Woreda */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ያገኙት አገልግሎት</label>
                <select 
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
                  value={formData.serviceType}
                  onChange={e => setFormData({...formData, serviceType: e.target.value})}
                >
                  <option>Civil Registration</option>
                  <option>Vital Events</option>
                  {services.map(s => <option key={s._id} value={s.title}>{s.title}</option>)}
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">አገልግሎት ያገኙበት ቢሮ</label>
                <select 
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
                  value={formData.woredaOffice}
                  onChange={e => setFormData({...formData, woredaOffice: e.target.value})}
                >
                  <option>ክፍለ ከተማ</option>
                  {woredas.map(w => <option key={w._id} value={w.name}>{w.name}</option>)}
                  
                </select>
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">ደረጃ ይስጡ</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    type="button" 
                    key={star}
                    onClick={() => setFormData({...formData, rating: star})}
                    className={`text-3xl transition-transform hover:scale-110 ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <RiStarFill />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">አስተያየት / ጥቆማ</label>
              <textarea 
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none h-32 resize-none"
                placeholder="ያዩትን የተሰማዎትን ያገሩን..."
                required
                value={formData.comment}
                onChange={e => setFormData({...formData, comment: e.target.value})}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-secondary transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-xl"
            >
              {loading ? 'Submitting...' : <><RiSendPlaneFill /> ይላኩ</>}
            </button>

          </form>
        )}
      </div>
    </div>
  );
};

export default Feedback;
