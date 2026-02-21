import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

const CareerDetail = () => {
  const { id } = useParams();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCareer();
  }, [id]);

  const fetchCareer = async () => {
    try {
      const { data } = await axios.get(`/api/careers/${id}`);
      console.log('Fetched career detail:', data);
      setCareer(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching career:', error);
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
  const careerStream = career.stream || career.requiredStream?.name || 'N/A';
  const after10th = career.after_10th || 'Complete 10th standard';
  const entranceExams = career.entrance_exams || career.requiredExams?.map(e => e.name || e) || [];
  const degreeOptions = career.degree_options || career.requiredDegrees?.map(d => d.name || d) || [];
  const skillsRequired = career.skills_required || career.coreSkills?.map(s => s.name || s) || [];
  const careerOptions = career.career_options || [];
  const alternativePaths = career.alternative_paths || career.alternativePaths || [];
  const description = career.description || career.root_path || '';

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

        {/* Career Roadmap Timeline */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Complete Career Roadmap</h2>
          
          <div className="space-y-6">
            {/* Step 1: After 10th */}
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <div className="w-1 h-full bg-blue-200 mt-2"></div>
              </div>
              <div className="pb-8 flex-1">
                <h3 className="text-xl font-semibold mb-2">After 10th Class</h3>
                <p className="text-gray-600">{after10th}</p>
              </div>
            </div>

            {/* Step 2: Stream Selection */}
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                <div className="w-1 h-full bg-blue-200 mt-2"></div>
              </div>
              <div className="pb-8 flex-1">
                <h3 className="text-xl font-semibold mb-2">Choose Stream</h3>
                <p className="text-gray-600">
                  Required: <span className="font-semibold text-blue-600">{careerStream}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">Duration: 2 years (11th & 12th)</p>
              </div>
            </div>

            {/* Step 3: Entrance Exams */}
            {entranceExams.length > 0 && (
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                  <div className="w-1 h-full bg-blue-200 mt-2"></div>
                </div>
                <div className="pb-8 flex-1">
                  <h3 className="text-xl font-semibold mb-2">Entrance Exams</h3>
                  <div className="space-y-2">
                    {entranceExams.map((exam, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-semibold">{typeof exam === 'string' ? exam : exam.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Degree Options */}
            {degreeOptions.length > 0 && (
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
                  <div className="w-1 h-full bg-blue-200 mt-2"></div>
                </div>
                <div className="pb-8 flex-1">
                  <h3 className="text-xl font-semibold mb-2">Degree Options</h3>
                  <div className="space-y-2">
                    {degreeOptions.map((degree, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-semibold">{typeof degree === 'string' ? degree : degree.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Skills Required */}
            {skillsRequired.length > 0 && (
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">5</div>
                  <div className="w-1 h-full bg-blue-200 mt-2"></div>
                </div>
                <div className="pb-8 flex-1">
                  <h3 className="text-xl font-semibold mb-2">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillsRequired.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {typeof skill === 'string' ? skill : skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Career Options */}
            {careerOptions.length > 0 && (
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">6</div>
                  <div className="w-1 h-full bg-green-200 mt-2"></div>
                </div>
                <div className="pb-8 flex-1">
                  <h3 className="text-xl font-semibold mb-2">Career Options</h3>
                  <div className="space-y-2">
                    {careerOptions.map((option, idx) => (
                      <div key={idx} className="bg-green-50 p-3 rounded-lg">
                        <p className="font-semibold text-green-800">{option}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Alternative Paths */}
            {alternativePaths.length > 0 && (
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">7</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Alternative Paths</h3>
                  <div className="flex flex-wrap gap-3">
                    {alternativePaths.map((path, idx) => (
                      <span key={idx} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
                        {path}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Alternative Paths */}
        {career.alternativePaths?.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Alternative / Lateral Paths</h2>
            <div className="flex flex-wrap gap-3">
              {career.alternativePaths.map((path, idx) => (
                <span key={idx} className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium">
                  {path}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CareerDetail;
