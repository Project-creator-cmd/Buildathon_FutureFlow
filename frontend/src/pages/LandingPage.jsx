import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8 animate-fade-in">
          <div className="inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-5xl font-bold text-white">F</span>
            </div>
          </div>
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            FutureFlow
          </h1>
          <p className="text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Personalized career roadmaps from 10th class to your dream job.
          </p>
          <Link 
            to="/signup" 
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-lg text-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Get Started
          </Link>
          <div className="mt-6">
            <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
              Already have an account? <span className="font-semibold">Login</span>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Complete Roadmaps</h3>
            <p className="text-gray-600 text-sm">Step-by-step guidance from 10th to your dream career</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
            <p className="text-gray-600 text-sm">Personalized recommendations based on your profile</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Community Support</h3>
            <p className="text-gray-600 text-sm">Connect with peers and get career guidance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
