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
  registerAccount: (name: string, email: string) => boolean;
  loginUser: (email: string) => boolean;
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
  }
];

const MOCK_INITIAL_BUDGETS: Budget[] = [
  { id: 'b-1', category: 'Food', monthlyLimit: 400, spentAmount: 145.50, period: 'July 2026' },
  { id: 'b-2', category: 'Bills', monthlyLimit: 200, spentAmount: 110, period: 'July 2026' },
  { id: 'b-3', category: 'Transport', monthlyLimit: 150, spentAmount: 65, period: 'July 2026' }
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
  }
];

const MOCK_NOTIFICATIONS: UserNotification[] = [
  {
    id: 'n-1',
    title: 'Welcome to MoneyFlow',
    message: 'Start by tracking your daily expenses or setting budget limits.',
    date: 'Just now',
    read: false,
    type: 'info'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default Authentication state is FALSE (User must login or register first!)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('moneyflow_is_logged_in') === 'true';
  });

  const [currentView, setCurrentView] = useState<ScreenView>(() => {
    return localStorage.getItem('moneyflow_is_logged_in') === 'true' ? 'dashboard' : 'landing';
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('moneyflow_user');
    return saved
      ? JSON.parse(saved)
      : {
          id: 'user-sablu',
          name: 'Sablu Hasan',
          email: 'sablu.hasan.dev@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: 'admin',
          currency: 'USD',
          currencySymbol: '$',
          language: 'English',
          isDarkMode: true,
          portfolioUrl: 'https://sablu-hasan.vercel.app/',
          authorName: 'Sablu Hasan'
        };
  });

  // Registered Accounts DB in LocalStorage
  const [registeredDb, setRegisteredDb] = useState<{ email: string; name: string; role: UserRole }[]>(() => {
    const saved = localStorage.getItem('moneyflow_registered_users');
    return saved
      ? JSON.parse(saved)
      : [
          { email: 'sablu.hasan.dev@gmail.com', name: 'Sablu Hasan', role: 'admin' },
          { email: 'user@example.com', name: 'Demo Normal User', role: 'normal' }
        ];
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
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Persistence
  useEffect(() => {
    localStorage.setItem('moneyflow_is_logged_in', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('moneyflow_registered_users', JSON.stringify(registeredDb));
  }, [registeredDb]);

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

  // Derived Financial Metrics
  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalBalance = monthlyIncome - monthlyExpenses + 8500;
  const totalSavings = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalBudgetLimit = budgets.reduce((acc, b) => acc + b.monthlyLimit, 0);
  const remainingBudget = Math.max(0, totalBudgetLimit - monthlyExpenses);

  const savingsRatio = monthlyIncome > 0 ? (monthlyIncome - monthlyExpenses) / monthlyIncome : 0;
  const financialHealthScore = Math.min(100, Math.max(30, Math.round(50 + savingsRatio * 40 + (totalSavings / 1000) * 2)));

  // Actions
  const registerAccount = (name: string, email: string): boolean => {
    const exists = registeredDb.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return false;

    const isAdmin = email.toLowerCase().includes('sablu.hasan.dev@gmail.com');
    const newUser = {
      email: email.toLowerCase(),
      name,
      role: (isAdmin ? 'admin' : 'normal') as UserRole
    };

    setRegisteredDb(prev => [...prev, newUser]);
    return true;
  };

  const loginUser = (emailInput: string): boolean => {
    const lowerEmail = emailInput.toLowerCase();
    const found = registeredDb.find(u => u.email.toLowerCase() === lowerEmail);

    if (!found && !lowerEmail.includes('sablu.hasan.dev@gmail.com')) {
      return false; // User not registered yet!
    }

    const role: UserRole = found ? found.role : lowerEmail.includes('sablu.hasan.dev@gmail.com') ? 'admin' : 'normal';
    const name = found ? found.name : 'Sablu Hasan';

    setUser(prev => ({
      ...prev,
      name,
      email: lowerEmail,
      role
    }));

    setIsLoggedIn(true);
    setCurrentView('dashboard');
    return true;
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    localStorage.setItem('moneyflow_is_logged_in', 'false');
    setCurrentView('landing');
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`
    };
    setTransactions(prev => [newTx, ...prev]);

    if (tx.type === 'expense') {
      setBudgets(prev =>
        prev.map(b =>
          b.category.toLowerCase() === tx.category.toLowerCase()
            ? { ...b, spentAmount: b.spentAmount + tx.amount }
            : b
        )
      );
    }
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addBudget = (b: Omit<Budget, 'id' | 'spentAmount'>) => {
    const newBudget: Budget = {
      ...b,
      id: `b-${Date.now()}`,
      spentAmount: 0
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
      prev.map(g => (g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g))
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

  return (
    <AppContext.Provider
      value={{
        user,
        transactions,
        budgets,
        goals,
        notifications,
        aiHistory,
        adminUsers: registeredDb.map((u, i) => ({
          id: `u-${i}`,
          name: u.name,
          email: u.email,
          role: u.role,
          joinedDate: '2026-07-20',
          status: 'Active',
          totalTransactions: 12
        })),
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
        registerAccount,
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
