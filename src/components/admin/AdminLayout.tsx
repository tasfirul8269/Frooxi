import React, { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { FiMoon, FiSun, FiLogOut } from 'react-icons/fi';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6">Frooxi Admin</h1>
          <nav>
            <ul>
              <li className="mb-2">
                <Link to="/admin/dashboard" className="flex items-center hover:bg-gray-700 p-2 rounded transition-colors">
                  Dashboard
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/admin/portfolios" className="flex items-center hover:bg-gray-700 p-2 rounded transition-colors">
                  Portfolios
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/admin/subscriptions" className="flex items-center hover:bg-gray-700 p-2 rounded transition-colors">
                  Subscriptions
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/admin/team" className="flex items-center hover:bg-gray-700 p-2 rounded transition-colors">
                  Team Members
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/admin/users" className="flex items-center hover:bg-gray-700 p-2 rounded transition-colors">
                  Users
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="pt-4 border-t border-gray-700">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <span>Theme</span>
            {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-red-400"
          >
            <span>Logout</span>
            <FiLogOut size={18} />
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Admin Dashboard
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Admin User
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-800">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;