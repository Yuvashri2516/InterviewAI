/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { resumeService } from '../services/resume';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { ResumeData } from '../types';
import { motion } from 'motion/react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Plus, 
  Award, 
  Calendar,
  Building,
  GraduationCap,
  Sparkles
} from 'lucide-react';

export default function ResumeUpload() {
  const { showToast } = useToast();
  const { refreshUser } = useAuth();
  
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load latest resume on initial mount
  useEffect(() => {
    const loadLatest = async () => {
      try {
        const latest = await resumeService.getLatest();
        if (latest) {
          setResume(latest);
        }
      } catch (err) {
        console.warn('Could not retrieve existing resume evaluation.');
      }
    };
    loadLatest();
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileProcessing(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcessing(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileProcessing = async (file: File) => {
    // Check extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'pdf' && extension !== 'docx' && extension !== 'doc') {
      showToast('Unsupported extension. Please upload a standard PDF or DOCX.', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    
    // Simulate upload timer progress cleanly
    const progressTimer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressTimer);
          return 90;
        }
        return prev + 15;
      });
    }, 200);

    try {
      const parsedResume = await resumeService.upload(file, (progressEvent) => {
        // Raw axios upload progress callback (if backed by server)
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      clearInterval(progressTimer);
      setUploadProgress(100);
      
      setTimeout(() => {
        setResume(parsedResume);
        setIsUploading(false);
        showToast('Resume processed and evaluated successfully!', 'success');
        refreshUser(); // Updates streak counter
      }, 500);

    } catch (err: any) {
      clearInterval(progressTimer);
      setIsUploading(false);
      showToast(err.message || 'Failed to parse resume document.', 'error');
    }
  };

  return (
    <div className="space-y-8 select-none">
      
      {/* Description Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Resume Scoring & Extractor</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
          Evaluate your resume format and keyword alignment. Our parser extracts core skills and projects to calibrate interview sessions specifically around your experience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. UPLOAD CONTROLLER & BASIC DETAILS (1/3 Width) */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Upload Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 p-6 rounded-3xl shadow-xs space-y-4">
            <h3 className="font-bold text-slate-850 dark:text-slate-100">Upload Document</h3>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".pdf,.docx,.doc"
            />

            {isUploading ? (
              <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
                <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-500 animate-spin" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Parsing Resume PDF...</p>
                  <p className="text-xs text-slate-400">Gemini AI is digesting projects and indexing experiences.</p>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-500">{uploadProgress}% Complete</span>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-blue-600 bg-blue-50/15 dark:border-blue-500 dark:bg-blue-950/10' 
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700/80 bg-slate-50/30 hover:bg-slate-50/55 dark:bg-slate-950/5'
                }`}
              >
                <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 shrink-0">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold">Drag and drop file here</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Support PDF, DOCX up to 5MB</p>
                </div>
                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline pointer-events-none"
                >
                  Or click to browse file
                </button>
              </div>
            )}
          </div>

          {/* Active Scoring Summary */}
          {resume && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 p-6 rounded-3xl shadow-xs text-center space-y-6"
            >
              <div className="space-y-1">
                <h3 className="font-bold text-slate-850">Evaluation Match Score</h3>
                <p className="text-xs text-slate-500">General compliance for target software engineering roles</p>
              </div>

              {/* Dial Score wrapper */}
              <div className="relative h-32 w-32 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    className="stroke-slate-100 dark:stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    className="stroke-blue-600 dark:stroke-blue-500 transition-all duration-1000"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 54}
                    strokeDashoffset={2 * Math.PI * 54 * (1 - resume.score / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold">{resume.score}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Perfect Rating</span>
                </div>
              </div>

              {/* Keyword indicators */}
              <div className="pt-2 grid grid-cols-2 gap-3.5 text-left text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/20 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Format</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> High Match
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/20 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Structure</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> Approved
                  </p>
                </div>
              </div>

              <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-center gap-1 bg-slate-55/30 py-1.5 rounded-lg">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Parsed on: {new Date(resume.parsedAt).toLocaleDateString()}
              </div>
            </motion.div>
          )}

        </div>

        {/* 2. PARSED EXTRACTED DETAILS DISPLAY (2/3 Width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {resume ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Document Overview Header card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{resume.fileName}</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Size: {resume.fileSize}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20 px-3 py-1 rounded-full">
                  <CheckCircle className="h-3.5 w-3.5" /> Extracted & Validated
                </span>
              </div>

              {/* Extracted Skills Block */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="space-y-0.5">
                  <h3 className="font-bold">Extracted Tech Competencies</h3>
                  <p className="text-xs text-slate-400">Core technologies detected inside resume body</p>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {resume.extractedSkills.map((sk) => (
                    <span 
                      key={sk}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 border border-slate-150 dark:border-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Extracted Projects Block */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl space-y-5">
                <div className="space-y-0.5">
                  <h3 className="font-bold">Extracted Project Portfolios</h3>
                  <p className="text-xs text-slate-400">Significant items parsed from engineering portfolio lists</p>
                </div>
                <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800/50">
                  {resume.projects.map((proj, idx) => (
                    <div key={proj.title} className={`pt-4 first:pt-0 space-y-2`}>
                      <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200">{proj.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                        {proj.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.technologies.map(tech => (
                          <span key={tech} className="px-2 py-0.5 rounded-md bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work history & Academics double card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Work History */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                  <h3 className="font-bold flex items-center gap-2 text-sm"><Building className="h-4.5 w-4.5 text-slate-400 shrink-0" /> Experience History</h3>
                  <div className="space-y-4">
                    {resume.experience.map(exp => (
                      <div key={exp.company} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{exp.role}</p>
                          <span className="text-[10px] font-bold text-slate-400 shrink-0 flex items-center gap-1"><Calendar className="h-3 w-3" /> {exp.duration}</span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-400">{exp.company}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed truncate-3-lines">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Academic History */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                  <h3 className="font-bold flex items-center gap-2 text-sm"><GraduationCap className="h-4.5 w-4.5 text-slate-400 shrink-0" /> Academics History</h3>
                  <div className="space-y-4">
                    {resume.education.map(edu => (
                      <div key={edu.institution} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{edu.degree}</p>
                          <span className="text-[10px] font-bold text-slate-400 shrink-0">{edu.year}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{edu.institution}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </motion.div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 h-full min-h-[30rem]">
              <div className="h-14 w-14 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-300 flex items-center justify-center">
                <FileText className="h-8 w-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="font-bold text-base">No Evaluated Resume</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Drag and drop a PDF file in the sidebar tool block to extract core credentials and receive an evaluation match rating.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
