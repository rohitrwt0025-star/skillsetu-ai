import React, { useState } from 'react';
import { StudentProfile, BranchType } from '../types';
import { User, X, Check, Save } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [qualification, setQualification] = useState(profile.qualification);
  const [branch, setBranch] = useState<BranchType>(profile.branch);
  const [institution, setInstitution] = useState(profile.institution);
  const [percentage, setPercentage] = useState(profile.percentageOrCgpa);
  const [gradYear, setGradYear] = useState(profile.graduationYear);
  const [activeBacklogs, setActiveBacklogs] = useState(profile.activeBacklogs);
  const [category, setCategory] = useState(profile.category);
  const [location, setLocation] = useState(profile.location);
  const [careerGoals, setCareerGoals] = useState(profile.careerGoals);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StudentProfile = {
      ...profile,
      name,
      email,
      phone,
      qualification,
      branch,
      institution,
      percentageOrCgpa: percentage,
      graduationYear: gradYear,
      activeBacklogs,
      category,
      location,
      careerGoals,
    };
    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Profile</h3>
              <p className="text-[11px] text-slate-500">Powers automated eligibility matching and resume pre-fills</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Student Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Contact Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Current Degree</label>
              <select
                value={qualification}
                onChange={(e) => setQualification(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none"
              >
                <option value="Diploma">Diploma in Engineering</option>
                <option value="B.Tech/BE">B.Tech / BE</option>
                <option value="ITI">ITI</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Engineering Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value as BranchType)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none"
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
              <label className="block font-medium text-slate-700 mb-1">Passing Year</label>
              <select
                value={gradYear}
                onChange={(e) => setGradYear(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono focus:outline-none"
              >
                <option value="2027">2027 (Pre-Final Year)</option>
                <option value="2026">2026 (Final Year)</option>
                <option value="2025">2025 (Fresh Passout)</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Polytechnic / College Name</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Aggregate Marks (%)</label>
              <input
                type="number"
                step="0.1"
                value={percentage}
                onChange={(e) => setPercentage(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Active Backlogs</label>
              <input
                type="number"
                value={activeBacklogs}
                onChange={(e) => setActiveBacklogs(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none"
              >
                <option value="General">General</option>
                <option value="OBC">OBC (Non-Creamy)</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Location / City</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Career Goal Statement</label>
            <textarea
              rows={2}
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none text-slate-700"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
