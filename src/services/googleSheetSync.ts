// Google Sheets Automatic Cloud Sync Utility
// Spreadsheet ID: 1rjbnHvr0Jje93dQOy0GnyPBSCLZc3gNfCYSed2JT5wU

export const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1rjbnHvr0Jje93dQOy0GnyPBSCLZc3gNfCYSed2JT5wU/edit?gid=0#gid=0';

// Live Active Google Apps Script Webhook Endpoint for Sablu Hasan's MoneyFlow Spreadsheet
export const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyLv4otV3L-fWGv8gUrKXI6DiaBilIzsHrISUiGnyeMdMs1Z6gKaCYa3aKgf4FqlXZ-/exec';

let webhookUrl = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK || localStorage.getItem('moneyflow_google_sheet_webhook') || DEFAULT_WEBHOOK_URL;

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
  const targetUrl = webhookUrl || DEFAULT_WEBHOOK_URL;

  try {
    await fetch(targetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    console.log('Successfully synced live data to Google Sheet database!', data);
    return true;
  } catch (err) {
    console.error('Error syncing live data to Google Sheet:', err);
    return false;
  }
}
