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
  SubscriptionPlan,
  MonthlyBudgetTarget
} from '../types';
import { syncDashboardSnapshotToGoogleSheet, GOOGLE_SHEET_URL } from '../services/googleSheetSync';

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
  plan: SubscriptionPlan;
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
  withdrawFromSavingsGoal: (id: string, amount: number) => void;
  withdrawDirectlyFromTotalSavings: (amount: number, reason: string) => void;
  toggleTheme: () => void;
  changeCurrency: (code: CurrencyCode) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  addAIQuery: (query: string, response: string) => void;
  
  // Dynamic Monthly Budget & Unique Savings History Actions
  updateRunningMonthTargetBudget: (targetAmount: number) => void;
  updateAccumulatedSavingsAmount: (newSavingsAmount: number) => void;
  rolloverRemainingSavingsToNextMonth: () => void;
  correctMonthlySavingsHistoryItem: (monthLabel: string, correctedSavingsAmount: number) => void;
  deleteMonthlySavingsHistoryItem: (monthLabel: string) => void;
  addMissingMonthlySavingsItem: (monthLabel: string, targetBudget: number, savingsAchieved: number) => { success: boolean; message: string };
  
  // Auth & Admin Account & Plan Management Actions
  registerAccount: (name: string, email: string, password: string) => { success: boolean; message: string };
  loginUser: (email: string, password: string) => { success: boolean; message: string };
  logoutUser: () => void;
  approveUser: (email: string) => void;
  rejectUser: (email: string) => void;
  deactivateUser: (email: string) => void;
  deleteUserAccount: (email: string) => void;
  toggleUserPlan: (email: string, newPlan: SubscriptionPlan) => void;
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
            plan: 'Pro',
            joinedDate: '2026-01-01'
          }
        ];
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('moneyflow_user');
    return saved
      ? JSON.parse(saved)
      : {
          id: 'USR-1001',
          name: 'Sablu Hasan',
          email: 'sablu.hasan.dev@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: 'admin',
          approvalStatus: 'Approved',
          plan: 'Pro',
          currency: 'USD',
          currencySymbol: '$',
          language: 'English',
          isDarkMode: true,
          portfolioUrl: 'https://sablu-hasan.vercel.app/',
          authorName: 'Sablu Hasan',
          runningMonthTargetBudget: 0,
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
    return saved ? JSON.parse(saved) : [];
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
    id: `USR-${1000 + i}`,
    name: u.name,
    email: u.email,
    role: u.role,
    approvalStatus: u.approvalStatus,
    plan: u.plan || 'Free',
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

  const sumOfHistorySavings = monthlySavingsHistory.reduce((acc, item) => acc + item.savingsAchieved, 0);
  const totalSavings = sumOfHistorySavings + (user.totalAccumulatedSavings || 0) + goals.reduce((acc, g) => acc + g.currentAmount, 0);

  const totalBudgetLimit = user.runningMonthTargetBudget || 0;
  const remainingBudget = Math.max(0, totalBudgetLimit - monthlyExpenses);

  const financialHealthScore = transactions.length === 0 && monthlySavingsHistory.length === 0
    ? 100
    : Math.min(100, Math.max(30, Math.round(50 + ((monthlyIncome - monthlyExpenses) / (monthlyIncome || 1)) * 40)));

  const healthStatusText = financialHealthScore >= 80 ? 'Excellent' : financialHealthScore >= 60 ? 'Good' : 'Needs Attention';

  const runningMonthLabel = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  // Master helper function to sync complete dashboard screenshot metrics to Google Sheet
  const triggerGoogleSheetDashboardSync = (actionName: string, customIncome?: number, customExpense?: number) => {
    const calcIncome = customIncome !== undefined ? customIncome : monthlyIncome;
    const calcExpense = customExpense !== undefined ? customExpense : monthlyExpenses;
    const calcNetBalance = calcIncome - calcExpense;
    const calcRemaining = Math.max(0, (user.runningMonthTargetBudget || 0) - calcExpense);
    const calcSpentPct = (user.runningMonthTargetBudget || 0) > 0 ? Math.min(100, Math.round((calcExpense / (user.runningMonthTargetBudget || 1)) * 100)) : 0;

    syncDashboardSnapshotToGoogleSheet({
      userId: user.id || 'USR-1001',
      userName: user.name,
      userEmail: user.email,
      runningMonth: runningMonthLabel,
      targetBudget: user.runningMonthTargetBudget || 0,
      targetBudgetSpent: calcExpense,
      targetBudgetSpentPct: calcSpentPct,
      netBalance: calcNetBalance,
      monthlyIncome: calcIncome,
      monthlyExpenses: calcExpense,
      accumulatedSavings: totalSavings,
      remainingCap: calcRemaining,
      financialHealthScore: financialHealthScore,
      healthStatusText: healthStatusText,
      aiMonthlyTip: `Target Budget: ${user.currencySymbol}${user.runningMonthTargetBudget || 0}, Spent: ${user.currencySymbol}${calcExpense} (${calcSpentPct}%). Discipline maintained!`,
      lastAction: actionName
    });
  };

  // WITHDRAWALS / DEDUCTIONS FROM SAVINGS
  const withdrawFromSavingsGoal = (id: string, amount: number) => {
    setGoals(prev =>
      prev.map(g => (g.id === id ? { ...g, currentAmount: Math.max(0, g.currentAmount - amount) } : g))
    );
    triggerGoogleSheetDashboardSync('Withdrawal from Savings Goal');
  };

  const withdrawDirectlyFromTotalSavings = (amount: number, reason: string) => {
    setUser(prev => ({
      ...prev,
      totalAccumulatedSavings: (prev.totalAccumulatedSavings || 0) - amount
    }));
    triggerGoogleSheetDashboardSync(`Savings Deduction (${reason || 'Withdrawal'})`);
  };

  // UNIQUE MONTHLY SAVINGS ACTIONS
  const updateRunningMonthTargetBudget = (targetAmount: number) => {
    setUser(prev => ({ ...prev, runningMonthTargetBudget: targetAmount }));
    const calcRemaining = Math.max(0, targetAmount - monthlyExpenses);
    const calcSpentPct = targetAmount > 0 ? Math.min(100, Math.round((monthlyExpenses / targetAmount) * 100)) : 0;

    syncDashboardSnapshotToGoogleSheet({
      userId: user.id || 'USR-1001',
      userName: user.name,
      userEmail: user.email,
      runningMonth: runningMonthLabel,
      targetBudget: targetAmount,
      targetBudgetSpent: monthlyExpenses,
      targetBudgetSpentPct: calcSpentPct,
      netBalance: totalBalance,
      monthlyIncome,
      monthlyExpenses,
      accumulatedSavings: totalSavings,
      remainingCap: calcRemaining,
      financialHealthScore,
      healthStatusText,
      aiMonthlyTip: `Target Budget updated to ${user.currencySymbol}${targetAmount}`,
      lastAction: 'Updated Monthly Target Budget'
    });
  };

  const updateAccumulatedSavingsAmount = (newSavingsAmount: number) => {
    setUser(prev => ({ ...prev, totalAccumulatedSavings: newSavingsAmount }));
    triggerGoogleSheetDashboardSync('Manual Savings Base Adjustment');
  };

  const correctMonthlySavingsHistoryItem = (monthLabel: string, correctedSavingsAmount: number) => {
    setMonthlySavingsHistory(prev =>
      prev.map(item =>
        item.month.toLowerCase() === monthLabel.toLowerCase()
          ? { ...item, savingsAchieved: correctedSavingsAmount }
          : item
      )
    );
    triggerGoogleSheetDashboardSync(`Savings History Correction (${monthLabel})`);
  };

  const deleteMonthlySavingsHistoryItem = (monthLabel: string) => {
    setMonthlySavingsHistory(prev => prev.filter(item => item.month.toLowerCase() !== monthLabel.toLowerCase()));
    triggerGoogleSheetDashboardSync(`Deleted Month Savings Record (${monthLabel})`);
  };

  const addMissingMonthlySavingsItem = (monthLabel: string, targetBudget: number, savingsAchieved: number) => {
    const cleanMonthName = monthLabel.trim();
    const existingIndex = monthlySavingsHistory.findIndex(m => m.month.toLowerCase() === cleanMonthName.toLowerCase());

    if (existingIndex !== -1) {
      setMonthlySavingsHistory(prev =>
        prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, targetBudget, savingsAchieved, isRolledOver: true }
            : item
        )
      );
    } else {
      const newItem: MonthlyBudgetTarget = {
        month: cleanMonthName,
        targetBudget,
        runningSpend: Math.max(0, targetBudget - savingsAchieved),
        savingsAchieved,
        isRolledOver: true
      };
      setMonthlySavingsHistory(prev => [newItem, ...prev]);
    }

    triggerGoogleSheetDashboardSync(`Added Savings Record (${cleanMonthName})`);

    return {
      success: true,
      message: `Saved month record for ${cleanMonthName}!`
    };
  };

  const rolloverRemainingSavingsToNextMonth = () => {
    const currentSavingsThisMonth = Math.max(0, monthlyIncome - monthlyExpenses);
    const currentMonthLabel = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    const existingIndex = monthlySavingsHistory.findIndex(m => m.month.toLowerCase() === currentMonthLabel.toLowerCase());

    if (existingIndex !== -1) {
      setMonthlySavingsHistory(prev =>
        prev.map((item, idx) =>
          idx === existingIndex
            ? {
                ...item,
                targetBudget: user.runningMonthTargetBudget,
                runningSpend: monthlyExpenses,
                savingsAchieved: currentSavingsThisMonth,
                isRolledOver: true
              }
            : item
        )
      );
    } else {
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
    }

    triggerGoogleSheetDashboardSync('Monthly Savings Rolled Over');
  };

  // AUTH & ADMIN ACCOUNT & PLAN MANAGEMENT ACTIONS
  const registerAccount = (name: string, email: string, password: string) => {
    const lowerEmail = email.toLowerCase().trim();
    const exists = registeredUsers.some(u => u.email.toLowerCase() === lowerEmail);
    if (exists) {
      return { success: false, message: 'An account with this email already exists! Please click Sign In to log in.' };
    }

    const isAdmin = lowerEmail === 'sablu.hasan.dev@gmail.com';
    const newUserId = isAdmin ? 'USR-1001' : `USR-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAcc: RegisteredUserAccount = {
      name,
      email: lowerEmail,
      passwordHash: password,
      role: isAdmin ? 'admin' : 'normal',
      approvalStatus: isAdmin ? 'Approved' : 'Pending',
      plan: isAdmin ? 'Pro' : 'Free',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setRegisteredUsers(prev => [...prev, newAcc]);

    syncDashboardSnapshotToGoogleSheet({
      userId: newUserId,
      userName: name,
      userEmail: lowerEmail,
      runningMonth: runningMonthLabel,
      targetBudget: 0,
      targetBudgetSpent: 0,
      targetBudgetSpentPct: 0,
      netBalance: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      accumulatedSavings: 0,
      remainingCap: 0,
      financialHealthScore: 100,
      healthStatusText: 'Excellent',
      aiMonthlyTip: 'Welcome to MoneyFlow!',
      lastAction: 'New Account Registration',
      isRegistration: true
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
        id: 'USR-1001',
        name: 'Sablu Hasan',
        email: lowerEmail,
        role: 'admin',
        approvalStatus: 'Approved',
        plan: 'Pro'
      }));

      setIsLoggedIn(true);
      setCurrentView('dashboard');
      triggerGoogleSheetDashboardSync('Admin Session Login');

      return { success: true, message: 'Logged in as Sablu Hasan (Admin).' };
    }

    const found = registeredUsers.find(u => u.email.toLowerCase() === lowerEmail);
    if (!found) {
      return { success: false, message: 'No account found with this email! Please register first.' };
    }

    if (found.passwordHash !== passwordInput) {
      return { success: false, message: 'Incorrect password! Please try again.' };
    }

    if (found.approvalStatus === 'Deactivated') {
      return { success: false, message: 'Your account has been deactivated by Admin Sablu Hasan. Access restricted.' };
    }

    const assignedUserId = `USR-${Math.abs(hashString(found.email))}`;

    setUser(prev => ({
      ...prev,
      id: assignedUserId,
      name: found.name,
      email: found.email,
      role: found.role,
      approvalStatus: found.approvalStatus,
      plan: found.plan || 'Free',
      runningMonthTargetBudget: 0,
      totalAccumulatedSavings: 0
    }));

    setTransactions([]);
    setBudgets([]);
    setGoals([]);
    setMonthlySavingsHistory([]);

    setIsLoggedIn(true);
    setCurrentView('dashboard');
    triggerGoogleSheetDashboardSync('User Account Login');

    return { success: true, message: 'Signed in successfully!' };
  };

  const logoutUser = () => {
    triggerGoogleSheetDashboardSync('User Session Logout');
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

    syncDashboardSnapshotToGoogleSheet({
      userId: `USR-${Math.abs(hashString(userEmail))}`,
      userName: 'User Account',
      userEmail: userEmail,
      runningMonth: runningMonthLabel,
      targetBudget: 0,
      targetBudgetSpent: 0,
      targetBudgetSpentPct: 0,
      netBalance: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      accumulatedSavings: 0,
      remainingCap: 0,
      financialHealthScore: 100,
      healthStatusText: 'Approved',
      aiMonthlyTip: 'Account Approved by Admin',
      lastAction: 'Account Approved by Admin'
    });
  };

  const rejectUser = (userEmail: string) => {
    setRegisteredUsers(prev =>
      prev.map(u => (u.email.toLowerCase() === userEmail.toLowerCase() ? { ...u, approvalStatus: 'Rejected' } : u))
    );
  };

  const deactivateUser = (userEmail: string) => {
    setRegisteredUsers(prev =>
      prev.map(u => (u.email.toLowerCase() === userEmail.toLowerCase() ? { ...u, approvalStatus: 'Deactivated' } : u))
    );

    if (user.email.toLowerCase() === userEmail.toLowerCase()) {
      setUser(prev => ({ ...prev, approvalStatus: 'Deactivated' }));
      setIsLoggedIn(false);
    }
  };

  const deleteUserAccount = (userEmail: string) => {
    setRegisteredUsers(prev => prev.filter(u => u.email.toLowerCase() !== userEmail.toLowerCase()));

    if (user.email.toLowerCase() === userEmail.toLowerCase()) {
      setIsLoggedIn(false);
      setCurrentView('landing');
    }
  };

  const toggleUserPlan = (userEmail: string, newPlan: SubscriptionPlan) => {
    setRegisteredUsers(prev =>
      prev.map(u => (u.email.toLowerCase() === userEmail.toLowerCase() ? { ...u, plan: newPlan } : u))
    );

    if (user.email.toLowerCase() === userEmail.toLowerCase()) {
      setUser(prev => ({ ...prev, plan: newPlan }));
    }
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
    setMonthlySavingsHistory([]);
    setUser(prev => ({ ...prev, totalAccumulatedSavings: 0, runningMonthTargetBudget: 0 }));
    localStorage.removeItem('moneyflow_transactions');
    localStorage.removeItem('moneyflow_budgets');
    localStorage.removeItem('moneyflow_goals');
    localStorage.removeItem('moneyflow_savings_history');
    triggerGoogleSheetDashboardSync('All Data Reset to Zero');
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`
    };
    const nextTxs = [newTx, ...transactions];
    setTransactions(nextTxs);

    if (tx.type === 'expense') {
      setBudgets(prev =>
        prev.map(b =>
          b.category.toLowerCase() === tx.category.toLowerCase()
            ? { ...b, spentAmount: b.spentAmount + tx.amount }
            : b
        )
      );
    }

    const calcInc = nextTxs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const calcExp = nextTxs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

    triggerGoogleSheetDashboardSync(`Added Entry: ${tx.title} (${tx.type})`, calcInc, calcExp);
  };

  const deleteTransaction = (id: string) => {
    const nextTxs = transactions.filter(t => t.id !== id);
    setTransactions(nextTxs);

    const calcInc = nextTxs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const calcExp = nextTxs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

    triggerGoogleSheetDashboardSync('Deleted Transaction Entry', calcInc, calcExp);
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
        withdrawFromSavingsGoal,
        withdrawDirectlyFromTotalSavings,
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
        deactivateUser,
        deleteUserAccount,
        toggleUserPlan,
        changeAdminPassword,
        resetAllDataToZero,
        updateRunningMonthTargetBudget,
        updateAccumulatedSavingsAmount,
        rolloverRemainingSavingsToNextMonth,
        correctMonthlySavingsHistoryItem,
        deleteMonthlySavingsHistoryItem,
        addMissingMonthlySavingsItem,
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

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash % 9000) + 1000;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
