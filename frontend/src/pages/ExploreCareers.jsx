import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

const ExploreCareers = () => {
  const [careers, setCareers] = useState([]);
  const [filteredCareers, setFilteredCareers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStream, setSelectedStream] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const streams = ['All', 'Science (PCM)', 'Science (PCB)', 'Commerce', 'Arts/Humanities', 'Vocational', 'Diploma'];

  useEffect(() => {
    fetchCareers();
  }, []);

  useEffect(() => {
    filterCareers();
  }, [searchTerm, selectedStream, careers]);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get('/api/careers');
      console.log('Fetched careers:', data);
      setCareers(data);
      setFilteredCareers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching careers:', error);
      setError(error.response?.data?.message || 'Failed to fetch careers');
      setLoading(false);
    }
  };

  const filterCareers = () => {
    let filtered = careers;

    if (selectedStream !== 'All') {
      filtered = filtered.filter(c => c.stream === selectedStream);
    }

    if (searchTerm) {
      filtered = filtered.filter(c => {
        const careerName = c.name || c.career_options?.[0] || '';
        const careerStream = c.stream || '';
        return careerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               careerStream.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    setFilteredCareers(filtered);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading careers...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchCareers} className="btn-primary">
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Explore Career Paths</h2>
          <p className="text-gray-600">Discover complete roadmaps from 10th class to your dream career</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Search careers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
            <select
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              className="input-field"
            >
              {streams.map(stream => (
                <option key={stream} value={stream}>{stream}</option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-blue-600">{filteredCareers.length}</span> of <span className="font-semibold">{careers.length}</span> careers
          </p>
        </div>

        {/* Career Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map(career => {
            const careerTitle = career.name || career.career_options?.[0] || 'Career Path';
            const careerStream = career.stream || career.requiredStream?.name || 'N/A';
            const nextStep = career.degree_options?.[0] || career.requiredDegrees?.[0]?.name || 'View Details';
            
            return (
              <Link
                key={career._id}
                to={`/career/${career._id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{careerTitle}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {careerStream}
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-700">Next Step:</p>
                        <p className="text-gray-600">{nextStep}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-blue-600 font-medium text-sm flex items-center">
                      View Complete Roadmap 
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredCareers.length === 0 && careers.length > 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 text-lg">No careers found matching your search</p>
            <button onClick={() => { setSearchTerm(''); setSelectedStream('All'); }} className="btn-secondary mt-4">
              Clear Filters
            </button>
          </div>
        )}

        {careers.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 text-lg mb-4">No careers available in the database</p>
            <p className="text-gray-400 text-sm">Please run the seed script to populate data</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ExploreCareers;
