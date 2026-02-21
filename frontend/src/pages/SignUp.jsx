import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    tenthMarks: '',
    currentLevel: '10th',
    strengths: [],
    interests: []
  });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const strengthOptions = ['Mathematics', 'Science', 'Programming', 'Biology', 'Commerce', 'Arts', 'English', 'Physics', 'Chemistry'];
  const interestOptions = ['Technology', 'Medicine', 'Finance', 'Design', 'Law', 'Management', 'Research', 'Teaching', 'Government'];

  const toggleSelection = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleNext = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.tenthMarks) {
      setError('Please fill all fields');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await axios.post('/api/auth/register', formData);
      login(data, data.token);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto">
              <span className="text-3xl font-bold text-white">F</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-800">Create Your Account</h2>
          <p className="text-gray-600 mt-2">Step {step} of 2</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>Basic Details</span>
              <span className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>Strengths & Interests</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className={`bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500`} style={{ width: `${(step / 2) * 100}%` }}></div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  className="input-field"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a strong password"
                  minLength={6}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">10th Marks (%)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.tenthMarks}
                    onChange={(e) => setFormData({ ...formData, tenthMarks: e.target.value })}
                    placeholder="85"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Level</label>
                  <select
                    className="input-field"
                    value={formData.currentLevel}
                    onChange={(e) => setFormData({ ...formData, currentLevel: e.target.value })}
                  >
                    <option value="10th">10th Class</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="diploma">Diploma</option>
                    <option value="degree">Degree</option>
                    <option value="postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              <button onClick={handleNext} className="btn-primary w-full mt-6">
                Next →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Subject Strengths</label>
                <div className="flex flex-wrap gap-2">
                  {strengthOptions.map(strength => (
                    <button
                      key={strength}
                      type="button"
                      onClick={() => toggleSelection('strengths', strength)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.strengths.includes(strength)
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
                        formData.interests.includes(interest)
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">
                  ← Back
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Create Account
                </button>
              </div>
            </form>
          )}

          <p className="text-center mt-6 text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
