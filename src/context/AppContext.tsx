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
  AccountStatus,
  MonthlyBudgetTarget
} from '../types';
import { syncTransactionToGoogleSheet, GOOGLE_SHEET_URL } from '../services/googleSheetSync';

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
  googleSheetUrl: string;
  monthlySavingsHistory: MonthlyBudgetTarget[];
  
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
  
  // Monthly Budget & Savings Correction Actions
  updateRunningMonthTargetBudget: (targetAmount: number) => void;
  updateAccumulatedSavingsAmount: (newSavingsAmount: number) => void;
  rolloverRemainingSavingsToNextMonth: () => void;
  correctMonthlySavingsHistoryItem: (monthLabel: string, correctedSavingsAmount: number) => void;
  
  // Auth & Admin Actions
  registerAccount: (name: string, email: string, password: string) => { success: boolean; message: string };
  loginUser: (email: string, password: string) => { success: boolean; message: string };
  logoutUser: () => void;
  approveUser: (email: string) => void;
  rejectUser: (email: string) => void;
  changeAdminPassword: (newPass: string) => void;
  resetAllDataToZero: () => void;
  
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('moneyflow_is_logged_in') === 'true';
  });

  const [currentView, setCurrentView] = useState<ScreenView>(() => {
    return localStorage.getItem('moneyflow_is_logged_in') === 'true' ? 'dashboard' : 'landing';
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('moneyflow_admin_pass') || 'SabluAdmin#2026';
  });

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
          authorName: 'Sablu Hasan',
          runningMonthTargetBudget: 1500,
          totalAccumulatedSavings: 0
        };
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('moneyflow_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('moneyflow_budgets');
    return saved ? JSON.parse(saved) : [];
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('moneyflow_goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [monthlySavingsHistory, setMonthlySavingsHistory] = useState<MonthlyBudgetTarget[]>(() => {
    const saved = localStorage.getItem('moneyflow_savings_history');
    return saved
      ? JSON.parse(saved)
      : [
          { month: 'June 2026', targetBudget: 1200, runningSpend: 850, savingsAchieved: 350, isRolledOver: true },
          { month: 'May 2026', targetBudget: 1000, runningSpend: 720, savingsAchieved: 280, isRolledOver: true }
        ];
  });

  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [aiHistory, setAiHistory] = useState<AIAdvice[]>([]);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Persistence
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

  useEffect(() => {
    localStorage.setItem('moneyflow_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('moneyflow_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('moneyflow_savings_history', JSON.stringify(monthlySavingsHistory));
  }, [monthlySavingsHistory]);

  const adminUsers: AdminUser[] = registeredUsers.map((u, i) => ({
    id: `u-${i}`,
    name: u.name,
    email: u.email,
    role: u.role,
    approvalStatus: u.approvalStatus,
    joinedDate: u.joinedDate,
    totalTransactions: 0
  }));

  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalBalance = monthlyIncome - monthlyExpenses;
  const totalSavings = (user.totalAccumulatedSavings || 0) + goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalBudgetLimit = user.runningMonthTargetBudget || 1500;
  const remainingBudget = Math.max(0, totalBudgetLimit - monthlyExpenses);

  const financialHealthScore = transactions.length === 0
    ? 100
    : Math.min(100, Math.max(30, Math.round(50 + ((monthlyIncome - monthlyExpenses) / (monthlyIncome || 1)) * 40)));

  // MONTHLY SAVINGS CORRECTION & ACTIONS
  const updateRunningMonthTargetBudget = (targetAmount: number) => {
    setUser(prev => ({ ...prev, runningMonthTargetBudget: targetAmount }));

    syncTransactionToGoogleSheet({
      date: new Date().toISOString().split('T')[0],
      userName: user.name,
      userEmail: user.email,
      title: 'Updated Monthly Target Budget',
      type: 'Budget Target',
      category: 'Budget Setting',
      amount: targetAmount,
      paymentMethod: 'System',
      notes: `Set running month target budget to ${user.currencySymbol}${targetAmount}`
    });
  };

  const updateAccumulatedSavingsAmount = (newSavingsAmount: number) => {
    setUser(prev => ({ ...prev, totalAccumulatedSavings: newSavingsAmount }));

    syncTransactionToGoogleSheet({
      date: new Date().toISOString().split('T')[0],
      userName: user.name,
      userEmail: user.email,
      title: 'Manual Savings Amount Adjustment',
      type: 'Savings Adjustment',
      category: 'Savings',
      amount: newSavingsAmount,
      paymentMethod: 'System',
      notes: `Adjusted total accumulated savings to ${user.currencySymbol}${newSavingsAmount}`
    });
  };

  const correctMonthlySavingsHistoryItem = (monthLabel: string, correctedSavingsAmount: number) => {
    setMonthlySavingsHistory(prev =>
      prev.map(item =>
        item.month === monthLabel
          ? { ...item, savingsAchieved: correctedSavingsAmount }
          : item
      )
    );

    // Sync correction to Google Sheet!
    syncTransactionToGoogleSheet({
      date: new Date().toISOString().split('T')[0],
      userName: user.name,
      userEmail: user.email,
      title: `Savings History Correction (${monthLabel})`,
      type: 'Savings Correction',
      category: 'Savings',
      amount: correctedSavingsAmount,
      paymentMethod: 'System',
      notes: `Corrected savings amount for ${monthLabel} to ${user.currencySymbol}${correctedSavingsAmount}`
    });
  };

  const rolloverRemainingSavingsToNextMonth = () => {
    const currentSavingsThisMonth = Math.max(0, monthlyIncome - monthlyExpenses);
    const updatedTotalSavings = (user.totalAccumulatedSavings || 0) + currentSavingsThisMonth;

    setUser(prev => ({ ...prev, totalAccumulatedSavings: updatedTotalSavings }));

    const currentMonthLabel = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    setMonthlySavingsHistory(prev => [
      {
        month: currentMonthLabel,
        targetBudget: user.runningMonthTargetBudget,
        runningSpend: monthlyExpenses,
        savingsAchieved: currentSavingsThisMonth,
        isRolledOver: true
      },
      ...prev
    ]);

    syncTransactionToGoogleSheet({
      date: new Date().toISOString().split('T')[0],
      userName: user.name,
      userEmail: user.email,
      title: 'Monthly Savings Rolled Over',
      type: 'Rollover Savings',
      category: 'Savings',
      amount: currentSavingsThisMonth,
      paymentMethod: 'System',
      notes: `Rolled over ${user.currencySymbol}${currentSavingsThisMonth} remaining savings to next month!`
    });
  };

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
      approvalStatus: isAdmin ? 'Approved' : 'Pending',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setRegisteredUsers(prev => [...prev, newAcc]);

    syncTransactionToGoogleSheet({
      date: new Date().toISOString().split('T')[0],
      userName: name,
      userEmail: lowerEmail,
      title: 'New Account Registration',
      type: 'Registration',
      category: 'User System',
      amount: 0,
      paymentMethod: 'Web Portal',
      notes: `Account created with status: ${isAdmin ? 'Approved' : 'Pending'}`
    });

    return {
      success: true,
      message: isAdmin
        ? 'Admin account created successfully! Please sign in now.'
        : 'Account created successfully! Status is currently Pending Admin Approval.'
    };
  };

  const loginUser = (emailInput: string, passwordInput: string) => {
    const lowerEmail = emailInput.toLowerCase().trim();

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

  const approveUser = (userEmail: string) => {
    setRegisteredUsers(prev =>
      prev.map(u => (u.email.toLowerCase() === userEmail.toLowerCase() ? { ...u, approvalStatus: 'Approved' } : u))
    );

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

  const resetAllDataToZero = () => {
    setTransactions([]);
    setBudgets([]);
    setGoals([]);
    setUser(prev => ({ ...prev, totalAccumulatedSavings: 0 }));
    localStorage.removeItem('moneyflow_transactions');
    localStorage.removeItem('moneyflow_budgets');
    localStorage.removeItem('moneyflow_goals');
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

    syncTransactionToGoogleSheet({
      date: tx.date,
      userName: user.name,
      userEmail: user.email,
      title: tx.title,
      type: tx.type,
      category: tx.category,
      amount: tx.amount,
      paymentMethod: tx.paymentMethod,
      notes: tx.notes
    });
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
        googleSheetUrl: GOOGLE_SHEET_URL,
        monthlySavingsHistory,
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
        resetAllDataToZero,
        updateRunningMonthTargetBudget,
        updateAccumulatedSavingsAmount,
        rolloverRemainingSavingsToNextMonth,
        correctMonthlySavingsHistoryItem,
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
