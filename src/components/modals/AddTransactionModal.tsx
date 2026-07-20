import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Upload, Calendar, Tag, CreditCard, FileText } from 'lucide-react';
import type { TransactionType, PaymentMethod } from '../../types';

const CATEGORIES_BY_TYPE = {
  income: ['Salary', 'Freelancing', 'Business', 'Investment', 'Other Income'],
  expense: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Healthcare', 'Bills', 'Education', 'Travel', 'Others']
};

const PAYMENT_METHODS: PaymentMethod[] = [
  'Cash',
  'Bank Account',
  'Credit Card',
  'Debit Card',
  'Mobile Banking'
];

export const AddTransactionModal: React.FC = () => {
  const { activeModal, setActiveModal, addTransaction, user } = useApp();

  const [type, setType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES_BY_TYPE.expense[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Credit Card');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [receiptName, setReceiptName] = useState<string | null>(null);

  if (activeModal !== 'addTransaction') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || parseFloat(amount) <= 0) return;

    addTransaction({
      title,
      amount: parseFloat(amount),
      type,
      category,
      paymentMethod,
      date,
      status: 'Completed',
      notes,
      receiptUrl: receiptName ? 'simulated_receipt.jpg' : undefined
    });

    setActiveModal(null);
  };

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptName(e.target.files[0].name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-card rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Add Financial Transaction
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Record new income or expense for Sablu Hasan's portfolio manager
            </p>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Toggle */}
        <div className="grid grid-cols-2 gap-2 my-4 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setType('expense');
              setCategory(CATEGORIES_BY_TYPE.expense[0]);
            }}
            className={`py-2 text-xs font-extrabold rounded-xl transition-all ${
              type === 'expense'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Expense (-)
          </button>
          <button
            type="button"
            onClick={() => {
              setType('income');
              setCategory(CATEGORIES_BY_TYPE.income[0]);
            }}
            className={`py-2 text-xs font-extrabold rounded-xl transition-all ${
              type === 'income'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Income (+)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Title / Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder={type === 'income' ? 'e.g. Freelance Web App' : 'e.g. Weekly Grocery'}
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Amount ({user.currencySymbol})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-emerald-500">
                  {user.currencySymbol}
                </span>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-extrabold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Category & Payment Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {CATEGORIES_BY_TYPE[type].map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Payment Method
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {PAYMENT_METHODS.map(pm => (
                    <option key={pm} value={pm}>
                      {pm}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Receipt Upload & Notes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Receipt Attachment
              </label>
              <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 cursor-pointer bg-slate-50 dark:bg-slate-900/30 text-xs font-medium text-slate-600 dark:text-slate-400">
                <Upload className="w-4 h-4 text-blue-500" />
                <span className="truncate">{receiptName || 'Upload Receipt'}</span>
                <input type="file" accept="image/*" onChange={handleReceiptChange} className="hidden" />
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="Additional details..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-1/2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white text-xs font-extrabold shadow-lg shadow-blue-500/20"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
