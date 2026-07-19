/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { motion } from 'motion/react';
import { BrainCircuit, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('yuvashrinarasimman25@gmail.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all credentials.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      showToast('Signed in successfully!', 'success');
      navigate(from, { replace: true });
    } catch (err: any) {
      showToast(err.message || 'Authentication failed. Please verify credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Visual Ambient Banner Block (Left Side) */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-blue-600 dark:bg-blue-900 p-12 text-white relative overflow-hidden select-none">
        {/* Glow meshes */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-cyan-500/30" />
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-400/25 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-cyan-400/25 blur-3xl" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">InterviewAI</span>
        </div>

        <div className="relative z-10 space-y-4 max-w-lg">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Perfecting technical loops, one practice at a time.
          </h2>
          <p className="text-blue-100/80 text-sm leading-relaxed">
            Gain deep, professional evaluations of your system design, technical core, and behavioral answers using advanced Google Gemini reasoning models.
          </p>
        </div>

        <div className="relative z-10 text-xs text-blue-200/65 font-medium">
          © 2026 InterviewAI Inc. Secure sandbox environments.
        </div>
      </div>

      {/* Form Content Block (Right Side) */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-xl"
        >
          <div className="text-center md:text-left space-y-2">
            <div className="flex md:hidden justify-center mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <BrainCircuit className="h-5.5 w-5.5" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome Back</h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Sign in to resume active preparation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Password
                </label>
                <Link
                  id="login-forgot-link"
                  to="/forgot-password"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 rounded-2xl py-3.5 shadow-lg shadow-blue-500/10 transition-all focus:outline-hidden cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  Continue <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Prompt Sign up */}
          <div className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/50">
            Don't have an account?{' '}
            <Link
              id="login-signup-link"
              to="/signup"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Sign up for free
            </Link>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
