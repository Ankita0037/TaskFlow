import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUnreadCount } from '../../hooks';
import {
  Home,
  ListTodo,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Plus,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Main navigation header component
 */
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { count: unreadCount } = useUnreadCount();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/tasks', label: 'Tasks', icon: ListTodo },
  ];

  const isActiveLink = (href: string) => location.pathname === href;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Nav */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center flex-shrink-0 group">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <ListTodo className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent hidden sm:block">
                TaskFlow
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden sm:ml-10 sm:flex sm:space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200',
                    isActiveLink(link.href)
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/25'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <link.icon className="h-4 w-4 mr-2" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Create Task Button */}
            <Link
              to="/tasks/new"
              className="hidden sm:inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-sm font-semibold rounded-xl hover:from-primary-700 hover:to-accent-700 transition-all duration-300 shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/30 group"
            >
              <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              New Task
            </Link>

            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-bold text-white bg-gradient-to-r from-red-500 to-rose-500 rounded-full shadow-md animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md">
                  <span className="text-sm font-bold text-white">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Pro User
                  </p>
                </div>
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden backdrop-blur-sm">
                <div className="p-2">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Profile</p>
                      <p className="text-xs text-gray-500">Manage your account</p>
                    </div>
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <div className="p-2 bg-red-100 rounded-lg mr-3">
                      <LogOut className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Logout</p>
                      <p className="text-xs text-red-400">Sign out of your account</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center px-3 py-2 text-base font-medium rounded-md',
                  isActiveLink(link.href)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <link.icon className="h-5 w-5 mr-3" />
                {link.label}
              </Link>
            ))}
            <Link
              to="/tasks/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 text-base font-medium text-primary-600 hover:bg-primary-50 rounded-md"
            >
              <Plus className="h-5 w-5 mr-3" />
              New Task
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
