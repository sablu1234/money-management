export type TransactionType = 'income' | 'expense';
export type PaymentMethod = 'Cash' | 'Bank Account' | 'Credit Card' | 'Debit Card' | 'Mobile Banking';
export type TransactionStatus = 'Completed' | 'Pending' | 'Recurring';
export type UserRole = 'normal' | 'premium' | 'admin';
export type CurrencyCode = 'USD' | 'BDT' | 'EUR' | 'GBP' | 'JPY';
export type AccountStatus = 'Approved' | 'Pending' | 'Rejected';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  notes?: string;
  receiptUrl?: string;
}

export interface Budget {
  id: string;
  category: string;
  monthlyLimit: number;
  spentAmount: number;
  period: string;
}

export interface MonthlyBudgetTarget {
  month: string; // e.g. '2026-07'
  targetBudget: number;
  runningSpend: number;
  savingsAchieved: number;
  isRolledOver: boolean;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  icon: string;
  autoSaveMonthly?: number;
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'alert' | 'info' | 'success';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  approvalStatus: AccountStatus;
  currency: CurrencyCode;
  currencySymbol: string;
  language: string;
  isDarkMode: boolean;
  portfolioUrl: string;
  authorName: string;
  runningMonthTargetBudget: number;
  totalAccumulatedSavings: number;
}

export interface AIAdvice {
  id: string;
  query: string;
  response: string;
  timestamp: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  approvalStatus: AccountStatus;
  joinedDate: string;
  totalTransactions: number;
}
