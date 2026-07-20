import React from 'react';
import { useApp } from '../../context/AppContext';
import type { ScreenView } from '../../context/AppContext';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  BarChart3,
  Bot,
  User,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  Home,
  LogIn,
  X
} from 'lucide-react';

interface SidebarItem {
  id: ScreenView;
  label: string;
  icon: React.ElementType;
  badge?: string;
  adminOnly?: boolean;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'auth', label: 'Sign Up / Login', icon: LogIn, badge: 'Auth' },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'budgets', label: 'Budget Plan', icon: PieChart },
  { id: 'goals', label: 'Savings Goals', icon: Target },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'ai', label: 'AI Assistant', icon: Bot, badge: 'AI' },
  { id: 'profile', label: 'Profile & Settings', icon: User },
  { id: 'admin', label: 'Admin Panel', icon: ShieldAlert, adminOnly: true },
  { id: 'landing', label: 'App Overview', icon: Home }
];

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { currentView, setCurrentView, user, isLoggedIn } = useApp();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 z-50 h-full w-64 glass-card border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-4 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-5">
          
          {/* Mobile Header with Close Button */}
          <div className="flex items-center justify-between md:hidden pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">MoneyFlow Menu</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Quick Info */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-emerald-500/10 border border-blue-100 dark:border-blue-900/50">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/30"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{isLoggedIn ? user.name : 'Guest User'}</p>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 capitalize">
                    {isLoggedIn ? `${user.role} Plan` : 'Sign Up to Access'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Core Modules
            </p>

            {SIDEBAR_ITEMS.filter(item => !(item.adminOnly && user.role !== 'admin')).map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md glow-blue'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest rounded-full bg-emerald-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Portfolio Link Card */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <a
            href={user.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all text-center"
          >
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Project Author</p>
            <p className="text-xs font-extrabold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
              {user.authorName}
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </p>
            <p className="text-[10px] text-slate-400 mt-1 truncate">sablu-hasan.vercel.app</p>
          </a>
        </div>
      </aside>
    </>
  );
};
