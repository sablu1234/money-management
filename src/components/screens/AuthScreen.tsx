import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Lock, User, Shield, ArrowRight } from 'lucide-react';
import type { UserRole } from '../../types';

export const AuthScreen: React.FC = () => {
  const { loginUser, switchRole } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('sablu.hasan.dev@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Sablu Hasan');
  const [selectedRole, setSelectedRole] = useState<UserRole>('premium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switchRole(selectedRole);
    loginUser(email);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="w-full max-w-md glass-card rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-white font-extrabold text-2xl mx-auto shadow-lg glow-blue">
            M
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {isLogin ? 'Welcome Back to MoneyFlow' : 'Create MoneyFlow Account'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Smart Personal Finance Manager by Sablu Hasan
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setIsLogin(true)}
            className={`py-2 rounded-xl transition-all ${
              isLogin
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`py-2 rounded-xl transition-all ${
              !isLogin
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Register
          </button>
        </div>

        {/* Quick Role Preset Demo Picker */}
        <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-2">
          <p className="text-[11px] font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            Quick Demo Role Selector
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {(['normal', 'premium', 'admin'] as UserRole[]).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRole(r)}
                className={`py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all ${
                  selectedRole === r
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-extrabold text-xs shadow-xl glow-blue flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span>{isLogin ? 'Sign In to Workspace' : 'Create Account & Access'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Google Button */}
        <div className="pt-2 text-center">
          <button
            onClick={() => {
              switchRole('premium');
              loginUser('sablu.hasan.google@gmail.com');
            }}
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};
