import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { AuthContext } from '../context/AuthContext';

const CommunityForum = () => {
  const [posts, setPosts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', description: '' });
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get('/api/forum');
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/forum', newPost);
      setNewPost({ title: '', description: '' });
      setShowCreateModal(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleReply = async (postId) => {
    try {
      await axios.post(`/api/forum/${postId}/reply`, { text: replyText[postId] });
      setReplyText({ ...replyText, [postId]: '' });
      fetchPosts();
    } catch (error) {
      console.error('Error replying:', error);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await axios.post(`/api/forum/${postId}/like`);
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
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
            <p className="text-gray-600 mt-1">Ask questions and discuss career paths</p>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            Ask a Question
          </button>
        </div>

        <div className="space-y-4">
          {posts.map(post => (
            <div key={post._id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-3">{post.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Posted by {post.user?.name}</span>
                    <span>•</span>
                    <span>{post.replies?.length || 0} replies</span>
                    <span>•</span>
                    <button onClick={() => handleLikePost(post._id)} className="flex items-center space-x-1 hover:text-blue-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      <span>{post.likes?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {post.replies?.length > 0 && (
                <div className="mt-4 space-y-3 border-t pt-4">
                  {post.replies.map((reply, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-800 mb-2">{reply.text}</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span>{reply.user?.name}</span>
                        <span>•</span>
                        <span>{reply.likes?.length || 0} likes</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              <div className="mt-4 flex space-x-2">
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyText[post._id] || ''}
                  onChange={(e) => setReplyText({ ...replyText, [post._id]: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button onClick={() => handleReply(post._id)} className="btn-primary">
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 text-lg">No posts yet. Be the first to ask a question!</p>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ask a Question</h3>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="input-field"
                  placeholder="What's your question?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newPost.description}
                  onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                  className="input-field"
                  rows="4"
                  placeholder="Provide more details..."
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CommunityForum;
