import { useEffect, useState } from 'react';

const SplashScreen = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center z-50">
      <div className={`text-center transition-all duration-1000 ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6 transform hover:rotate-6 transition-transform">
            <span className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">F</span>
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            FutureFlow
          </h1>
          <p className="text-xl text-blue-200 font-light">
            Transforming Career Confusion into Clear Roadmaps
          </p>
        </div>
        <div className="flex justify-center space-x-2 mt-8">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
