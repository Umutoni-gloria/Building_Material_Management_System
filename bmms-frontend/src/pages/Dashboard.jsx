import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GlobalSearch from '../components/GlobalSearch';
import { mockApiService } from '../config/mockData';
import { navItems } from '../config/navigation';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load all necessary dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Load all data in parallel
        const [userProfile, dashStats, notifs] = await Promise.all([
          mockApiService.getUserProfile(),
          mockApiService.getDashboardStats(),
          mockApiService.getNotifications()
        ]);

        setUser(userProfile);
        setDashboardData(dashStats);
        setNotifications(notifs);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Set active nav based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = navItems.find(item => currentPath.startsWith(item.path));
    if (activeItem) {
      document.title = `${activeItem.name} | Build Materials`;
    }
  }, [location.pathname]);

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    
    // Redirect to login
    navigate('/login');
  };

  const markNotificationAsRead = async (id) => {
    try {
      await mockApiService.markNotificationAsRead(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-800 text-white transition-all duration-300 ease-in-out flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          {sidebarOpen && (
            <h1 className="text-xl font-bold flex items-center">
              <span className="bg-white text-blue-800 rounded px-2 mr-2">BM</span>
              BUILD MATERIALS
            </h1>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-1 rounded-md hover:bg-blue-700 transition-colors"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 ${location.pathname.startsWith(item.path) ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-colors duration-200`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {sidebarOpen && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Sidebar footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-blue-700 text-sm text-blue-200">
            <p>Build Materials v1.0.0</p>
            <p className="mt-1">© {new Date().getFullYear()} All Rights Reserved</p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <GlobalSearch />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  className="p-1 rounded-full hover:bg-gray-100 relative"
                  onClick={() => navigate('/admin/dashboard/notifications')}
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </div>
              
              <div className="relative group">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {user ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  {sidebarOpen && (
                    <span className="text-gray-700">
                      {user ? user.name : 'User'}
                    </span>
                  )}
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block border border-gray-200">
                  <Link 
                    to="/dashboard/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/dashboard/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading dashboard...</span>
              </div>
            ) : (
              <Outlet context={{ dashboardData, user, notifications, markNotificationAsRead }} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;