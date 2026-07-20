export type TransactionType = 'income' | 'expense';

export type AccountStatus = 'Pending' | 'Approved' | 'Rejected' | 'Deactivated';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  paymentMethod: string;
  notes?: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface Budget {
  id: string;
  category: string;
  monthlyLimit: number;
  spentAmount: number;
  period: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'danger';
}

export type UserRole = 'normal' | 'admin';
export type CurrencyCode = 'USD' | 'BDT' | 'EUR' | 'GBP' | 'JPY';

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
  runningMonthTargetBudget: number; // User's custom running month target budget (e.g. $1500)
  totalAccumulatedSavings: number; // Base total savings adjustment
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

export interface MonthlyBudgetTarget {
  month: string; // e.g. "July 2026"
  targetBudget: number;
  runningSpend: number;
  savingsAchieved: number;
  isRolledOver?: boolean;
}
