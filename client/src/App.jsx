import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import Woredas from './pages/Woredas';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Documents from './pages/Documents';
import Feedback from './pages/Feedback';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import SubcityData from './pages/SubcityData';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SocialSidebar from './components/SocialSidebar';
import ChatWidget from './components/ChatWidget';

import RemoteEntry from './pages/RemoteEntry';
import OfficerLogin from './pages/OfficerLogin';
import FlipbookDemo from './pages/FlipbookDemo';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        <Routes>
          {/* Admin Routes - No Navbar/Footer */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/officer-login" element={<OfficerLogin />} />
          <Route path="/remote-entry" element={<RemoteEntry />} />
          <Route path="/award" element={<FlipbookDemo />} />

          {/* Public Routes - With Navbar/Footer */}
          <Route path="*" element={
            <>
              <Navbar />
              <SocialSidebar />
              <ChatWidget />
              <main className="flex-grow pt-[72px]">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/news/:id" element={<NewsDetail />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/woredas" element={<Woredas />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/subcity-data" element={<SubcityData />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
