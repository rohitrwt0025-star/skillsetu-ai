import React, { useState, useMemo } from 'react';
import { 
  StudentProfile, 
  EligibilityCriteria, 
  EligibilityResult, 
  CriteriaCheckItem, 
  BranchType, 
  Opportunity,
  ApplicationEntry
} from '../types';
import { ELIGIBILITY_PRESETS } from '../data/eligibilityPresets';
import { 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  HelpCircle,
  PlusCircle,
  Copy,
  ChevronDown
} from 'lucide-react';

interface EligibilityCheckerProps {
  studentProfile: StudentProfile;
  initialOpportunity?: Opportunity | null;
  onAddToTracker: (role: string, organization: string, location: string, type: any) => void;
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({
  studentProfile,
  initialOpportunity,
  onAddToTracker,
}) => {
  // Preset selector
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(Boolean(initialOpportunity));

  // Profile Form state (initialized with student profile)
  const [userQualification, setUserQualification] = useState(studentProfile.qualification);
  const [userBranch, setUserBranch] = useState<BranchType>(studentProfile.branch);
  const [userPercentage, setUserPercentage] = useState<number>(studentProfile.percentageOrCgpa);
  const [userGradYear, setUserGradYear] = useState<number>(studentProfile.graduationYear);
  const [userActiveBacklogs, setUserActiveBacklogs] = useState<number>(studentProfile.activeBacklogs);
  const [userAge, setUserAge] = useState<number>(21);
  const [userCategory, setUserCategory] = useState(studentProfile.category);

  // Criteria Form state (either from initialOpportunity, preset, or user custom input)
  const [criteriaRole, setCriteriaRole] = useState(
    initialOpportunity ? initialOpportunity.role : ELIGIBILITY_PRESETS[0].roleTitle
  );
  const [criteriaOrg, setCriteriaOrg] = useState(
    initialOpportunity ? initialOpportunity.organization : ELIGIBILITY_PRESETS[0].organization
  );
  const [criteriaMinQual, setCriteriaMinQual] = useState(
    initialOpportunity ? 'Diploma' : ELIGIBILITY_PRESETS[0].minQualification
  );
  const [criteriaBranches, setCriteriaBranches] = useState<BranchType[]>(
    initialOpportunity ? initialOpportunity.branches : ELIGIBILITY_PRESETS[0].allowedBranches
  );
  const [criteriaMinPercentage, setCriteriaMinPercentage] = useState<number>(
    initialOpportunity?.minPercentage ?? ELIGIBILITY_PRESETS[0].minPercentage
  );
  const [criteriaMaxAge, setCriteriaMaxAge] = useState<number>(
    initialOpportunity?.maxAge ?? ELIGIBILITY_PRESETS[0].maxAgeLimit
  );
  const [criteriaGradYears, setCriteriaGradYears] = useState<number[]>(
    initialOpportunity?.passingYearAllowed ?? ELIGIBILITY_PRESETS[0].allowedGraduationYears
  );
  const [criteriaMaxBacklogs, setCriteriaMaxBacklogs] = useState<number>(
    ELIGIBILITY_PRESETS[0].maxBacklogsAllowed
  );
  const [criteriaNotes, setCriteriaNotes] = useState<string>(
    initialOpportunity?.notificationSnippet ?? ELIGIBILITY_PRESETS[0].additionalCriteria
  );

  // When preset is selected
  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    setIsCustomMode(false);
    const p = ELIGIBILITY_PRESETS[idx];
    setCriteriaRole(p.roleTitle);
    setCriteriaOrg(p.organization);
    setCriteriaMinQual(p.minQualification);
    setCriteriaBranches(p.allowedBranches);
    setCriteriaMinPercentage(p.minPercentage);
    setCriteriaMaxAge(p.maxAgeLimit);
    setCriteriaGradYears(p.allowedGraduationYears);
    setCriteriaMaxBacklogs(p.maxBacklogsAllowed);
    setCriteriaNotes(p.additionalCriteria);
  };

  // Perform rigorous comparison
  const analysisResult = useMemo<EligibilityResult>(() => {
    const items: CriteriaCheckItem[] = [];
    const recommendations: string[] = [];

    // 1. Qualification Check
    const qualMatch = criteriaMinQual === 'Any Technical' || criteriaMinQual === userQualification;
    items.push({
      criterion: 'Educational Qualification',
      requirement: `Minimum ${criteriaMinQual} in Engineering`,
      userStatus: `${userQualification} Holder`,
      status: qualMatch ? 'match' : 'mismatch',
      explanation: qualMatch 
        ? `Your degree (${userQualification}) satisfies the minimum academic qualification criterion.`
        : `Notification mandates ${criteriaMinQual}, while your current recorded qualification is ${userQualification}. Check for equivalency clauses.`
    });

    // 2. Branch Check
    const branchMatch = 
      criteriaBranches.includes('All Technical Branches') || 
      criteriaBranches.includes(userBranch);
    items.push({
      criterion: 'Eligible Branch / Discipline',
      requirement: criteriaBranches.join(' / '),
      userStatus: userBranch,
      status: branchMatch ? 'match' : 'mismatch',
      explanation: branchMatch
        ? `Your branch (${userBranch}) is explicitly included in the advertised disciplines.`
        : `Your branch (${userBranch}) is not listed in the standard eligibility schedule. Review if your State Board syllabus maps to an allied branch.`
    });

    // 3. Minimum Percentage Check
    const marksDelta = userPercentage - criteriaMinPercentage;
    let marksStatus: 'match' | 'mismatch' | 'needs_verification' = 'match';
    let marksExpl = '';

    if (marksDelta >= 0) {
      marksStatus = 'match';
      marksExpl = `Your score of ${userPercentage}% meets or exceeds the required cutoff of ${criteriaMinPercentage}%.`;
    } else if (marksDelta >= -2.0) {
      marksStatus = 'needs_verification';
      marksExpl = `Your score of ${userPercentage}% is marginally below ${criteriaMinPercentage}%. Check notification rules regarding rounding of decimals or category relaxation.`;
      recommendations.push('Check notification rules on whether 59.5%+ is considered 60% or strictly excluded.');
    } else {
      marksStatus = 'mismatch';
      marksExpl = `Your score of ${userPercentage}% is below the mandatory minimum cutoff of ${criteriaMinPercentage}%.`;
    }

    items.push({
      criterion: 'Aggregate Marks / Cutoff',
      requirement: `Minimum ${criteriaMinPercentage}% (Aggregate)`,
      userStatus: `${userPercentage}% Aggregate`,
      status: marksStatus,
      explanation: marksExpl
    });

    // 4. Passing Year Check
    const yearMatch = criteriaGradYears.includes(userGradYear);
    items.push({
      criterion: 'Year of Graduation',
      requirement: `Batch ${criteriaGradYears.join(', ')}`,
      userStatus: `${userGradYear} Passing Out`,
      status: yearMatch ? 'match' : 'mismatch',
      explanation: yearMatch
        ? `Your cohort year (${userGradYear}) falls within the eligible recruitment window.`
        : `Recruitment is restricted to ${criteriaGradYears.join(', ')} batches. Passing out in ${userGradYear} may not be eligible unless extension corrigendum exists.`
    });

    // 5. Backlogs Check
    let backlogStatus: 'match' | 'mismatch' | 'needs_verification' = 'match';
    let backlogExpl = '';

    if (userActiveBacklogs === 0) {
      backlogStatus = 'match';
      backlogExpl = 'You have zero active backlogs, satisfying the all-clear requirement.';
    } else if (userActiveBacklogs <= criteriaMaxBacklogs) {
      backlogStatus = 'needs_verification';
      backlogExpl = `You have ${userActiveBacklogs} active backlog(s). Allowed is ${criteriaMaxBacklogs}, but you must clear all papers before final document verification.`;
      recommendations.push(`Ensure backlogs are cleared and final marks cards are produced by the joining date.`);
    } else {
      backlogStatus = 'mismatch';
      backlogExpl = `You have ${userActiveBacklogs} active backlogs, exceeding the allowed threshold of ${criteriaMaxBacklogs}.`;
    }

    items.push({
      criterion: 'Backlog Status',
      requirement: criteriaMaxBacklogs === 0 ? 'Zero Active Backlogs (All Clear)' : `Max ${criteriaMaxBacklogs} Active Backlog`,
      userStatus: `${userActiveBacklogs} Active Backlogs`,
      status: backlogStatus,
      explanation: backlogExpl
    });

    // 6. Age Check
    let ageStatus: 'match' | 'mismatch' | 'needs_verification' = 'match';
    let ageExpl = '';

    if (userAge <= criteriaMaxAge) {
      ageStatus = 'match';
      ageExpl = `Your age of ${userAge} years is within the maximum limit of ${criteriaMaxAge} years.`;
    } else {
      if (userCategory === 'OBC') {
        const relaxedMax = criteriaMaxAge + 3;
        if (userAge <= relaxedMax) {
          ageStatus = 'needs_verification';
          ageExpl = `Age is ${userAge} (limit ${criteriaMaxAge}). As an OBC candidate, you may qualify under the 3-year statutory government age relaxation upon producing a valid Non-Creamy Layer certificate.`;
          recommendations.push('Prepare recent central/state OBC Non-Creamy Layer (NCL) certificate.');
        } else {
          ageStatus = 'mismatch';
          ageExpl = `Age of ${userAge} exceeds the relaxed upper limit of ${relaxedMax} for OBC.`;
        }
      } else if (userCategory === 'SC' || userCategory === 'ST') {
        const relaxedMax = criteriaMaxAge + 5;
        if (userAge <= relaxedMax) {
          ageStatus = 'needs_verification';
          ageExpl = `Age is ${userAge} (limit ${criteriaMaxAge}). As an ${userCategory} candidate, you may qualify under the 5-year statutory relaxation.`;
          recommendations.push(`Ensure ${userCategory} caste certificate is in the prescribed central format.`);
        } else {
          ageStatus = 'mismatch';
          ageExpl = `Age of ${userAge} exceeds the relaxed upper limit of ${relaxedMax} for ${userCategory}.`;
        }
      } else {
        ageStatus = 'mismatch';
        ageExpl = `Your age of ${userAge} years exceeds the maximum limit of ${criteriaMaxAge} years.`;
      }
    }

    items.push({
      criterion: 'Age Limit Criterion',
      requirement: `Maximum ${criteriaMaxAge} Years (${userCategory !== 'General' ? 'Relaxations applicable' : 'General cutoff'})`,
      userStatus: `${userAge} Years Old (${userCategory})`,
      status: ageStatus,
      explanation: ageExpl
    });

    // Overall calculations
    const matchCount = items.filter(i => i.status === 'match').length;
    const verifyCount = items.filter(i => i.status === 'needs_verification').length;
    const mismatchCount = items.filter(i => i.status === 'mismatch').length;

    let overallStatus: 'Eligible' | 'Not Eligible' | 'Conditional / Needs Verification' = 'Eligible';
    if (mismatchCount > 0) {
      overallStatus = 'Not Eligible';
    } else if (verifyCount > 0) {
      overallStatus = 'Conditional / Needs Verification';
    }

    const matchPercentage = Math.round(((matchCount + (verifyCount * 0.5)) / items.length) * 100);

    return {
      overallStatus,
      matchPercentage,
      items,
      officialDisclaimer: 'This result is an automated informational guide based on user inputs. The official recruitment notification, gazette advertisement, and any corrigenda published by the recruiting organization remain the sole authoritative source of truth. Always confirm requirements directly before applying.',
      recommendations
    };
  }, [
    userQualification, userBranch, userPercentage, userGradYear, userActiveBacklogs, userAge, userCategory,
    criteriaMinQual, criteriaBranches, criteriaMinPercentage, criteriaMaxAge, criteriaGradYears, criteriaMaxBacklogs
  ]);

  const handleApplyToTracker = () => {
    onAddToTracker(
      criteriaRole,
      criteriaOrg,
      'Recruitment Portal',
      'Apprenticeship (NATS)'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          <span>Eligibility Verification Engine</span>
          <span aria-hidden="true">·</span>
          <span>Rules & Notification Analyzer</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Eligibility Checker</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Cross-examine your educational profile against recruitment notification requirements before investing time and application fees.
        </p>
      </div>

      {/* Preset Fast Selector */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-2">
        <label className="block text-xs font-bold text-slate-800">
          Load Notification Criteria Preset:
        </label>
        <div className="flex flex-wrap gap-2">
          {ELIGIBILITY_PRESETS.map((preset, idx) => (
            <button
              key={preset.roleTitle}
              onClick={() => handleSelectPreset(idx)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                !isCustomMode && selectedPresetIndex === idx
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {preset.roleTitle.split('(')[0]} · {preset.organization.split(' ')[0]}
            </button>
          ))}
          <button
            onClick={() => setIsCustomMode(true)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              isCustomMode
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            + Custom Notification Input
          </button>
        </div>
      </div>

      {/* Two Column Grid: Left Student Profile, Right Job Posting Criteria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Your Academic Profile */}
        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Your Candidate Profile
            </h3>
            <span className="text-[11px] text-slate-400">Synced with your details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Qualification</label>
              <select
                value={userQualification}
                onChange={(e) => setUserQualification(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                <option value="Diploma">Diploma in Engineering</option>
                <option value="B.Tech/BE">B.Tech / BE</option>
                <option value="ITI">ITI</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Branch</label>
              <select
                value={userBranch}
                onChange={(e) => setUserBranch(e.target.value as BranchType)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Computer Science & IT">Computer Science & IT</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Mechatronics">Mechatronics</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Aggregate Score (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="35"
                max="100"
                value={userPercentage}
                onChange={(e) => setUserPercentage(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Passing Year
              </label>
              <select
                value={userGradYear}
                onChange={(e) => setUserGradYear(parseInt(e.target.value, 10))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                <option value="2027">2027 (Pre-Final Year)</option>
                <option value="2026">2026 (Final Year / Fresh)</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Active Backlogs
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={userActiveBacklogs}
                onChange={(e) => setUserActiveBacklogs(parseInt(e.target.value, 10) || 0)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Candidate Age
              </label>
              <input
                type="number"
                min="16"
                max="45"
                value={userAge}
                onChange={(e) => setUserAge(parseInt(e.target.value, 10) || 18)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">
                Category (For Statutory Age & Fee Relaxation)
              </label>
              <div className="flex gap-2">
                {(['General', 'OBC', 'SC', 'ST', 'EWS'] as const).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setUserCategory(cat)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      userCategory === cat
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recruitment Notification Criteria */}
        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-600" />
              Recruitment Notification Criteria
            </h3>
            <span className="text-[11px] text-slate-400">
              {isCustomMode ? 'Custom Entry' : 'Loaded from Official Template'}
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Target Role</label>
                <input
                  type="text"
                  value={criteriaRole}
                  onChange={(e) => {
                    setCriteriaRole(e.target.value);
                    setIsCustomMode(true);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Organization</label>
                <input
                  type="text"
                  value={criteriaOrg}
                  onChange={(e) => {
                    setCriteriaOrg(e.target.value);
                    setIsCustomMode(true);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Min Marks (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={criteriaMinPercentage}
                  onChange={(e) => {
                    setCriteriaMinPercentage(parseFloat(e.target.value) || 50);
                    setIsCustomMode(true);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Max Age (Gen)</label>
                <input
                  type="number"
                  value={criteriaMaxAge}
                  onChange={(e) => {
                    setCriteriaMaxAge(parseInt(e.target.value, 10) || 25);
                    setIsCustomMode(true);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Max Backlogs</label>
                <input
                  type="number"
                  value={criteriaMaxBacklogs}
                  onChange={(e) => {
                    setCriteriaMaxBacklogs(parseInt(e.target.value, 10) || 0);
                    setIsCustomMode(true);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Notification Clauses / Special Conditions
              </label>
              <textarea
                rows={2}
                value={criteriaNotes}
                onChange={(e) => {
                  setCriteriaNotes(e.target.value);
                  setIsCustomMode(true);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Analysis Result Banner */}
      <div className={`p-5 rounded-xl border shadow-xs transition-colors ${
        analysisResult.overallStatus === 'Eligible'
          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
          : analysisResult.overallStatus === 'Conditional / Needs Verification'
          ? 'bg-amber-50/80 border-amber-200 text-amber-950'
          : 'bg-rose-50/80 border-rose-200 text-rose-950'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            {analysisResult.overallStatus === 'Eligible' ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : analysisResult.overallStatus === 'Conditional / Needs Verification' ? (
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">
                  {analysisResult.overallStatus === 'Eligible'
                    ? 'Likely Eligible to Apply'
                    : analysisResult.overallStatus === 'Conditional / Needs Verification'
                    ? 'Conditional Match — Verification Advised'
                    : 'Does Not Appear Eligible under Standard Criteria'}
                </h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-current">
                  {analysisResult.matchPercentage}% Alignment
                </span>
              </div>
              <p className="text-xs opacity-90 mt-1">
                Comparing for <strong>{criteriaRole}</strong> at <strong>{criteriaOrg}</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={handleApplyToTracker}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs shrink-0 self-start sm:self-center"
          >
            + Add to Application Tracker
          </button>
        </div>
      </div>

      {/* Criteria Breakdown Table / Cards */}
      <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Clause-by-Clause Criteria Evaluation
        </h3>

        <div className="divide-y divide-slate-100">
          {analysisResult.items.map((item, idx) => {
            const isMatch = item.status === 'match';
            const isVerify = item.status === 'needs_verification';
            return (
              <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="space-y-1 md:max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{item.criterion}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isMatch
                        ? 'bg-emerald-100 text-emerald-800'
                        : isVerify
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isMatch ? 'Matches' : isVerify ? 'Check Clause' : 'Mismatch'}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs shrink-0 bg-slate-50 p-2.5 rounded-lg border border-slate-100 md:w-80">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Notification Requirement</span>
                    <span className="font-semibold text-slate-800">{item.requirement}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Your Profile Value</span>
                    <span className="font-semibold text-slate-800">{item.userStatus}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Authoritative Notice Box */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-800">
            Authoritative Notice & Compliance Guidance
          </p>
          <p className="leading-relaxed">
            {analysisResult.officialDisclaimer}
          </p>
        </div>
      </div>

    </div>
  );
};
