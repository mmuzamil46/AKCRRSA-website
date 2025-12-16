import React, { useState, useEffect } from 'react';
import axios from 'axios';

const About = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/about`);
        setContent(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!content) return <div className="min-h-screen flex items-center justify-center">No content available</div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-primary flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={content.heroImage.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${content.heroImage}` : content.heroImage} 
            alt="About" 
            className="w-full h-full object-cover opacity-30" 
          />
        </div>
        <div className="relative z-10 text-center text-white p-4">
          <h1 className="text-5xl font-serif font-bold mb-4">{content.title}</h1>
          <p className="text-xl max-w-2xl mx-auto">{content.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg mx-auto text-gray-700">
          <h2 className="text-3xl text-primary font-bold mb-6">ማን ነን?</h2>
          <p className="whitespace-pre-wrap">{content.mainContent}</p>
          
          <div className="bg-accent p-8 rounded-xl my-8 border-l-4 border-primary">
            <h3 className="text-2xl font-bold text-primary mb-4">ራዕይ</h3>
            <p className="whitespace-pre-wrap">{content.vision}</p>

            <h3 className="text-2xl font-bold text-primary mt-6 mb-4">ተልዕኮ</h3>
            <p className="whitespace-pre-wrap">{content.mission}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
