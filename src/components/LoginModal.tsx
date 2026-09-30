import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SetuLogo } from './SetuLogo';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  reasonMessage?: string;
  onSuccessRedirect?: () => void;
  onOpenSetupGuide?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  reasonMessage,
  onSuccessRedirect,
  onOpenSetupGuide,
}) => {
  const { signInWithGoogle, isCloudConnected, cloudSyncError } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setLocalError(null);
    try {
      const user = await signInWithGoogle();
      if (user) {
        onClose();
        if (onSuccessRedirect) {
          onSuccessRedirect();
        }
      }
    } catch (err: any) {
      setLocalError(err.message || 'An error occurred during Google sign-in.');
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-800 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo and Brand */}
        <div className="text-center space-y-2">
          <div className="inline-block">
            <SetuLogo size="lg" showText={false} />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign In to SkillSetu AI
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            “Your Skills. Your Opportunities. Your Future.”
          </p>
        </div>

        {/* Contextual Reason Callout */}
        <div className="mt-5 p-3.5 rounded-xl bg-blue-50/80 border border-blue-100 text-blue-950 text-xs flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {reasonMessage || 'Sign in to explore opportunities and save your career progress.'}
          </p>
        </div>

        {/* Error Callout */}
        {(localError || cloudSyncError) && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Sign-in Notice</p>
              <p className="text-[11px] leading-relaxed">
                {localError || cloudSyncError}
              </p>
            </div>
          </div>
        )}

        {/* Prominent Google Sign-In Action */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-300 hover:border-blue-400 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-all shadow-xs disabled:opacity-50"
          >
            {isSigningIn ? (
              <span className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
            )}
            <span>{isSigningIn ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          <p className="text-[11px] text-slate-400 text-center leading-normal">
            Secure single sign-on via Firebase Authentication. We never ask for, see, or store your Google password.
          </p>
        </div>

        {/* Benefits List */}
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Search & view technician, apprentice, and DET openings</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Sync application pipeline securely across your devices</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Save personalized resume drafts and interview progress</span>
          </div>
        </div>

        {/* Setup & Authorized Domain Help */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Cloud Sync Active</span>
          </span>
          {onOpenSetupGuide && (
            <button
              onClick={() => {
                onClose();
                onOpenSetupGuide();
              }}
              className="text-blue-600 hover:underline flex items-center gap-0.5"
            >
              <span>Setup & Domain Checklist</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
