/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  BrainCircuit, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Video, 
  Award, 
  BarChart3, 
  ShieldCheck, 
  Zap,
  Check
} from 'lucide-react';
import ThemeSwitcher from '../components/ThemeSwitcher';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-500/15 selection:text-blue-600 transition-colors duration-300">
      
      {/* GLOWING HEADER BACKGROUND BLUR MESHES */}
      <div className="absolute top-0 left-1/4 h-96 w-96 -translate-x-1/2 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-1/4 h-96 w-96 translate-x-1/2 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-500 text-white shadow-md shadow-blue-500/20">
              <BrainCircuit className="h-5.5 w-5.5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              InterviewAI
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <Link
              id="landing-signin-link"
              to="/login"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              id="landing-signup-btn"
              to="/signup"
              className="inline-flex items-center gap-1 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl px-4 py-2.5 shadow-md shadow-blue-500/15 transition-all hover:translate-y-[-1px] focus:outline-hidden"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-28 md:pb-24 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 text-xs font-semibold text-blue-700 dark:text-blue-400">
            <Sparkles className="h-3.5 w-3.5" /> Next-Gen AI Interview Evaluator
          </motion.div>

          {/* Heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto"
          >
            Nail Your Next Interview with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">
              Real-Time AI Coaching
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Upload your resume, generate personalized role-based question sets, practice
            under timed conditions, and receive instant, expert-level feedback backed by Gemini.
          </motion.p>

          {/* Call to Actions */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              id="landing-hero-start"
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-2xl px-8 py-4 shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] focus:outline-hidden"
            >
              Start Free Trial <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/55 rounded-2xl px-8 py-4 shadow-md transition-all focus:outline-hidden"
            >
              Explore Features
            </a>
          </motion.div>

          {/* Dashboard Preview Frame Mockup */}
          <motion.div 
            variants={itemVariants}
            className="pt-12 max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-2xl p-2 md:p-3 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-10 border-b border-slate-100 dark:border-slate-800/50 flex items-center px-4 gap-2 bg-slate-55/40 dark:bg-slate-900">
                <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-44 rounded-md bg-slate-100 dark:bg-slate-850/60 mx-auto" />
              </div>
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200" 
                alt="Dashboard Screen Mockup" 
                className="w-full h-auto rounded-xl border border-slate-100 dark:border-slate-800/50 mt-10"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. VALUE PROPOSITION STATS */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-200/50 dark:border-slate-800/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-blue-600 dark:text-blue-500">94%</p>
            <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">Placement Rate Improvement</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-indigo-600 dark:text-indigo-500">12k+</p>
            <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">Mock Sessions Finished</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-cyan-500">30+</p>
            <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">Tech roles Supported</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-emerald-500">4.9/5</p>
            <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">User satisfaction rating</p>
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything You Need to Master the Loop</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            Engineered like modern SaaS tools. Fast, beautifully formatted, responsive, and completely personalized.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/65 rounded-2xl p-8 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
            <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-3">Resume Parser & Scorecard</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Drag and drop your PDF resume. Our parser automatically extracts projects, key skills, and experience to generate a complete evaluation scorecard.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/65 rounded-2xl p-8 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
            <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">
              <Video className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-3">Adaptive Interview Simulator</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Customize setup options for roles, specific question sizes, and difficulties. Experience interactive interview modules with timelines, auto-saves, and trackers.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/65 rounded-2xl p-8 hover:shadow-xl hover:shadow-cyan-500/5 transition-all">
            <div className="h-12 w-12 rounded-xl bg-cyan-100 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-6">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-3">Interactive Reports & Charts</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              View granular, Gemini-evaluated feedback on communication clarity and technical accuracy, with model answers and specific study resources.
            </p>
          </div>

        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section className="bg-slate-100/50 dark:bg-slate-900/40 border-y border-slate-200/50 dark:border-slate-800/50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Simple, Clear Pricing</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              No contracts. Cancel at any time. Start practicing immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8">
            
            {/* Free tier */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Basic</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Perfect for checking basic concepts.</p>
                <p className="text-4xl font-extrabold mt-6">$0 <span className="text-sm font-medium text-slate-500">/ forever</span></p>
                
                <ul className="mt-8 space-y-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-500 shrink-0" />
                    <span>3 Full mock interviews</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-500 shrink-0" />
                    <span>1 Resume evaluation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-500 shrink-0" />
                    <span>Basic metrics breakdown</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/signup"
                className="mt-8 w-full inline-flex items-center justify-center font-semibold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl py-3 transition-colors text-center"
              >
                Sign Up Free
              </Link>
            </div>

            {/* Premium Tier */}
            <div className="relative bg-white dark:bg-slate-900 border-2 border-blue-600 dark:border-blue-500 rounded-3xl p-8 flex flex-col justify-between shadow-xl shadow-blue-500/5">
              <div className="absolute top-0 right-8 -translate-y-1/2 inline-flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                <Zap className="h-3.5 w-3.5 shrink-0" /> Popular Choice
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Premium Pro</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">The complete suite for elite placements.</p>
                <p className="text-4xl font-extrabold mt-6">$29 <span className="text-sm font-medium text-slate-500">/ month</span></p>
                
                <ul className="mt-8 space-y-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-500 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-100">Unlimited AI mock sessions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-500 shrink-0" />
                    <span>Unlimited Resume scoring</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-500 shrink-0" />
                    <span>Gemini technical answer diagnostics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-500 shrink-0" />
                    <span>Personalized weak skill study roadmaps</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/signup"
                className="mt-8 w-full inline-flex items-center justify-center font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl py-3 shadow-md shadow-blue-500/15 transition-all text-center"
              >
                Join Premium Pro
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 6. TRUST & SECURITY */}
      <section className="py-16 px-4 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold">Your Data remains Secured</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              Uploaded resumes are securely processed via ephemeral memory loops and never sold or shared with training libraries.
            </p>
          </div>
        </div>
        <p className="text-xs font-semibold text-slate-400">Powered by advanced Google Gemini Pro Systems</p>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center text-xs font-medium text-slate-500 dark:text-slate-400 space-y-4">
        <p>© 2026 InterviewAI Inc. All rights reserved.</p>
        <div className="flex items-center justify-center gap-6">
          <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact Support</a>
        </div>
      </footer>

    </div>
  );
}
