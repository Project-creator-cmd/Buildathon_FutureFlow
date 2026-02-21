import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { AuthContext } from '../context/AuthContext';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [question, setQuestion] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`/api/community/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestion(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching question:', error);
      setLoading(false);
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/community/questions/${id}/reply`,
        { content: replyContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyContent('');
      fetchQuestion(); // Refresh to show new reply
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Failed to submit reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeReply = async (replyId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/community/replies/${replyId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchQuestion(); // Refresh to show updated likes
    } catch (error) {
      console.error('Error liking reply:', error);
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!confirm('Are you sure you want to delete this reply?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/community/replies/${replyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchQuestion(); // Refresh to remove deleted reply
    } catch (error) {
      console.error('Error deleting reply:', error);
      alert('Failed to delete reply');
    }
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

  if (!question) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Question not found</p>
          <Link to="/community" className="btn-primary inline-block">
            Back to Community
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link to="/community" className="inline-flex items-center text-blue-600 hover:text-blue-700">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Community
        </Link>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center space-x-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
              {question.category}
            </span>
            <span className="text-sm text-gray-500">{getTimeAgo(question.createdAt)}</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">{question.title}</h1>
          <p className="text-gray-700 text-lg mb-6 whitespace-pre-wrap">{question.description}</p>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {question.author?.name}
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {question.views || 0} views
              </span>
            </div>
          </div>
        </div>

        {/* Replies Section */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {question.replies?.length || 0} {question.replies?.length === 1 ? 'Reply' : 'Replies'}
          </h2>

          {/* Reply Form */}
          <form onSubmit={handleSubmitReply} className="mb-8">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="4"
              required
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={submitting || !replyContent.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Posting...' : 'Post Reply'}
              </button>
            </div>
          </form>

          {/* Replies List */}
          <div className="space-y-4">
            {question.replies && question.replies.length > 0 ? (
              question.replies.map((reply) => (
                <div key={reply._id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {reply.author?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{reply.author?.name}</p>
                        <p className="text-sm text-gray-500">{getTimeAgo(reply.createdAt)}</p>
                      </div>
                    </div>
                    {user && reply.author?._id === user._id && (
                      <button
                        onClick={() => handleDeleteReply(reply._id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 mb-4 whitespace-pre-wrap">{reply.content}</p>
                  <button
                    onClick={() => handleLikeReply(reply._id)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill={reply.likes?.includes(user?._id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span className="text-sm">{reply.likes?.length || 0}</span>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No replies yet. Be the first to reply!</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QuestionDetail;
