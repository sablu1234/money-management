import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Users,
  CheckCircle2,
  Clock,
  Activity,
  FileSpreadsheet,
  ExternalLink,
  Check,
  X,
  UserCheck,
  Ban,
  Trash2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ADMIN_REVENUE_DATA = [
  { month: 'Jan', revenue: 1200 },
  { month: 'Feb', revenue: 1800 },
  { month: 'Mar', revenue: 2400 },
  { month: 'Apr', revenue: 3100 },
  { month: 'May', revenue: 4200 },
  { month: 'Jun', revenue: 5600 },
  { month: 'Jul', revenue: 7800 },
];

export const AdminScreen: React.FC = () => {
  const {
    adminUsers,
    approveUser,
    rejectUser,
    deactivateUser,
    deleteUserAccount,
    googleSheetUrl,
    user
  } = useApp();

  const [webhookInput, setWebhookInput] = useState('');
  const [webhookMsg, setWebhookMsg] = useState('');

  const pendingUsers = adminUsers.filter(u => u.approvalStatus === 'Pending');
  const activeUsers = adminUsers.filter(u => u.approvalStatus === 'Approved');

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookInput) return;
    localStorage.setItem('moneyflow_google_sheet_webhook', webhookInput);
    setWebhookMsg('Google Sheet Webhook URL saved successfully!');
    setTimeout(() => setWebhookMsg(''), 3000);
  };

  return (
    <div className="space-y-6 py-4 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl glass-card border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-blue-500/10 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg glow-blue">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                Sablu Hasan's Admin Command Center
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-500 text-xs font-black uppercase">
                Owner Mode
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Full control over user approvals, account deactivations, deletions, and Google Sheet database
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={user.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 flex items-center gap-1.5"
          >
            <span>Developer Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
          </a>
        </div>
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
            <span className="text-[11px] font-bold uppercase">Active Approved Users</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{activeUsers.length} Members</p>
          <p className="text-[10px] text-slate-400">Full Application Access</p>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase">Database Sync Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-500">Live Active</p>
          <p className="text-[10px] text-slate-400">Google Sheet Real-Time Sync</p>
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
            🎉 All registered users have been reviewed and approved!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 uppercase font-extrabold">
                  <th className="py-2.5 px-3">User ID</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-center">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pendingUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-mono text-slate-400 font-bold">{u.id}</td>
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
                          <Check className="w-3.5 h-3.5" /> Approve
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

      {/* Revenue Chart & All Users Directory */}
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

        {/* All Users Directory with Deactivate & Delete Capabilities */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">All Registered Accounts</h3>
            <span className="text-xs text-slate-400 font-bold">{adminUsers.length} Users</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 uppercase font-extrabold">
                  <th className="py-2 px-3">User & ID</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-center">Manage Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {adminUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                        <span className="font-mono text-[10px] text-slate-400">({u.id})</span>
                      </div>
                      <p className="text-[10px] text-slate-400">{u.email}</p>
                    </td>

                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          u.approvalStatus === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : u.approvalStatus === 'Deactivated'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-rose-500/10 text-rose-500'
                        }`}
                      >
                        {u.approvalStatus}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      {u.role === 'admin' ? (
                        <span className="text-[10px] text-indigo-500 font-extrabold">Master Admin</span>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5">
                          {u.approvalStatus !== 'Approved' && (
                            <button
                              onClick={() => approveUser(u.email)}
                              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors"
                              title="Approve Account"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {u.approvalStatus !== 'Deactivated' && (
                            <button
                              onClick={() => deactivateUser(u.email)}
                              className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-colors"
                              title="Deactivate Account"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to permanently delete account for ${u.name} (${u.email})?`)) {
                                deleteUserAccount(u.email);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                            title="Permanently Delete Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
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
