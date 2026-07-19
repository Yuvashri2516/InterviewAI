# InterviewAI 🚀

An elegant, full-stack, AI-powered interview simulation and preparation platform. InterviewAI uses advanced **Gemini Pro** models (via the official `@google/genai` SDK) to conduct realistic, adaptive role-specific interviews, analyze uploaded resumes, and synthesize deep-dive grading scorecards to help candidates close competence gaps.

---

## 🎨 Visual Identity & Key Highlights
* **Tailwind CSS v4 & Modern Design**: Implemented with high-contrast, responsive layouts, generous negative space, smooth entry animations (powered by `motion`), and support for adaptive light/dark modes.
* **Full-stack Express + Vite Architecture**: Fully isolated API endpoints that safely proxy Gemini API transactions server-side, hiding private keys from the client browser.
* **Dynamic Analytics**: Powered by `recharts` to render rich interactive skill competency radar charts, historic performance analytics, and diagnostic logs.

---

## 🌟 Key Features

1. **Resume Integration**: Upload resumes (`.pdf`, `.txt`, `.docx`), parse skill trees, and map key achievements automatically to personalize mock interview questions.
2. **Interactive Mock Interview Simulator**:
   - Audio & text feedback options.
   - Dynamic time-tracking and response status monitors.
   - Staggered and adaptive question progression based on candidate answers.
3. **Comprehensive Gemini Scorecard**:
   - Synthesizes an overall competence percentage score.
   - Tracks granular progress metrics: Technical Depth, Communication, and Clarity.
   - Outputs aesthetic lists of **Aesthetic Strengths** and **Critical Gaps**.
   - Side-by-side comparative views of candidate answers, Gemini critiquing logs, and **ideal structural responses**.
4. **Historical Evaluation Indexes**: Save and trace past performance scorecards over time with search and category filtering.
5. **System Sandbox Controls**: Fully adjustable settings to purge local telemetries, configure proxy ports, or toggle mock server fallbacks for offline testing.

---

## 🛠️ Technology Stack

* **Frontend Framework**: [React 19](https://react.dev/) + [Vite 6](https://vite.dev/)
* **Backend Runtime**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Animations**: [motion/react](https://github.com/motiondivision/motion)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Charts**: [Recharts](https://recharts.org/)
* **AI Orchestration**: [@google/genai SDK](https://www.npmjs.com/package/@google/genai)
* **HTTP Client**: [Axios](https://axios-http.com/)

---

## 📁 Folder Structure

```text
├── .env.example              # Environment variable declarations
├── .gitignore                # Production ignore patterns (dist, node_modules, etc.)
├── package.json              # Main project package manifest
├── tsconfig.json             # TypeScript rules configuration
├── vite.config.ts            # Vite assets and compiler settings
├── server.ts                 # Full-stack Express backend with Vite middleware
├── src/                      # Client-side application source
│   ├── main.tsx              # React mounting entry point
│   ├── App.tsx               # Routing map and context providers
│   ├── index.css             # Tailwind v4 globals and theme configuration
│   ├── types.ts              # Centralized TypeScript models and interfaces
│   ├── api/
│   │   └── client.ts         # Configured Axios instance
│   ├── components/
│   │   └── ThemeSwitcher.tsx # Theme controller widget
│   ├── contexts/
│   │   ├── AuthContext.tsx   # Dummy auth session coordinator
│   │   ├── ThemeContext.tsx  # Global light/dark manager
│   │   └── ToastContext.tsx  # Dynamic UI notification system
│   ├── layouts/
│   │   └── ProtectedRouteLayout.tsx # Shell with responsive Left Navigation & Header
│   ├── pages/
│   │   ├── Landing.tsx       # Marketing & features dashboard
│   │   ├── Login.tsx         # Platform entry credentials screen
│   │   ├── Signup.tsx        # Candidate registration screen
│   │   ├── ForgotPassword.tsx# Password retrieval/reset wizard
│   │   ├── Dashboard.tsx     # Overview cards, skills radar chart, and actions
│   │   ├── ResumeUpload.tsx  # File-uploader (supports drag-and-drop) and analysis UI
│   │   ├── InterviewSetup.tsx# Mock configurations (role selection, difficulty, count)
│   │   ├── InterviewScreen.tsx# Immersive terminal emulator simulation
│   │   ├── InterviewResults.tsx# Grading scorecards with comparative feedback
│   │   ├── InterviewHistory.tsx# Performance audit-trail database
│   │   ├── Profile.tsx       # Candidate professional overview
│   │   ├── Settings.tsx      # Sandbox telemetries and API connection configurations
│   │   └── NotFound.tsx      # Custom elegant 404 screen
│   └── services/
│       ├── auth.ts           # Authentication client-side API layer
│       ├── resume.ts         # Resume upload and parse methods
│       ├── interview.ts      # Active simulator sessions orchestrator
│       ├── reports.ts        # Performance scorecard fetchers
│       └── analytics.ts      # General system metrics calculators
└── uploads/                  # Temporary multipart uploader directory (auto-ignored)
```

---

## ⚙️ Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

And configure the variables inside `.env`:
```env
# GEMINI_API_KEY: Required for generating questions, analyzing resumes, and grading responses.
# Get an API key from Google AI Studio.
GEMINI_API_KEY="your_gemini_api_key_here"

# APP_URL: Base URL where this full-stack application is deployed.
# Defaults to local port during development.
APP_URL="http://localhost:3000"
```

---

## 🚀 Installation & Local Development

### Prerequisites
Make sure you have [Node.js (v18+)](https://nodejs.org/) installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode
To boot up the Express server and automatically run the integrated Vite compiler:
```bash
npm run dev
```
The application will be accessible at: **`http://localhost:3000`**

### 3. Build for Production
To bundle both the backend entry server and client assets for deployment:
```bash
npm run build
```
This command compiles the frontend static bundle into `dist/` and compiles the backend `server.ts` into a fast, self-contained CommonJS file `dist/server.cjs` using `esbuild`.

### 4. Start Production Server
```bash
npm start
```

---

## 📸 Screenshots

*Below are placeholders for the interface screenshots:*

### 📊 Landing & Professional Dashboard
> *Placeholder for main candidate landing interface and responsive widgets.*
> `![Dashboard Screenshot](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80)`

### 🛡️ Active Interview Screen
> *Placeholder for the real-time immersive terminal interview simulation.*
> `![Simulator Screenshot](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80)`

### 📝 Dynamic Scorecard Analysis
> *Placeholder for the Gemini-powered grading reports and side-by-side structural response comparative evaluations.*
> `![Scorecard Screenshot](https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80)`

---

## 🤝 Contributing
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing-feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## 📄 License
This project is licensed under the Apache-2.0 License - see the LICENSE file for details.
