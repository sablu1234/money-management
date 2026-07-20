import React, { useState } from 'react';
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
  ChevronRight,
  Target,
  Edit2,
  Calendar,
  Sparkles,
  CheckCircle2,
  X,
  Check
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
    monthlySavingsHistory,
    updateRunningMonthTargetBudget,
    updateAccumulatedSavingsAmount,
    rolloverRemainingSavingsToNextMonth,
    correctMonthlySavingsHistoryItem,
    setCurrentView,
    setActiveModal
  } = useApp();

  // Budget & Savings Target States
  const [editingTargetBudget, setEditingTargetBudget] = useState(false);
  const [targetBudgetInput, setTargetBudgetInput] = useState(user.runningMonthTargetBudget ? String(user.runningMonthTargetBudget) : '1500');

  const [editingSavings, setEditingSavings] = useState(false);
  const [savingsInput, setSavingsInput] = useState(String(user.totalAccumulatedSavings || 0));

  // Edit Monthly Savings History Correction State
  const [editingMonthLabel, setEditingMonthLabel] = useState<string | null>(null);
  const [monthSavingsInput, setMonthSavingsInput] = useState('');

  const [rolloverSuccess, setRolloverSuccess] = useState('');

  // Current Running Month Spend Calculation
  const currentMonthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const runningMonthTarget = user.runningMonthTargetBudget || 1500;
  const runningMonthSpendPct = Math.min(100, Math.round((monthlyExpenses / runningMonthTarget) * 100));
  const currentMonthSavings = Math.max(0, monthlyIncome - monthlyExpenses);

  const handleSaveTargetBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(targetBudgetInput);
    if (!isNaN(val) && val >= 0) {
      updateRunningMonthTargetBudget(val);
      setEditingTargetBudget(false);
    }
  };

  const handleSaveSavings = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(savingsInput);
    if (!isNaN(val) && val >= 0) {
      updateAccumulatedSavingsAmount(val);
      setEditingSavings(false);
    }
  };

  const handleCorrectMonthSavings = (monthLabel: string) => {
    const val = parseFloat(monthSavingsInput);
    if (!isNaN(val) && val >= 0) {
      correctMonthlySavingsHistoryItem(monthLabel, val);
      setEditingMonthLabel(null);
      setMonthSavingsInput('');
    }
  };

  const handleRollover = () => {
    rolloverRemainingSavingsToNextMonth();
    setRolloverSuccess(`Rolled over ${user.currencySymbol}${currentMonthSavings.toFixed(2)} to next month's savings!`);
    setTimeout(() => setRolloverSuccess(''), 4000);
  };

  // Recharts Data
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

  const incomeVsExpenseData = [
    { name: 'Income', amount: monthlyIncome },
    { name: 'Expense', amount: monthlyExpenses },
    { name: 'Savings', amount: currentMonthSavings }
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
              {user.role} Member
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Running Month: <strong className="text-emerald-400">{currentMonthName}</strong> overview & budget tracker.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setActiveModal('addTransaction')}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-extrabold text-xs shadow-lg glow-blue flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Entry</span>
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

      {/* Running Month Target Budget & Savings Tracker Header Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Running Month Target Budget */}
        <div className="glass-card p-6 rounded-3xl border border-blue-200 dark:border-blue-900/60 bg-blue-500/5 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500 text-white">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white">Target Budget ({currentMonthName})</h3>
                <p className="text-[11px] text-slate-400">Monthly Spending Cap</p>
              </div>
            </div>
            <button
              onClick={() => setEditingTargetBudget(!editingTargetBudget)}
              className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-200 text-xs font-bold flex items-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Target
            </button>
          </div>

          {editingTargetBudget ? (
            <form onSubmit={handleSaveTargetBudget} className="flex gap-2">
              <input
                type="number"
                value={targetBudgetInput}
                onChange={e => setTargetBudgetInput(e.target.value)}
                className="flex-1 p-2 rounded-xl border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 text-xs font-bold"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Save
              </button>
            </form>
          ) : (
            <div>
              <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                {user.currencySymbol}{runningMonthTarget.toLocaleString()}
              </p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                  <span>Spent: {user.currencySymbol}{monthlyExpenses.toFixed(2)}</span>
                  <span>{runningMonthSpendPct}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      runningMonthSpendPct > 80 ? 'bg-rose-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${runningMonthSpendPct}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          <p className="text-[11px] text-slate-400">
            Remaining Cap: <strong className="text-slate-900 dark:text-white">{user.currencySymbol}{remainingBudget.toFixed(2)}</strong>
          </p>
        </div>

        {/* Card 2: Current Month Savings & Rollover Action */}
        <div className="glass-card p-6 rounded-3xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-500/5 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500 text-white">
                <PiggyBank className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white">Month Net Savings</h3>
                <p className="text-[11px] text-slate-400">Income minus Expenses</p>
              </div>
            </div>
            <button
              onClick={() => setEditingSavings(!editingSavings)}
              className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 text-xs font-bold flex items-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5" /> Correct Total
            </button>
          </div>

          {editingSavings ? (
            <form onSubmit={handleSaveSavings} className="flex gap-2">
              <input
                type="number"
                value={savingsInput}
                onChange={e => setSavingsInput(e.target.value)}
                className="flex-1 p-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-xs font-bold"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Save
              </button>
            </form>
          ) : (
            <div>
              <p className="text-3xl font-black text-emerald-500">
                {user.currencySymbol}{currentMonthSavings.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Total Accumulation: <strong className="text-emerald-400">{user.currencySymbol}{totalSavings.toLocaleString()}</strong>
              </p>
            </div>
          )}

          {rolloverSuccess && (
            <p className="text-xs font-bold text-emerald-500 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {rolloverSuccess}
            </p>
          )}

          <button
            onClick={handleRollover}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Rollover Savings to Next Month</span>
          </button>
        </div>

        {/* Card 3: Month-by-Month Savings History with Correction Controls */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>Savings History & Correction</span>
            </h3>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {monthlySavingsHistory.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{item.month}</p>
                    <p className="text-[10px] text-slate-400">Cap: {user.currencySymbol}{item.targetBudget}</p>
                  </div>

                  {editingMonthLabel === item.month ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        placeholder={String(item.savingsAchieved)}
                        value={monthSavingsInput}
                        onChange={e => setMonthSavingsInput(e.target.value)}
                        className="w-20 p-1 text-xs font-bold rounded border border-emerald-500 bg-white dark:bg-slate-800"
                      />
                      <button
                        onClick={() => handleCorrectMonthSavings(item.month)}
                        className="p-1 rounded bg-emerald-500 text-white hover:bg-emerald-600"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setEditingMonthLabel(null)}
                        className="p-1 rounded bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-right flex items-center gap-2">
                      <div>
                        <p className="font-black text-emerald-500">+{user.currencySymbol}{item.savingsAchieved}</p>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                          Rolled Over
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setEditingMonthLabel(item.month);
                          setMonthSavingsInput(String(item.savingsAchieved));
                        }}
                        className="p-1 text-slate-400 hover:text-blue-500 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Correct this month's savings amount"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top 5 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Balance */}
        <div className="glass-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Net Balance
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {user.currencySymbol}{totalBalance.toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Real-time Net Balance
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
            Running month credits
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
            Running month debits
          </p>
        </div>

        {/* Total Accumulated Savings */}
        <div className="glass-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Accumulated Savings
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {user.currencySymbol}{totalSavings.toLocaleString()}
          </p>
          <p className="text-[10px] text-indigo-500 font-bold">
            Total savings reserve
          </p>
        </div>

        {/* Remaining Cap */}
        <div className="glass-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Remaining Cap
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
            Your health score is calculated based on current month net savings and spending habits for Sablu Hasan.
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
              "You have set a Target Budget of <strong>{user.currencySymbol}{runningMonthTarget}</strong> for {currentMonthName}. You have currently spent <strong>{user.currencySymbol}{monthlyExpenses}</strong> ({runningMonthSpendPct}%). Great budget discipline!"
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
            <span className="text-xs text-slate-400 font-medium">{currentMonthName}</span>
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
              <p className="text-xs text-slate-400">No expense entries recorded yet for {currentMonthName}</p>
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
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">No transactions recorded yet</td>
                  </tr>
                ) : (
                  recentTransactions.map(tx => (
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
                  ))
                )}
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
            {budgets.length === 0 ? (
              <p className="text-xs text-slate-400">No category budget limits created yet</p>
            ) : (
              budgets.slice(0, 4).map(b => {
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
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
