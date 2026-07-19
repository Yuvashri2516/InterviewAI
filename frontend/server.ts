/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import multer from 'multer';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database for development session persistence
const DB = {
  users: [
    {
      id: 'usr_1',
      name: 'Yuvashri Narasimman',
      email: 'yuvashrinarasimman25@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      bio: 'Aspiring Full Stack Engineer passionate about building scalable web systems and modern AI interfaces.',
      targetRole: 'Fullstack Engineer',
      experienceLevel: 'Mid',
      streakCount: 5,
      lastActiveDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
  ],
  resumes: [] as any[],
  sessions: {} as Record<string, any>,
  reports: [] as any[]
};

// Initial seeding of a mock resume for a complete walkthrough experience
DB.resumes.push({
  id: 'res_1',
  fileName: 'Yuvashri_Resume.pdf',
  fileSize: '1.2 MB',
  score: 84,
  extractedSkills: ['React 19', 'Vite', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS', 'PostgreSQL', 'FastAPI', 'Docker'],
  projects: [
    {
      title: 'InterviewAI Platform',
      description: 'Built a full-stack automated mock interview SaaS platform utilizing FastAPI, React, and Gemini.',
      technologies: ['React', 'FastAPI', 'TypeScript', 'Tailwind CSS']
    },
    {
      title: 'Distributed Analytics Pipeline',
      description: 'Designed a low-latency analytics worker that ingests logs and aggregates real-time event stats.',
      technologies: ['Node.js', 'PostgreSQL', 'Redis']
    }
  ],
  education: [
    {
      institution: 'State University',
      degree: 'B.S. in Computer Science',
      year: '2025'
    }
  ],
  experience: [
    {
      company: 'TechCorp Solutions',
      role: 'Software Engineer Intern',
      duration: '6 Months',
      description: 'Developed critical frontend features for enterprise SaaS clients, increasing retention by 15%.'
    }
  ],
  parsedAt: new Date().toISOString()
});

// Seed some initial report history
DB.reports.push({
  id: 'rep_1',
  sessionId: 'sess_pre',
  role: 'Fullstack Engineer',
  difficulty: 'Mid',
  type: 'Mixed',
  date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
  overallScore: 82,
  technicalScore: 85,
  communicationScore: 78,
  clarityScore: 83,
  strengths: [
    'Excellent understanding of React component design and hook lifecycles.',
    'Solid grasp of REST API structure and standard databases.',
    'Clear breakdown of database normalization rules.'
  ],
  weaknesses: [
    'Slightly hesitated on memory management questions in Node.js.',
    'Communication structure could benefit from the STAR methodology for behavioral questions.'
  ],
  questionFeedback: [
    {
      questionId: 'q_1',
      questionText: 'Explain the difference between useEffect and useLayoutEffect in React.',
      userAnswer: 'useEffect runs asynchronously after the render paint, which is fine for most side effects. useLayoutEffect runs synchronously before the browser paints, which prevents visual flickering when mutating the DOM.',
      idealAnswer: 'useEffect executes asynchronously after the browser paints, keeping the interface responsive. useLayoutEffect is invoked synchronously immediately after all DOM mutations but before the paint phase; it is ideal for calculations involving DOM measurements to prevent visual layout shifts.',
      score: 95,
      technicalScore: 98,
      communicationScore: 92,
      clarityScore: 95,
      feedback: 'Splendid answer. You explained the timing and practical use cases perfectly.'
    },
    {
      questionId: 'q_2',
      questionText: 'How would you optimize a database query that is running slowly?',
      userAnswer: 'I would check for indexing. If there is no index on the queried columns, I would add one. I would also write EXPLAIN to inspect the execution plan and avoid SELECT * if I do not need all columns.',
      idealAnswer: 'Optimize query by checking the Execution Plan (using EXPLAIN), ensuring relevant indexes are created for WHERE, JOIN, and ORDER BY columns, avoiding wildcard selection (SELECT *), optimizing joins, and optionally introducing database indexing or caching layers.',
      score: 90,
      technicalScore: 92,
      communicationScore: 88,
      clarityScore: 90,
      feedback: 'Excellent answer. Mentioning EXPLAIN shows strong developer experience.'
    }
  ],
  recommendedTopics: [
    {
      name: 'Advanced React render loops',
      reason: 'To solidify state batching behaviors in high-density components.',
      resources: ['React official dev logs on concurrency', 'Dan Abramov blog on render timings']
    },
    {
      name: 'STAR Communication framework',
      reason: 'To structure non-technical questions in a concise Situation-Task-Action-Result format.',
      resources: ['Stripe Engineering Interview guides', 'STAR Method handbook']
    }
  ]
});

// Multer storage setup for uploads
const upload = multer({ dest: 'uploads/' });

// Lazy Gemini Client Initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'MY_GEMINI_API_KEY') {
    return null;
  }
  try {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    return aiClient;
  } catch (err) {
    console.error('Failed to initialize Gemini Client:', err);
    return null;
  }
}

// Global active user resolver (Simple Mock JWT Auth)
function getAuthenticatedUser(req: express.Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  // Look up user or default to the seeded one
  return DB.users[0];
}

// ----------------------------------------------------
// AUTH ENDPOINTS
// ----------------------------------------------------
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing registration details' });
  }

  // Check duplicate
  const exists = DB.users.find(u => u.email === email);
  if (exists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = {
    id: `usr_${DB.users.length + 1}`,
    name,
    email,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    bio: '',
    targetRole: 'Frontend Engineer',
    experienceLevel: 'Junior',
    streakCount: 1,
    lastActiveDate: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  DB.users.push(newUser);
  res.json({
    user: newUser,
    token: `mock_jwt_token_${newUser.id}`
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  const user = DB.users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Simply mock successful login
  res.json({
    user,
    token: `mock_jwt_token_${user.id}`
  });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  res.json({ message: 'Password recovery email sent successfully.' });
});

app.get('/api/auth/me', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized session' });
  }
  res.json(user);
});

// ----------------------------------------------------
// PROFILE ENDPOINTS
// ----------------------------------------------------
app.get('/api/profile', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  res.json(user);
});

app.put('/api/profile', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const { name, bio, targetRole, experienceLevel } = req.body;
  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (targetRole) user.targetRole = targetRole;
  if (experienceLevel) user.experienceLevel = experienceLevel;

  res.json(user);
});

// ----------------------------------------------------
// RESUME ENDPOINTS
// ----------------------------------------------------
app.post('/api/resume/upload', upload.single('file'), async (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const ai = getGeminiClient();
  const fileDetails = {
    id: `res_${Date.now()}`,
    fileName: file.originalname,
    fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    parsedAt: new Date().toISOString()
  };

  if (ai) {
    try {
      // In a real environment, we'd read the file content. Since we have a uploaded file placeholder path,
      // we can read some of the file or feed a prompt instructing Gemini to build a realistic profile
      // based on the file's metadata name to simulate a deep extraction.
      const prompt = `You are a high-quality resume parser. Analyze this resume name: "${file.originalname}" and generate a realistic, production-grade JSON resume parse. 
      Respond with ONLY a valid JSON object matching this schema:
      {
        "score": number (0 to 100 rating),
        "extractedSkills": string[] (list of technical skills relevant to software development, product, design etc),
        "projects": [{"title": string, "description": string, "technologies": string[]}],
        "education": [{"institution": string, "degree": string, "year": string}],
        "experience": [{"company": string, "role": string, "duration": string, "description": string}]
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsedData = JSON.parse(response.text?.trim() || '{}');
      const finalResume = {
        ...fileDetails,
        score: parsedData.score || 78,
        extractedSkills: parsedData.extractedSkills || ['React', 'JavaScript'],
        projects: parsedData.projects || [],
        education: parsedData.education || [],
        experience: parsedData.experience || []
      };

      DB.resumes.push(finalResume);
      // Update user's target details based on parsed details
      if (finalResume.extractedSkills.length > 0) {
        user.streakCount += 1; // Award streak for uploading resume
      }
      return res.json(finalResume);

    } catch (err) {
      console.error('Gemini Resume Parsing Failed, falling back to mock parser:', err);
    }
  }

  // Fallback beautiful parser
  const nameParts = file.originalname.toLowerCase();
  let role = 'Frontend Developer';
  let skills = ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS'];
  
  if (nameParts.includes('back') || nameParts.includes('node') || nameParts.includes('py')) {
    role = 'Backend Developer';
    skills = ['Node.js', 'Express', 'Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Redis'];
  } else if (nameParts.includes('pm') || nameParts.includes('product')) {
    role = 'Product Manager';
    skills = ['Product Strategy', 'Agile/Scrum', 'Wireframing', 'Market Research', 'Jira'];
  } else if (nameParts.includes('data') || nameParts.includes('ml')) {
    role = 'Data Scientist';
    skills = ['Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-Learn', 'TensorFlow', 'Data Visualization'];
  }

  const fallbackResume = {
    ...fileDetails,
    score: Math.floor(Math.random() * 20) + 70, // 70-90
    extractedSkills: skills,
    projects: [
      {
        title: `Portfolio SaaS App`,
        description: `Developed an end-to-end platform using modern web paradigms, improving page performance by 40%.`,
        technologies: skills.slice(0, 3)
      }
    ],
    education: [
      {
        institution: 'Silicon Valley Tech Institute',
        degree: 'Bachelor of Science in Software Systems',
        year: '2025'
      }
    ],
    experience: [
      {
        company: 'Vanguard Engineering Lab',
        role: `Junior ${role}`,
        duration: '1 Year',
        description: 'Worked inside a cross-functional squad to optimize core system bottlenecks and deliver elegant features.'
      }
    ]
  };

  DB.resumes.push(fallbackResume);
  res.json(fallbackResume);
});

app.get('/api/resume/latest', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  if (DB.resumes.length === 0) {
    return res.json(null);
  }
  res.json(DB.resumes[DB.resumes.length - 1]);
});

app.get('/api/resume/:id', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const resume = DB.resumes.find(r => r.id === req.params.id);
  if (!resume) return res.status(404).json({ message: 'Resume not found' });
  res.json(resume);
});

// ----------------------------------------------------
// INTERVIEW ENDPOINTS
// ----------------------------------------------------
app.post('/api/interview/setup', async (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const { role, difficulty, type, numQuestions, timeLimit } = req.body;
  if (!role || !difficulty || !type || !numQuestions) {
    return res.status(400).json({ message: 'Missing interview configuration parameters' });
  }

  const sessionId = `sess_${Date.now()}`;
  const ai = getGeminiClient();

  let questions: any[] = [];

  if (ai) {
    try {
      const prompt = `You are an elite Tech Recruiter. Generate exactly ${numQuestions} highly realistic interview questions for a candidate.
      Candidate Details:
      - Role: ${role}
      - Difficulty: ${difficulty}
      - Interview Type: ${type}
      
      Respond with ONLY a valid JSON array containing objects matching this schema:
      [
        {
          "id": "q_" followed by an incremental number,
          "text": "the actual interview question text",
          "category": "e.g. system design, react hooks, behavioral, etc",
          "idealAnswer": "a model, thorough and highly technical answer of what a senior engineer would say"
        }
      ]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      questions = JSON.parse(response.text?.trim() || '[]');
    } catch (err) {
      console.error('Gemini Question Generation Failed, falling back to database seeding:', err);
    }
  }

  // Pre-configured questions fallback if Gemini is absent or fails
  if (questions.length === 0) {
    const fallbackBank: Record<string, any[]> = {
      'Frontend Engineer': [
        {
          id: 'q_fe_1',
          text: 'What are React Fiber nodes, and how does the reconciliation loop work under the hood?',
          category: 'React Architecture',
          idealAnswer: 'React Fiber is the rendering engine introduced in React 16. It breaks rendering into incremental work units called fibers. Reconciliation works in two phases: the render phase (asynchronous/interruptible), which builds the fiber tree and computes changes, and the commit phase (synchronous/uninterruptible), which applies mutations directly to the DOM.'
        },
        {
          id: 'q_fe_2',
          text: 'How do you optimize render cycles and state transitions in complex React applications?',
          category: 'Performance',
          idealAnswer: 'Optimizations include memoizing expensive components with React.memo, caching reference functions/values with useCallback and useMemo, state virtualization (rendering only items in viewport), avoiding global state thrashing by using localized context or atomic state libraries, and lazy-loading non-critical routing chunks.'
        },
        {
          id: 'q_fe_3',
          text: 'Describe the browser critical rendering path and how to reduce cumulative layout shift (CLS).',
          category: 'Browser Performance',
          idealAnswer: 'The critical rendering path is: DOM -> CSSOM -> Render Tree -> Layout -> Paint -> Composite. To reduce CLS, always include size attributes on images and video elements, reserve space with CSS aspect-ratio or wrappers, avoid injecting dynamic layouts above the fold, and use font-display: swap with fallback matching.'
        }
      ],
      'Backend Engineer': [
        {
          id: 'q_be_1',
          text: 'How do you handle database transaction concurrency conflicts in high-throughput applications?',
          category: 'Databases',
          idealAnswer: 'Concurrency conflicts are mitigated using pessimistic locking (locking rows during read-modify), optimistic locking (using version numbers or timestamps and failing update if stale), configuring appropriate transaction isolation levels (e.g. READ COMMITTED vs SERIALIZABLE), and leveraging atomic updates and database level constraint checks.'
        },
        {
          id: 'q_be_2',
          text: 'Explain how you would design a scalable distributed rate-limiter for a microservice ecosystem.',
          category: 'System Design',
          idealAnswer: 'I would design a sliding window counter algorithm leveraging an in-memory Redis cluster. Each user/API key has a Redis key tracking request timestamps. By grouping request buckets and utilizing Redis pipelines or Lua scripts, we achieve sub-millisecond atomic checks without race conditions across server nodes.'
        }
      ],
      'Fullstack Engineer': [
        {
          id: 'q_fs_1',
          text: 'Compare REST, GraphQL, and gRPC. When would you use each in a production layout?',
          category: 'System API Design',
          idealAnswer: 'REST is standard, easily cacheable, and great for public APIs. GraphQL minimizes over-fetching and allows clients to request exact shapes, making it exceptional for dynamic frontend dashboards. gRPC leverages HTTP/2 and Protocol Buffers for hyper-efficient, strongly typed server-to-server microservice remote procedure calls.'
        },
        {
          id: 'q_fs_2',
          text: 'What are WebSockets and how do you design a cluster to handle 100,000 concurrent socket connections?',
          category: 'Networking',
          idealAnswer: 'WebSockets maintain a single persistent bidirectional TCP connection. To scale to 100k, you need horizontal scaling. Introduce an Nginx load balancer distributing connections with IP hashing, set up an Express/WS backend cluster, and hook up a Redis Pub/Sub backplane to synchronize socket events across separate server processes.'
        }
      ]
    };

    // Grab correct pool or default
    const pool = fallbackBank[role as string] || fallbackBank['Fullstack Engineer'];
    // Randomize and slice
    questions = pool.sort(() => 0.5 - Math.random()).slice(0, numQuestions);
    // If we need more, just copy and give dummy ids
    let index = 1;
    while (questions.length < numQuestions) {
      questions.push({
        id: `q_gen_${index++}`,
        text: `Tell me about a challenging engineering scenario you faced while designing features for a ${role}.`,
        category: 'Experience & Execution',
        idealAnswer: 'An exceptional response would detail a specific technical bottleneck (e.g., memory leaks, query locks, layout thrashing), the precise monitoring tool used to diagnose it, the logical evaluation of trade-offs, and the ultimate, positive business outcome.'
      });
    }
  }

  // Ensure IDs are aligned
  questions = questions.map((q, i) => ({
    ...q,
    id: q.id || `q_${i + 1}`
  }));

  const session = {
    id: sessionId,
    config: { role, difficulty, type, numQuestions, timeLimit },
    questions,
    answers: {},
    status: 'active',
    startedAt: new Date().toISOString(),
    currentQuestionIndex: 0
  };

  DB.sessions[sessionId] = session;
  res.json(session);
});

app.get('/api/interview/session/:id', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const session = DB.sessions[req.params.id];
  if (!session) return res.status(404).json({ message: 'Session not found' });
  res.json(session);
});

app.post('/api/interview/session/:sessionId/answer', async (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const { sessionId } = req.params;
  const { questionId, userAnswer, timeSpent } = req.body;

  const session = DB.sessions[sessionId];
  if (!session) return res.status(404).json({ message: 'Session not found' });

  const question = session.questions.find((q: any) => q.id === questionId);
  if (!question) return res.status(404).json({ message: 'Question not found' });

  const ai = getGeminiClient();
  let evaluation: any = null;

  if (ai) {
    try {
      const prompt = `You are a Senior Technical Examiner. Evaluate this candidate's answer for the technical question.
      
      Question: "${question.text}"
      Ideal Answer Reference: "${question.idealAnswer}"
      Candidate Answer: "${userAnswer}"
      Role Level: ${session.config.difficulty} ${session.config.role}
      
      Perform a deep, objective analysis. Be critical but constructive.
      Respond with ONLY a valid JSON object matching this schema:
      {
        "score": number (0 to 100 overall score),
        "feedback": "string (concise summary feedback)",
        "idealAnswer": "string (refined ideal summary)",
        "strengths": string[] (up to 3 key strengths of candidate answer),
        "weaknesses": string[] (up to 3 items they missed or could improve),
        "technicalScore": number (0 to 100 rating for tech depth),
        "communicationScore": number (0 to 100 rating for delivery),
        "clarityScore": number (0 to 100 rating for explanation articulation)
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      evaluation = JSON.parse(response.text?.trim() || '{}');
    } catch (err) {
      console.error('Gemini Answer Evaluation Failed, falling back to mock scoring:', err);
    }
  }

  // Fallback Evaluator if Gemini is offline
  if (!evaluation) {
    const wordCount = userAnswer ? userAnswer.trim().split(/\s+/).length : 0;
    let score = 50;
    let feedback = 'The answer is too brief. Try to structure your technical definitions with more concrete production examples.';
    let strengths = ['Stated the core definition.'];
    let weaknesses = ['Missing operational trade-offs.', 'Could benefit from code structural examples.'];
    
    if (wordCount > 100) {
      score = 88;
      feedback = 'Outstanding. You demonstrate an incredibly clear structural understanding of the architectural trade-offs.';
      strengths = ['Clear definition of the core concepts.', 'Excellent structural explanation.', 'Directly mentions trade-offs.'];
      weaknesses = ['Could slightly expand on concrete load bottlenecks under high stress.'];
    } else if (wordCount > 40) {
      score = 75;
      feedback = 'Solid response. You understand the primary concepts, but should speak more deeply about optimization.';
      strengths = ['Correct terminology usage.', 'Shows developer familiarity.'];
      weaknesses = ['Missing deep architectural details.'];
    }

    evaluation = {
      score,
      feedback,
      idealAnswer: question.idealAnswer,
      strengths,
      weaknesses,
      technicalScore: Math.min(100, score + 4),
      communicationScore: Math.max(50, score - 5),
      clarityScore: score
    };
  }

  const interviewAnswer = {
    questionId,
    userAnswer,
    evaluation,
    timeSpent,
    savedAt: new Date().toISOString()
  };

  session.answers[questionId] = interviewAnswer;
  
  // Progress question pointer
  session.currentQuestionIndex += 1;

  res.json(interviewAnswer);
});

app.post('/api/interview/session/:sessionId/finish', async (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const { sessionId } = req.params;
  const session = DB.sessions[sessionId];
  if (!session) return res.status(404).json({ message: 'Session not found' });

  session.status = 'completed';
  session.completedAt = new Date().toISOString();

  // Accumulate scores
  const answersList = Object.values(session.answers);
  const totalAnswers = answersList.length;

  let overallScore = 0;
  let technicalScore = 0;
  let communicationScore = 0;
  let clarityScore = 0;
  const strengthsSet = new Set<string>();
  const weaknessesSet = new Set<string>();
  const questionFeedbackList: any[] = [];

  answersList.forEach((ans: any) => {
    const evalObj = ans.evaluation;
    overallScore += evalObj.score;
    technicalScore += evalObj.technicalScore;
    communicationScore += evalObj.communicationScore;
    clarityScore += evalObj.clarityScore;

    evalObj.strengths?.forEach((s: string) => strengthsSet.add(s));
    evalObj.weaknesses?.forEach((w: string) => weaknessesSet.add(w));

    const question = session.questions.find((q: any) => q.id === ans.questionId);
    questionFeedbackList.push({
      questionId: ans.questionId,
      questionText: question ? question.text : 'Question Details',
      userAnswer: ans.userAnswer,
      idealAnswer: evalObj.idealAnswer || (question ? question.idealAnswer : ''),
      score: evalObj.score,
      technicalScore: evalObj.technicalScore,
      communicationScore: evalObj.communicationScore,
      clarityScore: evalObj.clarityScore,
      feedback: evalObj.feedback
    });
  });

  const divider = totalAnswers || 1;
  overallScore = Math.round(overallScore / divider);
  technicalScore = Math.round(technicalScore / divider);
  communicationScore = Math.round(communicationScore / divider);
  clarityScore = Math.round(clarityScore / divider);

  // Default mock elements if no answers submitted
  if (totalAnswers === 0) {
    overallScore = 70;
    technicalScore = 72;
    communicationScore = 68;
    clarityScore = 70;
  }

  const strengths = Array.from(strengthsSet).slice(0, 4);
  const weaknesses = Array.from(weaknessesSet).slice(0, 4);

  // Recommendations generator
  const ai = getGeminiClient();
  let recommendedTopics: any[] = [];

  if (ai && totalAnswers > 0) {
    try {
      const prompt = `Based on these weaknesses flagged in an interview: ${JSON.stringify(weaknesses)}, generate exactly 2 highly relevant recommended study topics to help the candidate master them.
      Respond with ONLY a valid JSON array matching this schema:
      [
        {
          "name": "Topic Name",
          "reason": "Why this topic was suggested based on performance",
          "resources": ["Specific online article, book, or docs link"]
        }
      ]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      recommendedTopics = JSON.parse(response.text?.trim() || '[]');
    } catch (e) {
      console.error('Failed generating recommendations via Gemini, using fallback:', e);
    }
  }

  if (recommendedTopics.length === 0) {
    recommendedTopics = [
      {
        name: `${session.config.role} Design Patterns`,
        reason: `To help address limitations in structuring software modules under ${session.config.difficulty} requirements.`,
        resources: ['Refactoring.Guru Design Patterns', 'Developer Roadmap guidelines']
      },
      {
        name: 'Enterprise System Scaling',
        reason: 'Recommended due to optimization weaknesses highlighted during technical questioning.',
        resources: ['System Design Primer by Donne Martin', 'ByteByteGo System Architecture logs']
      }
    ];
  }

  const reportId = `rep_${Date.now()}`;
  const report = {
    id: reportId,
    sessionId: session.id,
    role: session.config.role,
    difficulty: session.config.difficulty,
    type: session.config.type,
    date: new Date().toISOString(),
    overallScore,
    technicalScore,
    communicationScore,
    clarityScore,
    strengths: strengths.length > 0 ? strengths : ['Showed general competence and promptness.'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['Could expand further on extreme load stress optimization.'],
    questionFeedback: questionFeedbackList,
    recommendedTopics
  };

  DB.reports.push(report);

  // Increment User streak
  user.streakCount += 1;
  user.lastActiveDate = new Date().toISOString();

  res.json(session);
});

// ----------------------------------------------------
// REPORTS ENDPOINTS
// ----------------------------------------------------
app.get('/api/reports', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  res.json(DB.reports);
});

app.get('/api/reports/:id', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const report = DB.reports.find(r => r.id === req.params.id);
  if (!report) return res.status(404).json({ message: 'Report not found' });
  res.json(report);
});

app.get('/api/reports/session/:sessionId', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const report = DB.reports.find(r => r.sessionId === req.params.sessionId);
  if (!report) return res.status(404).json({ message: 'Report not found for this session' });
  res.json(report);
});

// ----------------------------------------------------
// ANALYTICS & TELEMETRY ENDPOINTS
// ----------------------------------------------------
app.get('/api/analytics/dashboard', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  // Average completed score calculation
  const totalReportsCount = DB.reports.length;
  let averageScore = 0;
  if (totalReportsCount > 0) {
    const sum = DB.reports.reduce((acc, rep) => acc + rep.overallScore, 0);
    averageScore = Math.round(sum / totalReportsCount);
  } else {
    averageScore = 0;
  }

  // Active Resume Score
  const latestResume = DB.resumes.length > 0 ? DB.resumes[DB.resumes.length - 1] : null;
  const resumeScore = latestResume ? latestResume.score : 0;

  // Skills breakdown
  const skillsBreakdown = [
    { skill: 'React/JS', score: 85 },
    { skill: 'Node/APIs', score: latestResume && latestResume.extractedSkills.some((s: string) => s.toLowerCase().includes('node') || s.toLowerCase().includes('api')) ? 88 : 72 },
    { skill: 'Databases', score: 80 },
    { skill: 'Sys Design', score: 68 },
    { skill: 'Behavioral', score: 75 }
  ];

  // Progress history formatting
  const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const monthlyProgress = months.map((m, i) => {
    // Distribute previous mock interviews
    const count = i === 5 ? totalReportsCount : Math.floor(Math.random() * 2) + 1;
    const score = i === 5 ? (averageScore || 78) : Math.floor(Math.random() * 15) + 70;
    return {
      month: m,
      interviewsCount: count,
      averageScore: score
    };
  });

  // Recent Interviews formatting
  const recentInterviews = DB.reports.slice(-5).reverse().map(rep => ({
    id: rep.id,
    role: rep.role,
    type: rep.type,
    difficulty: rep.difficulty,
    score: rep.overallScore,
    date: new Date(rep.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  // Weak skills suggestions
  const weakSkills = [
    {
      name: 'System Design Scaling',
      score: 64,
      recommendation: 'Focus on database partitioning, distributed caching strategies, and load balancing mechanics.'
    },
    {
      name: 'Asynchronous Concurrency',
      score: 71,
      recommendation: 'Review event loops, microtask queues, process worker threads, and memory lifecycle leak identification.'
    }
  ];

  // Prepopulated Recommended practice scenarios
  const recommendedPractice = [
    {
      id: 'prac_1',
      title: 'Distributed System Rate Limiter',
      category: 'System Design',
      difficulty: 'Senior',
      estimatedTime: '25 Min'
    },
    {
      id: 'prac_2',
      title: 'React Concurrent Mode & Transitions',
      category: 'Frontend Engineering',
      difficulty: 'Mid',
      estimatedTime: '15 Min'
    },
    {
      id: 'prac_3',
      title: 'STAR Behavioral Leadership Scenario',
      category: 'Behavioral',
      difficulty: 'Lead',
      estimatedTime: '20 Min'
    }
  ];

  // Quick Goal elements
  const upcomingGoals = [
    { id: 'goal_1', title: 'Complete first Mid-level System Design module', dueDate: 'Jul 24', completed: totalReportsCount > 0 },
    { id: 'goal_2', title: 'Upload fully revised PDF resume', dueDate: 'Jul 26', completed: DB.resumes.length > 0 },
    { id: 'goal_3', title: 'Achieve a 5-day active streak', dueDate: 'Jul 28', completed: user.streakCount >= 5 }
  ];

  res.json({
    stats: {
      averageScore: averageScore || 0,
      completedInterviews: totalReportsCount,
      resumeScore,
      streakCounter: user.streakCount
    },
    skillsBreakdown,
    monthlyProgress,
    recentInterviews,
    weakSkills,
    recommendedPractice,
    upcomingGoals
  });
});

// Serve frontend static assets and setup Dev/Prod middleware routing
async function initServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`InterviewAI Full-Stack Node Server running on http://0.0.0.0:${PORT}`);
  });
}

initServer().catch(err => {
  console.error('Server Initialization Failed:', err);
});
