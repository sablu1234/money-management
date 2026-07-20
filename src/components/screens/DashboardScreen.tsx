import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  PieChart as PieIcon,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  Bot,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#F59E0B',
  Transport: '#3B82F6',
  Shopping: '#EC4899',
  Entertainment: '#8B5CF6',
  Healthcare: '#10B981',
  Bills: '#EF4444',
  Salary: '#10B981',
  Freelancing: '#6366F1'
};

export const DashboardScreen: React.FC = () => {
  const {
    user,
    transactions,
    budgets,
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    totalSavings,
    remainingBudget,
    financialHealthScore,
    setCurrentView,
    setActiveModal
  } = useApp();

  // Data for Recharts Pie Chart (Expenses by Category)
  const categoryDataMap: Record<string, number> = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoryDataMap[t.category] = (categoryDataMap[t.category] || 0) + t.amount;
    });

  const pieChartData = Object.keys(categoryDataMap).map(cat => ({
    name: cat,
    value: categoryDataMap[cat]
  }));

  // Data for Income vs Expense Bar Chart
  const incomeVsExpenseData = [
    { name: 'Income', amount: monthlyIncome },
    { name: 'Expense', amount: monthlyExpenses },
    { name: 'Savings', amount: totalSavings }
  ];

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6 py-4 animate-in fade-in duration-300">
      
      {/* Welcome & Author Portfolio Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black">
              Welcome back, {user.name}!
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold capitalize">
              {user.role} Plan
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Here is your live personal money manager overview & health score.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setActiveModal('addTransaction')}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-extrabold text-xs shadow-lg glow-blue flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>

          <button
            onClick={() => setActiveModal('exportReport')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 backdrop-blur-md transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Top 5 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Balance */}
        <div className="glass-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Balance
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {user.currencySymbol}{totalBalance.toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +12.4% from last month
          </p>
        </div>

        {/* Monthly Income */}
        <div className="glass-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Monthly Income
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-500">
            {user.currencySymbol}{monthlyIncome.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">
            From Salary & Freelance
          </p>
        </div>

        {/* Monthly Expenses */}
        <div className="glass-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Monthly Expenses
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-500">
            {user.currencySymbol}{monthlyExpenses.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">
            7 category expenses
          </p>
        </div>

        {/* Savings Goals */}
        <div className="glass-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Savings Amount
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {user.currencySymbol}{totalSavings.toLocaleString()}
          </p>
          <p className="text-[10px] text-indigo-500 font-bold">
            Across 3 active goals
          </p>
        </div>

        {/* Remaining Budget */}
        <div className="glass-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Remaining Budget
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <PieIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-500">
            {user.currencySymbol}{remainingBudget.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">
            Safe spending limit
          </p>
        </div>

      </div>

      {/* Financial Health Score & AI Insight Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Health Score Meter */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Financial Health Score</h3>
            </div>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
              Excellent
            </span>
          </div>

          <div className="text-center py-2">
            <p className="text-5xl font-black bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 bg-clip-text text-transparent">
              {financialHealthScore} <span className="text-xs font-bold text-slate-400">/ 100</span>
            </p>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${financialHealthScore}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            Your savings ratio is currently <strong>{Math.round(((monthlyIncome - monthlyExpenses)/monthlyIncome)*100)}%</strong>. High health index for Sablu Hasan's portfolio!
          </p>
        </div>

        {/* AI Quick Insight Prompt */}
        <div className="md:col-span-2 glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-slate-900/10 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-600 text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">MoneyFlow AI Assistant</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Instant Smart Financial Recommendations</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('ai')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Open AI Chat <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <p className="font-bold text-blue-600 dark:text-blue-400">💡 AI Monthly Tip:</p>
            <p className="text-[11px] leading-relaxed">
              "Your top expense this month is <strong>Food & Dining ({user.currencySymbol}145.50)</strong>. Reducing dining out by 15% would save an extra <strong>{user.currencySymbol}22/month</strong> towards your MacBook Pro goal!"
            </p>
          </div>
        </div>

      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Income vs Expense Bar Chart */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Cash Flow Overview</span>
            <span className="text-xs text-slate-400 font-medium">July 2026</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeVsExpenseData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
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
                <Bar dataKey="amount" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Pie Chart */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Category Wise Spending</span>
            <span className="text-xs text-slate-400 font-medium">Breakdown</span>
          </h3>

          <div className="h-64 w-full flex items-center justify-center">
            {pieChartData.length === 0 ? (
              <p className="text-xs text-slate-400">No expense data recorded yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CATEGORY_COLORS[entry.name] || '#64748b'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Recent Transactions & Budget Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Transactions Table */}
        <div className="lg:col-span-2 glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Recent Transactions</h3>
            <button
              onClick={() => setCurrentView('transactions')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All ({transactions.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-extrabold text-slate-400 uppercase">
                  <th className="py-2 px-3">Title</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {recentTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                      {tx.title}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">{tx.date}</td>
                    <td
                      className={`py-2.5 px-3 text-right font-extrabold ${
                        tx.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}{user.currencySymbol}{tx.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Budget Warning Widget */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Budget Limits</span>
            </h3>
            <button
              onClick={() => setCurrentView('budgets')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3">
            {budgets.slice(0, 4).map(b => {
              const pct = Math.min(100, Math.round((b.spentAmount / b.monthlyLimit) * 100));
              return (
                <div key={b.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>{b.category}</span>
                    <span>{user.currencySymbol}{b.spentAmount} / {user.currencySymbol}{b.monthlyLimit} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct > 80 ? 'bg-rose-500' : pct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
