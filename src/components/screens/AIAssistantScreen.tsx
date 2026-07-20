import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bot, Send, Sparkles, RefreshCw, Lightbulb } from 'lucide-react';

const PRESET_PROMPTS = [
  "Where did I spend the most money this month?",
  "How can I save $500 in 60 days?",
  "Analyze my overall spending habits",
  "How much can I afford to invest in tech gear?"
];

export const AIAssistantScreen: React.FC = () => {
  const { user, transactions, monthlyIncome, monthlyExpenses, aiHistory, addAIQuery } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleAsk = (queryText: string) => {
    if (!queryText.trim()) return;

    setIsTyping(true);
    const text = queryText;
    setInputQuery('');

    setTimeout(() => {
      let aiReply = '';
      const lower = text.toLowerCase();

      if (lower.includes('where did i spend') || lower.includes('most money')) {
        const catMap: Record<string, number> = {};
        transactions.filter(t => t.type === 'expense').forEach(t => {
          catMap[t.category] = (catMap[t.category] || 0) + t.amount;
        });
        const highestCategory = Object.keys(catMap).sort((a, b) => catMap[b] - catMap[a])[0] || 'Food';
        const highestAmt = catMap[highestCategory] || 145.50;

        aiReply = `Based on your live transactions for Sablu Hasan, your highest spending category this month is **${highestCategory}** totaling **${user.currencySymbol}${highestAmt.toFixed(2)}** (${Math.round((highestAmt/monthlyExpenses)*100)}% of your total expenses). Cutting back slightly on ${highestCategory} will instantly free up extra cashflow!`;
      } else if (lower.includes('save') || lower.includes('500')) {
        aiReply = `To save **${user.currencySymbol}500** over 60 days:\n1. Set aside **${user.currencySymbol}8.33 per day** automatically into your Emergency Fund.\n2. Reallocate 10% from your Entertainment & Shopping budgets.\n3. Your current net monthly savings buffer is already **${user.currencySymbol}${(monthlyIncome - monthlyExpenses).toFixed(2)}**, so you can reach this target effortlessly in under 30 days!`;
      } else if (lower.includes('analyze') || lower.includes('habit')) {
        aiReply = `📊 **MoneyFlow Financial Analysis for ${user.name}**:\n- **Savings Rate**: Exceptional! You save **${Math.round(((monthlyIncome - monthlyExpenses)/monthlyIncome)*100)}%** of your income.\n- **Cashflow**: Total Income is ${user.currencySymbol}${monthlyIncome.toLocaleString()} vs Expenses of ${user.currencySymbol}${monthlyExpenses.toLocaleString()}.\n- **Recommendation**: Your budget is extremely healthy. Consider automating deposits into your MacBook Pro M3 savings goal to finish it 1 month early!`;
      } else {
        aiReply = `I analyzed your portfolio data for Sablu Hasan! You currently have **${transactions.length} active transaction records**, a net monthly surplus of **${user.currencySymbol}${(monthlyIncome - monthlyExpenses).toFixed(2)}**, and 3 active savings goals. Your financial trajectory is very strong!`;
      }

      addAIQuery(text, aiReply);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="space-y-6 py-4 animate-in fade-in duration-300 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 text-white flex items-center justify-center shadow-lg glow-blue">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              AI Financial Assistant
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized spending insights & advice powered by MoneyFlow AI
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-extrabold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Active
        </span>
      </div>

      {/* Preset Prompts Chips */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          Quick Questions You Can Ask:
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESET_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(prompt)}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors text-left"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 p-6 min-h-[350px] space-y-4 max-h-[500px] overflow-y-auto">
        {aiHistory.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto">
              <Bot className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Ask MoneyFlow AI Anything
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Click any chip above or type a custom question to get instant analysis of Sablu Hasan's finances!
            </p>
          </div>
        ) : (
          aiHistory.map(chat => (
            <div key={chat.id} className="space-y-3">
              {/* User Question */}
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none text-xs max-w-md shadow-md">
                  <p className="font-semibold">{chat.query}</p>
                  <span className="text-[9px] text-blue-200 block text-right mt-1">{chat.timestamp}</span>
                </div>
              </div>

              {/* AI Answer */}
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-4 rounded-2xl rounded-tl-none text-xs max-w-lg space-y-2 border border-slate-200 dark:border-slate-700 shadow-sm leading-relaxed whitespace-pre-line">
                  {chat.response}
                </div>
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
            MoneyFlow AI is analyzing financial dataset...
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleAsk(inputQuery);
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask AI about your spending, budgets, or savings goals..."
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          className="flex-1 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-lg glow-blue hover:from-blue-700 transition-all active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
