import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Home, Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                MindMap Notes
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
                      : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};