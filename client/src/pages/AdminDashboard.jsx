import React, { useState, useEffect } from 'react';
import { 
  RiDashboardLine, RiArticleLine, RiServiceLine, RiMapPinUserLine, RiMessage2Line, RiLogoutBoxLine,
  RiImage2Line, RiNotification3Line, RiFileTextLine, RiMailFill, RiMenuLine, RiCloseLine, RiShareLine
} from 'react-icons/ri';
import { FaUserTie } from 'react-icons/fa';

import { Link, useNavigate } from 'react-router-dom';
import AdminNewsManager from './admin/AdminNewsManager';
import AdminServicesManager from './admin/AdminServicesManager';
import AdminWoredasManager from './admin/AdminWoredasManager';
import AdminBannerManager from './admin/AdminBannerManager';
import AdminAnnouncementManager from './admin/AdminAnnouncementManager';
import AdminDocumentManager from './admin/AdminDocumentManager';
import AdminFeedbackManager from './admin/AdminFeedbackManager';
import AdminContactManager from './admin/AdminContactManager';
import AdminAboutEditor from './admin/AdminAboutEditor';
import AdminGalleryManager from './admin/AdminGalleryManager';
import AdminManagerMessage from './admin/AdminManagerMessage';
import AdminSocialManager from './admin/AdminSocialManager';
import AdminSubcityDataManager from './admin/AdminSubcityDataManager';


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <DashboardHome />;
      case 'news':
        return <AdminNewsManager />;
      case 'services':
        return <AdminServicesManager />;
      case 'woredas':
        return <AdminWoredasManager />;
      case 'banners':
        return <AdminBannerManager />;
      case 'announcements':
        return <AdminAnnouncementManager />;
      case 'documents':
        return <AdminDocumentManager />;
      case 'feedback':
        return <AdminFeedbackManager />;
      case 'contact':
        return <AdminContactManager />;
      case 'about':
        return <AdminAboutEditor />;
      case 'gallery':
        return <AdminGalleryManager />;
      case 'manager':
        return <AdminManagerMessage />;
      case 'social':
        return <AdminSocialManager />;
      case 'subcity-data':
        return <AdminSubcityDataManager />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-primary text-white p-4 flex items-center justify-between z-50">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-primary text-white flex flex-col overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 text-2xl font-serif font-bold border-b border-white/10 hidden lg:block">
          Admin Panel
        </div>
        <nav className="flex-grow p-4 space-y-2 mt-16 lg:mt-0">
          <SidebarItem icon={<RiDashboardLine />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => handleTabChange('dashboard')} />
          <SidebarItem icon={<FaUserTie />} label="Manager Message" active={activeTab === 'manager'} onClick={() => handleTabChange('manager')} />
          <SidebarItem icon={<RiArticleLine />} label="News" active={activeTab === 'news'} onClick={() => handleTabChange('news')} />
          <SidebarItem icon={<RiServiceLine />} label="Services" active={activeTab === 'services'} onClick={() => handleTabChange('services')} />
          <SidebarItem icon={<RiMapPinUserLine />} label="Woredas" active={activeTab === 'woredas'} onClick={() => handleTabChange('woredas')} />
          <SidebarItem icon={<RiInformationLine />} label="Subcity Data" active={activeTab === 'subcity-data'} onClick={() => handleTabChange('subcity-data')} />
          <div className="border-t border-white/10 my-2 pt-2 text-xs text-gray-400 font-bold px-4">Extras</div>
          <SidebarItem icon={<RiImage2Line />} label="Banners" active={activeTab === 'banners'} onClick={() => handleTabChange('banners')} />
          <SidebarItem icon={<RiNotification3Line />} label="Announcements" active={activeTab === 'announcements'} onClick={() => handleTabChange('announcements')} />
          <SidebarItem icon={<RiFileTextLine />} label="Documents" active={activeTab === 'documents'} onClick={() => handleTabChange('documents')} />
          <SidebarItem icon={<RiMessage2Line />} label="Feedback" active={activeTab === 'feedback'} onClick={() => handleTabChange('feedback')} />
          <SidebarItem icon={<RiMailFill />} label="Contact Messages" active={activeTab === 'contact'} onClick={() => handleTabChange('contact')} />
          <SidebarItem icon={<RiArticleLine />} label="About Page" active={activeTab === 'about'} onClick={() => handleTabChange('about')} />
          <SidebarItem icon={<RiImage2Line />} label="Gallery" active={activeTab === 'gallery'} onClick={() => handleTabChange('gallery')} />
          <SidebarItem icon={<RiShareLine />} label="Social Media" active={activeTab === 'social'} onClick={() => handleTabChange('social')} />
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded hover:bg-white/10 transition-colors">
            <RiLogoutBoxLine size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
        <div className="p-4 md:p-6 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-4 py-3 rounded transition-colors ${
      active ? 'bg-white/20 font-bold' : 'hover:bg-white/10'
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="text-sm">{label}</span>
  </button>
);

const DashboardHome = () => (
  <div className="bg-white rounded-lg shadow p-4 md:p-6">
    <h2 className="text-xl md:text-2xl font-bold mb-4">Welcome to Admin Dashboard</h2>
    <p className="text-gray-600 text-sm md:text-base">Select a section from the sidebar to manage your website content.</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      <StatCard title="Quick Access" value="Use sidebar" color="bg-blue-500" />
      <StatCard title="Mobile Ready" value="Manage anywhere" color="bg-green-500" />
      <StatCard title="Easy to Use" value="Simple interface" color="bg-purple-500" />
    </div>
  </div>
);

const StatCard = ({ title, value, color }) => (
  <div className={`${color} text-white p-4 md:p-6 rounded-lg shadow`}>
    <h3 className="text-xs md:text-sm font-bold opacity-90">{title}</h3>
    <p className="text-lg md:text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default AdminDashboard;
