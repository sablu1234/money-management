import React from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, Receipt, Plus, Bot, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentView, setCurrentView, setActiveModal, isLoggedIn } = useApp();

  if (!isLoggedIn) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-around shadow-2xl">
      <button
        onClick={() => setCurrentView('dashboard')}
        className={`flex flex-col items-center gap-1 ${
          currentView === 'dashboard' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      <button
        onClick={() => setCurrentView('transactions')}
        className={`flex flex-col items-center gap-1 ${
          currentView === 'transactions' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'
        }`}
      >
        <Receipt className="w-5 h-5" />
        <span className="text-[10px]">History</span>
      </button>

      {/* Floating Plus Button */}
      <button
        onClick={() => setActiveModal('addTransaction')}
        className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 text-white flex items-center justify-center shadow-lg -mt-6 ring-4 ring-white dark:ring-slate-900 active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>

      <button
        onClick={() => setCurrentView('ai')}
        className={`flex flex-col items-center gap-1 ${
          currentView === 'ai' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'
        }`}
      >
        <Bot className="w-5 h-5" />
        <span className="text-[10px]">AI Assistant</span>
      </button>

      <button
        onClick={() => setCurrentView('profile')}
        className={`flex flex-col items-center gap-1 ${
          currentView === 'profile' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px]">Profile</span>
      </button>
    </div>
  );
};
