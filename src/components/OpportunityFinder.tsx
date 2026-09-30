import React, { useState, useMemo } from 'react';
import { Opportunity, BranchType, OpportunityType } from '../types';
import { 
  Search, 
  Filter, 
  Bookmark, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  Building2, 
  GraduationCap, 
  AlertTriangle, 
  Check, 
  Plus, 
  Info,
  CheckCircle2,
  FileCheck2,
  PlusCircle,
  X,
  Compass
} from 'lucide-react';

interface OpportunityFinderProps {
  opportunities: Opportunity[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onCheckEligibilityForOpp: (opp: Opportunity) => void;
  onAddToTracker: (opp: Opportunity) => void;
  onAddCustomOpportunity: (opp: Opportunity) => void;
  currentUser: any;
  onOpenLogin: (reason?: string) => void;
}

export const OpportunityFinder: React.FC<OpportunityFinderProps> = ({
  opportunities,
  savedIds,
  onToggleSave,
  onCheckEligibilityForOpp,
  onAddToTracker,
  onAddCustomOpportunity,
  currentUser,
  onOpenLogin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOppDetail, setSelectedOppDetail] = useState<Opportunity | null>(null);

  // New Custom Opportunity Form State
  const [customRole, setCustomRole] = useState('');
  const [customOrg, setCustomOrg] = useState('');
  const [customLoc, setCustomLoc] = useState('');
  const [customQual, setCustomQual] = useState('Diploma in Engineering');
  const [customBranch, setCustomBranch] = useState<BranchType>('Electronics & Communication');
  const [customType, setCustomType] = useState<OpportunityType>('Apprenticeship (NATS)');
  const [customDeadline, setCustomDeadline] = useState('');
  const [customStipend, setCustomStipend] = useState('');
  const [customLink, setCustomLink] = useState('');
  const [customSnippet, setCustomSnippet] = useState('');

  // Extract unique locations
  const availableLocations = useMemo(() => {
    const locs = new Set<string>();
    opportunities.forEach(o => {
      // Extract city or general location
      const firstPart = o.location.split(',')[0].trim();
      locs.add(firstPart);
    });
    return Array.from(locs);
  }, [opportunities]);

  // Filtered opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      // Search matches
      const matchesSearch = 
        opp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.notificationSnippet.toLowerCase().includes(searchTerm.toLowerCase());

      // Branch filter
      const matchesBranch = 
        selectedBranch === 'All' || 
        opp.branches.includes(selectedBranch as BranchType) ||
        opp.branches.includes('All Technical Branches');

      // Type filter
      const matchesType = selectedType === 'All' || opp.type === selectedType;

      // Location filter
      const matchesLoc = 
        selectedLocation === 'All' || 
        opp.location.toLowerCase().includes(selectedLocation.toLowerCase());

      // Saved only
      const matchesSaved = !showSavedOnly || savedIds.includes(opp.id);

      return matchesSearch && matchesBranch && matchesType && matchesLoc && matchesSaved;
    });
  }, [opportunities, searchTerm, selectedBranch, selectedType, selectedLocation, showSavedOnly, savedIds]);

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRole || !customOrg) return;

    const newOpp: Opportunity = {
      id: `custom-${Date.now()}`,
      role: customRole,
      organization: customOrg,
      location: customLoc || 'Open / Location on Notice',
      qualification: customQual,
      branches: [customBranch],
      type: customType,
      deadline: customDeadline || '2026-11-30',
      stipendOrSalary: customStipend || 'As per norms',
      applicationLink: customLink.startsWith('http') ? customLink : `https://${customLink || 'google.com'}`,
      notificationSnippet: customSnippet || 'Entered manually by student from recruitment advertisement or notice board.',
      isSampleData: false,
    };

    onAddCustomOpportunity(newOpp);
    setIsAddModalOpen(false);
    // Reset form
    setCustomRole('');
    setCustomOrg('');
    setCustomLoc('');
    setCustomLink('');
    setCustomSnippet('');
  };

  if (!currentUser) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>Opportunity Radar</span>
            <span aria-hidden="true">·</span>
            <span>Protected Career Access</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Opportunity Finder</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access curated technician apprenticeships, PSU trainee schedules, DET campus drives, and lateral entry programs.
          </p>
        </div>

        {/* Protected Gate Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-slate-800 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

          <div className="relative z-10 max-w-lg mx-auto space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center mx-auto shadow-inner">
              <Compass className="w-7 h-7 text-cyan-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Member Opportunity Access
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                “Sign in to explore opportunities and save your career progress.”
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Create your free student profile with Google to search technical vacancies across ECE, Mechanical, CS/IT, Civil, and Electrical streams, check live eligibility fit, and bookmark opportunities to the cloud.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onOpenLogin('Sign in to explore opportunities and save your career progress.')}
                className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-sm font-bold shadow-md transition-all hover:scale-[1.02]"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              No password entry required. Secure authentication powered by Firebase Auth.
            </p>
          </div>
        </div>

        {/* Teaser Preview of Opportunity Categories */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Opportunities You Unlock After Signing In:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { title: 'NATS Apprenticeships', sub: 'Govt PSUs & Defense Labs (BEL, DRDO, BHEL)', stipend: '₹10,500 – ₹14,000 / mo' },
              { title: 'Diploma Engineer Trainees', sub: 'Automotive & Industrial OEMs (Tata Motors, L&T)', stipend: '₹22,000 – ₹28,000 / mo' },
              { title: 'Lateral Entry B.Tech', sub: 'State Technical University Direct 2nd Year LEET', stipend: 'Degree Pathway' },
            ].map((cat, i) => (
              <div key={i} className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-xs font-bold text-slate-900 block">{cat.title}</span>
                <span className="text-[11px] text-slate-500 block">{cat.sub}</span>
                <span className="text-[11px] text-blue-600 font-semibold block pt-1">{cat.stipend}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Title & Mandatory Sample Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>Opportunity Radar</span>
            <span aria-hidden="true">·</span>
            <span>Polytechnic & Fresh Graduate Placements</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Find Opportunities</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover technician apprenticeships, DET campus recruitments, PSU trainee positions, and lateral entry programs.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Opportunity</span>
        </button>
      </div>

      {/* Mandatory Prominent Transparency Notice */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-950">
            Sample Data — Verify Before Applying
          </p>
          <p className="text-amber-800 leading-relaxed">
            The opportunity listings below illustrate authentic recruitment structures, typical eligibility cutoffs, and official portal paths for diploma engineers. SkillSetu AI does not invent real vacancies or claim these sample listings are live without verification. Always cross-check the official employment notifications published on organization websites (e.g. BEL, Tata Motors, DMRC, NATS portal) or the Employment News gazette before submitting applications.
          </p>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by role, organization (e.g., Tata Motors, BEL, DRDO), or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Saved Toggle Button */}
          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 shrink-0 ${
              showSavedOnly 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-current' : ''}`} />
            <span>Saved Only ({savedIds.length})</span>
          </button>
        </div>

        {/* Filter Dropdowns and Interactive Segmented Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          
          {/* Branch filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Engineering Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              <option value="All">All Branches</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Computer Science & IT">Computer Science & IT</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Mechatronics">Mechatronics</option>
            </select>
          </div>

          {/* Opportunity Type Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Opportunity Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="Apprenticeship (NATS)">Apprenticeship (NATS)</option>
              <option value="Private Industry">Private Industry (DET)</option>
              <option value="PSU Trainee">PSU Trainee</option>
              <option value="Lateral Entry">Lateral Entry (B.Tech LEET)</option>
              <option value="Internship">Industrial Internship</option>
            </select>
          </div>

          {/* Location filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Location / Region
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              <option value="All">All Locations</option>
              {availableLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Results Count & Active Filters Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong className="font-mono text-slate-900">{filteredOpportunities.length}</strong> opportunities
        </span>
        {(selectedBranch !== 'All' || selectedType !== 'All' || selectedLocation !== 'All' || searchTerm || showSavedOnly) && (
          <button
            onClick={() => {
              setSelectedBranch('All');
              setSelectedType('All');
              setSelectedLocation('All');
              setSearchTerm('');
              setShowSavedOnly(false);
            }}
            className="text-blue-600 hover:underline"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Opportunities List Cards */}
      {filteredOpportunities.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200/80 p-8">
          <Filter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No opportunities match your filter criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Try resetting branch or opportunity type filters, or add your own custom recruitment posting found on your college notice board.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setSelectedBranch('All');
                setSelectedType('All');
                setSelectedLocation('All');
                setSearchTerm('');
                setShowSavedOnly(false);
              }}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Add Custom Listing
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOpportunities.map((opp) => {
            const isSaved = savedIds.includes(opp.id);
            return (
              <div
                key={opp.id}
                className="bg-white rounded-xl border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  
                  {/* Top Header: Unboxed metadata and Bookmark */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-800">{opp.organization}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-blue-700 font-medium">{opp.type}</span>
                      {opp.isSampleData && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-medium border border-amber-200/60">
                            Sample Listing
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => onToggleSave(opp.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSaved 
                          ? 'bg-blue-50 text-blue-600 border-blue-200' 
                          : 'text-slate-400 border-slate-200 hover:bg-slate-50 hover:text-slate-700'
                      }`}
                      title={isSaved ? 'Remove from Saved' : 'Save Opportunity'}
                      aria-label="Save opportunity"
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Role Title */}
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {opp.role}
                  </h3>

                  {/* Location & Qualification snippet */}
                  <div className="mt-2 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{opp.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{opp.qualification} ({opp.branches.join(', ')})</span>
                    </div>
                  </div>

                  {/* Brief notification description snippet */}
                  <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                    {opp.notificationSnippet}
                  </p>

                  {/* Compensation & Deadline */}
                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-600">
                    <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                      {opp.stipendOrSalary}
                    </span>
                    <span className="font-mono text-amber-700 flex items-center gap-1 shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>Due: {opp.deadline}</span>
                    </span>
                  </div>

                </div>

                {/* Card Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onCheckEligibilityForOpp(opp)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Check Eligibility</span>
                    </button>

                    <button
                      onClick={() => onAddToTracker(opp)}
                      className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      title="Add to Application Tracker"
                    >
                      + Tracker
                    </button>
                  </div>

                  {/* Apply external link button */}
                  {opp.applicationLink && (
                    <a
                      href={opp.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                    >
                      <span>Official Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add Custom Opportunity Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Add Opportunity</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Found a placement notice on your college board, newspaper, or Telegram? Save it here so you can verify eligibility and track it in your pipeline.
            </p>

            <form onSubmit={handleCreateCustom} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Role Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diploma Engineer Trainee (DET)"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Organization / Company <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bharat Heavy Electricals Ltd (BHEL)"
                  value={customOrg}
                  onChange={(e) => setCustomOrg(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bhopal / Haridwar"
                    value={customLoc}
                    onChange={(e) => setCustomLoc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Type
                  </label>
                  <select
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value as OpportunityType)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    <option value="Apprenticeship (NATS)">Apprenticeship (NATS)</option>
                    <option value="Private Industry">Private Industry (DET)</option>
                    <option value="PSU Trainee">PSU Trainee</option>
                    <option value="Lateral Entry">Lateral Entry (B.Tech)</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Target Branch
                  </label>
                  <select
                    value={customBranch}
                    onChange={(e) => setCustomBranch(e.target.value as BranchType)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Computer Science & IT">Computer Science & IT</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Mechatronics">Mechatronics</option>
                    <option value="All Technical Branches">All Technical Branches</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={customDeadline}
                    onChange={(e) => setCustomDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Stipend / Expected Salary
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹15,000/month"
                    value={customStipend}
                    onChange={(e) => setCustomStipend(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Official Website / Link
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. https://company.com/apply"
                    value={customLink}
                    onChange={(e) => setCustomLink(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Key Requirements / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 60% aggregate required, 2026 passout batch only, written test in campus."
                  value={customSnippet}
                  onChange={(e) => setCustomSnippet(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Save Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
