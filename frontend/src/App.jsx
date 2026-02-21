import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useState, useEffect } from 'react';
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
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';

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
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/explore" element={<PrivateRoute><ExploreCareers /></PrivateRoute>} />
          <Route path="/career/:id" element={<PrivateRoute><CareerDetail /></PrivateRoute>} />
          <Route path="/my-career" element={<PrivateRoute><MyCareerPath /></PrivateRoute>} />
          <Route path="/high-demand" element={<PrivateRoute><HighDemandCourses /></PrivateRoute>} />
          <Route path="/forum" element={<PrivateRoute><CommunityForum /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
