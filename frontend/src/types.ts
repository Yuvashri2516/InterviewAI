/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  targetRole?: string;
  experienceLevel?: string;
  streakCount: number;
  lastActiveDate?: string;
  createdAt: string;
}

export interface ResumeData {
  id: string;
  fileName: string;
  fileSize: string;
  score: number;
  extractedSkills: string[];
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  parsedAt: string;
}

export type InterviewRole = 
  | 'Frontend Engineer' 
  | 'Backend Engineer' 
  | 'Fullstack Engineer' 
  | 'Data Scientist' 
  | 'Product Manager' 
  | 'Mobile Developer' 
  | 'DevOps Engineer' 
  | 'System Architect';

export type InterviewDifficulty = 'Junior' | 'Mid' | 'Senior' | 'Lead';

export type InterviewType = 'Technical' | 'Behavioral' | 'System Design' | 'Mixed';

export interface InterviewConfig {
  role: InterviewRole;
  difficulty: InterviewDifficulty;
  type: InterviewType;
  numQuestions: number;
  timeLimit: number; // in minutes
}

export interface InterviewQuestion {
  id: string;
  text: string;
  category: string;
  idealAnswer: string;
}

export interface AnswerEvaluation {
  score: number; // 0-100
  feedback: string;
  idealAnswer: string;
  strengths: string[];
  weaknesses: string[];
  technicalScore: number;
  communicationScore: number;
  clarityScore: number;
}

export interface InterviewAnswer {
  questionId: string;
  userAnswer: string;
  evaluation?: AnswerEvaluation;
  timeSpent: number; // in seconds
  savedAt: string;
}

export interface InterviewSession {
  id: string;
  config: InterviewConfig;
  questions: InterviewQuestion[];
  answers: Record<string, InterviewAnswer>;
  status: 'setup' | 'active' | 'completed';
  startedAt: string;
  completedAt?: string;
  currentQuestionIndex: number;
}

export interface QuestionFeedbackItem {
  questionId: string;
  questionText: string;
  userAnswer: string;
  idealAnswer: string;
  score: number;
  technicalScore: number;
  communicationScore: number;
  clarityScore: number;
  feedback: string;
}

export interface PerformanceReport {
  id: string;
  sessionId: string;
  role: string;
  difficulty: string;
  type: string;
  date: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  clarityScore: number;
  strengths: string[];
  weaknesses: string[];
  questionFeedback: QuestionFeedbackItem[];
  recommendedTopics: Array<{
    name: string;
    reason: string;
    resources: string[];
  }>;
}

export interface SkillsBreakdown {
  skill: string;
  score: number;
}

export interface MonthlyProgress {
  month: string;
  interviewsCount: number;
  averageScore: number;
}

export interface DashboardData {
  stats: {
    averageScore: number;
    completedInterviews: number;
    resumeScore: number;
    streakCounter: number;
  };
  skillsBreakdown: SkillsBreakdown[];
  monthlyProgress: MonthlyProgress[];
  recentInterviews: Array<{
    id: string;
    role: string;
    type: string;
    difficulty: string;
    score: number;
    date: string;
  }>;
  weakSkills: Array<{
    name: string;
    score: number;
    recommendation: string;
  }>;
  recommendedPractice: Array<{
    id: string;
    title: string;
    category: string;
    difficulty: string;
    estimatedTime: string;
  }>;
  upcomingGoals: Array<{
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
  }>;
}
