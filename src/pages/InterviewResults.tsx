/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { reportsService } from '../services/reports';
import { useToast } from '../contexts/ToastContext';
import { PerformanceReport } from '../types';
import { motion } from 'motion/react';
import { 
  Award, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Loader2, 
  HelpCircle,
  TrendingUp,
  Clock,
  BookOpen,
  ThumbsUp
} from 'lucide-react';

export default function InterviewResults() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!sessionId) return;
      try {
        const data = await reportsService.getBySessionId(sessionId);
        setReport(data);
        
        // Open the first question analysis by default
        if (data && data.questionFeedback.length > 0) {
          setOpenAccordionId(data.questionFeedback[0].questionId);
        }
      } catch (err: any) {
        showToast('Grading scorecard could not be synthesized.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [sessionId, showToast]);

  const toggleAccordion = (id: string) => {
    setOpenAccordionId(openAccordionId === id ? null : id);
  };

  if (isLoading || !report) {
    return (
      <div className="h-[calc(100vh-10rem)] flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-blue-600 dark:text-blue-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Synthesizing grading scorecard...</p>
        </div>
      </div>
    );
  }

  const { 
    overallScore, 
    technicalScore, 
    communicationScore, 
    clarityScore, 
    strengths, 
    weaknesses, 
    questionFeedback, 
    role, 
    difficulty, 
    date 
  } = report;

  const executiveFeedback = `Based on your simulation calibration, you demonstrated strong proficiency in ${role} (${difficulty}). Your answers exhibited solid technical depth (${technicalScore}%) and clear, structured communication (${communicationScore}%). Review the individual critiques below to seal all remaining competence gaps.`;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 select-none"
    >
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            id="results-back-dashboard"
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Performance Summary Report</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Evaluated role: <span className="font-bold text-slate-800 dark:text-slate-200">{role}</span> ({difficulty})</p>
        </div>

        <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-850 px-3.5 py-1.5 rounded-xl">
          Completed: {new Date(date).toLocaleDateString()}
        </span>
      </div>

      {/* 2. GRADE CARD & FEEDBACK PANEL (GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Scorecard Circular Ring (1/3 size) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl shadow-xs flex flex-col items-center text-center justify-between min-h-[22rem]">
          <div className="space-y-1">
            <h3 className="font-bold text-base">Grading Index</h3>
            <p className="text-xs text-slate-500">Gemini overall competence score</p>
          </div>

          <div className="relative h-40 w-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="68"
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r="68"
                className="stroke-blue-600 dark:stroke-blue-500 transition-all duration-1000"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 68}
                strokeDashoffset={2 * Math.PI * 68 * (1 - overallScore / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold">{overallScore}%</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Competency</span>
            </div>
          </div>

          {/* Qualitative score text */}
          <div className="space-y-1">
            <p className={`text-sm font-extrabold ${
              overallScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' : overallScore >= 65 ? 'text-amber-500' : 'text-rose-500'
            }`}>
              {overallScore >= 80 ? 'Proficient Calibration' : overallScore >= 65 ? 'Developing Calibration' : 'Urgent Correction Required'}
            </p>
            <p className="text-[10px] font-bold text-slate-400">Calibration rating scales: Junior-Lead standard</p>
          </div>
        </div>

        {/* AI Written Feedback card (2/3 size) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <h3 className="font-bold">Gemini Overall Assessment</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
              {executiveFeedback}
            </p>
          </div>

          {/* Sub factors progress meters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-5">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span>Technical Score</span>
                <span>{technicalScore}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${technicalScore}%` }} />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span>Communication Score</span>
                <span>{communicationScore}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${communicationScore}%` }} />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span>Clarity Score</span>
                <span>{clarityScore}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${clarityScore}%` }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. STRENGTHS & WEAKNESSES DOUBLE COLUMN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className="bg-emerald-50/15 dark:bg-emerald-950/5 border border-emerald-200/40 dark:border-emerald-900/35 p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
            <h3 className="font-bold text-emerald-800 dark:text-emerald-400">Aesthetic Strengths</h3>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
            {strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <ThumbsUp className="h-4.5 w-4.5 mt-0.5 text-emerald-500 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-amber-50/15 dark:bg-amber-950/5 border border-amber-200/40 dark:border-amber-900/35 p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
            <h3 className="font-bold text-amber-800 dark:text-amber-400">Critical Weak Gaps</h3>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
            {weaknesses.map((weak, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <BookOpen className="h-4.5 w-4.5 mt-0.5 text-amber-500 shrink-0" />
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* 4. ACCORDION DETAILED QUESTION BY QUESTION ANALYSIS */}
      <div className="space-y-4">
        <div className="space-y-0.5">
          <h3 className="font-bold text-lg">Granular Question-by-Question Grading</h3>
          <p className="text-xs text-slate-500">Collapse blocks to analyze Gemini feedback, gaps, and ideal response structures</p>
        </div>

        <div className="space-y-3.5">
          {questionFeedback.map((item, idx) => {
            const isOpen = openAccordionId === item.questionId;
            return (
              <div 
                key={item.questionId}
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs"
              >
                {/* Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.questionId)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-hidden cursor-pointer hover:bg-slate-50/40 dark:hover:bg-slate-850/20"
                >
                  <div className="flex items-center gap-3.5 pr-4">
                    <span className="h-6 w-6 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-850 dark:text-slate-100 line-clamp-1">{item.questionText}</h4>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      item.score >= 80 
                        ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/25' 
                        : 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/25'
                    }`}>{item.score}% Match</span>
                    {isOpen ? <ChevronUp className="h-4.5 w-4.5 text-slate-400" /> : <ChevronDown className="h-4.5 w-4.5 text-slate-400" />}
                  </div>
                </button>

                {/* Collapsible content */}
                {isOpen && (
                  <div className="p-5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-950/10 space-y-5 text-xs sm:text-sm">
                    
                    {/* User Answer block */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Answer Response</span>
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 font-mono text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {item.userAnswer || '// No answer response registered for this question.'}
                      </div>
                    </div>

                    {/* Gemini structural critiques */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gemini Architectural Critique</span>
                      <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
                        {item.feedback}
                      </p>
                    </div>

                    {/* Ideal Model Answer block */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-indigo-500 shrink-0" /> Ideal Structural Model Answer
                      </span>
                      <div className="p-4 rounded-xl bg-blue-50/20 dark:bg-indigo-950/10 border border-indigo-150/40 dark:border-indigo-900/30 text-xs text-indigo-850 dark:text-indigo-300 leading-relaxed whitespace-pre-wrap font-sans font-medium">
                        {item.idealAnswer}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </motion.div>
  );
}
