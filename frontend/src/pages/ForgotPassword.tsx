/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/auth';
import { useToast } from '../contexts/ToastContext';
import { motion } from 'motion/react';
import { BrainCircuit, Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please specify your registered email.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
      showToast('Verification sent!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error executing password recovery.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 sm:p-12 transition-colors duration-300">
      
      <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-8 sm:p-10 rounded-3xl shadow-xl space-y-8"
      >
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Link to="/" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-500">
              <BrainCircuit className="h-6 w-6" />
            </Link>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Recover Password</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            We will send you a verification link to reset your account credentials.
          </p>
        </div>

        {isSubmitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="flex justify-center text-emerald-500">
              <CheckCircle2 className="h-14 w-14" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Reset Link Dispatched</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Check your inbox at <span className="font-semibold text-slate-800 dark:text-slate-200">{email}</span> for recovery steps.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Sign In
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email field */}
            <div className="space-y-2">
              <label htmlFor="forgot-email" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                <input
                  id="forgot-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                id="forgot-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 rounded-2xl py-3.5 shadow-lg shadow-blue-500/10 transition-all focus:outline-hidden cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Transmitting...
                  </>
                ) : (
                  'Transmit Reset Link'
                )}
              </button>
              
              <Link
                id="forgot-back-login"
                to="/login"
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white py-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}

      </motion.div>
    </div>
  );
}
