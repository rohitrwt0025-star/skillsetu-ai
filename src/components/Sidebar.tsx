import React from 'react';
import { TabType } from './Navbar';
import { 
  LayoutDashboard, 
  Compass, 
  FileCheck2, 
  FileText, 
  HelpCircle as QuestionIcon, 
  ListTodo, 
  Sparkles,
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
  Bookmark
} from 'lucide-react';
import { StudentProfile } from '../types';

interface SidebarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  savedCount: number;
  activeAppsCount: number;
  studentProfile: StudentProfile;
  onOpenProfile: () => void;
  onOpenGuide: () => void;
  onOpenAccount: () => void;
  onOpenLogin: (reason?: string) => void;
  hasApiKey: boolean;
  currentUser: any;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ElementType;
  count?: number;
  isProtected?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  savedCount,
  activeAppsCount,
  studentProfile,
  onOpenProfile,
  onOpenGuide,
  onOpenAccount,
  onOpenLogin,
  hasApiKey,
  currentUser,
}) => {
  const primaryNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'opportunities', label: 'Opportunity Finder', icon: Compass, count: savedCount, isProtected: true },
    { id: 'eligibility', label: 'Eligibility Checker', icon: FileCheck2 },
    { id: 'resume', label: 'Resume Assistant', icon: FileText },
    { id: 'interview', label: 'Interview Prep', icon: QuestionIcon },
    { id: 'tracker', label: 'Application Tracker', icon: ListTodo, count: activeAppsCount },
    { id: 'assistant', label: 'AI Career Assistant', icon: Sparkles },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 flex-1 flex flex-col justify-between">
        
        {/* Navigation list */}
        <div className="space-y-6">
          
          {/* User Profile Card */}
          {currentUser ? (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="w-9 h-9 rounded-lg border border-slate-200 object-cover shadow-xs"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      {currentUser.displayName ? currentUser.displayName.charAt(0) : 'S'}
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 truncate max-w-[110px]">
                      {currentUser.displayName || studentProfile.name}
                    </h4>
                    <p className="text-[11px] text-emerald-600 font-medium truncate max-w-[110px]">
                      Cloud Synced
                    </p>
                  </div>
                </div>
                <button
                  onClick={onOpenAccount}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline shrink-0"
                >
                  Account
                </button>
              </div>
              
              <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-600">
                <span className="truncate max-w-[140px]">{studentProfile.branch}</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  {studentProfile.percentageOrCgpa}%
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  G
                </div>
                <span className="font-bold text-slate-800">Sign in with Google</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">
                Unlock job search and sync your applications securely to the cloud.
              </p>
              <button
                onClick={() => onOpenLogin('Sign in to explore opportunities and save your career progress.')}
                className="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-2xs"
              >
                Continue with Google
              </button>
            </div>
          )}

          {/* Primary Nav Links */}
          <div>
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Career Workspace
            </p>
            <nav className="space-y-1">
              {primaryNav.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.isProtected && !currentUser) {
                        onOpenLogin('Sign in to explore opportunities and save your career progress.');
                      } else {
                        onTabChange(item.id as TabType);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors group ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.isProtected && !currentUser && (
                        <span className="text-[10px] text-slate-400">🔒</span>
                      )}
                      {item.count !== undefined && item.count > 0 && (
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md tabular-nums ${
                          isActive ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Trust & Verification Note */}
          <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 text-[11px] text-slate-600 leading-relaxed">
            <div className="flex items-center gap-1.5 text-blue-800 font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Student Notice</span>
            </div>
            <p className="text-slate-600">
              Sample listings are mock data for practice. Always verify with official employment gazettes and org portals.
            </p>
          </div>

        </div>

        {/* Footer Area */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <button
            onClick={onOpenGuide}
            className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Platform Guide & Setup</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
          
          <div className="px-3 py-1.5 flex items-center justify-between text-[10px] text-slate-400">
            <span>SkillSetu AI v1.0</span>
            <span className={hasApiKey ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
              {hasApiKey ? 'AI Live' : 'Demo Mode'}
            </span>
          </div>
        </div>

      </div>
    </aside>
  );
};
