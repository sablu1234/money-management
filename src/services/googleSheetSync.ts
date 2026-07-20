// Google Sheets Automatic Cloud Sync Utility
// Spreadsheet ID: 1rjbnHvr0Jje93dQOy0GnyPBSCLZc3gNfCYSed2JT5wU

export const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1rjbnHvr0Jje93dQOy0GnyPBSCLZc3gNfCYSed2JT5wU/edit?gid=0#gid=0';

// Configurable Webhook Endpoint (Google Apps Script / SheetDB / AppSheet)
let webhookUrl = localStorage.getItem('moneyflow_google_sheet_webhook') || '';

export const setGoogleSheetWebhook = (url: string) => {
  webhookUrl = url;
  localStorage.setItem('moneyflow_google_sheet_webhook', url);
};

export const getGoogleSheetWebhook = () => webhookUrl;

export async function syncTransactionToGoogleSheet(data: {
  date: string;
  userName: string;
  userEmail: string;
  title: string;
  type: string;
  category: string;
  amount: number;
  paymentMethod: string;
  notes?: string;
}) {
  const targetUrl = webhookUrl;
  if (!targetUrl) {
    console.log('Google Sheet Webhook not set yet. Data logged locally:', data);
    return false;
  }

  try {
    await fetch(targetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    console.log('Successfully synced transaction to Google Sheet!');
    return true;
  } catch (err) {
    console.error('Error syncing to Google Sheet:', err);
    return false;
  }
}
