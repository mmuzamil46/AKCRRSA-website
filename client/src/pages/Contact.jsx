import React, { useState } from 'react';
import { RiMapPinFill, RiPhoneFill, RiMailFill, RiSendPlaneFill } from 'react-icons/ri';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/contact`, formData);
      setSuccessMessage('መልእክትዎ በተሳካ ሁኔታ ተልኳል! በቅርቡ እናገኝዎታለን። (Your message has been sent successfully! We will contact you soon.)');
      setFormData({ name: '', phone: '', message: '' });
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setErrorMessage('ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ። (Error occurred. Please try again.)');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl text-primary font-serif font-bold mb-12 text-center">ያግኙን</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="bg-white p-8 rounded-2xl shadow-lg h-full">
            <h2 className="text-2xl font-bold text-primary mb-8">አድራሻ</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary text-2xl flex-shrink-0">
                  <RiMapPinFill />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">አካባቢ</h3>
                  <p className="text-gray-600">
                    አዲስ ከተማ ክፍለ ከተማ አስተዳደር ህንጻ፤ ከመድሀኒያለም ት/ቤት ወደ መሳለሚያ በሚወስደው መንገድ ከራስ ሀይሉ ስፖርት ማዕከል ጎን።
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary text-2xl flex-shrink-0">
                  <RiPhoneFill />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">ስልክ</h3>
                  <p className="text-gray-600">+251 112 590 992</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary text-2xl flex-shrink-0">
                  <RiMailFill />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">ኢሜይል</h3>
                  <p className="text-gray-600">addisketemawosagnkunete@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-6">መልእክት ይላኩልን</h2>
            
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">ሙሉ ስም *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">ስልክ ቁጥር *</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">መልእክት *</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded h-32 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  required
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white font-bold py-3 rounded hover:bg-secondary transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RiSendPlaneFill size={20} />
                {submitting ? 'በመላክ ላይ...' : 'ላክ'}
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 bg-white p-4 rounded-2xl shadow-lg">
          <div className="w-full h-[400px] rounded-xl overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15761.543209564223!2d38.71186701104692!3d9.02844572235282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85f269553f4d%3A0x6b8405523a637504!2sAddis%20Ketema%2C%20Addis%20Ababa!5e0!3m2!1sen!2set!4v1702905000000!5m2!1sen!2set" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
