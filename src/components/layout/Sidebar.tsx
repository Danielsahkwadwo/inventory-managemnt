import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  BarChart3, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/inventory', icon: <Package size={20} />, label: 'Inventory' },
    { to: '/reports', icon: <BarChart3 size={20} />, label: 'Reports' },
    { to: '/profile', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <aside 
      className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-20'
      } flex flex-col h-full`}
    >
      {/* Logo and brand */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-blue-700 text-white p-2 rounded">
            <Package size={isOpen ? 24 : 20} />
          </div>
          {isOpen && <h1 className="ml-3 text-lg font-semibold">StockMaster</h1>}
        </div>
        <button 
          onClick={toggleSidebar} 
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      
      {/* Navigation links */}
      <nav className="flex-1 pt-5 pb-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {isOpen && <span className="ml-3">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User info and logout */}
      <div className="border-t p-4">
        <div className="flex items-center">
          {user?.avatar && (
            <img 
              src={user.avatar} 
              alt="User avatar" 
              className="h-8 w-8 rounded-full object-cover"
            />
          )}
          {isOpen && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.shopName || 'My Shop'}</p>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className={`mt-3 flex items-center w-full text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 ${
            !isOpen ? 'justify-center' : ''
          }`}
        >
          <LogOut size={20} />
          {isOpen && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;