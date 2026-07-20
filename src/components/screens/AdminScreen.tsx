import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Users, DollarSign, Activity, Lock, CheckCircle, ArrowUpRight } from 'lucide-react';
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
  const { user, adminUsers } = useApp();

  if (user.role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Admin Access Required</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
          Please use the top <strong>Role Switcher</strong> to select "Admin" role to test this screen!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4 animate-in fade-in duration-300">
      
      {/* Admin Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black">MoneyFlow Admin Console</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              System analytics, SaaS subscription revenue, and user permissions
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-extrabold flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5" /> System Healthy
        </span>
      </div>

      {/* Admin Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase">Total Platform Users</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">1,482</p>
          <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +18.2% this month
          </p>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase">Active SaaS Subscriptions</span>
            <Shield className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-indigo-500">680 Premium</p>
          <p className="text-[10px] text-slate-400">45.8% conversion rate</p>
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

      {/* Revenue Chart & User Management */}
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

        {/* User Management Table */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">User Accounts & Roles</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 uppercase font-extrabold">
                  <th className="py-2 px-3">User</th>
                  <th className="py-2 px-3">Role</th>
                  <th className="py-2 px-3">Status</th>
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
                          u.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-rose-500/10 text-rose-500'
                        }`}
                      >
                        {u.status}
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
