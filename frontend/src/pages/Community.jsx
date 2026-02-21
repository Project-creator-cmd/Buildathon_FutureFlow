import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

const Community = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Career Guidance', 'Exams', 'Skills', 'Colleges', 'General'];

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [searchTerm, selectedCategory, sortBy, questions]);

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/community/questions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(data);
      setFilteredQuestions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = questions;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(q =>
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === 'replies') {
      filtered = [...filtered].sort((a, b) => (b.replyCount || 0) - (a.replyCount || 0));
    } else {
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredQuestions(filtered);
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
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
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Community Forum</h2>
            <p className="text-gray-600 mt-1">Ask questions and get career guidance</p>
          </div>
          <Link to="/community/ask" className="btn-primary">
            Ask Question
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search questions..."
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
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="newest">Newest First</option>
              <option value="replies">Most Replies</option>
            </select>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Showing <span className="font-semibold text-blue-600">{filteredQuestions.length}</span> questions
          </p>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map(question => (
            <Link
              key={question._id}
              to={`/community/question/${question._id}`}
              className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {question.category}
                    </span>
                    <span className="text-sm text-gray-500">{getTimeAgo(question.createdAt)}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{question.title}</h3>
                  <p className="text-gray-600 line-clamp-2 mb-3">{question.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {question.author?.name}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {question.replyCount || 0} replies
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {question.views || 0} views
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 text-lg mb-4">No questions found</p>
            <Link to="/community/ask" className="btn-primary inline-block">
              Be the first to ask!
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Community;
