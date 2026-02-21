import { useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

const MyCareerPath = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generateRoadmap = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/careers/personalized');
      setRoadmaps(data);
      setGenerated(true);
      setLoading(false);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Analyzing your profile and generating personalized roadmaps...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!generated) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎯</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">Generate Your Personalized Career Roadmap</h1>
            <p className="text-gray-600 mb-8 text-lg">
              Based on your marks, strengths, and interests, we'll recommend the best career paths for you
            </p>
            <button onClick={generateRoadmap} className="btn-primary text-lg px-8 py-3">
              Generate Roadmap
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Your Personalized Career Roadmaps</h1>
            <p className="text-gray-600 mt-1">Top {roadmaps.length} career recommendations based on your profile</p>
          </div>
          <button onClick={generateRoadmap} className="btn-secondary">
            Regenerate
          </button>
        </div>

        {roadmaps.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-600">No suitable careers found. Try updating your profile.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {roadmaps.map((roadmap, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      #{index + 1}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{roadmap.career.name}</h2>
                      <span className="text-sm text-gray-500">{roadmap.career.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">{roadmap.suitabilityScore}%</div>
                    <div className="text-sm text-gray-500">Match Score</div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Why This Career?</h3>
                  <p className="text-blue-800">{roadmap.reason}</p>
                </div>

                {roadmap.skillGaps?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Skills to Develop:</h3>
                    <div className="flex flex-wrap gap-2">
                      {roadmap.skillGaps.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {roadmap.improvements?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Improvement Suggestions:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {roadmap.improvements.map((improvement, idx) => (
                        <li key={idx} className="text-gray-600">{improvement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-1">Entry Level</h4>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{(roadmap.salaryProjection.entry.min / 100000).toFixed(1)}L
                    </p>
                    <p className="text-sm text-green-700">Starting salary</p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-1">Mid Level</h4>
                    <p className="text-2xl font-bold text-yellow-600">
                      ₹{(roadmap.salaryProjection.mid.min / 100000).toFixed(1)}L
                    </p>
                    <p className="text-sm text-yellow-700">After 3-6 years</p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-1">Senior Level</h4>
                    <p className="text-2xl font-bold text-purple-600">
                      ₹{(roadmap.salaryProjection.senior.min / 100000).toFixed(1)}L
                    </p>
                    <p className="text-sm text-purple-700">After 7-10 years</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Your Journey Timeline:</h3>
                  <div className="space-y-2 text-sm">
                    {Object.entries(roadmap.timeline).map(([key, value]) => (
                      <div key={key} className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        <span className="text-gray-700">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyCareerPath;
