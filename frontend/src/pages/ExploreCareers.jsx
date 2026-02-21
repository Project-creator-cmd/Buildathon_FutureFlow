import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

const ExploreCareers = () => {
  const [careers, setCareers] = useState([]);
  const [filteredCareers, setFilteredCareers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Engineering & Technology', 'Medical & Healthcare', 'Commerce & Finance', 'Management', 'Design & Creative', 'Government & Civil Services', 'Law', 'Pure Sciences', 'Emerging Fields'];

  useEffect(() => {
    fetchCareers();
  }, []);

  useEffect(() => {
    filterCareers();
  }, [searchTerm, selectedCategory, careers]);

  const fetchCareers = async () => {
    try {
      const { data } = await axios.get('/api/careers');
      setCareers(data);
      setFilteredCareers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching careers:', error);
      setLoading(false);
    }
  };

  const filterCareers = () => {
    let filtered = careers;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(c => c.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCareers(filtered);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Explore Careers</h2>
          <p className="text-gray-600">Discover complete roadmaps for 20+ career paths</p>
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
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-600">Showing {filteredCareers.length} careers</p>
        </div>

        {/* Career Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map(career => (
            <Link
              key={career._id}
              to={`/career/${career._id}`}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800 flex-1">{career.name}</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full whitespace-nowrap ml-2">
                    {career.category}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{career.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {career.requiredStream?.name}
                  </div>
                  
                  {career.jobRoles?.entry && (
                    <div className="flex items-center text-green-600 font-medium">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ₹{(career.jobRoles.entry.salaryRange.min / 100000).toFixed(1)}L - ₹{(career.jobRoles.entry.salaryRange.max / 100000).toFixed(1)}L
                    </div>
                  )}
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
          ))}
        </div>

        {filteredCareers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 text-lg">No careers found matching your criteria</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ExploreCareers;
