import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import api from '../utils/api';

interface District {
  code: string;
  name: string;
  state_code: string;
  state_name: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      // Fetch only Uttar Pradesh districts
      const response = await api.get('/api/districts/UP');
      setDistricts(response.data.data);
    } catch (error) {
      console.error('Error fetching districts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoDetect = () => {
    setDetectingLocation(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            console.log('📍 Your location:', { latitude, longitude });
            
            const response = await api.get('/api/districts/locate/coordinates', {
              params: { lat: latitude, lng: longitude }
            });
            
            console.log('🎯 Nearest district:', response.data);
            
            if (response.data.success) {
              const { data: district, distance } = response.data;
              alert(`📍 Nearest district: ${district.name}, ${district.state_name} (${distance})`);
              navigate(`/district/${district.code}`);
            } else {
              alert('Could not find nearest district. Please select manually.');
            }
          } catch (error: any) {
            console.error('❌ Error detecting location:', error);
            if (error.response) {
              alert(`Server error: ${error.response.status}. Please try again or select manually.`);
            } else if (error.request) {
              alert('Cannot connect to server. Please make sure backend is running.');
            } else {
              alert('Could not detect your location. Please select manually.');
            }
          } finally {
            setDetectingLocation(false);
          }
        },
        (error) => {
          console.error('❌ Geolocation error:', error);
          let message = 'Location access denied. ';
          if (error.code === error.PERMISSION_DENIED) {
            message += 'Please allow location access in your browser settings and try again.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            message += 'Location information is unavailable.';
          } else if (error.code === error.TIMEOUT) {
            message += 'Location request timed out.';
          }
          alert(message + ' Please select your district manually.');
          setDetectingLocation(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser. Please select your district manually.');
      setDetectingLocation(false);
    }
  };

  const filteredDistricts = districts.filter(district => {
    const matchesSearch = district.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="spinner mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Loading Districts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8 border border-gray-200">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">
              MGNREGA Dashboard
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-4 font-semibold">
              Uttar Pradesh Performance Tracker
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Track rural employment schemes across <strong className="text-orange-600">{districts.length} districts</strong> in Uttar Pradesh
            </p>
          </div>

          {/* Auto-detect button */}
          <button
            onClick={handleAutoDetect}
            disabled={detectingLocation}
            className="btn-primary inline-flex items-center px-8 py-4 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaMapMarkerAlt className={`mr-3 text-xl ${detectingLocation ? 'animate-pulse' : ''}`} />
            {detectingLocation ? (
              <span>Detecting Your Location...</span>
            ) : (
              <span>📍 Auto-Detect My District</span>
            )}
          </button>
          <p className="text-gray-600 text-sm mt-3 font-medium">
            ⚡ Find your nearest district in Uttar Pradesh instantly!
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 animate-slideInLeft">
          <div className="relative group">
            <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-orange-600 transition-colors" />
            <input
              type="text"
              placeholder="🔍 Search districts in Uttar Pradesh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-lg font-medium transition-all"
            />
          </div>

          {/* Results count */}
          <div className="mt-4 text-center">
            <p className="text-gray-700 font-semibold text-lg">
              Showing <span className="text-orange-600 font-bold text-xl">{filteredDistricts.length}</span> of <span className="font-bold">{districts.length}</span> districts
            </p>
          </div>
        </div>

        {/* District Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
          {filteredDistricts.map((district) => (
            <button
              key={district.code}
              onClick={() => navigate(`/district/${district.code}`)}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all card-hover text-left border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl">
                  <FaMapMarkerAlt className="text-white text-2xl" />
                </div>
                <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  {district.state_code}
                </div>
              </div>
              
              <div>
                <p className="text-xl font-bold text-gray-900 mb-2">
                  {district.name}
                </p>
                <p className="text-sm text-gray-600 font-medium flex items-center">
                  <span className="mr-1">📍</span>
                  {district.state_name}
                </p>
              </div>

              {/* Hover effect */}
              <div className="mt-4 flex items-center text-orange-600 font-semibold text-sm">
                <span>View Dashboard</span>
                <span className="ml-2">→</span>
              </div>
            </button>
          ))}
        </div>

        {filteredDistricts.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200 animate-scaleIn">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-2xl font-bold text-gray-700 mb-2">No districts found</p>
            <p className="text-gray-600">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
