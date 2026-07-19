/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewService } from '../services/interview';
import { useToast } from '../contexts/ToastContext';
import { InterviewSession, InterviewQuestion } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  CheckCircle, 
  AlertTriangle, 
  Loader2, 
  Flame, 
  BrainCircuit,
  CornerDownLeft,
  X,
  FileQuestion
} from 'lucide-react';

export default function InterviewScreen() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState('');
  
  // Timers
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [timeSpentOnQuestion, setTimeSpentOnQuestion] = useState(0);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const autoSaveTimerRef = useRef<any>(null);
  const questionStartRef = useRef<number>(Date.now());

  // Load session from DB
  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;
      try {
        const activeSession = await interviewService.getSession(sessionId);
        setSession(activeSession);
        
        // Setup initial timers
        setTimeLeft(activeSession.config.timeLimit * 60);
        setCurrentIndex(activeSession.currentQuestionIndex || 0);

        // Try load existing draft if any
        const currentQ = activeSession.questions[activeSession.currentQuestionIndex || 0];
        if (currentQ && activeSession.answers[currentQ.id]) {
          setAnswerText(activeSession.answers[currentQ.id].userAnswer || '');
        }
      } catch (err: any) {
        showToast('Active interview loop could not be synchronized.', 'error');
        navigate('/setup');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, [sessionId, navigate, showToast]);

  // Global Countdown Timer
  useEffect(() => {
    if (isLoading || !session || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExceeded();
          return 0;
        }
        return prev - 1;
      });
      setTimeSpentOnQuestion(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, session, timeLeft]);

  const handleTimeExceeded = () => {
    showToast('Timer limits exceeded! Finalizing session reports.', 'warning');
    handleFinalizeInterview();
  };

  // Auto-Save Answer Draft Trigger with Debouncing
  const handleAnswerChange = (text: string) => {
    setAnswerText(text);

    // Clear previous timer
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    
    setIsSaving(true);
    autoSaveTimerRef.current = setTimeout(async () => {
      if (!session || !sessionId) return;
      const currentQuestion = session.questions[currentIndex];
      if (!currentQuestion) return;

      try {
        await interviewService.submitAnswer(
          sessionId,
          currentQuestion.id,
          text,
          timeSpentOnQuestion
        );
        setIsSaving(false);
      } catch (err) {
        setIsSaving(false);
        console.warn('Draft auto-save throttled.');
      }
    }, 1500);
  };

  // Switch index navigation
  const navigateToQuestion = (index: number) => {
    if (!session) return;
    if (index < 0 || index >= session.questions.length) return;

    // Save current active draft immediately
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    const currentQ = session.questions[currentIndex];
    
    // Set up draft text for next question
    const targetQ = session.questions[index];
    setCurrentIndex(index);
    setAnswerText(session.answers[targetQ.id]?.userAnswer || '');
    
    // Reset specific question timer
    setTimeSpentOnQuestion(0);
  };

  const handleNextQuestionSubmit = async () => {
    if (!session || !sessionId) return;
    const currentQuestion = session.questions[currentIndex];
    
    try {
      setIsSaving(true);
      await interviewService.submitAnswer(
        sessionId,
        currentQuestion.id,
        answerText,
        timeSpentOnQuestion
      );
      setIsSaving(false);

      if (currentIndex === session.questions.length - 1) {
        // Open submission dialog
        setIsSubmitModalOpen(true);
      } else {
        navigateToQuestion(currentIndex + 1);
      }
    } catch (err: any) {
      setIsSaving(false);
      showToast('Could not register question answer.', 'error');
    }
  };

  const handleFinalizeInterview = async () => {
    if (!sessionId) return;
    setIsSubmitModalOpen(false);
    setIsFinishing(true);

    try {
      await interviewService.finish(sessionId);
      showToast('Interview reports finalized! Analyzing scores.', 'success');
      navigate(`/results/${sessionId}`);
    } catch (err: any) {
      setIsFinishing(false);
      showToast('Error finalizing platform summaries.', 'error');
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (isLoading || !session) {
    return (
      <div className="h-[calc(100vh-10rem)] flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-blue-600 dark:text-blue-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading active session container...</p>
        </div>
      </div>
    );
  }

  if (isFinishing) {
    return (
      <div className="h-[calc(100vh-10rem)] flex items-center justify-center">
        <div className="text-center max-w-sm space-y-6 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <div className="h-20 w-20 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-500" />
            <BrainCircuit className="absolute h-8 w-8 text-blue-600 dark:text-blue-400 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg">Evaluating Performance Indices</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Gemini is scrutinizing your answers for structural correctness, clarity, communication flow, and technical accuracy.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/20 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            <Loader2 className="h-3 w-3 animate-spin" /> Computing Scorecards
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = session.questions[currentIndex];
  const wordCount = answerText ? answerText.trim().split(/\s+/).filter(Boolean).length : 0;
  const totalQuestions = session.questions.length;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto space-y-6 select-none"
    >
      
      {/* 1. TOP HEADER STATUS AND TIMER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
        <div className="space-y-1 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/20 px-2.5 py-1 rounded-md uppercase tracking-wider">
              {session.config.role}
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:text-slate-400 dark:bg-slate-800 px-2.5 py-1 rounded-md uppercase">
              {session.config.type}
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500">Practice ID: {session.id}</p>
        </div>

        {/* Global Timer countdown */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/40 px-4.5 py-3 rounded-xl border border-slate-250/20">
          <Clock className={`h-5 w-5 shrink-0 ${timeLeft < 120 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
          <div className="text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time Remaining</p>
            <p className={`text-sm sm:text-base font-extrabold font-mono ${timeLeft < 120 ? 'text-red-600 dark:text-red-400' : ''}`}>
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      </div>

      {/* 2. PROGRESS ROADMAP INDICATOR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
          <span>Question Progress</span>
          <span>{currentIndex + 1} of {totalQuestions} completed</span>
        </div>
        {/* Progress bar line */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
        {/* Step circles */}
        <div className="flex items-center justify-between pt-1">
          {session.questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => navigateToQuestion(idx)}
              className={`h-7 w-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all focus:outline-hidden cursor-pointer ${
                idx === currentIndex
                  ? 'bg-blue-600 text-white shadow-xs scale-105'
                  : session.answers[q.id]?.userAnswer
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900'
                    : 'bg-slate-100 text-slate-500 border border-transparent dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* 3. ACTIVE QUESTION BLOCK & ANSWER SHEET (SPLIT OR ROW) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Active Question Panel (2/5 size) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <FileQuestion className="h-5.5 w-5.5" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Question prompt</span>
              <h2 className="text-base sm:text-lg font-bold leading-relaxed text-slate-850 dark:text-slate-100">
                {currentQuestion.text}
              </h2>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-200/30 text-xs text-slate-500 space-y-2 leading-relaxed">
              <span className="font-bold text-slate-700 dark:text-slate-300">Practice Directives:</span>
              <p>1. Formulate comprehensive responses addressing structural bottlenecks, trade-offs, and optimization benchmarks.</p>
              <p>2. Aim for at least <span className="font-bold text-slate-700 dark:text-slate-300">100+ words</span> to ensure Gemini can generate maximum telemetry feedback.</p>
            </div>
          </div>
        </div>

        {/* Large Answer Sheet Area (3/5 size) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Response Console</span>
            
            {/* Auto-save status indicator */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
                  <span>Saving draft...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Draft saved</span>
                </>
              )}
            </div>
          </div>

          <div className="relative">
            <textarea
              id="active-answer-textarea"
              value={answerText}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="w-full h-80 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 rounded-2xl p-4 text-xs sm:text-sm focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono leading-relaxed"
              placeholder="// Write your technical explanation here. Be elaborate. Use STAR methodology if behavior question..."
            />
          </div>

          {/* Counters and Navigation footer inside card */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="flex items-center gap-3 font-semibold text-slate-400">
              <span>Words: <span className="font-bold text-slate-700 dark:text-slate-300">{wordCount}</span></span>
              <span>Characters: <span className="font-bold text-slate-700 dark:text-slate-300">{answerText?.length || 0}</span></span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => navigateToQuestion(currentIndex - 1)}
                className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-500 disabled:opacity-30 focus:outline-hidden"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>
              <button
                id="answer-submit-continue-btn"
                type="button"
                onClick={handleNextQuestionSubmit}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl px-4 py-2.5 shadow-md focus:outline-hidden"
              >
                {currentIndex === totalQuestions - 1 ? 'Finish & Review' : 'Save & Continue'} <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 4. DIALOG MODAL CONFIRMATION ON SUBMISSION */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSubmitModalOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />
            {/* Modal card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 m-auto z-50 h-fit max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/40 pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <h3 className="font-bold text-slate-850 dark:text-white">Confirm Mock Submission</h3>
                </div>
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="space-y-2 text-sm text-slate-500 leading-relaxed font-semibold">
                <p>You have completed draft responses for all generated questions.</p>
                <p className="text-xs">Once submitted, Gemini will parse each answer and compute your technical, clarity, and communication score reports.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                  Return to Edit
                </button>
                <button
                  id="modal-confirm-submit-btn"
                  type="button"
                  onClick={handleFinalizeInterview}
                  className="px-4.5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white shadow-md shadow-blue-500/10"
                >
                  Confirm & Finalize
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
