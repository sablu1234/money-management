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
  AdminUser,
  AccountStatus
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

interface RegisteredUserAccount {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  approvalStatus: AccountStatus;
  joinedDate: string;
}

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
  adminPassword: string;
  
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
  toggleTheme: () => void;
  changeCurrency: (code: CurrencyCode) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  addAIQuery: (query: string, response: string) => void;
  
  // Auth & Admin Actions
  registerAccount: (name: string, email: string, password: string) => { success: boolean; message: string };
  loginUser: (email: string, password: string) => { success: boolean; message: string };
  logoutUser: () => void;
  approveUser: (email: string) => void;
  rejectUser: (email: string) => void;
  changeAdminPassword: (newPass: string) => void;
  
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
  }
];

const MOCK_INITIAL_BUDGETS: Budget[] = [
  { id: 'b-1', category: 'Food', monthlyLimit: 400, spentAmount: 145.50, period: 'July 2026' },
  { id: 'b-2', category: 'Bills', monthlyLimit: 200, spentAmount: 110, period: 'July 2026' }
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
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('moneyflow_is_logged_in') === 'true';
  });

  const [currentView, setCurrentView] = useState<ScreenView>(() => {
    return localStorage.getItem('moneyflow_is_logged_in') === 'true' ? 'dashboard' : 'landing';
  });

  // Admin Secret Password (Default: SabluAdmin#2026)
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('moneyflow_admin_pass') || 'SabluAdmin#2026';
  });

  // Database of Registered Users in LocalStorage
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUserAccount[]>(() => {
    const saved = localStorage.getItem('moneyflow_registered_db');
    return saved
      ? JSON.parse(saved)
      : [
          {
            name: 'Sablu Hasan',
            email: 'sablu.hasan.dev@gmail.com',
            passwordHash: 'SabluAdmin#2026',
            role: 'admin',
            approvalStatus: 'Approved',
            joinedDate: '2026-01-01'
          },
          {
            name: 'Alex Vance',
            email: 'alex@example.com',
            passwordHash: 'user123',
            role: 'normal',
            approvalStatus: 'Pending',
            joinedDate: '2026-07-19'
          }
        ];
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
          approvalStatus: 'Approved',
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

  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [aiHistory, setAiHistory] = useState<AIAdvice[]>([]);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // LocalStorage Persistence
  useEffect(() => {
    localStorage.setItem('moneyflow_is_logged_in', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('moneyflow_registered_db', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('moneyflow_admin_pass', adminPassword);
  }, [adminPassword]);

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

  // Derived Admin Users list
  const adminUsers: AdminUser[] = registeredUsers.map((u, i) => ({
    id: `u-${i}`,
    name: u.name,
    email: u.email,
    role: u.role,
    approvalStatus: u.approvalStatus,
    joinedDate: u.joinedDate,
    totalTransactions: 5
  }));

  // Financial Calculations
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

  // AUTH ACTIONS
  const registerAccount = (name: string, email: string, password: string) => {
    const lowerEmail = email.toLowerCase().trim();
    const exists = registeredUsers.some(u => u.email.toLowerCase() === lowerEmail);
    if (exists) {
      return { success: false, message: 'An account with this email already exists!' };
    }

    const isAdmin = lowerEmail === 'sablu.hasan.dev@gmail.com';

    const newAcc: RegisteredUserAccount = {
      name,
      email: lowerEmail,
      passwordHash: password,
      role: isAdmin ? 'admin' : 'normal',
      approvalStatus: isAdmin ? 'Approved' : 'Pending', // New users get Pending status until Admin approves!
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setRegisteredUsers(prev => [...prev, newAcc]);
    return {
      success: true,
      message: isAdmin
        ? 'Admin account created successfully! Please sign in now.'
        : 'Account created successfully! Your status is currently Pending Admin Approval.'
    };
  };

  const loginUser = (emailInput: string, passwordInput: string) => {
    const lowerEmail = emailInput.toLowerCase().trim();

    // Check if logging in as Sablu Hasan (Admin)
    if (lowerEmail === 'sablu.hasan.dev@gmail.com') {
      if (passwordInput !== adminPassword) {
        return { success: false, message: 'Invalid Admin Password! Please enter the correct password.' };
      }

      setUser(prev => ({
        ...prev,
        name: 'Sablu Hasan',
        email: lowerEmail,
        role: 'admin',
        approvalStatus: 'Approved'
      }));
      setIsLoggedIn(true);
      setCurrentView('dashboard');
      return { success: true, message: 'Logged in as Sablu Hasan (Admin).' };
    }

    // Check normal users DB
    const found = registeredUsers.find(u => u.email.toLowerCase() === lowerEmail);
    if (!found) {
      return { success: false, message: 'No account found with this email! Please register first.' };
    }

    if (found.passwordHash !== passwordInput) {
      return { success: false, message: 'Incorrect password! Please try again.' };
    }

    setUser(prev => ({
      ...prev,
      name: found.name,
      email: found.email,
      role: found.role,
      approvalStatus: found.approvalStatus
    }));

    setIsLoggedIn(true);
    setCurrentView('dashboard');
    return { success: true, message: 'Signed in successfully!' };
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    localStorage.setItem('moneyflow_is_logged_in', 'false');
    setCurrentView('landing');
  };

  // ADMIN APPROVAL ACTIONS
  const approveUser = (userEmail: string) => {
    setRegisteredUsers(prev =>
      prev.map(u => (u.email.toLowerCase() === userEmail.toLowerCase() ? { ...u, approvalStatus: 'Approved' } : u))
    );

    // If active logged in user is this person, update status
    if (user.email.toLowerCase() === userEmail.toLowerCase()) {
      setUser(prev => ({ ...prev, approvalStatus: 'Approved' }));
    }
  };

  const rejectUser = (userEmail: string) => {
    setRegisteredUsers(prev =>
      prev.map(u => (u.email.toLowerCase() === userEmail.toLowerCase() ? { ...u, approvalStatus: 'Rejected' } : u))
    );
  };

  const changeAdminPassword = (newPass: string) => {
    setAdminPassword(newPass);
    setRegisteredUsers(prev =>
      prev.map(u => (u.email.toLowerCase() === 'sablu.hasan.dev@gmail.com' ? { ...u, passwordHash: newPass } : u))
    );
  };

  // Standard Financial Actions
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
    setBudgets(prev => [...prev, { ...b, id: `b-${Date.now()}`, spentAmount: 0 }]);
  };

  const updateBudgetLimit = (id: string, limit: number) => {
    setBudgets(prev => prev.map(b => (b.id === id ? { ...b, monthlyLimit: limit } : b)));
  };

  const addGoal = (g: Omit<SavingsGoal, 'id' | 'currentAmount'>) => {
    setGoals(prev => [...prev, { ...g, id: `g-${Date.now()}`, currentAmount: 0 }]);
  };

  const depositToGoal = (id: string, amount: number) => {
    setGoals(prev =>
      prev.map(g => (g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g))
    );
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
        adminUsers,
        currentView,
        activeModal,
        selectedCategoryFilter,
        isLoggedIn,
        adminPassword,
        setCurrentView,
        setActiveModal,
        setSelectedCategoryFilter,
        addTransaction,
        deleteTransaction,
        addBudget,
        updateBudgetLimit,
        addGoal,
        depositToGoal,
        toggleTheme,
        changeCurrency,
        markNotificationRead,
        clearAllNotifications,
        addAIQuery,
        registerAccount,
        loginUser,
        logoutUser,
        approveUser,
        rejectUser,
        changeAdminPassword,
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
