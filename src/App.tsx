import React, { useState, useEffect } from 'react';
import { 
  AuthProvider, 
  useAuth 
} from './context/AuthContext';
import { 
  Navbar, 
  TabType 
} from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomeDashboard } from './components/HomeDashboard';
import { OpportunityFinder } from './components/OpportunityFinder';
import { EligibilityChecker } from './components/EligibilityChecker';
import { ResumeAssistant } from './components/ResumeAssistant';
import { InterviewPrep } from './components/InterviewPrep';
import { ApplicationTracker } from './components/ApplicationTracker';
import { CareerAssistant } from './components/CareerAssistant';
import { ProfileModal } from './components/ProfileModal';
import { GuideModal } from './components/GuideModal';
import { LoginModal } from './components/LoginModal';
import { AccountPrivacyModal } from './components/AccountPrivacyModal';

import { 
  Opportunity, 
  ApplicationEntry, 
  StudentProfile, 
  ResumeData 
} from './types';
import { SAMPLE_OPPORTUNITIES } from './data/mockOpportunities';
import { 
  getStoredApplications, 
  saveStoredApplications,
  getSavedOpportunityIds,
  toggleSaveOpportunityId,
  getStoredStudentProfile,
  saveStoredStudentProfile,
  getStoredResumeData,
  saveStoredResumeData
} from './utils/storage';

function AppContent() {
  const { 
    currentUser, 
    isSavingToCloud, 
    cloudSyncError, 
    saveProfileCloud, 
    saveApplicationsCloud, 
    saveSavedOppsCloud, 
    saveResumeCloud,
    fetchUserCloudData 
  } = useAuth();

  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(getStoredStudentProfile);
  const [applications, setApplications] = useState<ApplicationEntry[]>(getStoredApplications);
  const [savedOppIds, setSavedOppIds] = useState<string[]>(getSavedOpportunityIds);
  const [resumeData, setResumeData] = useState<ResumeData>(getStoredResumeData);
  const [customOpportunities, setCustomOpportunities] = useState<Opportunity[]>(() => {
    try {
      const raw = localStorage.getItem('skillsetu_custom_opps_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [selectedOppForEligibility, setSelectedOppForEligibility] = useState<Opportunity | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginReasonMessage, setLoginReasonMessage] = useState('Sign in to explore opportunities and save your career progress.');
  const [postLoginRedirectTab, setPostLoginRedirectTab] = useState<TabType | null>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check Gemini system status on mount
  useEffect(() => {
    fetch('/api/system-status')
      .then(res => res.json())
      .then(data => {
        if (data.hasApiKey) {
          setHasApiKey(true);
        }
      })
      .catch(() => {
        setHasApiKey(false);
      });
  }, []);

  // When user logs in or changes, sync with Firestore cloud
  useEffect(() => {
    if (currentUser) {
      fetchUserCloudData().then((cloudData) => {
        if (cloudData) {
          if (cloudData.profile) {
            setStudentProfile(cloudData.profile);
            saveStoredStudentProfile(cloudData.profile);
          } else {
            // First time cloud user: save initial local profile to cloud
            saveProfileCloud(studentProfile);
          }

          if (cloudData.applications && cloudData.applications.length > 0) {
            setApplications(cloudData.applications);
            saveStoredApplications(cloudData.applications);
          } else {
            saveApplicationsCloud(applications);
          }

          if (cloudData.savedOppIds && cloudData.savedOppIds.length > 0) {
            setSavedOppIds(cloudData.savedOppIds);
          } else {
            saveSavedOppsCloud(savedOppIds);
          }

          if (cloudData.resume) {
            setResumeData(cloudData.resume);
            saveStoredResumeData(cloudData.resume);
          } else {
            saveResumeCloud(resumeData);
          }

          showToast(`Welcome ${currentUser.displayName || 'Student'}! Cloud sync active.`);
        }
      });
    }
  }, [currentUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenLogin = (reason?: string, redirectTab?: TabType) => {
    setLoginReasonMessage(reason || 'Sign in to explore opportunities and save your career progress.');
    if (redirectTab) {
      setPostLoginRedirectTab(redirectTab);
    }
    setIsLoginModalOpen(true);
  };

  const handlePostLoginSuccess = () => {
    if (postLoginRedirectTab) {
      setCurrentTab(postLoginRedirectTab);
      setPostLoginRedirectTab(null);
    }
  };

  // Combine built-in sample opportunities with custom entries
  const allOpportunities: Opportunity[] = [
    ...customOpportunities,
    ...SAMPLE_OPPORTUNITIES
  ];

  const savedOpportunities = allOpportunities.filter(o => savedOppIds.includes(o.id));

  // Toggle Save Opportunity
  const handleToggleSave = (id: string) => {
    const updated = toggleSaveOpportunityId(id);
    setSavedOppIds(updated);
    if (currentUser) {
      saveSavedOppsCloud(updated);
    }
    const isNowSaved = updated.includes(id);
    showToast(isNowSaved ? 'Opportunity saved to bookmarks and cloud!' : 'Opportunity removed from bookmarks.');
  };

  // Check Eligibility For a specific Opportunity
  const handleCheckEligibilityForOpp = (opp: Opportunity) => {
    setSelectedOppForEligibility(opp);
    setCurrentTab('eligibility');
    showToast(`Loaded criteria for ${opp.role}`);
  };

  // Add Opportunity directly into Application Tracker
  const handleAddOppToTracker = (opp: Opportunity) => {
    const exists = applications.some(a => a.role === opp.role && a.organization === opp.organization);
    if (exists) {
      showToast('This opportunity is already present in your Application Tracker.');
      setCurrentTab('tracker');
      return;
    }

    const newApp: ApplicationEntry = {
      id: `app-from-opp-${Date.now()}`,
      role: opp.role,
      organization: opp.organization,
      location: opp.location,
      type: opp.type,
      appliedDate: new Date().toISOString().split('T')[0],
      deadline: opp.deadline,
      status: 'Interested',
      notes: `Captured from Opportunity Finder. Criteria: ${opp.qualification}. Expected stipend: ${opp.stipendOrSalary}`,
      applicationLink: opp.applicationLink,
      expectedStipend: opp.stipendOrSalary,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newApp, ...applications];
    setApplications(updated);
    saveStoredApplications(updated);
    if (currentUser) {
      saveApplicationsCloud(updated);
    }
    showToast(`Added "${opp.role}" to your Application Tracker as "Interested"!`);
    setCurrentTab('tracker');
  };

  // Add custom manual application into Tracker
  const handleAddApplication = (entry: ApplicationEntry) => {
    const updated = [entry, ...applications];
    setApplications(updated);
    saveStoredApplications(updated);
    if (currentUser) {
      saveApplicationsCloud(updated);
    }
    showToast('Application logged and saved!');
  };

  const handleUpdateApplication = (entry: ApplicationEntry) => {
    const updated = applications.map(a => a.id === entry.id ? entry : a);
    setApplications(updated);
    saveStoredApplications(updated);
    if (currentUser) {
      saveApplicationsCloud(updated);
    }
    showToast('Application updated successfully.');
  };

  const handleDeleteApplication = (id: string) => {
    const updated = applications.filter(a => a.id !== id);
    setApplications(updated);
    saveStoredApplications(updated);
    if (currentUser) {
      saveApplicationsCloud(updated);
    }
    showToast('Application removed from tracker.');
  };

  const handleImportApplications = (imported: ApplicationEntry[]) => {
    setApplications(imported);
    saveStoredApplications(imported);
    if (currentUser) {
      saveApplicationsCloud(imported);
    }
    showToast(`Imported ${imported.length} applications from backup file.`);
  };

  // Add custom opportunity from notice board
  const handleAddCustomOpportunity = (opp: Opportunity) => {
    const updated = [opp, ...customOpportunities];
    setCustomOpportunities(updated);
    localStorage.setItem('skillsetu_custom_opps_v1', JSON.stringify(updated));
    showToast(`Custom opportunity "${opp.role}" created and listed!`);
  };

  // Profile update
  const handleSaveProfile = (newProfile: StudentProfile) => {
    setStudentProfile(newProfile);
    saveStoredStudentProfile(newProfile);
    if (currentUser) {
      saveProfileCloud(newProfile);
    }
    showToast('Student profile updated and synced!');
  };

  // Resume update
  const handleSaveResume = (newResume: ResumeData) => {
    setResumeData(newResume);
    saveStoredResumeData(newResume);
    if (currentUser) {
      saveResumeCloud(newResume);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        studentProfile={studentProfile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onOpenAccount={() => setIsAccountModalOpen(true)}
        onOpenLogin={(reason) => handleOpenLogin(reason)}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        hasApiKey={hasApiKey}
        currentUser={currentUser}
        isSavingToCloud={isSavingToCloud}
      />

      {/* Main Workspace: Desktop Sidebar + Viewport Content */}
      <div className="flex-1 flex w-full">
        
        {/* Desktop Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          savedCount={savedOppIds.length}
          activeAppsCount={applications.filter(a => a.status !== 'Not Selected').length}
          studentProfile={studentProfile}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenGuide={() => setIsGuideModalOpen(true)}
          onOpenAccount={() => setIsAccountModalOpen(true)}
          onOpenLogin={(reason) => handleOpenLogin(reason)}
          hasApiKey={hasApiKey}
          currentUser={currentUser}
        />

        {/* Dynamic Main Viewport */}
        <main className="flex-1 overflow-x-hidden min-h-[calc(100vh-4rem)]">
          {currentTab === 'dashboard' && (
            <HomeDashboard
              studentProfile={studentProfile}
              onNavigate={(tab) => {
                setCurrentTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              savedOpportunities={savedOpportunities}
              applications={applications}
              onOpenProfile={() => setIsProfileModalOpen(true)}
              onOpenGuide={() => setIsGuideModalOpen(true)}
              currentUser={currentUser}
              onOpenLogin={(reason, redirectTab) => handleOpenLogin(reason, redirectTab)}
            />
          )}

          {currentTab === 'opportunities' && (
            <OpportunityFinder
              opportunities={allOpportunities}
              savedIds={savedOppIds}
              onToggleSave={handleToggleSave}
              onCheckEligibilityForOpp={handleCheckEligibilityForOpp}
              onAddToTracker={handleAddOppToTracker}
              onAddCustomOpportunity={handleAddCustomOpportunity}
              currentUser={currentUser}
              onOpenLogin={(reason) => handleOpenLogin(reason, 'opportunities')}
            />
          )}

          {currentTab === 'eligibility' && (
            <EligibilityChecker
              studentProfile={studentProfile}
              initialOpportunity={selectedOppForEligibility}
              onAddToTracker={(role, org, loc, type) => {
                const newApp: ApplicationEntry = {
                  id: `app-eligibility-${Date.now()}`,
                  role,
                  organization: org,
                  location: loc,
                  type,
                  appliedDate: new Date().toISOString().split('T')[0],
                  deadline: '2026-11-30',
                  status: 'Interested',
                  notes: 'Verified eligibility using SkillSetu AI checker.',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
                handleAddApplication(newApp);
                setCurrentTab('tracker');
              }}
            />
          )}

          {currentTab === 'resume' && (
            <ResumeAssistant
              studentProfile={studentProfile}
              initialResume={resumeData}
              onSaveResume={handleSaveResume}
            />
          )}

          {currentTab === 'interview' && (
            <InterviewPrep
              studentBranch={studentProfile.branch}
            />
          )}

          {currentTab === 'tracker' && (
            <ApplicationTracker
              applications={applications}
              onAddApplication={handleAddApplication}
              onUpdateApplication={handleUpdateApplication}
              onDeleteApplication={handleDeleteApplication}
              onImportApplications={handleImportApplications}
            />
          )}

          {currentTab === 'assistant' && (
            <CareerAssistant
              studentProfile={studentProfile}
              hasApiKey={hasApiKey}
            />
          )}
        </main>
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-medium shadow-lg border border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Profile Edit Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={studentProfile}
        onSaveProfile={handleSaveProfile}
      />

      {/* In-App Guide & Setup Checklist Modal */}
      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        hasApiKey={hasApiKey}
      />

      {/* Login Screen / Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        reasonMessage={loginReasonMessage}
        onSuccessRedirect={handlePostLoginSuccess}
        onOpenSetupGuide={() => setIsGuideModalOpen(true)}
      />

      {/* Account & Privacy Management Modal */}
      <AccountPrivacyModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onSignOut={() => showToast('Signed out successfully.')}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">SkillSetu AI</span>
            <span aria-hidden="true">·</span>
            <span>“Your Skills. Your Opportunities. Your Future.”</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Polytechnic & Fresh Graduate Placement Platform</span>
            <span aria-hidden="true">·</span>
            <button onClick={() => setIsGuideModalOpen(true)} className="text-blue-600 hover:underline">
              Guide & Firebase Checklist
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={() => setIsAccountModalOpen(true)} className="text-slate-600 hover:underline">
              Privacy & Account
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
