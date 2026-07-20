import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Download, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';

export const ExportReportModal: React.FC = () => {
  const { activeModal, setActiveModal, transactions, user, totalBalance } = useApp();
  const [downloading, setDownloading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (activeModal !== 'exportReport') return null;

  const handleExportCSV = () => {
    setDownloading(true);
    setTimeout(() => {
      const headers = ['ID', 'Title', 'Type', 'Category', 'Amount', 'Date', 'PaymentMethod', 'Status'];
      const rows = transactions.map(t => [
        t.id,
        `"${t.title.replace(/"/g, '""')}"`,
        t.type,
        t.category,
        t.amount,
        t.date,
        t.paymentMethod,
        t.status
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `MoneyFlow_Financial_Report_SabluHasan_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloading(false);
      setSuccessMsg('CSV file generated and downloaded successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 600);
  };

  const handlePrintPDF = () => {
    setDownloading(true);
    setTimeout(() => {
      window.print();
      setDownloading(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-card rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Export Financial Report
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Download spreadsheet or printable summary PDF
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Overview Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 mb-4 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Author Portfolio:</span>
            <span className="text-blue-500 font-bold">{user.authorName}</span>
          </div>
          <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Total Records:</span>
            <span className="font-bold text-slate-900 dark:text-white">{transactions.length} Entries</span>
          </div>
          <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Net Balance:</span>
            <span className="font-bold text-emerald-500">{user.currencySymbol}{totalBalance.toLocaleString()}</span>
          </div>
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Options */}
        <div className="space-y-3">
          <button
            onClick={handleExportCSV}
            disabled={downloading}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 bg-white dark:bg-slate-800/80 flex items-center justify-between text-left group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Export to CSV</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Excel / Google Sheets compatible data</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
          </button>

          <button
            onClick={handlePrintPDF}
            disabled={downloading}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 bg-white dark:bg-slate-800/80 flex items-center justify-between text-left group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Print / Save PDF Report</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Formatted printable summary document</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
          </button>
        </div>

        <div className="mt-5">
          <button
            onClick={() => setActiveModal(null)}
            className="w-full py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
