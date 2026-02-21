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
        <div className="text-center py-12">Career not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{career.name}</h1>
              <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {career.category}
              </span>
            </div>
          </div>
          <p className="text-gray-600 text-lg">{career.description}</p>
        </div>

        {/* Career Roadmap Timeline */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Complete Career Roadmap</h2>
          
          <div className="space-y-6">
            {/* Step 1: 10th Class */}
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <div className="w-1 h-full bg-blue-200 mt-2"></div>
              </div>
              <div className="pb-8">
                <h3 className="text-xl font-semibold mb-2">10th Class</h3>
                <p className="text-gray-600">Complete your 10th standard with good marks</p>
                <p className="text-sm text-gray-500 mt-1">Minimum Required: {career.minMarks}%</p>
              </div>
            </div>

            {/* Step 2: Stream Selection */}
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                <div className="w-1 h-full bg-blue-200 mt-2"></div>
              </div>
              <div className="pb-8">
                <h3 className="text-xl font-semibold mb-2">Intermediate / Diploma Stream</h3>
                <p className="text-gray-600">Choose: <span className="font-semibold text-blue-600">{career.requiredStream?.name}</span></p>
                <p className="text-sm text-gray-500 mt-1">Duration: 2 years</p>
              </div>
            </div>

            {/* Step 3: Entrance Exams */}
            {career.requiredExams?.length > 0 && (
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                  <div className="w-1 h-full bg-blue-200 mt-2"></div>
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-semibold mb-2">Entrance Exams</h3>
                  <div className="space-y-2">
                    {career.requiredExams.map(exam => (
                      <div key={exam._id} className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-semibold">{exam.name}</p>
                        <p className="text-sm text-gray-600">{exam.fullName}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Degree */}
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
                <div className="w-1 h-full bg-blue-200 mt-2"></div>
              </div>
              <div className="pb-8">
                <h3 className="text-xl font-semibold mb-2">Degree / Higher Studies</h3>
                <div className="space-y-2">
                  {career.requiredDegrees?.map(degree => (
                    <div key={degree._id} className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-semibold">{degree.name}</p>
                      <p className="text-sm text-gray-600">Duration: {degree.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 5: Core Skills */}
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">5</div>
                <div className="w-1 h-full bg-blue-200 mt-2"></div>
              </div>
              <div className="pb-8">
                <h3 className="text-xl font-semibold mb-2">Core Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                  {career.coreSkills?.map(skill => (
                    <span key={skill._id} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 6: Certifications */}
            {career.certifications?.length > 0 && (
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">6</div>
                  <div className="w-1 h-full bg-blue-200 mt-2"></div>
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-semibold mb-2">Certifications</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {career.certifications.map((cert, idx) => (
                      <li key={idx} className="text-gray-600">{cert}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Step 7: Internships */}
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">7</div>
                <div className="w-1 h-full bg-blue-200 mt-2"></div>
              </div>
              <div className="pb-8">
                <h3 className="text-xl font-semibold mb-2">Internships</h3>
                <p className="text-gray-600">Duration: {career.internshipDuration}</p>
              </div>
            </div>

            {/* Job Roles */}
            {career.jobRoles?.entry && (
              <>
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">8</div>
                    <div className="w-1 h-full bg-green-200 mt-2"></div>
                  </div>
                  <div className="pb-8">
                    <h3 className="text-xl font-semibold mb-2">Entry-Level Job (0-2 years)</h3>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="font-semibold text-lg">{career.jobRoles.entry.title}</p>
                      <p className="text-green-600 font-semibold mt-2">
                        ₹{(career.jobRoles.entry.salaryRange.min / 100000).toFixed(1)}L - ₹{(career.jobRoles.entry.salaryRange.max / 100000).toFixed(1)}L per year
                      </p>
                    </div>
                  </div>
                </div>

                {career.jobRoles.mid && (
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold">9</div>
                      <div className="w-1 h-full bg-yellow-200 mt-2"></div>
                    </div>
                    <div className="pb-8">
                      <h3 className="text-xl font-semibold mb-2">Mid-Level Job (3-6 years)</h3>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="font-semibold text-lg">{career.jobRoles.mid.title}</p>
                        <p className="text-yellow-700 font-semibold mt-2">
                          ₹{(career.jobRoles.mid.salaryRange.min / 100000).toFixed(1)}L - ₹{(career.jobRoles.mid.salaryRange.max / 100000).toFixed(1)}L per year
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {career.jobRoles.senior && (
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">10</div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Senior-Level Job (7-10 years)</h3>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="font-semibold text-lg">{career.jobRoles.senior.title}</p>
                        <p className="text-purple-700 font-semibold mt-2">
                          ₹{(career.jobRoles.senior.salaryRange.min / 100000).toFixed(1)}L - ₹{(career.jobRoles.senior.salaryRange.max / 100000).toFixed(1)}L per year
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
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
