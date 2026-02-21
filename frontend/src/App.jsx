import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useState, useEffect, useContext } from 'react';
import SplashScreen from './components/SplashScreen';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ExploreCareers from './pages/ExploreCareers';
import CareerDetail from './pages/CareerDetail';
import MyCareerPath from './pages/MyCareerPath';
import HighDemandCourses from './pages/HighDemandCourses';
import CommunityForum from './pages/CommunityForum';
import Community from './pages/Community';
import AskQuestion from './pages/AskQuestion';
import QuestionDetail from './pages/QuestionDetail';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';

// Component to redirect logged-in users away from auth pages
const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/explore" element={<PrivateRoute><ExploreCareers /></PrivateRoute>} />
          <Route path="/career/:id" element={<PrivateRoute><CareerDetail /></PrivateRoute>} />
          <Route path="/my-career" element={<PrivateRoute><MyCareerPath /></PrivateRoute>} />
          <Route path="/high-demand" element={<PrivateRoute><HighDemandCourses /></PrivateRoute>} />
          <Route path="/forum" element={<PrivateRoute><CommunityForum /></PrivateRoute>} />
          <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
          <Route path="/community/ask" element={<PrivateRoute><AskQuestion /></PrivateRoute>} />
          <Route path="/community/question/:id" element={<PrivateRoute><QuestionDetail /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
