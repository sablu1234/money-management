import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  Bot,
  PieChart,
  Smartphone,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export const LandingScreen: React.FC = () => {
  const { setCurrentView, user, isLoggedIn } = useApp();

  return (
    <div className="space-y-16 py-6 animate-in fade-in duration-300">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white p-8 md:p-14 shadow-2xl border border-slate-800">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Gen Personal Finance SaaS
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Master Your Money with <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              MoneyFlow Intelligence
            </span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
            Complete personal money management platform engineered by <strong className="text-white">Sablu Hasan</strong>. 
            Track income, expenses, budgets, savings goals, and get real-time AI spending insights with modern fintech aesthetics inspired by Revolut & YNAB.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setCurrentView(isLoggedIn ? 'dashboard' : 'auth')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-extrabold text-xs md:text-sm shadow-xl glow-blue flex items-center gap-2 transition-all active:scale-95"
            >
              <span>{isLoggedIn ? 'Go to Dashboard' : 'Launch Demo Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={user.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs md:text-sm flex items-center gap-2 backdrop-blur-md transition-all"
            >
              <span>Sablu Hasan Portfolio</span>
              <ExternalLink className="w-4 h-4 text-emerald-400" />
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 text-center md:text-left">
            <div>
              <p className="text-2xl md:text-3xl font-black text-white">$120k+</p>
              <p className="text-xs text-slate-400">Tracked Transactions</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-black text-emerald-400">99.9%</p>
              <p className="text-xs text-slate-400">Budget Accuracy</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-black text-blue-400">PWA & APK</p>
              <p className="text-xs text-slate-400">Mobile Ready</p>
            </div>
          </div>
        </div>
      </section>

      {/* Author Showcase Card */}
      <section className="glass-card rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.authorName}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-500/20 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Designed & Authored by {user.authorName}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-extrabold">
                Verified Creator
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Building high-performance, scalable web and mobile software with sleek fintech user interfaces and powerful state architecture.
            </p>
          </div>
        </div>

        <a
          href={user.portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full md:w-auto px-5 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
        >
          <span>Visit Portfolio (sablu-hasan.vercel.app)</span>
          <ExternalLink className="w-4 h-4 text-emerald-400" />
        </a>
      </section>

      {/* Core Features Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            Enterprise Features
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Everything You Need for Financial Freedom
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 hover:border-blue-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">AI Financial Assistant</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Ask natural language questions like "Where did I spend the most?" or "How to save $500?" and get instant data-driven advice.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Smart Category Budgeting</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Set monthly limits per category with real-time percentage progress bars and 80%+ threshold warning notifications.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 hover:border-indigo-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">PWA & Offline APK Ready</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Install as a standalone native-feeling app on Android/iOS home screens or export as an APK for offline use.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Select Your Plan</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Test both Free and Premium tiers anytime using the top Role Switcher.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Normal Plan</h3>
            <p className="text-3xl font-black text-slate-900 dark:text-white">$0 <span className="text-xs text-slate-400 font-medium">/ forever</span></p>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Basic Income & Expense Tracking</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Up to 3 Budget Categories</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Single Currency (USD)</li>
            </ul>
          </div>

          <div className="glass-card p-6 rounded-3xl border-2 border-blue-500 shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase">
              Pro Feature
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Premium Plan</h3>
            <p className="text-3xl font-black text-blue-600 dark:text-blue-400">$9.99 <span className="text-xs text-slate-400 font-medium">/ month</span></p>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited Transactions & Receipts</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Full AI Financial Assistant</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Multi-currency & CSV/PDF Export</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Admin Dashboard Access</li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
};
