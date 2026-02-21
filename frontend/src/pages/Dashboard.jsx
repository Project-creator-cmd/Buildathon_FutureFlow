import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const Dashboard = () => {
  const stats = [
    { label: 'Careers Explored', value: '12', icon: '🔍', color: 'from-blue-500 to-blue-600' },
    { label: 'Recommended Paths', value: '5', icon: '🎯', color: 'from-green-500 to-green-600' },
    { label: 'Skills to Learn', value: '8', icon: '📚', color: 'from-purple-500 to-purple-600' },
    { label: 'Forum Posts', value: '3', icon: '💬', color: 'from-orange-500 to-orange-600' },
  ];

  const quickActions = [
    { title: 'Explore Careers', desc: 'Browse 20+ career paths', link: '/explore', icon: '🔍', color: 'blue' },
    { title: 'My Career Path', desc: 'View personalized roadmaps', link: '/my-career', icon: '🎯', color: 'indigo' },
    { title: 'High-Demand Courses', desc: 'Trending career options', link: '/high-demand', icon: '📈', color: 'green' },
    { title: 'Community Forum', desc: 'Ask questions & discuss', link: '/forum', icon: '💬', color: 'purple' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
          <p className="text-gray-600">Track your career exploration journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center text-2xl mb-4`}>
                {stat.icon}
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {quickActions.map((action, idx) => (
              <Link
                key={idx}
                to={action.link}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-14 h-14 bg-${action.color}-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0`}>
                    {action.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-1">{action.title}</h4>
                    <p className="text-gray-600 text-sm">{action.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 pb-4 border-b">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">🔍</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">Explored Software Engineer career</p>
                <p className="text-gray-500 text-sm">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 pb-4 border-b">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">🎯</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">Generated personalized roadmap</p>
                <p className="text-gray-500 text-sm">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600">💬</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">Posted in Community Forum</p>
                <p className="text-gray-500 text-sm">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
