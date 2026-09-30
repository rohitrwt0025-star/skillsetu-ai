import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  ShieldCheck, 
  Trash2, 
  LogOut, 
  AlertTriangle, 
  Lock, 
  Database, 
  Check, 
  Info,
  User,
  HardDrive
} from 'lucide-react';

interface AccountPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

export const AccountPrivacyModal: React.FC<AccountPrivacyModalProps> = ({
  isOpen,
  onClose,
  onSignOut,
}) => {
  const { 
    currentUser, 
    signOutUser, 
    deleteUserAccountAndData, 
    isCloudConnected,
    isSavingToCloud,
    cloudSyncError 
  } = useAuth();

  const [confirmDeleteStep, setConfirmDeleteStep] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignOut = async () => {
    await signOutUser();
    onSignOut();
    onClose();
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationText !== 'DELETE') return;
    setIsDeleting(true);
    setErrorMsg(null);
    try {
      await deleteUserAccountAndData();
      onSignOut();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete account. You may need to sign in again recently.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Account & Cloud Privacy</h3>
              <p className="text-[11px] text-slate-500">Manage your authenticated credentials and cloud data</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        {currentUser ? (
          <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-12 h-12 rounded-full border border-slate-200 object-cover shadow-xs"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                  {currentUser.displayName ? currentUser.displayName.charAt(0) : 'U'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {currentUser.displayName || 'Authenticated Student'}
                </h4>
                <p className="text-xs text-slate-500 truncate">
                  {currentUser.email}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span>UID: {currentUser.uid.slice(0, 10)}...</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 font-sans font-medium flex items-center gap-0.5">
                    <Check className="w-3 h-3 text-emerald-600" /> Google Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                <span>Cloud Storage Status:</span>
                <strong className={isCloudConnected ? 'text-emerald-700' : 'text-amber-700'}>
                  {isCloudConnected ? 'Connected (Firestore)' : 'Offline'}
                </strong>
              </span>
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
            <p className="font-semibold">Currently Not Signed In</p>
            <p>You are viewing SkillSetu AI in guest mode. Data is stored locally in your browser storage.</p>
          </div>
        )}

        {/* What Information is Saved & Why */}
        <div className="mt-6 space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>What Information We Save & Why</span>
          </h4>
          <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2 text-slate-600 leading-relaxed">
            <p>
              SkillSetu AI operates on strict data minimization. We only store information needed to provide the application's career tools:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li><strong>Academic profile</strong> (branch, passing year, marks %): used solely to automate the Eligibility Checker.</li>
              <li><strong>Saved opportunities</strong>: bookmarks you explicitly choose to save.</li>
              <li><strong>Application pipeline entries</strong>: test dates and statuses you log.</li>
              <li><strong>Resume drafts</strong>: formatted summaries and project notes you type.</li>
            </ul>
            <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
              Every database record is scoped to your private user ID (<code className="font-mono text-slate-700">users/{'{userId}'}</code>). Strict Firestore security rules mathematically prevent any other user from accessing or reading your records.
            </p>
          </div>
        </div>

        {/* Delete Account & Data Section */}
        {currentUser && (
          <div className="mt-6 pt-5 border-t border-slate-200 space-y-3">
            <h4 className="font-bold text-rose-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>User Control: Delete Account & Cloud Data</span>
            </h4>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {errorMsg}
              </div>
            )}

            {!confirmDeleteStep ? (
              <div className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/40 text-xs text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="font-semibold">Permanently Erase Your Data</p>
                  <p className="text-[11px] text-rose-700">
                    Removes your profile, applications, saved vacancies, and deletes your Google auth record.
                  </p>
                </div>
                <button
                  onClick={() => setConfirmDeleteStep(true)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete My Data</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-rose-300 bg-rose-50 text-xs text-rose-950 space-y-3">
                <p className="font-bold">Confirmation Required</p>
                <p className="leading-relaxed">
                  This action is permanent and cannot be undone. To confirm deletion of your cloud account and all associated records, type <strong>DELETE</strong> below:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type DELETE"
                    value={deleteConfirmationText}
                    onChange={(e) => setDeleteConfirmationText(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-rose-300 bg-white font-mono text-xs focus:outline-none"
                  />
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmationText !== 'DELETE' || isDeleting}
                    className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold transition-colors flex items-center gap-1.5"
                  >
                    {isDeleting ? 'Deleting...' : 'Confirm'}
                  </button>
                  <button
                    onClick={() => {
                      setConfirmDeleteStep(false);
                      setDeleteConfirmationText('');
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
