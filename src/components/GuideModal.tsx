import React from 'react';
import { X, BookOpen, ShieldCheck, Cpu, HardDrive, HelpCircle, CheckCircle2 } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasApiKey: boolean;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, hasApiKey }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">SkillSetu AI — Platform Guide</h3>
              <p className="text-xs text-slate-500">“Your Skills. Your Opportunities. Your Future.”</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content sections */}
        <div className="mt-6 space-y-6 text-xs text-slate-600 leading-relaxed">
          
          {/* Section 1: Purpose & Target Audience */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              1. Platform Purpose & Target Audience
            </h4>
            <p>
              <strong>SkillSetu AI</strong> is designed specifically for polytechnic diploma students, technical certificate holders, and fresh engineering graduates in India. It bridges the critical transition from diploma classrooms to initial careers across five core pillars:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700">
              <li><strong>Opportunity Finder</strong>: Discover NATS apprenticeships, DET campus drives, and PSU trainee schedules.</li>
              <li><strong>Eligibility Checker</strong>: Evaluate branch, aggregate percentage, and age criteria before paying application fees.</li>
              <li><strong>Resume Assistant</strong>: Generate ATS-ready resumes emphasizing lab instruments, workshop tools, and industrial training.</li>
              <li><strong>Interview Prep</strong>: Master practical electronics, mechanical, CS, and HR questions with model answers.</li>
              <li><strong>Application Tracker</strong>: Organize your application status pipeline locally and privately.</li>
            </ul>
          </div>

          {/* Section 2: Data Transparency & Official Authority */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2 text-amber-950">
            <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              2. Sample Data Policy & Authoritative Source
            </h4>
            <p className="text-amber-900">
              SkillSetu AI strictly adheres to anti-misinformation principles:
            </p>
            <ul className="list-disc list-inside space-y-1 text-amber-800">
              <li>All built-in example vacancies are clearly labeled as <strong>“Sample Data — Verify Before Applying.”</strong></li>
              <li>SkillSetu AI does not invent vacancies or guarantee real recruitment drives.</li>
              <li>The official employment notification, recruitment portal, and published gazette/corrigenda are the sole authoritative source of truth. Always verify clauses directly on official websites.</li>
            </ul>
          </div>

          {/* Section 3: Firebase Auth & Cloud Storage Setup Checklist */}
          <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/90 space-y-3 text-slate-800">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              3. Firebase Authentication & Cloud Storage Setup Checklist
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              SkillSetu AI uses Google OAuth via Firebase Authentication and Firestore Enterprise to store candidate profiles, application tracking pipelines, and resume drafts securely per user.
            </p>

            <div className="space-y-2 text-[11px] bg-white p-3 rounded-lg border border-blue-100">
              <strong className="block text-slate-900 text-xs">Configuration Steps in Firebase Console:</strong>
              <div className="space-y-1.5 text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="font-mono font-bold text-blue-600">Step 1:</span>
                  <span><strong>Enable Google Sign-in:</strong> In Firebase Console &gt; <em>Authentication</em> &gt; <em>Sign-in method</em>, click <strong>Google</strong> and toggle <strong>Enable</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono font-bold text-blue-600">Step 2:</span>
                  <span><strong>Add Authorized Domains:</strong> In Firebase Console &gt; <em>Authentication</em> &gt; <em>Settings</em> &gt; <em>Authorized domains</em>, add your AI Studio preview domain (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">ais-dev-...run.app</code> and <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">ais-pre-...run.app</code>).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono font-bold text-blue-600">Step 3:</span>
                  <span><strong>Cloud Firestore Rules:</strong> Verified security rules with <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">isOwner(userId)</code> access control are deployed automatically to isolate records to each user's authenticated UID.</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-600">
              <strong className="block text-slate-900 text-xs">Functional Verification Protocol:</strong>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li><strong>Public Access:</strong> Landing dashboard, Eligibility Checker, and Interview Prep remain accessible without login.</li>
                <li><strong>Protected Job Search:</strong> Selecting Opportunity Finder prompts a friendly Google sign-in screen.</li>
                <li><strong>Google Sign-in:</strong> Click "Continue with Google" popup. Displays avatar, name, and cloud sync status badge.</li>
                <li><strong>Data Isolation:</strong> Applications and saved vacancies sync to your private Firestore path <code className="font-mono">users/{'{userId}'}</code>.</li>
                <li><strong>Persistence:</strong> Reloading the browser preserves your account session and cloud-backed pipeline.</li>
                <li><strong>Delete Account & Data:</strong> Open Account &gt; "Delete My Data" &gt; type DELETE. Erases all Firestore documents and auth credentials.</li>
              </ul>
            </div>
          </div>

          {/* Section 4: AI Architecture & Demo Mode */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              4. Gemini AI Architecture & Transparent Demo Mode
            </h4>
            <p>
              Current AI Status: <strong className={hasApiKey ? 'text-emerald-700' : 'text-amber-700'}>
                {hasApiKey ? 'Live Gemini 3.8 Flash Connected' : 'Transparent Demo Mode Active'}
              </strong>
            </p>
            <p>
              When a valid Gemini API key is configured via the server-side environment (`GEMINI_API_KEY`), live career guidance and dynamic bullet point polishing are activated. If no key is configured, SkillSetu AI displays an explicit Demo Mode indicator and serves comprehensive, curated domain knowledge for diploma branches without pretending a live model is connected.
            </p>
          </div>

          {/* Section 5: Running & Publishing */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              5. How to Run, Test, and Deploy
            </h4>
            <div className="font-mono text-[11px] bg-slate-900 text-slate-200 p-3 rounded-lg space-y-1">
              <p># Development Server</p>
              <p className="text-emerald-400">npm run dev</p>
              <p className="mt-2"># Production Build</p>
              <p className="text-emerald-400">npm run build</p>
              <p className="mt-2"># Run Production Server</p>
              <p className="text-emerald-400">npm start</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors"
          >
            Got it, return to app
          </button>
        </div>

      </div>
    </div>
  );
};
