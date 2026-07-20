// Google Sheets 14-Column Single-Row Master Database Sync Utility
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

export interface FullUserRowPayload {
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  plan: string;
  approvalStatus: string;
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  totalSavings: number;
  targetBudget: number;
  remainingBudget: number;
  lastAction: string;
  isRegistration?: boolean;
}

export async function syncFullUserRowToGoogleSheet(data: FullUserRowPayload) {
  const targetUrl = webhookUrl || DEFAULT_WEBHOOK_URL;

  const payload = {
    userId: data.userId || 'USR-1001',
    userName: data.userName,
    userEmail: data.userEmail,
    role: data.role || 'normal',
    plan: data.plan || 'Free',
    approvalStatus: data.approvalStatus || 'Approved',
    totalBalance: data.totalBalance,
    monthlyIncome: data.monthlyIncome,
    monthlyExpenses: data.monthlyExpenses,
    totalSavings: data.totalSavings,
    targetBudget: data.targetBudget,
    remainingBudget: data.remainingBudget,
    lastAction: data.lastAction || 'Updated Metrics',
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
    console.log('Synced 14-Column Single Row User Master Data to Google Sheet:', payload);
    return true;
  } catch (err) {
    console.error('Error syncing 14-column single row master data:', err);
    return false;
  }
}
