import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Target, Plus, Sparkles, X, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const GoalsScreen: React.FC = () => {
  const { goals, addGoal, depositToGoal, user } = useApp();

  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [depositModalGoalId, setDepositModalGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  // Add goal form states
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('2026-12-31');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount) return;

    addGoal({
      title,
      targetAmount: parseFloat(targetAmount),
      deadline,
      category: 'Technology',
      icon: 'Target',
      autoSaveMonthly: 200
    });

    setTitle('');
    setTargetAmount('');
    setShowAddGoalModal(false);
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositModalGoalId || !depositAmount || parseFloat(depositAmount) <= 0) return;

    const goal = goals.find(g => g.id === depositModalGoalId);
    const amt = parseFloat(depositAmount);
    depositToGoal(depositModalGoalId, amt);

    if (goal && (goal.currentAmount + amt) >= goal.targetAmount) {
      // Fire celebration confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setDepositModalGoalId(null);
    setDepositAmount('');
  };

  return (
    <div className="space-y-6 py-4 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-500" />
            Financial Savings Goals
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track progress for Sablu Hasan's tech gear, emergency funds, and vacation plans
          </p>
        </div>

        <button
          onClick={() => setShowAddGoalModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-extrabold text-xs shadow-md glow-blue flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Savings Goal</span>
        </button>
      </div>

      {/* Grid of Goals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map(goal => {
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const isComplete = goal.currentAmount >= goal.targetAmount;

          return (
            <div
              key={goal.id}
              className={`glass-card p-6 rounded-3xl border transition-all space-y-4 relative overflow-hidden flex flex-col justify-between ${
                isComplete
                  ? 'border-emerald-500/50 bg-emerald-500/5'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {isComplete && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Reached!
                </div>
              )}

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-emerald-500/20 flex items-center justify-center text-blue-500">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">{goal.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Target Deadline: <span className="font-bold text-slate-700 dark:text-slate-300">{goal.deadline}</span>
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Saved: {user.currencySymbol}{goal.currentAmount.toLocaleString()}</span>
                  <span>Target: {user.currencySymbol}{goal.targetAmount.toLocaleString()}</span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-right text-[11px] font-extrabold text-emerald-500">{pct}% Achieved</p>
              </div>

              {/* Deposit Button */}
              <button
                onClick={() => setDepositModalGoalId(goal.id)}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Deposit Savings</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="w-full max-w-sm glass-card rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Create Savings Goal</h3>
              <button onClick={() => setShowAddGoalModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New iPhone / Car Fund"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Amount ({user.currencySymbol})
                </label>
                <input
                  type="number"
                  required
                  placeholder="1500"
                  value={targetAmount}
                  onChange={e => setTargetAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Deadline
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-xs font-extrabold shadow-md"
              >
                Create Goal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {depositModalGoalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="w-full max-w-xs glass-card rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Deposit to Goal</h3>
              <button onClick={() => setDepositModalGoalId(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeposit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Amount to Deposit ({user.currencySymbol})
                </label>
                <input
                  type="number"
                  required
                  placeholder="100"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-extrabold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-extrabold shadow-md"
              >
                Confirm Deposit
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
