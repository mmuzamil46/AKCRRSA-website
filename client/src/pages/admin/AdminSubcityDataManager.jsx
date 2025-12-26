import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiSaveLine, RiInformationLine } from 'react-icons/ri';
import { toast } from 'react-hot-toast';

const AdminSubcityDataManager = () => {
    const [stats, setStats] = useState({
        totalPopulation: 737740,
        totalArea: '7.41 km²',
        totalWoredas: 12,
        description: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const token = localStorage.getItem('adminToken');
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/subcity-data`);
                if (res.data.stats) {
                    setStats(res.data.stats);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/subcity-data/stats`, stats, config);
            toast.success('Stats updated successfully');
        } catch (err) {
            toast.error('Error updating stats');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6">Loading stats...</div>;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
                <RiInformationLine className="text-3xl text-primary" />
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">Subcity General Data</h3>
                    <p className="text-gray-500 text-sm">Update the high-level statistics shown on the public dashboard.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Total Population</label>
                        <input 
                            type="number" 
                            className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-primary outline-none transition-all"
                            value={stats.totalPopulation}
                            onChange={(e) => setStats({...stats, totalPopulation: e.target.value})}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Total Area (e.g., 7.41 km²)</label>
                        <input 
                            type="text" 
                            className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-primary outline-none transition-all"
                            value={stats.totalArea}
                            onChange={(e) => setStats({...stats, totalArea: e.target.value})}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Total Woredas</label>
                        <input 
                            type="number" 
                            className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-primary outline-none transition-all"
                            value={stats.totalWoredas}
                            onChange={(e) => setStats({...stats, totalWoredas: e.target.value})}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Subcity Description / About</label>
                    <textarea 
                        className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-primary outline-none transition-all h-32"
                        value={stats.description}
                        onChange={(e) => setStats({...stats, description: e.target.value})}
                        placeholder="Brief overview of the subcity..."
                    ></textarea>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit" 
                        disabled={saving}
                        className={`flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-secondary transition-all shadow-md active:scale-95 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {saving ? 'Saving...' : <><RiSaveLine /> Save Changes</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSubcityDataManager;
