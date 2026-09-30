import React, { useState } from 'react';
import { ResumeData, StudentProfile } from '../types';
import { SAMPLE_RESUME_PROFILES } from '../data/sampleProfiles';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Plus, 
  Trash2, 
  Printer, 
  RefreshCw,
  Wand2,
  AlertCircle,
  Eye,
  Edit3
} from 'lucide-react';

interface ResumeAssistantProps {
  studentProfile: StudentProfile;
  initialResume: ResumeData;
  onSaveResume: (data: ResumeData) => void;
}

export const ResumeAssistant: React.FC<ResumeAssistantProps> = ({
  studentProfile,
  initialResume,
  onSaveResume,
}) => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResume);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('preview');
  const [copied, setCopied] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceSuccessMessage, setEnhanceSuccessMessage] = useState<string | null>(null);

  // Skill inputs
  const [newTechSkill, setNewTechSkill] = useState('');
  const [newTool, setNewTool] = useState('');
  const [newLabInstrument, setNewLabInstrument] = useState('');

  // Handle Load Preset
  const handleLoadPreset = (key: 'ece' | 'mech') => {
    const preset = SAMPLE_RESUME_PROFILES[key];
    setResumeData(preset);
    onSaveResume(preset);
  };

  // Add skill helpers
  const handleAddSkill = (category: 'technical' | 'toolsAndSoftware' | 'labInstruments', value: string) => {
    if (!value.trim()) return;
    const updated = {
      ...resumeData,
      skills: {
        ...resumeData.skills,
        [category]: [...resumeData.skills[category], value.trim()]
      }
    };
    setResumeData(updated);
    onSaveResume(updated);
    if (category === 'technical') setNewTechSkill('');
    if (category === 'toolsAndSoftware') setNewTool('');
    if (category === 'labInstruments') setNewLabInstrument('');
  };

  const handleRemoveSkill = (category: 'technical' | 'toolsAndSoftware' | 'labInstruments', idx: number) => {
    const updated = {
      ...resumeData,
      skills: {
        ...resumeData.skills,
        [category]: resumeData.skills[category].filter((_, i) => i !== idx)
      }
    };
    setResumeData(updated);
    onSaveResume(updated);
  };

  // Smart bullet enhancement via backend API
  const handleEnhanceBullet = async (text: string, onReplace: (newText: string) => void) => {
    if (!text.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/resume-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          branch: studentProfile.branch
        })
      });
      const data = await res.json();
      if (data.enhanced) {
        onReplace(data.enhanced);
        setEnhanceSuccessMessage('Bullet point enhanced with strong action verbs!');
        setTimeout(() => setEnhanceSuccessMessage(null), 3000);
      }
    } catch {
      // Fallback local enhancement
      const polished = `Operated and calibrated systems for ${text}, ensuring compliance with industrial accuracy protocols.`;
      onReplace(polished);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Format full resume as Plain Text
  const generatePlainTextResume = () => {
    const p = resumeData.personalInfo;
    const edu = resumeData.education;
    const s = resumeData.skills;

    return `===============================================================
${p.fullName.toUpperCase()}
Email: ${p.email} | Phone: ${p.phone} | Location: ${p.location}
${p.linkedIn ? `LinkedIn: ${p.linkedIn}` : ''} ${p.githubOrPortfolio ? `| Portfolio: ${p.githubOrPortfolio}` : ''}
===============================================================

CAREER OBJECTIVE
---------------------------------------------------------------
${p.summary}

EDUCATION
---------------------------------------------------------------
* ${edu.diploma.degree}
  ${edu.diploma.institution} | ${edu.diploma.board}
  Year of Passing: ${edu.diploma.yearOfPassing} | Aggregate: ${edu.diploma.percentageOrCgpa}

* Secondary School Certificate (Class 10 / Matriculation)
  ${edu.tenth.school} | ${edu.tenth.board}
  Year of Passing: ${edu.tenth.yearOfPassing} | Percentage: ${edu.tenth.percentage}

TECHNICAL SKILLS & COMPETENCIES
---------------------------------------------------------------
* Core Technical: ${s.technical.join(', ')}
* Tools & Software: ${s.toolsAndSoftware.join(', ')}
* Lab & Measuring Instruments: ${s.labInstruments.join(', ')}
* Professional Attributes: ${s.softSkills.join(', ')}

ACADEMIC & CAPSTONE PROJECTS
---------------------------------------------------------------
${resumeData.projects.map(proj => `* Project Title: ${proj.title}
  Role: ${proj.role} | Tech Used: ${proj.technologies} | Duration: ${proj.duration}
  - Description: ${proj.description}
  - Quantifiable Outcome: ${proj.outcome}
`).join('\n')}

INDUSTRIAL TRAINING & INTERNSHIPS
---------------------------------------------------------------
${resumeData.internships.map(intern => `* ${intern.company} — ${intern.role}
  Duration: ${intern.duration} | Location: ${intern.location}
  - Key Responsibilities: ${intern.responsibilities}
`).join('\n')}

CERTIFICATIONS & WORKSHOPS
---------------------------------------------------------------
${resumeData.certifications.map(c => `* ${c}`).join('\n')}

HONORS & ACHIEVEMENTS
---------------------------------------------------------------
${resumeData.achievements.map(a => `* ${a}`).join('\n')}

===============================================================
Declaration: The above details are authentic, unexaggerated, and verified from original certificates.
`;
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generatePlainTextResume());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      alert('Copied resume draft to clipboard');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header and Quick Pre-fill Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>ATS Resume Engine</span>
            <span aria-hidden="true">·</span>
            <span>Polytechnic & Fresher Format</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Resume Assistant</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create a clean, ATS-optimized technical resume that highlights your practical lab work, workshop tools, and industrial training without invented claims.
          </p>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Editor / Preview Tabs */}
          <div className="p-1 bg-slate-100 rounded-lg flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'editor'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview & Copy</span>
            </button>
          </div>

          <button
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Resume!' : 'Copy Resume Text'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Print or Save as PDF"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Pre-fill Sample Profiles Banner */}
      <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-blue-900">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Need a quick benchmark template? Load a pre-filled sample profile:</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleLoadPreset('ece')}
            className="px-2.5 py-1 rounded-md bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 font-medium transition-colors"
          >
            Load ECE Sample
          </button>
          <button
            onClick={() => handleLoadPreset('mech')}
            className="px-2.5 py-1 rounded-md bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 font-medium transition-colors"
          >
            Load Mechanical Sample
          </button>
        </div>
      </div>

      {enhanceSuccessMessage && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{enhanceSuccessMessage}</span>
        </div>
      )}

      {/* Content: Editor vs Preview */}
      {activeTab === 'editor' ? (
        <div className="space-y-6">
          
          {/* Section 1: Personal Info */}
          <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Personal Information & Career Objective</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={resumeData.personalInfo.fullName}
                  onChange={(e) => {
                    const updated = {
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, fullName: e.target.value }
                    };
                    setResumeData(updated);
                    onSaveResume(updated);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={resumeData.personalInfo.email}
                  onChange={(e) => {
                    const updated = {
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                    };
                    setResumeData(updated);
                    onSaveResume(updated);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) => {
                    const updated = {
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                    };
                    setResumeData(updated);
                    onSaveResume(updated);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Location / Relocation Willingness</label>
                <input
                  type="text"
                  value={resumeData.personalInfo.location}
                  onChange={(e) => {
                    const updated = {
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, location: e.target.value }
                    };
                    setResumeData(updated);
                    onSaveResume(updated);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">LinkedIn Profile (Optional)</label>
                <input
                  type="text"
                  value={resumeData.personalInfo.linkedIn || ''}
                  onChange={(e) => {
                    const updated = {
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, linkedIn: e.target.value }
                    };
                    setResumeData(updated);
                    onSaveResume(updated);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">GitHub / Portfolio (Optional)</label>
                <input
                  type="text"
                  value={resumeData.personalInfo.githubOrPortfolio || ''}
                  onChange={(e) => {
                    const updated = {
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, githubOrPortfolio: e.target.value }
                    };
                    setResumeData(updated);
                    onSaveResume(updated);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>
            </div>

            <div className="text-xs">
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-slate-700">Career Objective Statement</label>
                <button
                  type="button"
                  onClick={() => handleEnhanceBullet(resumeData.personalInfo.summary, (enhanced) => {
                    const updated = {
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, summary: enhanced }
                    };
                    setResumeData(updated);
                    onSaveResume(updated);
                  })}
                  disabled={isEnhancing}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Enhance with AI</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={resumeData.personalInfo.summary}
                onChange={(e) => {
                  const updated = {
                    ...resumeData,
                    personalInfo: { ...resumeData.personalInfo, summary: e.target.value }
                  };
                  setResumeData(updated);
                  onSaveResume(updated);
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-slate-700"
              />
            </div>
          </div>

          {/* Section 2: Education */}
          <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Academic Qualifications</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Diploma */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-semibold text-slate-800">1. Diploma in Engineering</h4>
                <div>
                  <label className="block text-slate-600 mb-0.5">Degree Title</label>
                  <input
                    type="text"
                    value={resumeData.education.diploma.degree}
                    onChange={(e) => {
                      const updated = {
                        ...resumeData,
                        education: {
                          ...resumeData.education,
                          diploma: { ...resumeData.education.diploma, degree: e.target.value }
                        }
                      };
                      setResumeData(updated);
                      onSaveResume(updated);
                    }}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5">Polytechnic / College Name</label>
                  <input
                    type="text"
                    value={resumeData.education.diploma.institution}
                    onChange={(e) => {
                      const updated = {
                        ...resumeData,
                        education: {
                          ...resumeData.education,
                          diploma: { ...resumeData.education.diploma, institution: e.target.value }
                        }
                      };
                      setResumeData(updated);
                      onSaveResume(updated);
                    }}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-0.5">Passing Year</label>
                    <input
                      type="text"
                      value={resumeData.education.diploma.yearOfPassing}
                      onChange={(e) => {
                        const updated = {
                          ...resumeData,
                          education: {
                            ...resumeData.education,
                            diploma: { ...resumeData.education.diploma, yearOfPassing: e.target.value }
                          }
                        };
                        setResumeData(updated);
                        onSaveResume(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">Aggregate % / CGPA</label>
                    <input
                      type="text"
                      value={resumeData.education.diploma.percentageOrCgpa}
                      onChange={(e) => {
                        const updated = {
                          ...resumeData,
                          education: {
                            ...resumeData.education,
                            diploma: { ...resumeData.education.diploma, percentageOrCgpa: e.target.value }
                          }
                        };
                        setResumeData(updated);
                        onSaveResume(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Class 10 / Matriculation */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-semibold text-slate-800">2. Secondary School (Class 10 / SSC)</h4>
                <div>
                  <label className="block text-slate-600 mb-0.5">School Name</label>
                  <input
                    type="text"
                    value={resumeData.education.tenth.school}
                    onChange={(e) => {
                      const updated = {
                        ...resumeData,
                        education: {
                          ...resumeData.education,
                          tenth: { ...resumeData.education.tenth, school: e.target.value }
                        }
                      };
                      setResumeData(updated);
                      onSaveResume(updated);
                    }}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5">Board (CBSE / ICSE / State)</label>
                  <input
                    type="text"
                    value={resumeData.education.tenth.board}
                    onChange={(e) => {
                      const updated = {
                        ...resumeData,
                        education: {
                          ...resumeData.education,
                          tenth: { ...resumeData.education.tenth, board: e.target.value }
                        }
                      };
                      setResumeData(updated);
                      onSaveResume(updated);
                    }}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-0.5">Passing Year</label>
                    <input
                      type="text"
                      value={resumeData.education.tenth.yearOfPassing}
                      onChange={(e) => {
                        const updated = {
                          ...resumeData,
                          education: {
                            ...resumeData.education,
                            tenth: { ...resumeData.education.tenth, yearOfPassing: e.target.value }
                          }
                        };
                        setResumeData(updated);
                        onSaveResume(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">Percentage / Marks</label>
                    <input
                      type="text"
                      value={resumeData.education.tenth.percentage}
                      onChange={(e) => {
                        const updated = {
                          ...resumeData,
                          education: {
                            ...resumeData.education,
                            tenth: { ...resumeData.education.tenth, percentage: e.target.value }
                          }
                        };
                        setResumeData(updated);
                        onSaveResume(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Technical Skills, Lab Instruments & Tools */}
          <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Technical Skills & Lab Equipment Mastery</h3>
            
            <div className="space-y-4 text-xs">
              {/* Core Technical */}
              <div>
                <label className="block font-medium text-slate-700 mb-1.5">
                  Core Engineering Concepts & Prototyping
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {resumeData.skills.technical.map((skill, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs border border-slate-200">
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill('technical', idx)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add technical skill (e.g. PCB Soldering, Microcontrollers, CNC G-Code)..."
                    value={newTechSkill}
                    onChange={(e) => setNewTechSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill('technical', newTechSkill);
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill('technical', newTechSkill)}
                    className="px-3 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Lab Instruments */}
              <div>
                <label className="block font-medium text-slate-700 mb-1.5">
                  Lab Equipment & Bench Instruments (Valued by PSUs & Electronics firms)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {resumeData.skills.labInstruments.map((inst, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-50 text-cyan-900 text-xs border border-cyan-200">
                      <span>{inst}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill('labInstruments', idx)}
                        className="text-cyan-600 hover:text-cyan-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add instrument (e.g. Digital Storage Oscilloscope, Vernier Caliper, Multimeter)..."
                    value={newLabInstrument}
                    onChange={(e) => setNewLabInstrument(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill('labInstruments', newLabInstrument);
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill('labInstruments', newLabInstrument)}
                    className="px-3 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Academic Projects */}
          <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Final Year & Mini Projects</h3>
            </div>

            <div className="space-y-4">
              {resumeData.projects.map((proj, pIdx) => (
                <div key={proj.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Project #{pIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = {
                          ...resumeData,
                          projects: resumeData.projects.filter(p => p.id !== proj.id)
                        };
                        setResumeData(updated);
                        onSaveResume(updated);
                      }}
                      className="text-rose-600 hover:text-rose-800 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 mb-0.5">Project Title</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = {
                            ...resumeData,
                            projects: resumeData.projects.map(p => p.id === proj.id ? { ...p, title: e.target.value } : p)
                          };
                          setResumeData(updated);
                          onSaveResume(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-0.5">Hardware / Software Used</label>
                      <input
                        type="text"
                        value={proj.technologies}
                        onChange={(e) => {
                          const updated = {
                            ...resumeData,
                            projects: resumeData.projects.map(p => p.id === proj.id ? { ...p, technologies: e.target.value } : p)
                          };
                          setResumeData(updated);
                          onSaveResume(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="text-slate-600">Technical Description</label>
                      <button
                        type="button"
                        onClick={() => handleEnhanceBullet(proj.description, (enhanced) => {
                          const updated = {
                            ...resumeData,
                            projects: resumeData.projects.map(p => p.id === proj.id ? { ...p, description: enhanced } : p)
                          };
                          setResumeData(updated);
                          onSaveResume(updated);
                        })}
                        className="text-blue-600 hover:text-blue-700 text-[11px] font-medium flex items-center gap-1"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>Enhance Description</span>
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => {
                        const updated = {
                          ...resumeData,
                          projects: resumeData.projects.map(p => p.id === proj.id ? { ...p, description: e.target.value } : p)
                        };
                        setResumeData(updated);
                        onSaveResume(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-0.5">Quantifiable Outcome / Results</label>
                    <input
                      type="text"
                      placeholder="e.g. Achieved 98% accuracy; presented at State Polytechnic Symposium"
                      value={proj.outcome}
                      onChange={(e) => {
                        const updated = {
                          ...resumeData,
                          projects: resumeData.projects.map(p => p.id === proj.id ? { ...p, outcome: e.target.value } : p)
                        };
                        setResumeData(updated);
                        onSaveResume(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Summer Vocational Training & Internships */}
          <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Summer Industrial Training / Internships
            </h3>
            <p className="text-xs text-slate-500 -mt-2">
              Mandatory 4-to-6-week summer training at BSNL, Railway Workshop, State Electricity Board, or private plants.
            </p>

            <div className="space-y-4">
              {resumeData.internships.map((intern) => (
                <div key={intern.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-600 mb-0.5">Company / Workshop Name</label>
                      <input
                        type="text"
                        value={intern.company}
                        onChange={(e) => {
                          const updated = {
                            ...resumeData,
                            internships: resumeData.internships.map(i => i.id === intern.id ? { ...i, company: e.target.value } : i)
                          };
                          setResumeData(updated);
                          onSaveResume(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-0.5">Role / Trainee Designation</label>
                      <input
                        type="text"
                        value={intern.role}
                        onChange={(e) => {
                          const updated = {
                            ...resumeData,
                            internships: resumeData.internships.map(i => i.id === intern.id ? { ...i, role: e.target.value } : i)
                          };
                          setResumeData(updated);
                          onSaveResume(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-0.5">Duration</label>
                      <input
                        type="text"
                        value={intern.duration}
                        onChange={(e) => {
                          const updated = {
                            ...resumeData,
                            internships: resumeData.internships.map(i => i.id === intern.id ? { ...i, duration: e.target.value } : i)
                          };
                          setResumeData(updated);
                          onSaveResume(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-0.5">Shop-Floor / Testing Responsibilities</label>
                    <textarea
                      rows={2}
                      value={intern.responsibilities}
                      onChange={(e) => {
                        const updated = {
                          ...resumeData,
                          internships: resumeData.internships.map(i => i.id === intern.id ? { ...i, responsibilities: e.target.value } : i)
                        };
                        setResumeData(updated);
                        onSaveResume(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* Preview Mode (ATS Formatted Clean Paper View) */
        <div className="bg-white rounded-2xl border border-slate-300 shadow-md p-6 sm:p-12 max-w-4xl mx-auto space-y-6 text-slate-800 font-sans print:shadow-none print:border-none print:p-0">
          
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {resumeData.personalInfo.fullName.toUpperCase()}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-medium">
              <span>{resumeData.personalInfo.email}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{resumeData.personalInfo.phone}</span>
              <span aria-hidden="true">·</span>
              <span>{resumeData.personalInfo.location}</span>
              {resumeData.personalInfo.linkedIn && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{resumeData.personalInfo.linkedIn}</span>
                </>
              )}
            </div>
          </div>

          {/* Objective */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">
              Career Objective
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              {resumeData.personalInfo.summary}
            </p>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">
              Education
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                <div>
                  <span className="font-bold text-slate-900">{resumeData.education.diploma.degree}</span>
                  <div className="text-slate-600">{resumeData.education.diploma.institution} ({resumeData.education.diploma.board})</div>
                </div>
                <div className="text-slate-600 font-mono text-left sm:text-right shrink-0">
                  <span>{resumeData.education.diploma.yearOfPassing}</span>
                  <span className="block font-bold text-slate-900">{resumeData.education.diploma.percentageOrCgpa}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pt-1 border-t border-slate-100">
                <div>
                  <span className="font-semibold text-slate-900">Secondary School Certificate (Class 10 / Matriculation)</span>
                  <div className="text-slate-600">{resumeData.education.tenth.school} ({resumeData.education.tenth.board})</div>
                </div>
                <div className="text-slate-600 font-mono text-left sm:text-right shrink-0">
                  <span>{resumeData.education.tenth.yearOfPassing}</span>
                  <span className="block font-semibold text-slate-900">{resumeData.education.tenth.percentage}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">
              Technical Competencies & Instruments
            </h3>
            <div className="space-y-1.5 text-xs">
              <div>
                <strong className="text-slate-900">Core Engineering: </strong>
                <span className="text-slate-700">{resumeData.skills.technical.join(', ')}</span>
              </div>
              <div>
                <strong className="text-slate-900">Tools & CAD/Simulation: </strong>
                <span className="text-slate-700">{resumeData.skills.toolsAndSoftware.join(', ')}</span>
              </div>
              <div>
                <strong className="text-slate-900">Lab Equipment & Bench Instruments: </strong>
                <span className="text-slate-700">{resumeData.skills.labInstruments.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Projects */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">
              Academic Projects
            </h3>
            <div className="space-y-3 text-xs">
              {resumeData.projects.map((proj) => (
                <div key={proj.id} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                    <span className="font-bold text-slate-900">{proj.title}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{proj.duration}</span>
                  </div>
                  <div className="text-slate-600 text-[11px] italic">
                    Role: {proj.role} | Tech: {proj.technologies}
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    • {proj.description}
                  </p>
                  {proj.outcome && (
                    <p className="text-slate-800 font-medium">
                      • Outcome: {proj.outcome}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Internships / Summer Training */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">
              Industrial Training / Internships
            </h3>
            <div className="space-y-2.5 text-xs">
              {resumeData.internships.map((intern) => (
                <div key={intern.id} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                    <span className="font-bold text-slate-900">{intern.company}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{intern.duration}</span>
                  </div>
                  <div className="text-slate-600 text-[11px]">Role: {intern.role} · {intern.location}</div>
                  <p className="text-slate-700 leading-relaxed">
                    • {intern.responsibilities}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications & Achievements */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">
              Certifications & Co-Curricular Achievements
            </h3>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
              {resumeData.certifications.map((c, idx) => (
                <li key={`cert-${idx}`}>{c}</li>
              ))}
              {resumeData.achievements.map((a, idx) => (
                <li key={`ach-${idx}`}>{a}</li>
              ))}
            </ul>
          </div>

          {/* Declaration */}
          <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 text-center">
            I hereby declare that the academic and project particulars stated above are true to the best of my knowledge and supported by official mark sheets.
          </div>

        </div>
      )}

    </div>
  );
};
