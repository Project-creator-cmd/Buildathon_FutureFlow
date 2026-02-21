import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ConfirmModal from './ConfirmModal';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { path: '/explore', label: 'Explore Careers', icon: '🔍' },
    { path: '/my-career', label: 'My Career Path', icon: '🎯' },
    { path: '/high-demand', label: 'High-Demand Courses', icon: '📈' },
    { path: '/forum', label: 'Community Forum', icon: '💬' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              FutureFlow
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                location.pathname === item.path
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
      />
    </>
  );
};

export default Sidebar;
