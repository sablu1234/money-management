// Google Sheets Live Single-Row User Summary Sync Utility & Admin Email Alerts
// Spreadsheet ID: 1rjbnHvr0Jje93dQOy0GnyPBSCLZc3gNfCYSed2JT5wU

export const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1rjbnHvr0Jje93dQOy0GnyPBSCLZc3gNfCYSed2JT5wU/edit?gid=0#gid=0';

export const ADMIN_NOTIFICATION_EMAILS = [
  'mdsablu0000000@gmail.com',
  'mdsablu36@gmail.com'
];

export const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyLv4otV3L-fWGv8gUrKXI6DiaBilIzsHrISUiGnyeMdMs1Z6gKaCYa3aKgf4FqlXZ-/exec';

let webhookUrl = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK || localStorage.getItem('moneyflow_google_sheet_webhook') || DEFAULT_WEBHOOK_URL;

export const setGoogleSheetWebhook = (url: string) => {
  webhookUrl = url;
  localStorage.setItem('moneyflow_google_sheet_webhook', url);
};

export const getGoogleSheetWebhook = () => webhookUrl;

export interface UserSummarySheetPayload {
  userId: string;
  userName: string;
  userEmail: string;
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  totalSavings: number;
  targetBudget: number;
  lastAction?: string;
  accountStatus?: string;
  isRegistration?: boolean;
}

export async function syncUserTotalsToGoogleSheet(data: UserSummarySheetPayload) {
  const targetUrl = webhookUrl || DEFAULT_WEBHOOK_URL;

  const payload = {
    userId: data.userId || 'USR-1001',
    userName: data.userName,
    userEmail: data.userEmail,
    totalBalance: data.totalBalance,
    monthlyIncome: data.monthlyIncome,
    monthlyExpenses: data.monthlyExpenses,
    totalSavings: data.totalSavings,
    targetBudget: data.targetBudget,
    lastUpdated: new Date().toLocaleString(),
    lastAction: data.lastAction || 'Updated Financial Metrics',
    accountStatus: data.accountStatus || 'Approved',
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
    console.log('Synced Single Row User Total Amounts to Google Sheet:', payload);
    return true;
  } catch (err) {
    console.error('Error syncing single row user totals:', err);
    return false;
  }
}
