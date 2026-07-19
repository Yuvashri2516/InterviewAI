/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { reportsService } from '../services/reports';
import { useToast } from '../contexts/ToastContext';
import { PerformanceReport } from '../types';
import { motion } from 'motion/react';
import { 
  History, 
  Search, 
  SlidersHorizontal, 
  ArrowRight, 
  HelpCircle, 
  Loader2, 
  FileText, 
  Calendar,
  Award,
  Video
} from 'lucide-react';

export default function InterviewHistory() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<PerformanceReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await reportsService.getAll();
        setReports(data);
      } catch (err: any) {
        showToast('History logs could not be retrieved.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [showToast]);

  // Derived filter calculations
  const filteredReports = reports.filter((rep) => {
    const matchesSearch = rep.role.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          rep.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || rep.role === roleFilter;
    const matchesDifficulty = difficultyFilter === 'All' || rep.difficulty === difficultyFilter;
    
    return matchesSearch && matchesRole && matchesDifficulty;
  });

  const uniqueRoles = Array.from(new Set(reports.map(r => r.role)));

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-10rem)] flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-blue-600 dark:text-blue-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading historical registers...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 select-none"
    >
      
      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Interview Session History</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Review your historic progress and completed Gemini scorecard metrics.</p>
      </div>

      {/* Analytics Sub-Card aggregates */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sessions Finished</p>
          <p className="text-2xl font-extrabold mt-1">{reports.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Evaluation</p>
          <p className="text-2xl font-extrabold mt-1">
            {reports.length > 0 
              ? `${Math.round(reports.reduce((sum, r) => sum + r.overallScore, 0) / reports.length)}%`
              : 'N/A'
            }
          </p>
        </div>
        <div className="col-span-2 md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Latest Calibration</p>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate mt-1">
            {reports.length > 0 ? reports[0].role : 'None'}
          </p>
        </div>
      </div>

      {/* FILTER CONTROLLER BOARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-4.5 rounded-2xl flex flex-col md:flex-row items-center gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
          <input
            id="history-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:outline-hidden"
            placeholder="Search key roles or type focus..."
          />
        </div>

        {/* Filters dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          
          <div className="flex-1 md:flex-none">
            <select
              id="history-role-filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-hidden"
            >
              <option value="All">All Roles</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 md:flex-none">
            <select
              id="history-diff-filter"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-hidden"
            >
              <option value="All">All Seniorities</option>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead</option>
            </select>
          </div>

        </div>

      </div>

      {/* RESULTS LIST TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        {filteredReports.length === 0 ? (
          <div className="text-center py-20 space-y-3.5">
            <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-950 text-slate-300 flex items-center justify-center mx-auto">
              <History className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold">No History Logs Detected</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Try clearing search parameters, or launch a custom sandbox interview right now.</p>
            </div>
            <Link
              to="/setup"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl px-4 py-2.5 shadow-sm"
            >
              Launch Interview <Video className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-4.5 px-6">Specialized Role</th>
                  <th className="py-4.5 px-3">Discipline Focus</th>
                  <th className="py-4.5 px-3">Seniority Tag</th>
                  <th className="py-4.5 px-3">Evaluation Date</th>
                  <th className="py-4.5 px-3">Rating Score</th>
                  <th className="py-4.5 px-6 text-right">Summary Logs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 font-medium">
                {filteredReports.map((item) => (
                  <tr 
                    key={item.id}
                    onClick={() => navigate(`/results/${item.id}`)}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/25 transition-all cursor-pointer group"
                  >
                    {/* Role name */}
                    <td className="py-4 px-6 font-bold text-slate-850 dark:text-slate-150 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.role}
                    </td>
                    {/* Discipline Type */}
                    <td className="py-4 px-3 text-slate-500 dark:text-slate-400">
                      {item.type}
                    </td>
                    {/* Difficulty Tag */}
                    <td className="py-4 px-3">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                        item.difficulty === 'Senior' ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/20' : 'text-blue-600 bg-blue-50 dark:bg-blue-950/20'
                      }`}>
                        {item.difficulty}
                      </span>
                    </td>
                    {/* Date */}
                    <td className="py-4 px-3 text-slate-500 dark:text-slate-400 text-xs shrink-0 font-semibold flex items-center gap-1.5 mt-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" /> {new Date(item.date).toLocaleDateString()}
                    </td>
                    {/* score percent */}
                    <td className="py-4 px-3 font-bold text-slate-850 dark:text-slate-150">
                      <span className={`px-2.5 py-1 rounded-lg ${
                        item.overallScore >= 80 
                          ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/25' 
                          : item.overallScore >= 65 
                            ? 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/25' 
                            : 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/25'
                      }`}>{item.overallScore}% Match</span>
                    </td>
                    {/* CTA Details */}
                    <td className="py-4 px-6 text-right font-bold text-blue-600 dark:text-blue-400 group-hover:underline text-xs">
                      Review Scorecard <ArrowRight className="inline-block h-3.5 w-3.5 group-hover:translate-x-1 transition-all" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </motion.div>
  );
}
