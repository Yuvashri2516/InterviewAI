/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { analyticsService } from '../services/analytics';
import { DashboardData } from '../types';
import { motion } from 'motion/react';
import { 
  Award, 
  TrendingUp, 
  FileText, 
  Video, 
  Flame, 
  Plus, 
  ArrowRight, 
  Target, 
  AlertCircle,
  HelpCircle,
  Loader2,
  CheckCircle,
  Clock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [goals, setGoals] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const dashboardData = await analyticsService.getDashboardData();
        setData(dashboardData);
        setGoals(dashboardData.upcomingGoals || []);
      } catch (err: any) {
        showToast('Failed to load dashboard statistics.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, [showToast]);

  const toggleGoal = (id: string) => {
    setGoals(prev => 
      prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g)
    );
    showToast('Goal progress updated successfully.', 'success');
  };

  if (isLoading || !data) {
    return (
      <div className="h-[calc(100vh-10rem)] flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-blue-600 dark:text-blue-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Synthesizing platform metrics...</p>
        </div>
      </div>
    );
  }

  const { stats, skillsBreakdown, monthlyProgress, recentInterviews, weakSkills, recommendedPractice } = data;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 select-none"
    >
      {/* 1. GREETING & HERO SUMMARY */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 md:p-8 rounded-3xl shadow-xs">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">{user?.name}</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            Your telemetry looks strong. Keep pushing limits—you are currently on a <span className="font-bold text-slate-800 dark:text-slate-200">{stats.streakCounter}-day active streak</span>. Practice today to maintain momentum.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <Link
            id="dashboard-upload-resume-btn"
            to="/resume"
            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-xl px-5 py-3 transition-colors focus:outline-hidden"
          >
            <FileText className="h-4.5 w-4.5 shrink-0" /> Upload Resume
          </Link>
          <Link
            id="dashboard-start-interview-btn"
            to="/setup"
            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl px-5 py-3 shadow-md shadow-blue-500/10 transition-colors focus:outline-hidden"
          >
            <Video className="h-4.5 w-4.5 shrink-0" /> New Session <Plus className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* 2. CORE PERFORMANCE METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Streak card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Streak</span>
            <p className="text-2xl md:text-3xl font-extrabold">{stats.streakCounter} Days</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-500 flex items-center justify-center shrink-0">
            <Flame className="h-6 w-6 animate-pulse" />
          </div>
        </div>

        {/* Avg Score card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Average Score</span>
            <p className="text-2xl md:text-3xl font-extrabold">{stats.averageScore}%</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center shrink-0">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        {/* Resume Score card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Resume Score</span>
            <p className="text-2xl md:text-3xl font-extrabold">{stats.resumeScore || 'N/A'}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-550 flex items-center justify-center shrink-0">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        {/* Completed card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Interviews Done</span>
            <p className="text-2xl md:text-3xl font-extrabold">{stats.completedInterviews}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center shrink-0">
            <Award className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* 3. DOUBLE CHART GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Progress Line Chart (2/3 width on desktop) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-850 dark:text-slate-100">Performance Over Time</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your average evaluation scores across months</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
              <TrendingUp className="h-4 w-4" /> +15% this month
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" className="hidden dark:block" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 550 }} stroke="#64748B" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fontWeight: 550 }} stroke="#64748B" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderRadius: '16px',
                    borderColor: '#1E293B',
                    color: '#F8FAFC'
                  }}
                />
                <Area type="monotone" dataKey="averageScore" name="Avg Score %" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#scoreGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Skills Breakdown (1/3 width) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-3xl flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-850 dark:text-slate-100">Skills Radar</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Granular skill strength index</p>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsBreakdown}>
                <PolarGrid stroke="#E2E8F0" className="dark:stroke-slate-800" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fontWeight: 600, fill: '#64748B' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 9 }} />
                <Radar name="Skills" dataKey="score" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 4. DETAILS SECTION: PRACTICE ROADMAP & WEAK AREAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Practice scenarios */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-3xl space-y-5">
          <div className="space-y-1">
            <h3 className="font-bold">Recommended Study Modules</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">High-priority interview questions recommended for your target profile</p>
          </div>

          <div className="space-y-3">
            {recommendedPractice.map((prac) => (
              <div 
                key={prac.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer group"
                onClick={() => navigate('/setup')}
              >
                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{prac.title}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">{prac.category}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {prac.estimatedTime}</span>
                      <span className={`px-2 py-0.5 rounded-md ${
                        prac.difficulty === 'Senior' ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/20' : 'text-blue-600 bg-blue-50 dark:bg-blue-950/20'
                      }`}>{prac.difficulty}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Goals Checklist card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-3xl space-y-5">
          <div className="space-y-1">
            <h3 className="font-bold">Weekly Goals</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Keep up your streak targets</p>
          </div>
          <div className="space-y-3.5">
            {goals.map((g) => (
              <div 
                key={g.id}
                onClick={() => toggleGoal(g.id)}
                className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-55/30 dark:bg-slate-950/15 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className={`mt-0.5 shrink-0 h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                  g.completed 
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs' 
                    : 'border-slate-300 dark:border-slate-700 text-transparent'
                }`}>
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs sm:text-sm font-semibold truncate ${g.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {g.title}
                  </p>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-550 mt-0.5">Due: {g.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 5. DETAILS SECTION 2: WEAK SKILLS & RECENT INTERVIEWS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Interviews List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-bold">Recent Practice Evaluations</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Detailed logs of your past interview results</p>
            </div>
            <Link
              id="dashboard-all-history-link"
              to="/history"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              See All History <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {recentInterviews.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <HelpCircle className="h-10 w-10 text-slate-300 mx-auto" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No mock tests completed yet.</p>
                <Link to="/setup" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Start your first interview session now</Link>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/80 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-1">Role / Tech</th>
                    <th className="py-3 px-1">Type</th>
                    <th className="py-3 px-1">Difficulty</th>
                    <th className="py-3 px-1">Score</th>
                    <th className="py-3 px-1 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                  {recentInterviews.map((rep) => (
                    <tr key={rep.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-3 px-1 font-semibold text-slate-800 dark:text-slate-200">{rep.role}</td>
                      <td className="py-3 px-1 text-slate-500 dark:text-slate-400">{rep.type}</td>
                      <td className="py-3 px-1 font-medium">{rep.difficulty}</td>
                      <td className="py-3 px-1 font-bold">
                        <span className={`px-2.5 py-0.5 rounded-md ${
                          rep.score >= 80 
                            ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20' 
                            : rep.score >= 65 
                              ? 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20' 
                              : 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/20'
                        }`}>{rep.score}%</span>
                      </td>
                      <td className="py-3 px-1 text-right">
                        <button
                          onClick={() => navigate(`/results/${rep.id}`)}
                          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline focus:outline-hidden"
                        >
                          Review Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Weak skill breakdown alerts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-3xl space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold">Attention Areas</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Sub-metrics needing critical adjustment</p>
          </div>

          <div className="space-y-3">
            {weakSkills.map((weak) => (
              <div key={weak.name} className="p-4 rounded-2xl bg-amber-50/30 dark:bg-amber-950/10 border border-amber-200/40 dark:border-amber-800/20 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                    <h4 className="text-xs sm:text-sm font-bold text-slate-850 dark:text-slate-200">{weak.name}</h4>
                  </div>
                  <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">{weak.score}%</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
                  {weak.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </motion.div>
  );
}
