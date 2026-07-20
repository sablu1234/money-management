export type TransactionType = 'income' | 'expense';

export type AccountStatus = 'Pending' | 'Approved' | 'Rejected' | 'Deactivated';

export type SubscriptionPlan = 'Free' | 'Pro' | 'Admin';

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
  plan: SubscriptionPlan;
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
  plan: SubscriptionPlan;
  joinedDate: string;
  totalTransactions: number;
}

export interface MonthlyBudgetTarget {
  month: string;
  targetBudget: number;
  runningSpend: number;
  savingsAchieved: number;
  isRolledOver?: boolean;
}
