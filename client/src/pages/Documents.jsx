import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiFileDownloadLine, RiFilePdfLine, RiFileTextLine, RiEyeLine, RiCloseLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/documents`);
        setDocuments(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  if (loading) return <div className="text-center py-20">Loading Documents...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <SEO 
        title="Documents & Guidelines" 
        description="Download and view official documents, forms, and residency guidelines from Addis Ketema Subcity CRRSA."
        keywords="CRRSA Documents, Residency Forms, Ethiopia Civil Registration Guidelines"
      />
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
            <p className="text-secondary font-bold uppercase tracking-wider mb-2">ማህደር</p>
            <h1 className="text-4xl text-primary font-serif font-bold">ሰነዶች እና መመሪያዎች</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents.length === 0 ? (
                <div className="col-span-2 text-center text-gray-500">ምንም ሰነዶች አልተገኙም።</div>
            ) : (
                documents.map((doc) => (
                    <div key={doc._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                        <div className="p-3 bg-blue-50 text-primary rounded-lg">
                            {doc.fileUrl.endsWith('.pdf') ? <RiFilePdfLine size={32} /> : <RiFileTextLine size={32} />}
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{doc.title}</h3>
                            <span className="text-xs font-bold text-secondary uppercase bg-blue-50 px-2 py-1 rounded inline-block mb-3">
                                {doc.category}
                            </span>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{doc.description}</p>
                            
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setSelectedDoc(doc)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded hover:bg-secondary transition-colors"
                                >
                                    <RiEyeLine size={18} /> Read Online
                                </button>
                                <a 
                                    href={doc.fileUrl.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${doc.fileUrl}` : doc.fileUrl} 
                                    download
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-bold rounded hover:bg-gray-50 transition-colors"
                                >
                                    <RiFileDownloadLine size={18} /> Download
                                </a>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>

      {/* Document Viewer Modal */}
      <AnimatePresence>
        {selectedDoc && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
                onClick={() => setSelectedDoc(null)}
            >
                <motion.div 
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.95 }}
                    className="bg-white w-full max-w-5xl h-[85vh] rounded-lg shadow-2xl flex flex-col overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center p-4 border-b">
                        <h3 className="text-lg font-bold text-gray-800">{selectedDoc.title}</h3>
                        <button onClick={() => setSelectedDoc(null)} className="text-gray-500 hover:text-red-500">
                            <RiCloseLine size={24} />
                        </button>
                    </div>
                    <div className="flex-grow bg-gray-100 p-1">
                        <iframe 
                            src={selectedDoc.fileUrl.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${selectedDoc.fileUrl}` : selectedDoc.fileUrl} 
                            title={selectedDoc.title}
                            className="w-full h-full border-0"
                        />
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Documents;
