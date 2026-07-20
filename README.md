# MoneyFlow - Smart Personal Finance Manager

A modern, high-performance personal money management platform engineered by **Sablu Hasan** ([Portfolio](https://sablu-hasan.vercel.app/)).

## 🔐 Admin Credentials

```text
Admin Email: sablu.hasan.dev@gmail.com
Admin Password: SabluAdmin#2026
```

---

## 🌟 Key Features

- **Personalized Financial Dashboard**: Live balance overview, income, expenses, category spending breakdown pie chart, cashflow trend graphs, and Financial Health Score meter.
- **Admin Approval System**: Public registrations default to `Pending Admin Approval`. Only **Sablu Hasan (Admin)** can approve or reject new user registrations from the Admin Console.
- **Automated Google Sheets Live Database Sync**: Real-time cloud sync for user accounts and financial transactions to [Sablu Hasan's Google Sheet](https://docs.google.com/spreadsheets/d/1rjbnHvr0Jje93dQOy0GnyPBSCLZc3gNfCYSed2JT5wU/edit?gid=0#gid=0).
- **Dual Admin Email Notifications**: Automated instant email notifications sent to `mdsablu0000000@gmail.com` and `mdsablu36@gmail.com` whenever a new user registers.
- **Multi-Currency Support & Live Rate Converter**: Real-time rate converter supporting USD ($), BDT (৳), EUR (€), GBP (£), and JPY (¥).
- **Category Budgeting & Limit Alerts**: Budget thresholds with progress bars and 80%+ usage warning banners.
- **Savings Goals & Milestone Celebrations**: Goal progress tracking with celebratory confetti animation on completion.
- **AI Financial Assistant**: Intelligent conversational insights answering questions like *"Where did I spend the most money this month?"* or *"How to save $500?"*.
- **Report Export**: One-click CSV spreadsheet download & formatted printable PDF summary.
- **PWA & Mobile APK Support**: 1-click home screen install via PWA manifest or Capacitor offline APK build.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons
- **Data Visualization**: Recharts
- **Database & Sync**: LocalStorage State Architecture + Google Apps Script Webhook
- **Animations**: Canvas Confetti, Tailwind Animations
- **Author**: [Sablu Hasan](https://sablu-hasan.vercel.app/)

---

## ⚙️ Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sablu1234/money-management.git
   cd money-management
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local dev server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🔒 Making Repository Private on GitHub

1. Navigate to: [github.com/sablu1234/money-management/settings](https://github.com/sablu1234/money-management/settings)
2. Scroll to **Danger Zone** at the bottom of the page.
3. Click **Change visibility** -> Select **Change to private**.
4. Type `sablu1234/money-management` to confirm.

*(Vercel deployment will remain 100% active and connected even after making the repository Private)*
