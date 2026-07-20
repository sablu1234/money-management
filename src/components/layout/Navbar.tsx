import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Sun,
  Moon,
  DollarSign,
  Plus,
  User,
  Shield,
  LogOut,
  ExternalLink,
  CheckCircle,
  Menu
} from 'lucide-react';
import type { UserRole } from '../../types';

export const Navbar: React.FC<{ onToggleMobileSidebar: () => void }> = ({ onToggleMobileSidebar }) => {
  const {
    user,
    notifications,
    toggleTheme,
    switchRole,
    setCurrentView,
    setActiveModal,
    markNotificationRead,
    clearAllNotifications,
    logoutUser,
    isLoggedIn
  } = useApp();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  return (
    <header className="sticky top-0 z-30 w-full glass-card border-b border-slate-200 dark:border-slate-800 px-4 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Brand & Mobile Sidebar Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setCurrentView(isLoggedIn ? 'dashboard' : 'landing')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-lg glow-blue group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 dark:from-white dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  MoneyFlow
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                  v2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Smart Personal Finance Manager
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Sablu Hasan Author Portfolio Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium">
          <span className="text-slate-500 dark:text-slate-400">Designed & Authored by</span>
          <a
            href={user.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            {user.authorName}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* Quick Add Transaction Button */}
          {isLoggedIn && (
            <button
              onClick={() => setActiveModal('addTransaction')}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Entry</span>
            </button>
          )}

          {/* Currency Switcher */}
          <button
            onClick={() => setActiveModal('converter')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Switch Currency & Converter"
          >
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span>{user.currency}</span>
          </button>

          {/* Role Switcher Demo Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold capitalize hover:bg-indigo-100 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{user.role} Role</span>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Demo Role
                </div>
                {(['normal', 'premium', 'admin'] as UserRole[]).map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setShowRoleMenu(false);
                      if (r === 'admin') setCurrentView('admin');
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg font-medium flex items-center justify-between capitalize ${
                      user.role === r
                        ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{r} User</span>
                    {user.role === r && <CheckCircle className="w-3.5 h-3.5 text-blue-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Toggle Dark/Light Mode"
          >
            {user.isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Notifications</h4>
                  <button
                    onClick={clearAllNotifications}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">
                      No new notifications
                    </p>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                          n.read
                            ? 'bg-slate-50 dark:bg-slate-800/40 border-transparent opacity-70'
                            : 'bg-blue-50/50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400">{n.date}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar Dropdown */}
          <div className="relative">
            {isLoggedIn ? (
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-500 transition-all"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                />
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('auth')}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
              >
                Sign In
              </button>
            )}

            {showProfileMenu && isLoggedIn && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                </div>

                <button
                  onClick={() => {
                    setCurrentView('profile');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <User className="w-4 h-4 text-blue-500" />
                  <span>Profile & Settings</span>
                </button>

                <a
                  href={user.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <ExternalLink className="w-4 h-4 text-emerald-500" />
                  <span>Sablu Hasan Portfolio</span>
                </a>

                <button
                  onClick={() => {
                    logoutUser();
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
