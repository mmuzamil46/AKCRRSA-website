import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SEO from '../components/SEO';

const About = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentRes, staffRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/about`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/staff`)
        ]);
        setContent(contentRes.data);
        setStaff(staffRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!content) return <div className="min-h-screen flex items-center justify-center">No content available</div>;

  // Filter staff by role
  const heads = staff.filter(s => s.role === 'head');
  const leaders = staff.filter(s => s.role === 'team_leader');
  const members = staff.filter(s => s.role === 'staff');

  return (
    <div className="bg-white min-h-screen">
      <SEO 
        title="About Us" 
        description="Learn about the mission, vision, and role of the Addis Ketema Subcity Civil Registration and Residency Service Agency (AKCRRSA)."
        keywords="About CRRSA, Addis Ketema Civil Registration, Residency Service Mission"
      />
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

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="prose prose-lg mx-auto text-gray-700 mb-16 max-w-4xl">
          <h2 className="text-3xl text-primary font-bold mb-6">ማን ነን?</h2>
          <p className="whitespace-pre-wrap">{content.mainContent}</p>
          
          <div className="bg-accent p-8 rounded-xl my-8 border-l-4 border-primary">
            <h3 className="text-2xl font-bold text-primary mb-4">ራዕይ</h3>
            <p className="whitespace-pre-wrap">{content.vision}</p>

            <h3 className="text-2xl font-bold text-primary mt-6 mb-4">ተልዕኮ</h3>
            <p className="whitespace-pre-wrap">{content.mission}</p>
          </div>
        </div>

        {/* Staff Hierarchy Section */}
        <section className="mt-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">የጽ/ቤቱ መዋቅር</h2>
            <div className="w-24 h-1 bg-secondary mx-auto"></div>
          </div>

          {/* 1. Heads Section */}
          {heads.length > 0 && (
            <div className="flex justify-center mb-16">
              {heads.map(person => (
                <div key={person._id} className="relative group">
                  <div className="bg-white rounded-xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 border-2 border-primary/10 max-w-sm">
                    <div className="relative h-64 w-64 md:h-80 md:w-80 overflow-hidden">
                      <img 
                        src={person.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${person.image}` : person.image}
                        alt={person.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                        <span className="text-white font-bold tracking-wider uppercase">Lead Agency</span>
                      </div>
                    </div>
                    <div className="p-6 text-center bg-white relative z-10">
                      <h3 className="text-2xl font-bold text-gray-800 mb-1">{person.name}</h3>
                      <p className="text-primary font-medium uppercase tracking-wide text-sm">{person.position}</p>
                    </div>
                  </div>
                  {/* Connector Line Logic (Visual Only) */}
                  <div className="hidden md:block absolute top-full left-1/2 w-0.5 h-16 bg-gray-300 -translate-x-1/2 z-0"></div>
                </div>
              ))}
            </div>
          )}

          {/* 2. Team Leaders Section */}
          {leaders.length > 0 && (
            <div className="relative pt-8">
              {/* Horizontal Connecting Line */}
              {heads.length > 0 && <div className="hidden md:block absolute top-0 left-1/4 right-1/4 h-0.5 bg-gray-300"></div>}
              
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-500 uppercase tracking-widest">Team Leaders</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {leaders.map(person => (
                  <div key={person._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 w-full max-w-xs group border border-gray-100">
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                      <img 
                        src={person.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${person.image}` : person.image}
                        alt={person.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 text-center border-t border-primary/5">
                      <h4 className="text-lg font-bold text-gray-800">{person.name}</h4>
                      <p className="text-sm text-secondary font-medium mt-1">{person.position}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Other Staff Section (Optional) */}
          {members.length > 0 && (
            <div className="mt-16 pt-16 border-t border-gray-200">
               <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-500 uppercase tracking-widest">Our Staff</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {members.map(person => (
                  <div key={person._id} className="text-center group">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-gray-100 group-hover:border-primary/20 transition-colors shadow-sm">
                      <img 
                        src={person.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${person.image}` : person.image}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h5 className="font-bold text-gray-800">{person.name}</h5>
                    <p className="text-xs text-gray-500 uppercase">{person.position}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default About;
