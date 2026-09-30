# SkillSetu AI

> **“Your Skills. Your Opportunities. Your Future.”**

SkillSetu AI is a modern, responsive, student-focused career technology platform built specifically for **polytechnic diploma students and fresh technical graduates** in India. It bridges the critical transition from diploma coursework to competitive career placements.

---

## 🌟 Key Features

1. **Home Dashboard**
   - Candidate academic profile snapshot (branch, graduation cohort, percentage %, backlogs).
   - 6 Quick-Access workspace modules with consistent visual styling.
   - Saved opportunities counter and real-time application pipeline breakdown.
   - 5-step SkillSetu Success Bridge career milestone roadmap.

2. **Opportunity Finder**
   - Curated listings for Technician Apprenticeships (NATS), PSU Trainees (BEL, DRDO, Metro Rail), Private DET roles (Tata Motors, L&T), and Lateral Entry B.Tech (LEET).
   - Filters for Opportunity Type, Engineering Branch, and Location.
   - **Sample Data Transparency**: Clearly labeled as *"Sample Data — Verify Before Applying"*. Never pretends mock listings are live without verification.
   - Ability to add Custom Opportunities from college notice boards or newspapers.

3. **Eligibility Checker**
   - Deep gap analysis comparing student's branch, marks, backlogs, passout year, and age against recruitment notification clauses.
   - 1-click recruitment presets (BEL/DRDO Apprentice, Tata Motors DET, Delhi Metro JE, TCS Smart Hiring, LEET).
   - Color-coded results: *Eligible*, *Conditional / Needs Verification*, or *Not Eligible*.
   - Prominent authoritative notice: Official employment notifications remain the sole legal source of truth.

4. **Resume Assistant**
   - Purpose-built for diploma students: focuses on lab instruments (DSO, multimeter, Vernier caliper), shop-floor tools, and mandatory 4–6 week summer industrial training.
   - Action-verb bullet enhancement feature.
   - Pre-fill sample profile button (ECE, Mechanical).
   - ATS-friendly formatting, 1-click clipboard copy, and print / PDF download view.

5. **Interview Preparation**
   - Core questions across Electronics & Communication, Computer Science/IT, Mechanical, Electrical, Civil, and General HR for freshers.
   - Shows interviewer intent, model answers, key technical keywords, and pro-tips for diploma holders.
   - Interactive practice mode with instant coverage scoring.

6. **Application Tracker & User-Isolated Cloud Storage**
   - Pipeline Kanban board and table views (Interested, Applied, Test/Interview, Selected, Not Selected).
   - LocalStorage browser persistence plus **automatic Firebase Firestore cloud synchronization** when signed in.
   - JSON export backup and JSON import restore.

7. **AI Career Assistant ("Setu Guru")**
   - Answers nuanced student dilemmas (e.g. Lateral Entry B.Tech vs DET Job, NATS rules, written test strategies).
   - **Transparent Demo Mode**: When running offline or without an API key, clearly displays a Demo Mode badge and delivers verified domain advice instead of hallucinating.

8. **Google Authentication & Privacy Isolation**
   - Google Sign-In with Firebase Authentication (`signInWithPopup`).
   - Public access to Dashboard, Eligibility Checker, and Interview Prep; protected access to Job Search / Opportunity Finder.
   - Strict Firestore security rules (`isOwner(userId)`), isolating all records under `users/{userId}`.
   - User control: "Delete My Account and Data" with permanent erasure confirmation.

---

## 🔐 Firebase Authentication & Cloud Storage Setup

1. **Authentication (Google Sign-In)**:
   - In Firebase Console > *Authentication* > *Sign-in method*, enable **Google**.
   - Under *Settings* > *Authorized domains*, add your development and production hostnames (e.g. `ais-dev-...run.app` and `localhost`).
2. **Firestore Enterprise Database**:
   - The database instance is provisioned automatically with security rules deployed to `firestore.rules`.
   - Access to `users/{userId}/*` collections is strictly restricted to authenticated matching UIDs.
3. **Account & Data Erasure**:
   - Students can delete their entire account and all associated cloud records via the *Privacy & Account* dialog.

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or newer)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Mode
Run the Express + Vite development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Optional: Configure Live Gemini AI
Add your Gemini API key to `.env`:
```env
GEMINI_API_KEY="your_actual_api_key_here"
```
The application will automatically switch from **Demo Mode** to **Live Gemini 3.8 Flash**.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🎨 Visual Identity & Architecture
- **Palette**: Deep navy blue (`#0f172a`), royal blue (`#2563eb`), soft lavender (`#e0e7ff`), clean white, subtle cyan accents (`#06b6d4`).
- **Logo**: Upward bridge arc with connected nodes representing the "Setu" (Bridge of Skills).
- **Zero-Pill Discipline**: Metadata uses clean unboxed text with typographic separators (`·`).
- **WCAG AA Compliance**: High-contrast typography and keyboard-accessible controls.
