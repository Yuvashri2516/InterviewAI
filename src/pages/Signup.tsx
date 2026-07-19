/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { motion } from 'motion/react';
import { BrainCircuit, Mail, Lock, User as UserIcon, Loader2, ArrowRight } from 'lucide-react';

export default function Signup() {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('All fields are required to register.', 'warning');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      await signup(name, email, password);
      showToast('Account registered successfully! Welcome.', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Signup failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Sidebar Info Panel */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-gradient-to-br from-indigo-600 to-blue-700 dark:from-indigo-900 dark:to-blue-950 p-12 text-white relative overflow-hidden select-none">
        <div className="absolute inset-0 bg-blue-500/10" />
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">InterviewAI</span>
        </div>

        <div className="relative z-10 space-y-4 max-w-lg">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Accelerate Your Engineering Career
          </h2>
          <p className="text-indigo-100/80 text-sm leading-relaxed">
            Gain the competitive edge. Experience real-time role-based mock tests, analyze system design constraints, and master your behavioral storytelling.
          </p>
        </div>

        <div className="relative z-10 text-xs text-indigo-200/60 font-medium">
          © 2026 InterviewAI Inc. Fast, responsive, private evaluations.
        </div>
      </div>

      {/* Form Area */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-xl"
        >
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Get Started</h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Create your account to start practicing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="signup-name" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                  placeholder="Yuvashri Narasimman"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="signup-password" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                <input
                  id="signup-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                  placeholder="•••••••• (6+ characters)"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
              By creating an account, you agree to our{' '}
              <a href="#" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>.
            </p>

            {/* Submit */}
            <button
              id="signup-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 rounded-2xl py-3.5 shadow-lg shadow-blue-500/10 transition-all focus:outline-hidden cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Registering...
                </>
              ) : (
                <>
                  Register Account <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Prompt Sign in */}
          <div className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/50">
            Already have an account?{' '}
            <Link
              id="signup-login-link"
              to="/login"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
