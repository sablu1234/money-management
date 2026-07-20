import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Transaction,
  Budget,
  SavingsGoal,
  UserNotification,
  UserProfile,
  UserRole,
  CurrencyCode,
  AIAdvice,
  AdminUser
} from '../types';

export type ScreenView =
  | 'landing'
  | 'auth'
  | 'dashboard'
  | 'transactions'
  | 'budgets'
  | 'goals'
  | 'analytics'
  | 'ai'
  | 'profile'
  | 'admin';

export type ModalType = 'addTransaction' | 'converter' | 'exportReport' | 'addBudget' | 'addGoal' | null;

interface AppContextType {
  user: UserProfile;
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingsGoal[];
  notifications: UserNotification[];
  aiHistory: AIAdvice[];
  adminUsers: AdminUser[];
  currentView: ScreenView;
  activeModal: ModalType;
  selectedCategoryFilter: string;
  isLoggedIn: boolean;
  
  // Actions
  setCurrentView: (view: ScreenView) => void;
  setActiveModal: (modal: ModalType) => void;
  setSelectedCategoryFilter: (cat: string) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'spentAmount'>) => void;
  updateBudgetLimit: (id: string, limit: number) => void;
  addGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => void;
  depositToGoal: (id: string, amount: number) => void;
  switchRole: (role: UserRole) => void;
  toggleTheme: () => void;
  changeCurrency: (code: CurrencyCode) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  addAIQuery: (query: string, response: string) => void;
  loginUser: (email: string) => void;
  logoutUser: () => void;
  
  // Calculations
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  totalSavings: number;
  remainingBudget: number;
  financialHealthScore: number;
}

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  BDT: '৳',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
};

const MOCK_INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Senior Developer Salary',
    amount: 4500,
    type: 'income',
    category: 'Salary',
    date: '2026-07-01',
    paymentMethod: 'Bank Account',
    status: 'Completed',
    notes: 'Monthly salary credit from Tech Corp'
  },
  {
    id: 'tx-2',
    title: 'UI/UX Design Freelance Work',
    amount: 1200,
    type: 'income',
    category: 'Freelancing',
    date: '2026-07-08',
    paymentMethod: 'Mobile Banking',
    status: 'Completed',
    notes: 'Fintech Mobile App Redesign'
  },
  {
    id: 'tx-3',
    title: 'Grocery Supermarket Shopping',
    amount: 145.50,
    type: 'expense',
    category: 'Food',
    date: '2026-07-15',
    paymentMethod: 'Credit Card',
    status: 'Completed',
    notes: 'Organic groceries & monthly supplies'
  },
  {
    id: 'tx-4',
    title: 'Electricity & Fiber Internet Bill',
    amount: 110,
    type: 'expense',
    category: 'Bills',
    date: '2026-07-10',
    paymentMethod: 'Bank Account',
    status: 'Completed',
    notes: 'High speed fiber & utility bills'
  },
  {
    id: 'tx-5',
    title: 'Uber rides & Metro Pass',
    amount: 65,
    type: 'expense',
    category: 'Transport',
    date: '2026-07-12',
    paymentMethod: 'Debit Card',
    status: 'Completed'
  },
  {
    id: 'tx-6',
    title: 'Cinema & Concert Tickets',
    amount: 85,
    type: 'expense',
    category: 'Entertainment',
    date: '2026-07-18',
    paymentMethod: 'Credit Card',
    status: 'Completed'
  },
  {
    id: 'tx-7',
    title: 'Health Checkup & Pharmacy',
    amount: 95,
    type: 'expense',
    category: 'Healthcare',
    date: '2026-07-05',
    paymentMethod: 'Cash',
    status: 'Completed'
  }
];

const MOCK_INITIAL_BUDGETS: Budget[] = [
  { id: 'b-1', category: 'Food', monthlyLimit: 400, spentAmount: 145.50, period: 'July 2026' },
  { id: 'b-2', category: 'Bills', monthlyLimit: 200, spentAmount: 110, period: 'July 2026' },
  { id: 'b-3', category: 'Transport', monthlyLimit: 150, spentAmount: 65, period: 'July 2026' },
  { id: 'b-4', category: 'Entertainment', monthlyLimit: 120, spentAmount: 85, period: 'July 2026' },
  { id: 'b-5', category: 'Shopping', monthlyLimit: 300, spentAmount: 0, period: 'July 2026' }
];

const MOCK_INITIAL_GOALS: SavingsGoal[] = [
  {
    id: 'g-1',
    title: 'MacBook Pro M3 Max',
    targetAmount: 3500,
    currentAmount: 2400,
    deadline: '2026-10-31',
    category: 'Technology',
    icon: 'Laptop',
    autoSaveMonthly: 300
  },
  {
    id: 'g-2',
    title: 'Emergency Rainy Day Fund',
    targetAmount: 6000,
    currentAmount: 4800,
    deadline: '2026-12-31',
    category: 'Security',
    icon: 'ShieldCheck',
    autoSaveMonthly: 400
  },
  {
    id: 'g-3',
    title: 'Bali Summer Trip',
    targetAmount: 2000,
    currentAmount: 1350,
    deadline: '2026-09-15',
    category: 'Travel',
    icon: 'Plane',
    autoSaveMonthly: 250
  }
];

const MOCK_NOTIFICATIONS: UserNotification[] = [
  {
    id: 'n-1',
    title: 'Budget Alert (Entertainment)',
    message: 'Your Entertainment category is at 70% of your monthly budget limit.',
    date: '2 hours ago',
    read: false,
    type: 'alert'
  },
  {
    id: 'n-2',
    title: 'Savings Goal Progress',
    message: 'You are now 68% close to achieving your "MacBook Pro M3 Max" goal!',
    date: '1 day ago',
    read: false,
    type: 'success'
  },
  {
    id: 'n-3',
    title: 'Upcoming Bill Due',
    message: 'Cloud Hosting Renewal bill ($35) due in 3 days.',
    date: '2 days ago',
    read: true,
    type: 'info'
  }
];

const MOCK_ADMIN_USERS: AdminUser[] = [
  { id: 'u-1', name: 'Sablu Hasan', email: 'sablu.hasan@example.com', role: 'admin', joinedDate: '2026-01-10', status: 'Active', totalTransactions: 142 },
  { id: 'u-2', name: 'Alex Rivera', email: 'alex.r@fintech.io', role: 'premium', joinedDate: '2026-03-22', status: 'Active', totalTransactions: 89 },
  { id: 'u-3', name: 'Sophia Chen', email: 'sophia@design.co', role: 'normal', joinedDate: '2026-05-14', status: 'Active', totalTransactions: 34 },
  { id: 'u-4', name: 'Michael Vance', email: 'vance@enterprise.org', role: 'premium', joinedDate: '2026-06-01', status: 'Suspended', totalTransactions: 12 }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('moneyflow_user');
    return saved
      ? JSON.parse(saved)
      : {
          id: 'user-sablu',
          name: 'Sablu Hasan',
          email: 'sablu.hasan.dev@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: 'premium',
          currency: 'USD',
          currencySymbol: '$',
          language: 'English',
          isDarkMode: true,
          portfolioUrl: 'https://sablu-hasan.vercel.app/',
          authorName: 'Sablu Hasan'
        };
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('moneyflow_transactions');
    return saved ? JSON.parse(saved) : MOCK_INITIAL_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('moneyflow_budgets');
    return saved ? JSON.parse(saved) : MOCK_INITIAL_BUDGETS;
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('moneyflow_goals');
    return saved ? JSON.parse(saved) : MOCK_INITIAL_GOALS;
  });

  const [notifications, setNotifications] = useState<UserNotification[]>(() => {
    const saved = localStorage.getItem('moneyflow_notifications');
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  });

  const [aiHistory, setAiHistory] = useState<AIAdvice[]>([]);
  const [adminUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS);
  const [currentView, setCurrentView] = useState<ScreenView>('dashboard');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('moneyflow_user', JSON.stringify(user));
    if (user.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('moneyflow_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('moneyflow_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('moneyflow_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('moneyflow_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Derived Financial Metrics
  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalBalance = monthlyIncome - monthlyExpenses + 8500; // base account balance
  const totalSavings = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalBudgetLimit = budgets.reduce((acc, b) => acc + b.monthlyLimit, 0);
  const remainingBudget = Math.max(0, totalBudgetLimit - monthlyExpenses);

  // Financial Health Score Calculation (0-100)
  const savingsRatio = monthlyIncome > 0 ? (monthlyIncome - monthlyExpenses) / monthlyIncome : 0;
  const financialHealthScore = Math.min(100, Math.max(30, Math.round(50 + savingsRatio * 40 + (totalSavings / 1000) * 2)));

  // Actions
  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`
    };
    setTransactions(prev => [newTx, ...prev]);

    // Recalculate category budget spent if expense
    if (tx.type === 'expense') {
      setBudgets(prev =>
        prev.map(b =>
          b.category.toLowerCase() === tx.category.toLowerCase()
            ? { ...b, spentAmount: b.spentAmount + tx.amount }
            : b
        )
      );

      // Check for budget limit warnings (>80%)
      const matchBudget = budgets.find(b => b.category.toLowerCase() === tx.category.toLowerCase());
      if (matchBudget && (matchBudget.spentAmount + tx.amount) / matchBudget.monthlyLimit >= 0.8) {
        const newNotif: UserNotification = {
          id: `n-${Date.now()}`,
          title: `Budget Limit Warning (${matchBudget.category})`,
          message: `You have used ${Math.round(((matchBudget.spentAmount + tx.amount) / matchBudget.monthlyLimit) * 100)}% of your ${matchBudget.category} budget limit.`,
          date: 'Just now',
          read: false,
          type: 'alert'
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    }
  };

  const deleteTransaction = (id: string) => {
    const txToDelete = transactions.find(t => t.id === id);
    if (txToDelete && txToDelete.type === 'expense') {
      setBudgets(prev =>
        prev.map(b =>
          b.category.toLowerCase() === txToDelete.category.toLowerCase()
            ? { ...b, spentAmount: Math.max(0, b.spentAmount - txToDelete.amount) }
            : b
        )
      );
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addBudget = (b: Omit<Budget, 'id' | 'spentAmount'>) => {
    const existingExpenses = transactions
      .filter(t => t.type === 'expense' && t.category.toLowerCase() === b.category.toLowerCase())
      .reduce((sum, t) => sum + t.amount, 0);

    const newBudget: Budget = {
      ...b,
      id: `b-${Date.now()}`,
      spentAmount: existingExpenses
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  const updateBudgetLimit = (id: string, limit: number) => {
    setBudgets(prev => prev.map(b => (b.id === id ? { ...b, monthlyLimit: limit } : b)));
  };

  const addGoal = (g: Omit<SavingsGoal, 'id' | 'currentAmount'>) => {
    const newGoal: SavingsGoal = {
      ...g,
      id: `g-${Date.now()}`,
      currentAmount: 0
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const depositToGoal = (id: string, amount: number) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id === id) {
          const updated = g.currentAmount + amount;
          if (updated >= g.targetAmount && g.currentAmount < g.targetAmount) {
            setNotifications(n => [
              {
                id: `n-${Date.now()}`,
                title: 'Goal Achieved 🎉',
                message: `Congratulations! You reached your goal for "${g.title}"!`,
                date: 'Just now',
                read: false,
                type: 'success'
              },
              ...n
            ]);
          }
          return { ...g, currentAmount: updated };
        }
        return g;
      })
    );
  };

  const switchRole = (role: UserRole) => {
    setUser(prev => ({ ...prev, role }));
  };

  const toggleTheme = () => {
    setUser(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  const changeCurrency = (code: CurrencyCode) => {
    setUser(prev => ({
      ...prev,
      currency: code,
      currencySymbol: CURRENCY_SYMBOLS[code]
    }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addAIQuery = (query: string, response: string) => {
    setAiHistory(prev => [
      ...prev,
      {
        id: `ai-${Date.now()}`,
        query,
        response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const loginUser = (email: string) => {
    setIsLoggedIn(true);
    setUser(prev => ({ ...prev, email }));
    setCurrentView('dashboard');
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    setCurrentView('landing');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        transactions,
        budgets,
        goals,
        notifications,
        aiHistory,
        adminUsers,
        currentView,
        activeModal,
        selectedCategoryFilter,
        isLoggedIn,
        setCurrentView,
        setActiveModal,
        setSelectedCategoryFilter,
        addTransaction,
        deleteTransaction,
        addBudget,
        updateBudgetLimit,
        addGoal,
        depositToGoal,
        switchRole,
        toggleTheme,
        changeCurrency,
        markNotificationRead,
        clearAllNotifications,
        addAIQuery,
        loginUser,
        logoutUser,
        totalBalance,
        monthlyIncome,
        monthlyExpenses,
        totalSavings,
        remainingBudget,
        financialHealthScore
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
