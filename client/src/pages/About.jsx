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
        {/* Updated for strict single-line tree structure */}
        <section className="mt-20 overflow-x-auto pb-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">የጽ/ቤቱ መዋቅር</h2>
            <div className="w-24 h-1 bg-secondary mx-auto"></div>
          </div>

          <div className="flex flex-col items-center min-w-max px-8">
            {/* 1. Head (Root) */}
            {heads.map(person => (
              <div key={person._id} className="relative flex flex-col items-center z-10">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-primary/10 w-64 group hover:-translate-y-1 transition-transform duration-300 relative z-20">
                  <div className="h-64 overflow-hidden relative">
                    <img 
                      src={person.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${person.image}` : person.image}
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                       <span className="text-white font-bold text-sm tracking-widest uppercase">የጽ/ቤት ሀላፊ</span>
                    </div>
                  </div>
                  <div className="p-4 text-center bg-white">
                    <h3 className="text-xl font-bold text-gray-800">{person.name}</h3>
                    <p className="text-primary font-medium text-xs uppercase tracking-wide mt-1">{person.position}</p>
                  </div>
                </div>
                {/* Connector Down from Head */}
                {leaders.length > 0 && <div className="w-0.5 h-16 bg-gray-400"></div>}
              </div>
            ))}

            {/* 2. Team Leaders (Children) - Strict Single Line */}
            {leaders.length > 0 && (
              <div className="relative flex justify-center gap-12">
                 {/* 
                     Connector Logic: 
                     We draw a single horizontal line that spans from the center of the first child 
                     to the center of the last child.
                     Since dimensions are fixed (w-48 = 12rem), the center is 6rem.
                 */}
                 {leaders.length > 1 && (
                     <div className="absolute top-0 h-0.5 bg-gray-400" 
                          style={{
                              left: '6rem', // Center of first card
                              right: '6rem' // Center of last card
                          }}
                     ></div>
                 )}

                {leaders.map((person, index) => (
                  <div key={person._id} className="flex flex-col items-center relative">
                    {/* Vertical Line Connection to the Horizontal Bar */}
                    <div className="w-0.5 h-8 bg-gray-400"></div>
                    
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 w-48 group hover:shadow-xl transition-shadow relative z-20">
                      <div className="h-48 overflow-hidden bg-gray-100 relative">
                         <img 
                          src={person.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${person.image}` : person.image}
                          alt={person.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-3 text-center border-t border-gray-100">
                        <h4 className="text-sm font-bold text-gray-800">{person.name}</h4>
                        <p className="text-xs text-secondary font-medium mt-1 line-clamp-2">{person.position}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. General Staff Grid */}
          {members.length > 0 && (
            <div className="mt-24 pt-12 border-t border-gray-100 container mx-auto px-4">
               <div className="text-center mb-10">
                <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">General Staff</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {members.map(person => (
                  <div key={person._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center group">
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-3 border-2 border-gray-100 group-hover:border-primary/30 transition-colors">
                      <img 
                        src={person.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${person.image}` : person.image}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h5 className="font-bold text-gray-800 text-sm">{person.name}</h5>
                    <p className="text-xs text-gray-500 mt-1">{person.position}</p>
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
