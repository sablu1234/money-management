import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';

// Screens
import { LandingScreen } from './components/screens/LandingScreen';
import { AuthScreen } from './components/screens/AuthScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { TransactionsScreen } from './components/screens/TransactionsScreen';
import { BudgetScreen } from './components/screens/BudgetScreen';
import { GoalsScreen } from './components/screens/GoalsScreen';
import { AnalyticsScreen } from './components/screens/AnalyticsScreen';
import { AIAssistantScreen } from './components/screens/AIAssistantScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { AdminScreen } from './components/screens/AdminScreen';

// Modals
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { CurrencyConverterModal } from './components/modals/CurrencyConverterModal';
import { ExportReportModal } from './components/modals/ExportReportModal';

const AppContent: React.FC = () => {
  const { currentView, isLoggedIn } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderCurrentScreen = () => {
    switch (currentView) {
      case 'landing':
        return <LandingScreen />;
      case 'auth':
        return <AuthScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'transactions':
        return <TransactionsScreen />;
      case 'budgets':
        return <BudgetScreen />;
      case 'goals':
        return <GoalsScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'ai':
        return <AIAssistantScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'admin':
        return <AdminScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      {/* Main Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative">
        
        {/* Sidebar (Always rendered so mobile drawer toggle works on every screen!) */}
        <Sidebar
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        {/* Dynamic Main Workspace Area */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 overflow-y-auto w-full">
          {renderCurrentScreen()}
        </main>
      </div>

      {/* Mobile Touch Bottom Nav (Visible when logged in) */}
      {isLoggedIn && <MobileNav />}

      {/* Modals */}
      <AddTransactionModal />
      <CurrencyConverterModal />
      <ExportReportModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
