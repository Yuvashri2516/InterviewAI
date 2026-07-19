/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Lock, 
  Award, 
  Save, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck,
  Code
} from 'lucide-react';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || 'Yuvashri Narasimman');
  const [email] = useState(user?.email || 'yuvashrinarasimman25@gmail.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [targetRole, setTargetRole] = useState('Fullstack Engineer');
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (password) {
        if (password !== confirmPassword) {
          showToast('Passwords do not match.', 'warning');
          setIsSaving(false);
          return;
        }
        if (password.length < 6) {
          showToast('Password must be at least 6 characters.', 'warning');
          setIsSaving(false);
          return;
        }
      }

      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 800));

      // Save to localStorage mimicking DB update
      const stored = localStorage.getItem('interview_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.name = name;
        localStorage.setItem('interview_user', JSON.stringify(parsed));
      }

      refreshUser();
      setPassword('');
      setConfirmPassword('');
      showToast('Profile configuration updated successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to modify profile settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 select-none"
    >
      
      {/* Description Title */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Account Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Modify personal details, targets, and security credentials below.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card details (1/3 width) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl shadow-xs text-center space-y-6">
          <div className="relative h-24 w-24 mx-auto">
            <div className="h-full w-full rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl font-extrabold border-2 border-blue-500/10">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-xs">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="font-extrabold text-base">{name}</h3>
            <p className="text-xs text-slate-400 font-semibold">{email}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/20 text-left space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sandbox metrics</span>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500">Streak Count</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">5 Days</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500">Assessment Average</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">79% Match</span>
            </div>
          </div>
        </div>

        {/* Profile editing forms (2/3 width) */}
        <div className="lg:col-span-2">
          <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <User className="h-4 w-4 text-slate-400" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold focus:outline-hidden focus:border-blue-500"
                  placeholder="Yuvashri Narasimman"
                />
              </div>

              {/* Email (Readonly) */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 select-none">
                  <Mail className="h-4 w-4 text-slate-300" /> Registered Email
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-850/40 border border-slate-200 dark:border-slate-850 text-slate-400 rounded-xl text-sm font-semibold cursor-not-allowed select-none"
                />
              </div>
            </div>

            {/* Target Role Preference */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Code className="h-4 w-4 text-slate-400" /> Default Focus Specialization
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold focus:outline-hidden focus:border-blue-500"
                placeholder="e.g. Fullstack Engineer"
              />
            </div>

            {/* Password security update divider */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/40 space-y-4">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Lock className="h-4.5 w-4.5 text-slate-400 shrink-0" /> Modify Account Credentials
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    New Password (optional)
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden focus:border-blue-500 font-medium"
                    placeholder="••••••••"
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden focus:border-blue-500 font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Actions footer */}
            <div className="flex justify-end pt-2">
              <button
                id="profile-save-btn"
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl px-6 py-3 shadow-md shadow-blue-500/10 transition-colors focus:outline-hidden cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" /> Saving Changes...
                  </>
                ) : (
                  <>
                    Save Profile <Save className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>

    </motion.div>
  );
}
