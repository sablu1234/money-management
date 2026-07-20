import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, ExternalLink, Globe, Moon, Sun, CheckCircle2, Smartphone, Shield, Key } from 'lucide-react';
import type { CurrencyCode } from '../../types';

export const ProfileScreen: React.FC = () => {
  const { user, toggleTheme, changeCurrency, adminPassword, changeAdminPassword } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [savedMsg, setSavedMsg] = useState('');

  // Change Admin Password state
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [passError, setPassError] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg('Profile settings saved successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleChangeAdminPass = (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg('');
    setPassError('');

    if (currentPassInput !== adminPassword) {
      setPassError('Current admin password is incorrect!');
      return;
    }

    if (newPassInput.length < 6) {
      setPassError('New password must be at least 6 characters long.');
      return;
    }

    changeAdminPassword(newPassInput);
    setPassMsg('Admin password updated successfully! Use your new password for next login.');
    setCurrentPassInput('');
    setNewPassInput('');
    setTimeout(() => setPassMsg(''), 4000);
  };

  return (
    <div className="space-y-6 py-4 animate-in fade-in duration-300 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-500/30 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">{user.name}</h1>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-xs font-extrabold uppercase capitalize">
                {user.role} Member
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
          </div>
        </div>

        <a
          href={user.portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-slate-800"
        >
          <span>Portfolio Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
        </a>
      </div>

      {savedMsg && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Change Password Card for Sablu Hasan (Admin) */}
      {user.role === 'admin' && (
        <div className="glass-card p-6 rounded-3xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-500/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-500" />
              Change Secret Admin Password
            </h3>
            <span className="text-[11px] font-bold text-indigo-500 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Sablu Hasan Only
            </span>
          </div>

          {passError && (
            <p className="text-xs font-bold text-rose-500">{passError}</p>
          )}

          {passMsg && (
            <p className="text-xs font-bold text-emerald-500">{passMsg}</p>
          )}

          <form onSubmit={handleChangeAdminPass} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Current Password</label>
              <input
                type="password"
                required
                placeholder="Current Admin Pass"
                value={currentPassInput}
                onChange={e => setCurrentPassInput(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">New Password</label>
              <input
                type="password"
                required
                placeholder="New Admin Pass"
                value={newPassInput}
                onChange={e => setNewPassInput(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Profile Forms & Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Details */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            Account Information
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Author Portfolio URL
              </label>
              <input
                type="text"
                disabled
                value={user.portfolioUrl}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow"
            >
              Save Details
            </button>
          </form>
        </div>

        {/* App Preferences */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-500" />
            Preferences & Currency
          </h3>

          <div className="space-y-4 text-xs">
            
            {/* Currency Selector */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Primary Currency
              </label>
              <select
                value={user.currency}
                onChange={e => changeCurrency(e.target.value as CurrencyCode)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              >
                <option value="USD">USD ($ - US Dollar)</option>
                <option value="BDT">BDT (৳ - Bangladeshi Taka)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
                <option value="JPY">JPY (¥ - Japanese Yen)</option>
              </select>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                {user.isDarkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-slate-600" />}
                <span className="font-bold text-slate-800 dark:text-slate-200">Dark Mode Theme</span>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  user.isDarkMode ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    user.isDarkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Mobile PWA Info Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-200 dark:border-blue-800 space-y-1">
              <div className="flex items-center gap-1.5 font-extrabold text-blue-600 dark:text-blue-400">
                <Smartphone className="w-4 h-4" />
                <span>Mobile PWA & APK Status</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                This app supports 1-click home screen installation via PWA manifest or Capacitor offline APK build!
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
