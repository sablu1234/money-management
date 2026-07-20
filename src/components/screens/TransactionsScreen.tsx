import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Plus, Trash2, FileSpreadsheet, CheckCircle } from 'lucide-react';
import type { TransactionType } from '../../types';

export const TransactionsScreen: React.FC = () => {
  const { transactions, deleteTransaction, setActiveModal, user } = useApp();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  // Filtering
  const filtered = transactions.filter(t => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      (t.notes && t.notes.toLowerCase().includes(search.toLowerCase()));

    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortBy === 'highest') return b.amount - a.amount;
    if (sortBy === 'lowest') return a.amount - b.amount;
    return 0;
  });

  const allCategories = Array.from(new Set(transactions.map(t => t.category)));

  return (
    <div className="space-y-6 py-4 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            Transaction Ledger ({filtered.length})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Full record of Sablu Hasan's personal income and expenses
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveModal('addTransaction')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-extrabold text-xs shadow-md glow-blue flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Entry</span>
          </button>

          <button
            onClick={() => setActiveModal('exportReport')}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Export CSV / PDF</span>
          </button>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="glass-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search title, category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as any)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-bold text-slate-900 dark:text-white outline-none"
          >
            <option value="all">All Types</option>
            <option value="income">Income (+)</option>
            <option value="expense">Expense (-)</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-bold text-slate-900 dark:text-white outline-none"
          >
            <option value="all">All Categories</option>
            {allCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-bold text-slate-900 dark:text-white outline-none"
          >
            <option value="newest">Sort by Newest</option>
            <option value="oldest">Sort by Oldest</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>

        </div>
      </div>

      {/* Transaction Table Card */}
      <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Title / Notes</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No matching transactions found.
                  </td>
                </tr>
              ) : (
                sorted.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-400 font-medium whitespace-nowrap">
                      {tx.date}
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      <div>{tx.title}</div>
                      {tx.notes && (
                        <span className="text-[11px] font-normal text-slate-400 block truncate max-w-xs">
                          {tx.notes}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                        {tx.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                      {tx.paymentMethod}
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                        <CheckCircle className="w-3 h-3" />
                        {tx.status}
                      </span>
                    </td>

                    <td
                      className={`py-3 px-4 text-right font-black text-sm whitespace-nowrap ${
                        tx.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}{user.currencySymbol}{tx.amount.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
