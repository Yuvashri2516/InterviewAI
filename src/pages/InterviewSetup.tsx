/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewService } from '../services/interview';
import { useToast } from '../contexts/ToastContext';
import { InterviewRole, InterviewDifficulty, InterviewType, InterviewConfig } from '../types';
import { motion } from 'motion/react';
import { 
  Sliders, 
  User, 
  Shield, 
  Settings2, 
  FileQuestion, 
  Clock, 
  Play, 
  Loader2, 
  BrainCircuit, 
  Sparkles,
  Award,
  Terminal,
  Zap,
  Network
} from 'lucide-react';

export default function InterviewSetup() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState<InterviewRole>('Fullstack Engineer');
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>('Mid');
  const [type, setType] = useState<InterviewType>('Mixed');
  const [numQuestions, setNumQuestions] = useState(3);
  const [timeLimit, setTimeLimit] = useState(20);
  const [isInitializing, setIsInitializing] = useState(false);

  const roles: InterviewRole[] = [
    'Frontend Engineer',
    'Backend Engineer',
    'Fullstack Engineer',
    'Data Scientist',
    'Product Manager',
    'Mobile Developer',
    'DevOps Engineer',
    'System Architect'
  ];

  const handleStartInterview = async () => {
    setIsInitializing(true);
    const config: InterviewConfig = {
      role,
      difficulty,
      type,
      numQuestions,
      timeLimit
    };

    try {
      const session = await interviewService.setup(config);
      showToast('Interview customized and generated successfully!', 'success');
      
      // Delay navigation slightly to let the animation feel high-end
      setTimeout(() => {
        navigate(`/interview/${session.id}`);
      }, 1500);

    } catch (err: any) {
      setIsInitializing(false);
      showToast(err.message || 'Failed to generate questions. Verify setup.', 'error');
    }
  };

  if (isInitializing) {
    return (
      <div className="h-[calc(100vh-10rem)] flex items-center justify-center">
        <div className="text-center max-w-sm space-y-6 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <div className="h-20 w-20 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-800 dark:border-t-indigo-500" />
            <BrainCircuit className="absolute h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg">Engineering Customized Questions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Gemini AI is parsing your profile data, aligning with <span className="text-indigo-600 dark:text-indigo-400">{role}</span> specifications, and generating precise technical bottlenecks for evaluation.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            <Sparkles className="h-3 w-3" /> Initializing Sandbox
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 select-none"
    >
      
      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Interview Platform Customization</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Configure parameters below to generate custom structured question pools.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core parameters input block (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xs">
            
            {/* Target Role Dropdown */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <User className="h-4 w-4" /> Target Specialization
              </label>
              <div className="relative">
                <select
                  id="setup-role-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value as InterviewRole)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-semibold focus:outline-hidden focus:border-blue-500"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Difficulty */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Shield className="h-4 w-4" /> Seniority Standard
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['Junior', 'Mid', 'Senior', 'Lead'] as InterviewDifficulty[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center focus:outline-hidden cursor-pointer ${
                      difficulty === level
                        ? 'border-blue-600 bg-blue-50/20 text-blue-600 dark:border-blue-500 dark:bg-blue-950/20 dark:text-blue-400 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 hover:bg-slate-50/50'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Discipline Type */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Sliders className="h-4 w-4" /> Focus Discipline
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Tech */}
                <button
                  type="button"
                  onClick={() => setType('Technical')}
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 text-left transition-all focus:outline-hidden cursor-pointer ${
                    type === 'Technical'
                      ? 'border-blue-600 bg-blue-50/20 dark:border-blue-500 dark:bg-blue-950/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 hover:bg-slate-50/50'
                  }`}
                >
                  <Terminal className={`h-5 w-5 mt-0.5 shrink-0 ${type === 'Technical' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                  <div>
                    <h4 className={`text-xs font-bold ${type === 'Technical' ? 'text-blue-600 dark:text-blue-400' : ''}`}>Deep Technical Core</h4>
                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">Focuses on programming syntax, memory management, and code runtimes.</p>
                  </div>
                </button>

                {/* Sys design */}
                <button
                  type="button"
                  onClick={() => setType('System Design')}
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 text-left transition-all focus:outline-hidden cursor-pointer ${
                    type === 'System Design'
                      ? 'border-blue-600 bg-blue-50/20 dark:border-blue-500 dark:bg-blue-950/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 hover:bg-slate-50/50'
                  }`}
                >
                  <Network className={`h-5 w-5 mt-0.5 shrink-0 ${type === 'System Design' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                  <div>
                    <h4 className={`text-xs font-bold ${type === 'System Design' ? 'text-blue-600 dark:text-blue-400' : ''}`}>Distributed Systems</h4>
                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">Focuses on architectural scale, partitioning, cache backplanes, and bottlenecks.</p>
                  </div>
                </button>

                {/* Behavioral */}
                <button
                  type="button"
                  onClick={() => setType('Behavioral')}
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 text-left transition-all focus:outline-hidden cursor-pointer ${
                    type === 'Behavioral'
                      ? 'border-blue-600 bg-blue-50/20 dark:border-blue-500 dark:bg-blue-950/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 hover:bg-slate-50/50'
                  }`}
                >
                  <Award className={`h-5 w-5 mt-0.5 shrink-0 ${type === 'Behavioral' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                  <div>
                    <h4 className={`text-xs font-bold ${type === 'Behavioral' ? 'text-blue-600 dark:text-blue-400' : ''}`}>Behavioral & Culture</h4>
                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">Focuses on alignment, team conflicts, scaling organizations, and ownership.</p>
                  </div>
                </button>

                {/* Mixed */}
                <button
                  type="button"
                  onClick={() => setType('Mixed')}
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 text-left transition-all focus:outline-hidden cursor-pointer ${
                    type === 'Mixed'
                      ? 'border-blue-600 bg-blue-50/20 dark:border-blue-500 dark:bg-blue-950/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 hover:bg-slate-50/50'
                  }`}
                >
                  <Zap className={`h-5 w-5 mt-0.5 shrink-0 ${type === 'Mixed' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                  <div>
                    <h4 className={`text-xs font-bold ${type === 'Mixed' ? 'text-blue-600 dark:text-blue-400' : ''}`}>Mixed Competence</h4>
                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">Balanced coverage across system engineering, behavioral, and technical codes.</p>
                  </div>
                </button>

              </div>
            </div>

            {/* Slider configuration details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              
              {/* Question Count Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-2"><FileQuestion className="h-4 w-4" /> Load Size</span>
                  <span className="text-blue-600 dark:text-blue-400">{numQuestions} Questions</span>
                </div>
                <input 
                  type="range"
                  min="3"
                  max="10"
                  step="1"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-hidden"
                />
              </div>

              {/* Time slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> Timer Budget</span>
                  <span className="text-blue-600 dark:text-blue-400">{timeLimit} Minutes</span>
                </div>
                <input 
                  type="range"
                  min="10"
                  max="45"
                  step="5"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-hidden"
                />
              </div>

            </div>

          </div>
        </div>

        {/* Informational Panel Card (1/3 width) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl shadow-xs space-y-6">
            <h3 className="font-bold flex items-center gap-2 text-sm"><Settings2 className="h-4.5 w-4.5 text-slate-400" /> Platform Expectation</h3>
            
            <div className="space-y-4 text-xs font-medium">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/40">
                <h4 className="font-bold mb-1">Time management</h4>
                <p className="text-slate-500 leading-relaxed font-semibold">Allocate roughly {Math.round(timeLimit / numQuestions)} minutes per response. Timer is global.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/40">
                <h4 className="font-bold mb-1">Detailed Answers</h4>
                <p className="text-slate-500 leading-relaxed font-semibold">Gemini scores based on depth. Mention design patterns, tradeoffs, and code layouts.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/40">
                <h4 className="font-bold mb-1">Auto saving state</h4>
                <p className="text-slate-500 leading-relaxed font-semibold">Responses are automatically saved locally during text input changes.</p>
              </div>
            </div>

            <button
              id="setup-start-session-btn"
              onClick={handleStartInterview}
              className="w-full inline-flex items-center justify-center gap-2 font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-2xl py-3.5 shadow-lg shadow-blue-500/15 transition-all focus:outline-hidden cursor-pointer"
            >
              Start Practice Session <Play className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

    </motion.div>
  );
}
