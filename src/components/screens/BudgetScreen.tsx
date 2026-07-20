import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PieChart, Plus, AlertTriangle, X } from 'lucide-react';

export const BudgetScreen: React.FC = () => {
  const { budgets, addBudget, updateBudgetLimit, user } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newLimit, setNewLimit] = useState('');

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory || !newLimit) return;

    addBudget({
      category: newCategory,
      monthlyLimit: parseFloat(newLimit),
      period: 'July 2026'
    });

    setNewCategory('');
    setNewLimit('');
    setShowAddModal(false);
  };

  const totalBudgetLimit = budgets.reduce((acc, b) => acc + b.monthlyLimit, 0);
  const overallSpent = budgets.reduce((acc, b) => acc + b.spentAmount, 0);
  const overallPct = Math.min(100, Math.round((overallSpent / totalBudgetLimit) * 100));

  return (
    <div className="space-y-6 py-4 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-6 h-6 text-blue-500" />
            Category Budget Planning
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage monthly spending thresholds and get 80%+ limit warning alerts
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-extrabold text-xs shadow-md glow-blue flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Budget Category</span>
        </button>
      </div>

      {/* Overall Budget Status Progress Card */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-extrabold">
          <span className="text-slate-700 dark:text-slate-300">Total Monthly Budget Usage</span>
          <span className={overallPct > 80 ? 'text-rose-500' : 'text-emerald-500'}>
            {user.currencySymbol}{overallSpent.toFixed(2)} / {user.currencySymbol}{totalBudgetLimit.toFixed(2)} ({overallPct}%)
          </span>
        </div>

        <div className="w-full bg-slate-200 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              overallPct > 80 ? 'bg-rose-500' : 'bg-gradient-to-r from-blue-600 to-emerald-500'
            }`}
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </div>

      {/* Grid of Category Budgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map(b => {
          const pct = Math.min(100, Math.round((b.spentAmount / b.monthlyLimit) * 100));
          const isWarning = pct >= 80;

          return (
            <div
              key={b.id}
              className={`glass-card p-5 rounded-3xl border transition-all space-y-4 ${
                isWarning
                  ? 'border-rose-300 dark:border-rose-900/60 bg-rose-500/5'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {b.category}
                </span>
                {isWarning && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-extrabold animate-pulse">
                    <AlertTriangle className="w-3 h-3" />
                    Over 80% Used
                  </span>
                )}
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                  <span>Spent: {user.currencySymbol}{b.spentAmount.toFixed(2)}</span>
                  <span>Limit: {user.currencySymbol}{b.monthlyLimit}</span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pct >= 80 ? 'bg-rose-500' : pct >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Quick Limit Adjuster */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 text-[11px]">Adjust Limit:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateBudgetLimit(b.id, Math.max(50, b.monthlyLimit - 50))}
                    className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200"
                  >
                    -
                  </button>
                  <span className="font-bold px-1 text-slate-900 dark:text-white">
                    {user.currencySymbol}{b.monthlyLimit}
                  </span>
                  <button
                    onClick={() => updateBudgetLimit(b.id, b.monthlyLimit + 50)}
                    className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Budget Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="w-full max-w-sm glass-card rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Create Category Budget</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBudget} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Travel / Subscriptions"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Monthly Limit ({user.currencySymbol})
                </label>
                <input
                  type="number"
                  required
                  placeholder="300"
                  value={newLimit}
                  onChange={e => setNewLimit(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-xs font-extrabold shadow-md"
              >
                Save Budget Limit
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
