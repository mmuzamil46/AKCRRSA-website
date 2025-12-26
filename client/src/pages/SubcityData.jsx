import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip as ChartTooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import { RiMapPinLine, RiTeamLine, RiLayoutGridLine, RiInformationLine, RiNavigationLine } from 'react-icons/ri';
import SEO from '../components/SEO';

// Register ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const subcityIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #0d9488; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; items-center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"><i class="ri-government-fill"></i></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const woredaIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #1e40af; color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; items-center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"><i class="ri-map-pin-2-fill" style="font-size: 10px;"></i></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

// Helper component to fly to location
const MapFlyTo = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 15, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
};

const SubcityData = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedWoreda, setSelectedWoreda] = useState(null);
    const [distance, setDistance] = useState(null);

    const subcityCoords = [9.048864250066362, 38.7197229754138];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/subcity-data`);
                setData(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleWoredaSelect = (woreda) => {
        setSelectedWoreda(woreda);
        
        // Calculate distance
        if (woreda.lat && woreda.lng) {
            const from = L.latLng(subcityCoords[0], subcityCoords[1]);
            const to = L.latLng(woreda.lat, woreda.lng);
            setDistance((from.distanceTo(to) / 1000).toFixed(2));
        }
    };

    const chartData = useMemo(() => {
        if (!data || !data.woredas) return null;
        return {
            labels: data.woredas.map(w => w.name),
            datasets: [{
                label: 'የህዝብ ብዛት (Population)',
                data: data.woredas.map(w => w.population),
                backgroundColor: data.woredas.map(w => 
                    selectedWoreda && selectedWoreda._id === w._id ? 'rgba(13, 148, 136, 0.8)' : 'rgba(13, 148, 136, 0.2)'
                ),
                borderColor: 'rgba(13, 148, 136, 1)',
                borderWidth: 2,
                borderRadius: 8,
            }]
        };
    }, [data, selectedWoreda]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => `የህዝብ ብዛት: ${context.raw.toLocaleString()}`
                }
            }
        },
        onClick: (event, elements) => {
            if (elements.length > 0 && data.woredas) {
                const index = elements[0].index;
                handleWoredaSelect(data.woredas[index]);
            }
        },
        scales: {
            y: { beginAtZero: true },
            x: { grid: { display: false } }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 py-12 px-4 md:px-8">
            <SEO 
                title="Subcity Data & Statistics - AKCRRSA" 
                description="Explore Addis Ketama Subcity demographics, population maps, and woredas statistics."
            />

            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-12">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-teal-800 font-serif"
                    >
                        አዲስ ከተማ ክፍለ ከተማ ዳሽቦርድ
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-stone-600 mt-4 text-lg"
                    >
                        የህዝብ ብዛት ካርታ እና የወረዳዎች ስታትስቲክስ
                    </motion.p>
                </header>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <StatCard 
                        icon={<RiTeamLine />} 
                        label="ጠቅላላ የህዝብ ብዛት" 
                        value={data?.stats?.totalPopulation?.toLocaleString() || '737,740'} 
                        delay={0.3}
                    />
                    <StatCard 
                        icon={<RiLayoutGridLine />} 
                        label="ጠቅላላ ስፋት" 
                        value={data?.stats?.totalArea || '7.41 km²'} 
                        delay={0.4}
                    />
                    <StatCard 
                        icon={<RiMapPinLine />} 
                        label="የወረዳዎች ብዛት" 
                        value={data?.stats?.totalWoredas || '12'} 
                        delay={0.5}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Map Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 bg-white p-4 rounded-3xl shadow-xl border border-stone-200 h-[600px] overflow-hidden"
                    >
                        <MapContainer center={subcityCoords} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '1.5rem' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            
                            {/* Subcity Center Marker */}
                            <Marker position={subcityCoords} icon={subcityIcon}>
                                <Popup>
                                    <h3 className="font-bold">አዲስ ከተማ ክፍለ ከተማ</h3>
                                    <p>የክፍለ ከተማ ማዕከል</p>
                                </Popup>
                            </Marker>

                            {/* Woreda Markers */}
                            {data?.woredas?.map(w => (
                                <Marker 
                                    key={w._id} 
                                    position={[w.lat || 9.04923, w.lng || 38.71802]} 
                                    icon={woredaIcon}
                                    eventHandlers={{
                                        click: () => handleWoredaSelect(w)
                                    }}
                                >
                                    <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                                        <span className="font-bold">{w.name}</span>
                                    </Tooltip>
                                </Marker>
                            ))}

                            {selectedWoreda && (
                                <>
                                    <MapFlyTo coords={[selectedWoreda.lat, selectedWoreda.lng]} />
                                    <Polyline 
                                        positions={[subcityCoords, [selectedWoreda.lat, selectedWoreda.lng]]}
                                        pathOptions={{ color: '#ef4444', weight: 3, dashArray: '10, 10' }}
                                    />
                                </>
                            )}
                        </MapContainer>
                    </motion.div>

                    {/* Sidebar / Details */}
                    <div className="flex flex-col gap-8">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={selectedWoreda ? selectedWoreda._id : 'none'}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`p-8 rounded-3xl shadow-lg border transition-all duration-500 flex-grow flex flex-col justify-center text-center ${selectedWoreda ? 'bg-teal-50 border-teal-200' : 'bg-white border-stone-200'}`}
                            >
                                {selectedWoreda ? (
                                    <>
                                        <h2 className="text-3xl font-bold text-teal-800 mb-4">{selectedWoreda.name}</h2>
                                        <p className="text-stone-600 leading-relaxed mb-6">{selectedWoreda.description}</p>
                                        <div className="bg-white/80 backdrop-blur p-4 rounded-2xl flex items-center justify-between border border-teal-100">
                                            <div className="flex items-center gap-3">
                                                <RiTeamLine className="text-2xl text-teal-600" />
                                                <div className="text-left">
                                                    <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">የህዝብ ብዛት</p>
                                                    <p className="font-bold text-teal-900">{selectedWoreda.population.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            {distance && (
                                                <div className="flex items-center gap-3 border-l pl-4 border-teal-100">
                                                    <RiNavigationLine className="text-2xl text-teal-600" />
                                                    <div className="text-left">
                                                        <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">ርቀት</p>
                                                        <p className="font-bold text-teal-900">{distance} km</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <RiInformationLine className="text-3xl text-stone-400" />
                                        </div>
                                        <h2 className="text-xl font-bold text-stone-800 mb-2">የወረዳ ዝርዝሮች</h2>
                                        <p className="text-stone-500">ተጨማሪ መረጃ ለማየት እባክዎ ከካርታው ወይም ከገበታው ላይ አንድ ወረዳ ይምረጡ።</p>
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Chart Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white p-6 rounded-3xl shadow-xl border border-stone-200"
                        >
                            <h3 className="text-lg font-bold text-teal-800 mb-4 flex items-center gap-2">
                                <RiTeamLine /> የህዝብ ብዛት ንጽጽር
                            </h3>
                            <div className="h-[250px]">
                                {chartData && <Bar data={chartData} options={chartOptions} />}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, delay }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100 flex items-center gap-6 group hover:border-teal-200 transition-all active:scale-95"
    >
        <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-3xl text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all">
            {icon}
        </div>
        <div>
            <h3 className="text-stone-500 text-sm font-bold uppercase tracking-wider">{label}</h3>
            <p className="text-3xl font-black text-teal-900">{value}</p>
        </div>
    </motion.div>
);

export default SubcityData;
