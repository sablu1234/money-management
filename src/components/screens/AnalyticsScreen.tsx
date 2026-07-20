import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, TrendingUp, Sparkles, Download, Calendar } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const MONTHLY_CASHFLOW = [
  { month: 'Jan', income: 3800, expense: 2100 },
  { month: 'Feb', income: 4200, expense: 2300 },
  { month: 'Mar', income: 4000, expense: 1900 },
  { month: 'Apr', income: 4500, expense: 2400 },
  { month: 'May', income: 4800, expense: 2200 },
  { month: 'Jun', income: 5200, expense: 2600 },
  { month: 'Jul', income: 5700, expense: 500.50 }
];

export const AnalyticsScreen: React.FC = () => {
  const { user, monthlyIncome, monthlyExpenses, totalSavings, setActiveModal } = useApp();

  return (
    <div className="space-y-6 py-4 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-500" />
            Financial Analytics & Smart Predictions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Yearly cash flow projections & expense trend breakdowns for Sablu Hasan
          </p>
        </div>

        <button
          onClick={() => setActiveModal('exportReport')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-extrabold text-xs shadow-md glow-blue flex items-center gap-1.5"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF Report</span>
        </button>
      </div>

      {/* Cashflow Trend Area Chart */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Yearly Income vs Expense Growth (2026)
          </h3>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1 text-emerald-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Income
            </span>
            <span className="flex items-center gap-1 text-rose-500">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Expense
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_CASHFLOW}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#incomeGrad)" />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#expenseGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Smart Predictive Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-blue-500">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-xs font-black uppercase tracking-wider">Projected Next Month Balance</h3>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {user.currencySymbol}{(monthlyIncome * 1.05 - monthlyExpenses).toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-400">Based on steady freelancing + salary growth</p>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-500">
            <TrendingUp className="w-5 h-5" />
            <h3 className="text-xs font-black uppercase tracking-wider">Estimated Annual Savings</h3>
          </div>
          <p className="text-2xl font-black text-emerald-500">
            {user.currencySymbol}{(totalSavings + (monthlyIncome - monthlyExpenses) * 5).toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-400">If current 74% savings rate is maintained</p>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-500">
            <Calendar className="w-5 h-5" />
            <h3 className="text-xs font-black uppercase tracking-wider">MacBook Goal Completion Date</h3>
          </div>
          <p className="text-2xl font-black text-amber-500">
            Sept 14, 2026
          </p>
          <p className="text-[11px] text-slate-400">Estimated 45 days ahead of schedule!</p>
        </div>
      </div>

    </div>
  );
};
