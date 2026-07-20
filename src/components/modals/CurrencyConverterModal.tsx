import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, DollarSign, CheckCircle } from 'lucide-react';
import type { CurrencyCode } from '../../types';

const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  BDT: 118.5,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 155.2
};

export const CurrencyConverterModal: React.FC = () => {
  const { activeModal, setActiveModal, user, changeCurrency } = useApp();

  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('USD');
  const [toCurrency, setToCurrency] = useState<CurrencyCode>(user.currency);
  const [amount, setAmount] = useState<number>(100);

  if (activeModal !== 'converter') return null;

  const convertedAmount = (
    (amount / EXCHANGE_RATES[fromCurrency]) *
    EXCHANGE_RATES[toCurrency]
  ).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-card rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Multi-Currency & Exchange Rates
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Select app display currency or calculate live conversions
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Set Active App Currency */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Set Primary App Display Currency
          </p>
          <div className="grid grid-cols-5 gap-2">
            {(['USD', 'BDT', 'EUR', 'GBP', 'JPY'] as CurrencyCode[]).map(c => (
              <button
                key={c}
                onClick={() => changeCurrency(c)}
                className={`py-2 rounded-xl text-xs font-extrabold flex flex-col items-center justify-center transition-all ${
                  user.currency === c
                    ? 'bg-blue-600 text-white shadow-md glow-blue'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>{c}</span>
                {user.currency === c && <CheckCircle className="w-3 h-3 mt-0.5 text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Calculator */}
        <div className="space-y-4">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Live Rate Calculator
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">From</label>
              <select
                value={fromCurrency}
                onChange={e => setFromCurrency(e.target.value as CurrencyCode)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
              >
                {(['USD', 'BDT', 'EUR', 'GBP', 'JPY'] as CurrencyCode[]).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">To</label>
              <select
                value={toCurrency}
                onChange={e => setToCurrency(e.target.value as CurrencyCode)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
              >
                {(['USD', 'BDT', 'EUR', 'GBP', 'JPY'] as CurrencyCode[]).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 text-center">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Converted Result</p>
            <p className="text-xl font-black text-emerald-500 mt-1">
              {convertedAmount} {toCurrency}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <button
            onClick={() => setActiveModal(null)}
            className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold dark:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
