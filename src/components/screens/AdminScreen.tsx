import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Users, DollarSign, Activity, Lock, ArrowUpRight, Check, X, Clock, FileSpreadsheet, ExternalLink } from 'lucide-react';
import { setGoogleSheetWebhook, getGoogleSheetWebhook } from '../../services/googleSheetSync';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const ADMIN_REVENUE_DATA = [
  { month: 'Jan', revenue: 1240 },
  { month: 'Feb', revenue: 1890 },
  { month: 'Mar', revenue: 2400 },
  { month: 'Apr', revenue: 3100 },
  { month: 'May', revenue: 4200 },
  { month: 'Jun', revenue: 5600 },
  { month: 'Jul', revenue: 6800 }
];

export const AdminScreen: React.FC = () => {
  const { user, adminUsers, approveUser, rejectUser, googleSheetUrl } = useApp();
  const [webhookInput, setWebhookInput] = useState(getGoogleSheetWebhook());
  const [webhookMsg, setWebhookMsg] = useState('');

  if (user.role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Admin Access Required</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
          Only Sablu Hasan (Admin) can access this control panel.
        </p>
      </div>
    );
  }

  const pendingUsers = adminUsers.filter(u => u.approvalStatus === 'Pending');

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleSheetWebhook(webhookInput);
    setWebhookMsg('Google Sheet Webhook saved successfully!');
    setTimeout(() => setWebhookMsg(''), 3000);
  };

  return (
    <div className="space-y-6 py-4 animate-in fade-in duration-300">
      
      {/* Admin Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black">Sablu Hasan Admin Console</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Approve user registrations, system analytics, and Google Sheets integration
            </p>
          </div>
        </div>

        <a
          href={googleSheetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Open Linked Google Sheet</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Google Sheet Live Database Card */}
      <div className="glass-card p-6 rounded-3xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-500/5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Google Sheet Live Database Integration
            </h3>
          </div>
          <a
            href={googleSheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View Spreadsheet (gid=0)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          All user registration requests and transaction entries can automatically sync live to your Google Sheet: <strong className="text-slate-900 dark:text-white truncate block sm:inline">{googleSheetUrl}</strong>
        </p>

        <form onSubmit={handleSaveWebhook} className="space-y-2">
          <label className="block text-[11px] font-bold text-slate-500">Google Apps Script Webhook URL (Optional for Auto-Sync)</label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={webhookInput}
              onChange={e => setWebhookInput(e.target.value)}
              className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow hover:bg-emerald-700"
            >
              Save Webhook
            </button>
          </div>
          {webhookMsg && <p className="text-xs font-bold text-emerald-500 mt-1">{webhookMsg}</p>}
        </form>
      </div>

      {/* Admin Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase">Pending Registrations</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-500">{pendingUsers.length} Requests</p>
          <p className="text-[10px] text-slate-400">Requires Admin Approval</p>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase">Total Platform Users</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{adminUsers.length}</p>
          <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +18% growth
          </p>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase">Monthly SaaS MRR</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-500">$6,800</p>
          <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +24% MRR growth
          </p>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase">API & System Uptime</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">99.98%</p>
          <p className="text-[10px] text-emerald-500 font-bold">Latency: 42ms</p>
        </div>
      </div>

      {/* User Approvals Management Section */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          User Registration Approvals ({pendingUsers.length} Pending)
        </h3>

        {pendingUsers.length === 0 ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center">
            🎉 All registered users have been approved!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 uppercase font-extrabold">
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-center">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pendingUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{u.name}</td>
                    <td className="py-3 px-3 text-slate-500">{u.email}</td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-500 border border-amber-500/30 animate-pulse">
                        Pending Approval
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => approveUser(u.email)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-extrabold text-[11px] shadow hover:bg-emerald-600 flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve Full Access
                        </button>
                        <button
                          onClick={() => rejectUser(u.email)}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Revenue Chart & All Users Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Growth Chart */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            SaaS Monthly Recurring Revenue (MRR)
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* All Users Directory */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">All Registered Accounts</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 uppercase font-extrabold">
                  <th className="py-2 px-3">User</th>
                  <th className="py-2 px-3">Role</th>
                  <th className="py-2 px-3">Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {adminUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                      <p className="text-[10px] text-slate-400">{u.email}</p>
                    </td>
                    <td className="py-2.5 px-3 capitalize">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          u.approvalStatus === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}
                      >
                        {u.approvalStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
