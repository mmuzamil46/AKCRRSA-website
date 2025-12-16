import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiStarFill, RiStarLine, RiSendPlaneFill } from 'react-icons/ri';
import { motion } from 'framer-motion';

const Feedback = () => {
  const [services, setServices] = useState([]);
  const [woredas, setWoredas] = useState([]);
  const [formData, setFormData] = useState({
    serviceType: '',
    woredaOffice: '',
    rating: 0,
    comment: '',
    userName: '',
    userEmail: ''
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, woredasRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/services`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/woredas`)
      ]);
      setServices(servicesRes.data);
      setWoredas(woredasRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      alert('እባክዎ ደረጃ ይስጡ (Please provide a rating)');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/feedback`, formData);
      setSuccessMessage('አስተያየትዎ በተሳካ ሁኔታ ተልኳል! (Your feedback has been submitted successfully!)');
      setFormData({
        serviceType: '',
        woredaOffice: '',
        rating: 0,
        comment: '',
        userName: '',
        userEmail: ''
      });
      setTimeout(() => setSuccessMessage(''), 5000);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      alert('ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ። (Error occurred. Please try again.)');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type={interactive ? 'button' : undefined}
        onClick={interactive ? () => setFormData({ ...formData, rating: star }) : undefined}
        onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''}
        disabled={!interactive}
      >
        {star <= (interactive ? (hoverRating || formData.rating) : rating) ? (
          <RiStarFill className="text-yellow-400" size={interactive ? 32 : 20} />
        ) : (
          <RiStarLine className="text-gray-300" size={interactive ? 32 : 20} />
        )}
      </button>
    ));
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-secondary font-bold uppercase tracking-wider mb-2">አስተያየት</p>
          <h1 className="text-4xl text-primary font-serif font-bold mb-4">የአገልግሎት ግምገማ</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            የተቀበሉትን አገልግሎት በተመለከተ አስተያየትዎን እና ደረጃዎን ያካፍሉ። አስተያየትዎ አገልግሎታችንን ለማሻሻል ይረዳናል።
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Feedback Form */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">አስተያየት ያስገቡ</h2>
            
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">የአገልግሎት አይነት *</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  required
                >
                  <option value="">ይምረጡ...</option>
                  {services.map((service) => (
                    <option key={service._id} value={service.title}>{service.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ወረዳ/ቢሮ *</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={formData.woredaOffice}
                  onChange={(e) => setFormData({ ...formData, woredaOffice: e.target.value })}
                  required
                >
                  <option value="">ይምረጡ...</option>
                  <option value="ዋና ቢሮ">ዋና ቢሮ (Main Office)</option>
                  {woredas.map((woreda) => (
                    <option key={woreda._id} value={woreda.name}>{woreda.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ደረጃ *</label>
                <div className="flex gap-2">
                  {renderStars(formData.rating, true)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">አስተያየት *</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="የአገልግሎቱን ጥራት፣ ፍጥነት እና ሌሎች ልምዶችዎን ያካፍሉ..."
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ስም (አማራጭ)</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    placeholder="ሙሉ ስም"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ኢሜይል (አማራጭ)</label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.userEmail}
                    onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RiSendPlaneFill size={20} />
                {submitting ? 'በመላክ ላይ...' : 'አስተያየት ላክ'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
