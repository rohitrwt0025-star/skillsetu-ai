import React from 'react';
import { SetuLogo } from './SetuLogo';
import { 
  User, 
  HelpCircle, 
  Menu, 
  X,
  Compass,
  FileCheck2,
  FileText,
  HelpCircle as QuestionIcon,
  ListTodo,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';
import { StudentProfile } from '../types';

export type TabType = 
  | 'dashboard' 
  | 'opportunities' 
  | 'eligibility' 
  | 'resume' 
  | 'interview' 
  | 'tracker' 
  | 'assistant';

interface NavbarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  studentProfile: StudentProfile;
  onOpenProfile: () => void;
  onOpenGuide: () => void;
  onOpenAccount: () => void;
  onOpenLogin: (reason?: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  hasApiKey: boolean;
  currentUser: any;
  isSavingToCloud: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  studentProfile,
  onOpenProfile,
  onOpenGuide,
  onOpenAccount,
  onOpenLogin,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  hasApiKey,
  currentUser,
  isSavingToCloud,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ElementType; isProtected?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'opportunities', label: 'Opportunities', icon: Compass, isProtected: true },
    { id: 'eligibility', label: 'Eligibility', icon: FileCheck2 },
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'interview', label: 'Interview', icon: QuestionIcon },
    { id: 'tracker', label: 'Tracker', icon: ListTodo },
    { id: 'assistant', label: 'AI Advisor', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onTabChange('dashboard')}
              className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-0.5"
            >
              <SetuLogo size="md" />
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.isProtected && !currentUser) {
                      onOpenLogin('Sign in to explore opportunities and save your career progress.');
                    } else {
                      onTabChange(item.id);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.isProtected && !currentUser && (
                    <span className="text-[10px] text-slate-400 font-normal ml-0.5">🔒</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Guide & Verification Info */}
            <button
              onClick={onOpenGuide}
              title="Platform Guide & Firebase Checklist"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Platform Guide"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Cloud Sync Status Indicator */}
            {currentUser && (
              <button
                onClick={onOpenAccount}
                title={isSavingToCloud ? 'Syncing with Firestore...' : 'Cloud Synced'}
                className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <span className={`w-2 h-2 rounded-full ${isSavingToCloud ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
                <span className="font-mono">{isSavingToCloud ? 'Syncing...' : 'Cloud'}</span>
              </button>
            )}

            {/* User Profile / Sign In Button */}
            {currentUser ? (
              <button
                onClick={onOpenAccount}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-xs"
                title="Account & Privacy Settings"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.displayName ? currentUser.displayName.charAt(0) : 'S'}
                  </div>
                )}
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-medium text-slate-800 leading-tight truncate max-w-[100px]">
                    {currentUser.displayName ? currentUser.displayName.split(' ')[0] : 'Student'}
                  </p>
                  <p className="text-[10px] text-emerald-600 leading-tight truncate max-w-[100px] font-medium">
                    Signed In
                  </p>
                </div>
              </button>
            ) : (
              <button
                onClick={() => onOpenLogin('Sign in to explore opportunities and save your career progress.')}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" />
                </svg>
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.isProtected && !currentUser) {
                    onOpenLogin('Sign in to explore opportunities and save your career progress.');
                  } else {
                    onTabChange(item.id);
                  }
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.isProtected && !currentUser && (
                  <span className="text-xs text-slate-400 font-medium">🔒 Protected</span>
                )}
              </button>
            );
          })}
          
          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-3">
            <span>{currentUser ? `Signed in as ${currentUser.displayName || currentUser.email}` : 'Signed out (Guest)'}</span>
            {currentUser ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAccount();
                }}
                className="text-blue-600 font-medium hover:underline"
              >
                Account
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenLogin('Sign in to explore opportunities and save your career progress.');
                }}
                className="text-blue-600 font-bold hover:underline"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
