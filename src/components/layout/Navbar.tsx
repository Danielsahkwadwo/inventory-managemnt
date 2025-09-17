import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, Search, User, X } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import NotificationDropdown from '../notifications/NotificationDropdown';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { unreadCount } = useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded-md"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <Menu size={24} />
            </button>
            
            <div className={`ml-4 ${isSearchOpen ? 'block w-full' : 'hidden md:block'}`}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="search"
                  placeholder="Search inventory..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          
          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Mobile search button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              onClick={toggleSearch}
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
            
            {/* Notifications */}
            <div className="relative">
              <button
                className="flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                onClick={toggleNotifications}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
            </div>
            
            {/* User menu */}
            <div className="relative">
              <button
                className="flex items-center focus:outline-none"
                onClick={() => navigate('/profile')}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User avatar"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User size={20} className="text-blue-700" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;