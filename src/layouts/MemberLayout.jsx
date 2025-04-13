import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  CreditCard, 
  Wallet, 
  FileText, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MemberLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/member/dashboard', 
      icon: LayoutDashboard 
    },
    { 
      name: 'Profile', 
      href: '/member/profile', 
      icon: User 
    },
    { 
      name: 'Contributions', 
      href: '/member/contributions', 
      icon: CreditCard 
    },
    { 
      name: 'Share Capital', 
      href: '/member/share-capital', 
      icon: Wallet 
    },
    { 
      name: 'Loan Application', 
      href: '/member/loan-application', 
      icon: FileText 
    },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile Sidebar */}
      <div 
        className={`
          fixed inset-0 z-40 md:hidden 
          ${sidebarOpen ? 'block' : 'hidden'}
        `}
      >
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-gray-600 bg-opacity-75" 
          onClick={() => setSidebarOpen(false)}
        />
        
        {/* Sidebar Content */}
        <div 
          className="
            relative flex-1 flex flex-col w-64 max-w-xs 
            bg-white shadow-xl h-full
            transform transition-transform duration-300 ease-in-out
          "
        >
          {/* Close Button */}
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Logo and Title */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">SACCO System</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center p-3 rounded-lg transition-all duration-200 ease-in-out
                  ${location.pathname === item.href 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button 
              onClick={handleLogout}
              className="
                w-full flex items-center p-3 
                text-red-600 hover:bg-red-50 
                rounded-lg transition-all duration-200
              "
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          {/* Logo and Title */}
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">SACCO System</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center p-3 rounded-lg transition-all duration-200 ease-in-out
                  ${location.pathname === item.href 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button 
              onClick={handleLogout}
              className="
                w-full flex items-center p-3 
                text-red-600 hover:bg-red-50 
                rounded-lg transition-all duration-200
              "
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Mobile Menu Toggle */}
            <button 
              type="button" 
              className="md:hidden text-gray-500 hover:text-gray-600"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Page Title */}
            <h1 className="text-xl font-semibold text-gray-800">
              {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
            </h1>

            {/* User Profile */}
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="mr-3 text-right">
                  <p className="text-sm font-medium text-gray-700">
                    {currentUser?.full_name || currentUser?.email}
                  </p>
                </div>
                <div 
                  className="
                    h-10 w-10 rounded-full 
                    bg-blue-100 flex items-center justify-center
                    text-blue-600 font-semibold
                  "
                >
                  {currentUser?.full_name 
                    ? currentUser.full_name.charAt(0).toUpperCase() 
                    : 'U'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MemberLayout;