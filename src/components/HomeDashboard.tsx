import React from 'react';
import { TabType } from './Navbar';
import { StudentProfile, Opportunity, ApplicationEntry } from '../types';
import { 
  Compass, 
  FileCheck2, 
  FileText, 
  HelpCircle as QuestionIcon, 
  ListTodo, 
  Sparkles, 
  ArrowRight, 
  Bookmark, 
  CheckCircle2, 
  Clock, 
  Building2, 
  MapPin, 
  Calendar, 
  UserCheck,
  Briefcase,
  TrendingUp,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface HomeDashboardProps {
  studentProfile: StudentProfile;
  onNavigate: (tab: TabType) => void;
  savedOpportunities: Opportunity[];
  applications: ApplicationEntry[];
  onOpenProfile: () => void;
  onOpenGuide: () => void;
  currentUser?: any;
  onOpenLogin?: (reason?: string, redirectTab?: TabType) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  studentProfile,
  onNavigate,
  savedOpportunities,
  applications,
  onOpenProfile,
  onOpenGuide,
  currentUser,
  onOpenLogin,
}) => {
  // Application pipeline status counts
  const statusCounts = {
    Interested: applications.filter(a => a.status === 'Interested').length,
    Applied: applications.filter(a => a.status === 'Applied').length,
    'Test/Interview': applications.filter(a => a.status === 'Test/Interview').length,
    Selected: applications.filter(a => a.status === 'Selected').length,
    'Not Selected': applications.filter(a => a.status === 'Not Selected').length,
  };

  const featureCards = [
    {
      id: 'opportunities' as TabType,
      title: 'Opportunity Finder',
      description: 'Explore verified recruitment notices, NATS apprenticeships, DET campus drives, and lateral entry pathways.',
      icon: Compass,
      tag: 'Curated for Diploma & Freshers',
      accentColor: 'text-blue-600',
      bgColor: 'bg-blue-50/70',
      actionText: 'Browse Opportunities',
    },
    {
      id: 'eligibility' as TabType,
      title: 'Eligibility Checker',
      description: 'Compare your branch, aggregate marks, backlogs, and age against official recruitment criteria before applying.',
      icon: FileCheck2,
      tag: 'Instant Gap Analysis',
      accentColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50/70',
      actionText: 'Verify Eligibility',
    },
    {
      id: 'resume' as TabType,
      title: 'Resume Assistant',
      description: 'Draft ATS-ready resumes highlighting polytechnic coursework, workshop tools, lab instruments, and industrial training.',
      icon: FileText,
      tag: 'Action-Verb Enhanced',
      accentColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50/70',
      actionText: 'Build Draft Resume',
    },
    {
      id: 'interview' as TabType,
      title: 'Interview Preparation',
      description: 'Master core technical questions in electronics, communication, mechanical, and HR with sample model answers.',
      icon: QuestionIcon,
      tag: 'Core Concepts & Bench Skills',
      accentColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50/70',
      actionText: 'Practice Questions',
    },
    {
      id: 'tracker' as TabType,
      title: 'Application Tracker',
      description: 'Organize your job search pipeline with deadlines, test dates, and status updates stored securely in your browser.',
      icon: ListTodo,
      tag: 'Local & Private',
      accentColor: 'text-amber-600',
      bgColor: 'bg-amber-50/70',
      actionText: 'View Pipeline',
    },
    {
      id: 'assistant' as TabType,
      title: 'AI Career Advisor',
      description: 'Ask practical career questions on LEET lateral entry vs jobs, DET test strategies, and top industry certifications.',
      icon: Sparkles,
      tag: 'Interactive Career Guidance',
      accentColor: 'text-purple-600',
      bgColor: 'bg-purple-50/70',
      actionText: 'Start Consultation',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Hero Welcome Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-10 shadow-lg border border-slate-800">
        {/* Subtle geometric background grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>SkillSetu AI Career Platform</span>
            <span aria-hidden="true">·</span>
            <span>Polytechnic & Fresh Graduate Edition</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-200 to-white">{studentProfile.name}</span>.
          </h1>
          
          <p className="mt-2 text-base sm:text-lg text-slate-300 font-medium leading-snug">
            “Your Skills. Your Opportunities. Your Future.”
          </p>

          <p className="mt-3 text-sm text-slate-300 max-w-2xl leading-relaxed">
            Your dedicated career companion for exploring verified apprenticeship & job opportunities, checking notification eligibility criteria, building a competitive technical resume, and practicing core technical interviews.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (!currentUser && onOpenLogin) {
                  onOpenLogin('Sign in to explore opportunities and save your career progress.', 'opportunities');
                } else {
                  onNavigate('opportunities');
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              <span>Explore Opportunities</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('eligibility')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-sm font-medium transition-colors"
            >
              <FileCheck2 className="w-4 h-4 text-cyan-400" />
              <span>Check Eligibility</span>
            </button>
          </div>
        </div>

        {/* Student Snapshot Card inside hero banner */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300">
          <div>
            <span className="text-slate-400 block text-[11px]">Qualification & Branch</span>
            <span className="font-semibold text-white truncate block">{studentProfile.qualification} · {studentProfile.branch}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Passing Year</span>
            <span className="font-semibold text-white font-mono">{studentProfile.graduationYear} (Cohort)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Current Score</span>
            <span className="font-semibold text-white font-mono">{studentProfile.percentageOrCgpa}% Aggregate</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[11px]">Profile Status</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready
              </span>
            </div>
            <button
              onClick={onOpenProfile}
              className="text-cyan-300 hover:text-white underline text-[11px] self-end"
            >
              Update
            </button>
          </div>
        </div>
      </section>

      {/* Quick-Access Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Career Workspace Tools</h2>
            <p className="text-xs text-slate-500">Six integrated modules built specifically for polytechnic diploma students and freshers.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="group p-5 rounded-xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${card.bgColor} ${card.accentColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (card.id === 'opportunities' && !currentUser && onOpenLogin) {
                        onOpenLogin('Sign in to explore opportunities and save your career progress.', 'opportunities');
                      } else {
                        onNavigate(card.id);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all"
                  >
                    <span>{card.actionText}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Overview Split Section: Saved Opportunities & Application Funnel */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Application Pipeline Overview (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Application Pipeline</h3>
              </div>
              <button
                onClick={() => onNavigate('tracker')}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Open Tracker
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                { status: 'Interested', count: statusCounts.Interested, color: 'bg-slate-100 text-slate-700' },
                { status: 'Applied', count: statusCounts.Applied, color: 'bg-blue-50 text-blue-700' },
                { status: 'Test/Interview', count: statusCounts['Test/Interview'], color: 'bg-amber-50 text-amber-800' },
                { status: 'Selected', count: statusCounts.Selected, color: 'bg-emerald-50 text-emerald-800' },
                { status: 'Not Selected', count: statusCounts['Not Selected'], color: 'bg-rose-50 text-rose-700' },
              ].map(item => (
                <div key={item.status} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                  <span className="text-xs font-medium text-slate-700">{item.status}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md font-mono ${item.color}`}>
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Total Tracked Applications: <strong className="font-mono text-slate-800">{applications.length}</strong></span>
            <button
              onClick={() => onNavigate('tracker')}
              className="text-blue-600 font-medium hover:underline"
            >
              + Add Entry
            </button>
          </div>
        </div>

        {/* Saved Opportunities Highlights (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Saved Opportunities ({savedOpportunities.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigate('opportunities')}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Find More
              </button>
            </div>

            {savedOpportunities.length === 0 ? (
              <div className="text-center py-8">
                <Compass className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium">No saved opportunities yet.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Browse opportunities and click the bookmark button to save vacancies here.</p>
                <button
                  onClick={() => onNavigate('opportunities')}
                  className="mt-3 px-3 py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
                >
                  Browse Now
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {savedOpportunities.slice(0, 3).map((opp) => (
                  <div
                    key={opp.id}
                    className="p-3 rounded-lg border border-slate-200/70 hover:border-blue-200 hover:bg-blue-50/20 transition-all flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                        <span className="font-medium text-slate-800 truncate">{opp.organization}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{opp.location}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {opp.role}
                      </h4>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                        <span>{opp.stipendOrSalary}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-700 font-mono">Deadline: {opp.deadline}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onNavigate('eligibility')}
                        title="Check Eligibility"
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        Check Fit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Sample listings clearly labeled · Always verify official notices</span>
            <button
              onClick={() => onNavigate('opportunities')}
              className="text-blue-600 font-medium hover:underline"
            >
              View All ({savedOpportunities.length})
            </button>
          </div>
        </div>

      </section>

      {/* Setu Bridge Roadmap (Career Milestone Pathway) */}
      <section className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">The SkillSetu Success Bridge</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Recommended 5-step milestone journey from diploma classroom to first career appointment.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          {[
            { step: '01', title: 'Profile & Skills', desc: 'Document aggregate %, branch coursework, and shop-floor skills.', current: true },
            { step: '02', title: 'Opportunity Scan', desc: 'Filter NATS apprenticeships, DET roles, and LEET university slots.', current: false },
            { step: '03', title: 'Eligibility Check', desc: 'Cross-reference recruitment clauses, age cutoffs, and passout years.', current: false },
            { step: '04', title: 'Action Resume', desc: 'Format ATS-ready draft with lab instruments and summer training.', current: false },
            { step: '05', title: 'Interview & Offer', desc: 'Practice core electronics/mechanical concepts and track application status.', current: false },
          ].map((milestone) => (
            <div key={milestone.step} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-colors">
              <span className="text-[10px] font-bold text-blue-600 font-mono block mb-1">
                STEP {milestone.step}
              </span>
              <h4 className="text-xs font-bold text-slate-900 mb-1">{milestone.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">{milestone.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
