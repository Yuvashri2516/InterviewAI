/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Navigate, Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { 
  LayoutDashboard, 
  FileText, 
  Video, 
  History, 
  Settings, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  BrainCircuit,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProtectedRouteLayout() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-500"></div>
            <BrainCircuit className="absolute h-6 w-6 text-blue-600 dark:text-blue-500 animate-pulse" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Restoring premium interview session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Evaluation', path: '/resume', icon: FileText },
    { name: 'Start Interview', path: '/setup', icon: Video },
    { name: 'Performance History', path: '/history', icon: History },
    { name: 'Profile Settings', path: '/profile', icon: UserIcon },
    { name: 'Platform Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getBreadcrumbName = (pathname: string) => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return 'Home';
    
    const formattedMap: Record<string, string> = {
      dashboard: 'Dashboard',
      resume: 'Resume Upload',
      setup: 'Interview Setup',
      interview: 'Active Session',
      results: 'Report Evaluation',
      history: 'History & Analytics',
      profile: 'User Profile',
      settings: 'Settings',
    };

    // If active session has nested routes
    if (parts[0] === 'interview') return 'Interview Screen';
    if (parts[0] === 'results') return 'Interview Results';

    return formattedMap[parts[0]] || parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 select-none">
        {/* Brand Header */}
        <div className="flex h-16 items-center px-6 gap-3 border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-500 text-white shadow-md shadow-blue-500/20">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            InterviewAI
          </span>
        </div>

        {/* User Quick Info */}
        <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/30">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || '')}`}
              alt={user?.name}
              className="h-10 w-10 rounded-lg object-cover bg-slate-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-slate-800 dark:text-slate-200">{user?.name}</p>
              <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                <Award className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span className="font-medium">{user?.streakCount}-Day Streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                id={`sidebar-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                to={item.path}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all focus:outline-hidden ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-lg bg-blue-600 dark:bg-blue-400"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/50">
          <button
            id="sidebar-logout-btn"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 rounded-xl text-sm font-medium transition-all hover:bg-red-50 dark:hover:bg-red-950/20 focus:outline-hidden"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. MAIN APPLICATION CONTENT SHELL */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-8 shrink-0">
          
          {/* Breadcrumbs & Mobile Trigger */}
          <div className="flex items-center gap-4">
            <button
              id="mobile-menu-trigger"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden focus:outline-hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb List */}
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              <span className="hidden sm:inline">InterviewAI</span>
              <ChevronRight className="h-4 w-4 shrink-0 hidden sm:inline" />
              <span className="text-slate-900 dark:text-slate-200 font-semibold">{getBreadcrumbName(location.pathname)}</span>
            </div>
          </div>

          {/* Topbar Utility Actions */}
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

            {/* Quick Profile Icon Link */}
            <Link
              id="topbar-profile-link"
              to="/profile"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-hidden"
            >
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || '')}`}
                alt={user?.name}
                className="h-8 w-8 rounded-full object-cover bg-slate-200 border border-slate-200 dark:border-slate-700"
              />
              <span className="hidden lg:inline text-sm font-medium text-slate-700 dark:text-slate-300">{user?.name.split(' ')[0]}</span>
            </Link>
          </div>
        </header>

        {/* Route Outlet */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* 3. MOBILE MENU SIDEBAR OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
            />

            {/* Slide-out Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 md:hidden"
            >
              {/* Header */}
              <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-500 text-white">
                    <BrainCircuit className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    InterviewAI
                  </span>
                </div>
                <button
                  id="mobile-menu-close"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Profile Card */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || '')}`}
                    alt={user?.name}
                    className="h-10 w-10 rounded-lg object-cover bg-slate-200"
                  />
                  <div>
                    <p className="text-sm font-semibold truncate text-slate-800 dark:text-slate-200">{user?.name}</p>
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      <Award className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span className="font-medium">{user?.streakCount}-Day Streak</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Signout */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800/50">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 rounded-xl text-sm font-medium transition-all"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
