import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

const CareerDetail = () => {
  const { id } = useParams();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedExam, setExpandedExam] = useState(null);
  const [showAlternatives, setShowAlternatives] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCareer();
    }
  }, [id]);

  const fetchCareer = async () => {
    try {
      console.log('Fetching career with ID:', id);
      const token = localStorage.getItem('token');
      
      // Try personalized endpoint first if user is logged in
      const endpoint = token ? `/api/careers/${id}/personalized` : `/api/careers/${id}`;
      console.log('Using endpoint:', endpoint);
      
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const { data } = await axios.get(endpoint, config);
      console.log('Fetched career detail:', data);
      setCareer(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching career:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // If personalized endpoint fails, try regular endpoint
      if (error.response?.status === 401 || error.response?.status === 403) {
        try {
          console.log('Trying non-personalized endpoint...');
          const { data } = await axios.get(`/api/careers/${id}`);
          console.log('Fetched career (non-personalized):', data);
          setCareer(data);
          setLoading(false);
          return;
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      }
      
      setLoading(false);
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

  if (!career) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Career not found</p>
          <Link to="/explore" className="btn-primary mt-4 inline-block">
            Back to Explore
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Extract data from both old and new structure
  const careerTitle = career.name || career.career_options?.[0] || 'Career Path';
  const careerStream = career.stream || 'N/A';
  const after10th = career.after_10th || 'Complete 10th standard';
  const entranceExams = Array.isArray(career.entrance_exams) ? career.entrance_exams : [];
  const degreeOptions = Array.isArray(career.degree_options) ? career.degree_options : [];
  const skillsRequired = Array.isArray(career.skills_required) ? career.skills_required : [];
  const careerOptions = Array.isArray(career.career_options) ? career.career_options : [careerTitle];
  const alternativePaths = Array.isArray(career.alternative_paths) ? career.alternative_paths : [];
  const description = career.description || '';
  const certifications = Array.isArray(career.certifications) ? career.certifications : [];
  const internshipDuration = career.internshipDuration || 'Varies';
  const minMarks = career.minMarks || 50;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <Link to="/explore" className="text-blue-600 hover:text-blue-700 flex items-center mb-4">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Explore
          </Link>
          <h1 className="text-4xl font-bold mb-2">{careerTitle}</h1>
          <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            {careerStream}
          </span>
          {description && (
            <p className="text-gray-600 text-lg mt-4">{description}</p>
          )}
        </div>

        {/* Personalization Section */}
        {career.personalization && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-md p-6 border-2 border-green-200">
            <h2 className="text-2xl font-bold mb-4 text-green-800">📊 Personalized for You</h2>
            
            {/* Eligibility Status */}
            <div className={`p-4 rounded-lg mb-4 ${career.personalization.eligibility.meetsMarksRequirement ? 'bg-green-100 border-l-4 border-green-500' : 'bg-yellow-100 border-l-4 border-yellow-500'}`}>
              <h3 className="font-bold text-lg mb-2">
                {career.personalization.eligibility.meetsMarksRequirement ? '✅ Eligibility: Qualified' : '⚠️ Eligibility: Work Needed'}
              </h3>
              <p className="text-gray-700">
                Your Marks: <span className="font-bold">{career.personalization.eligibility.yourMarks}%</span> | 
                Required: <span className="font-bold">{career.personalization.eligibility.requiredMarks}%</span>
              </p>
            </div>

            {/* Matching Interests */}
            {career.personalization.matchingInterests.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">🎯 Matching Interests:</h3>
                <div className="flex flex-wrap gap-2">
                  {career.personalization.matchingInterests.map((interest, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Strengths */}
            {career.personalization.matchingStrengths.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">💪 Your Relevant Strengths:</h3>
                <div className="flex flex-wrap gap-2">
                  {career.personalization.matchingStrengths.map((strength, idx) => (
                    <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skill Gaps */}
            {career.personalization.skillGaps.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">📖 Skills to Develop:</h3>
                <div className="flex flex-wrap gap-2">
                  {career.personalization.skillGaps.slice(0, 5).map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">💡 Recommendations:</h3>
              <ul className="space-y-2">
                {career.personalization.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-gray-700">{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Career Roadmap Timeline */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-2">Complete Career Roadmap</h2>
          <p className="text-gray-600 mb-6">Your journey from 10th class to {careerTitle}</p>
          
          <div className="space-y-6">
            {/* Step 1: After 10th */}
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  <span className="text-lg">🎓</span>
                </div>
                <div className="w-1 h-full bg-gradient-to-b from-blue-200 to-purple-200 mt-2"></div>
              </div>
              <div className="pb-8 flex-1">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Step 1: After 10th Class</h3>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-gray-700">{after10th}</p>
                  <p className="text-sm text-gray-600 mt-2">📊 Minimum marks required: <span className="font-semibold text-blue-600">{minMarks}%</span></p>
                </div>
              </div>
            </div>

            {/* Step 2: Stream Selection */}
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  <span className="text-lg">📚</span>
                </div>
                <div className="w-1 h-full bg-gradient-to-b from-purple-200 to-green-200 mt-2"></div>
              </div>
              <div className="pb-8 flex-1">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Step 2: Choose Stream</h3>
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <p className="text-gray-700">
                    Required Stream: <span className="font-bold text-purple-700 text-lg">{careerStream}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-2">⏱️ Duration: 2 years (11th & 12th)</p>
                </div>
              </div>
            </div>

            {/* Step 3: Entrance Exams */}
            {entranceExams.length > 0 && (
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    <span className="text-lg">📝</span>
                  </div>
                  <div className="w-1 h-full bg-gradient-to-b from-green-200 to-yellow-200 mt-2"></div>
                </div>
                <div className="pb-8 flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Step 3: Entrance Exams</h3>
                  <div className="space-y-2">
                    {entranceExams.map((exam, idx) => {
                      const examName = typeof exam === 'string' ? exam : exam.name;
                      const isExpanded = expandedExam === idx;
                      
                      return (
                        <div key={idx} className="bg-green-50 rounded-lg border-l-4 border-green-500 overflow-hidden">
                          <button
                            onClick={() => setExpandedExam(isExpanded ? null : idx)}
                            className="w-full p-4 text-left hover:bg-green-100 transition-colors flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <span className="mr-2">✓</span>
                              <p className="font-semibold text-green-800">{examName}</p>
                            </div>
                            <svg 
                              className={`w-5 h-5 text-green-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {isExpanded && (
                            <div className="px-4 pb-4 bg-green-50 border-t border-green-200">
                              <p className="text-sm text-gray-700 mt-2">
                                <strong>Exam Type:</strong> National Level Entrance Exam
                              </p>
                              <p className="text-sm text-gray-700 mt-1">
                                <strong>Preparation Time:</strong> 1-2 years recommended
                              </p>
                              <p className="text-sm text-gray-700 mt-1">
                                <strong>Tip:</strong> Start preparing from 11th class for best results
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Degree Options */}
            {degreeOptions.length > 0 && (
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    <span className="text-lg">🎯</span>
                  </div>
                  <div className="w-1 h-full bg-gradient-to-b from-yellow-200 to-orange-200 mt-2"></div>
                </div>
                <div className="pb-8 flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Step 4: Degree Options</h3>
                  <div className="space-y-2">
                    {degreeOptions.map((degree, idx) => (
                      <div key={idx} className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
                        <p className="font-semibold text-yellow-800">{typeof degree === 'string' ? degree : degree.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Internship */}
            {internshipDuration && (
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    <span className="text-lg">💼</span>
                  </div>
                  <div className="w-1 h-full bg-gradient-to-b from-orange-200 to-red-200 mt-2"></div>
                </div>
                <div className="pb-8 flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Step 5: Internship & Training</h3>
                  <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                    <p className="text-gray-700">Duration: <span className="font-semibold text-orange-700">{internshipDuration}</span></p>
                    <p className="text-sm text-gray-600 mt-2">Gain practical experience and industry exposure</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Skills Required */}
            {skillsRequired.length > 0 && (
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    <span className="text-lg">⚡</span>
                  </div>
                  <div className="w-1 h-full bg-gradient-to-b from-red-200 to-pink-200 mt-2"></div>
                </div>
                <div className="pb-8 flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Step 6: Skills to Master</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillsRequired.map((skill, idx) => (
                      <span key={idx} className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition-colors">
                        {typeof skill === 'string' ? skill : skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Certifications */}
            {certifications.length > 0 && (
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    <span className="text-lg">🏆</span>
                  </div>
                  <div className="w-1 h-full bg-gradient-to-b from-pink-200 to-indigo-200 mt-2"></div>
                </div>
                <div className="pb-8 flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Step 7: Certifications (Optional)</h3>
                  <div className="space-y-2">
                    {certifications.map((cert, idx) => (
                      <div key={idx} className="bg-pink-50 p-3 rounded-lg border-l-4 border-pink-500">
                        <p className="font-medium text-pink-800">{cert}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 8: Career Options */}
            {careerOptions.length > 0 && (
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    <span className="text-lg">🎉</span>
                  </div>
                  <div className="w-1 h-8 bg-gradient-to-b from-indigo-200 to-transparent mt-2"></div>
                </div>
                <div className="pb-8 flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Step 8: Career Opportunities</h3>
                  <div className="space-y-2">
                    {careerOptions.map((option, idx) => (
                      <div key={idx} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border-l-4 border-indigo-500 hover:shadow-md transition-shadow">
                        <p className="font-bold text-indigo-800 text-lg">{option}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Alternative Paths */}
        {alternativePaths.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-md border-2 border-purple-200 overflow-hidden">
            <button
              onClick={() => setShowAlternatives(!showAlternatives)}
              className="w-full p-6 text-left hover:bg-purple-100 transition-colors flex items-center justify-between"
            >
              <div>
                <h2 className="text-2xl font-bold text-purple-800 flex items-center">
                  🔄 Alternative Career Paths
                  <span className="ml-3 text-sm font-normal text-purple-600">
                    ({alternativePaths.length} options)
                  </span>
                </h2>
                <p className="text-gray-600 mt-1">Other career options you can explore with similar qualifications</p>
              </div>
              <svg 
                className={`w-6 h-6 text-purple-600 transition-transform ${showAlternatives ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showAlternatives && (
              <div className="px-6 pb-6 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="grid md:grid-cols-2 gap-3 pt-4 border-t border-purple-200">
                  {alternativePaths.map((path, idx) => (
                    <div 
                      key={idx} 
                      className="px-4 py-3 bg-white text-purple-700 rounded-lg font-medium shadow-sm hover:shadow-md transition-all border border-purple-200 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      {path}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CareerDetail;
