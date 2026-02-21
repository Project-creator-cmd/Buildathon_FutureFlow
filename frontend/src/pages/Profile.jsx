import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const strengthOptions = ['Mathematics', 'Science', 'Programming', 'Biology', 'Commerce', 'Arts', 'English', 'Physics', 'Chemistry'];
  const interestOptions = ['Technology', 'Medicine', 'Finance', 'Design', 'Law', 'Management', 'Research', 'Teaching', 'Government'];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get('/api/auth/profile');
      setProfile(data.profile);
      setFormData(data.profile);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const toggleSelection = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/auth/profile', formData);
      setProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="btn-primary">
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">10th Marks (%)</label>
                  <input
                    type="number"
                    value={formData.tenthMarks}
                    onChange={(e) => setFormData({ ...formData, tenthMarks: e.target.value })}
                    className="input-field"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Education Level</label>
                  <select
                    value={formData.currentLevel}
                    onChange={(e) => setFormData({ ...formData, currentLevel: e.target.value })}
                    className="input-field"
                  >
                    <option value="10th">10th Class</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="diploma">Diploma</option>
                    <option value="degree">Degree</option>
                    <option value="postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Subject Strengths</label>
                <div className="flex flex-wrap gap-2">
                  {strengthOptions.map(strength => (
                    <button
                      key={strength}
                      type="button"
                      onClick={() => toggleSelection('strengths', strength)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.strengths?.includes(strength)
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {strength}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Career Interests</label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleSelection('interests', interest)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.interests?.includes(interest)
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">10th Marks</h3>
                  <p className="text-2xl font-bold text-gray-800">{profile?.tenthMarks}%</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Current Level</h3>
                  <p className="text-2xl font-bold text-gray-800 capitalize">{profile?.currentLevel}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Subject Strengths</h3>
                <div className="flex flex-wrap gap-2">
                  {profile?.strengths?.map((strength, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {strength}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Career Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile?.interests?.map((interest, idx) => (
                    <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t">
                <button onClick={() => navigate('/my-career')} className="btn-primary w-full">
                  Regenerate Career Path
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
