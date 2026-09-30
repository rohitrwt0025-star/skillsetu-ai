import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  deleteUser, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  deleteDoc, 
  writeBatch 
} from 'firebase/firestore';
import { 
  auth, 
  db, 
  googleProvider, 
  testFirestoreConnection, 
  handleFirestoreError, 
  OperationType 
} from '../services/firebase';
import { 
  StudentProfile, 
  ApplicationEntry, 
  ResumeData 
} from '../types';

interface AuthContextType {
  currentUser: User | null;
  authLoading: boolean;
  isCloudConnected: boolean;
  isSavingToCloud: boolean;
  cloudSyncError: string | null;
  signInWithGoogle: () => Promise<User | null>;
  signOutUser: () => Promise<void>;
  deleteUserAccountAndData: () => Promise<void>;
  saveProfileCloud: (profile: StudentProfile) => Promise<void>;
  saveApplicationsCloud: (apps: ApplicationEntry[]) => Promise<void>;
  saveSavedOppsCloud: (oppIds: string[]) => Promise<void>;
  saveResumeCloud: (resume: ResumeData) => Promise<void>;
  fetchUserCloudData: () => Promise<{
    profile?: StudentProfile;
    applications?: ApplicationEntry[];
    savedOppIds?: string[];
    resume?: ResumeData;
  } | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [isSavingToCloud, setIsSavingToCloud] = useState(false);
  const [cloudSyncError, setCloudSyncError] = useState<string | null>(null);

  // Monitor auth state changes
  useEffect(() => {
    testFirestoreConnection().then(connected => setIsCloudConnected(connected));

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google Sign-In via Popup
  const signInWithGoogle = async (): Promise<User | null> => {
    setCloudSyncError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setCurrentUser(result.user);
      return result.user;
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      // Helpful error message for configuration / authorized domains
      if (err.code === 'auth/unauthorized-domain') {
        setCloudSyncError('This domain is not authorized in Firebase Console > Authentication > Settings > Authorized domains. Please add this preview domain.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setCloudSyncError('Sign-in cancelled before completing.');
      } else {
        setCloudSyncError(err.message || 'Failed to authenticate with Google.');
      }
      return null;
    }
  };

  // Sign Out
  const signOutUser = async () => {
    setCloudSyncError(null);
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
    } catch (err: any) {
      console.error('Sign out error:', err);
      setCloudSyncError(err.message || 'Failed to sign out.');
    }
  };

  // Delete User Account and all subcollections
  const deleteUserAccountAndData = async () => {
    if (!currentUser) return;
    const uid = currentUser.uid;
    setIsSavingToCloud(true);
    setCloudSyncError(null);

    try {
      // 1. Delete all applications
      const appsPath = `users/${uid}/applications`;
      try {
        const appsSnapshot = await getDocs(collection(db, appsPath));
        for (const docSnapshot of appsSnapshot.docs) {
          await deleteDoc(doc(db, appsPath, docSnapshot.id));
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, appsPath);
      }

      // 2. Delete all saved opportunities
      const savedPath = `users/${uid}/savedOpportunities`;
      try {
        const savedSnapshot = await getDocs(collection(db, savedPath));
        for (const docSnapshot of savedSnapshot.docs) {
          await deleteDoc(doc(db, savedPath, docSnapshot.id));
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, savedPath);
      }

      // 3. Delete user root profile
      const userDocPath = `users/${uid}`;
      try {
        await deleteDoc(doc(db, 'users', uid));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, userDocPath);
      }

      // 4. Delete Auth account
      await deleteUser(currentUser);
      setCurrentUser(null);
    } catch (err: any) {
      console.error('Account deletion error:', err);
      if (err.code === 'auth/requires-recent-login') {
        setCloudSyncError('Deleting your account requires recent authentication. Please sign out and sign in again before deleting.');
      } else {
        setCloudSyncError(err.message || 'Failed to delete account and data.');
      }
      throw err;
    } finally {
      setIsSavingToCloud(false);
    }
  };

  // Save Profile to Cloud
  const saveProfileCloud = async (profile: StudentProfile) => {
    if (!currentUser) return;
    setIsSavingToCloud(true);
    setCloudSyncError(null);
    const path = `users/${currentUser.uid}`;

    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        userId: currentUser.uid,
        name: profile.name || currentUser.displayName || 'Student',
        email: profile.email || currentUser.email || '',
        phone: profile.phone || '',
        qualification: profile.qualification,
        branch: profile.branch,
        institution: profile.institution,
        boardOrUniversity: profile.boardOrUniversity,
        percentageOrCgpa: Number(profile.percentageOrCgpa) || 0,
        graduationYear: Number(profile.graduationYear) || 2026,
        activeBacklogs: Number(profile.activeBacklogs) || 0,
        category: profile.category,
        location: profile.location || '',
        careerGoals: profile.careerGoals || '',
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      setCloudSyncError('Failed to save profile to Firestore.');
      handleFirestoreError(e, OperationType.WRITE, path);
    } finally {
      setIsSavingToCloud(false);
    }
  };

  // Save Applications to Cloud
  const saveApplicationsCloud = async (apps: ApplicationEntry[]) => {
    if (!currentUser) return;
    setIsSavingToCloud(true);
    setCloudSyncError(null);
    const basePath = `users/${currentUser.uid}/applications`;

    try {
      // Overwrite collection entries
      for (const app of apps) {
        await setDoc(doc(db, basePath, app.id), {
          ...app,
          userId: currentUser.uid,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (e) {
      setCloudSyncError('Failed to synchronize applications with cloud.');
      handleFirestoreError(e, OperationType.WRITE, basePath);
    } finally {
      setIsSavingToCloud(false);
    }
  };

  // Save Bookmarked Opps to Cloud
  const saveSavedOppsCloud = async (oppIds: string[]) => {
    if (!currentUser) return;
    setIsSavingToCloud(true);
    setCloudSyncError(null);
    const basePath = `users/${currentUser.uid}/savedOpportunities`;

    try {
      for (const id of oppIds) {
        await setDoc(doc(db, basePath, id), {
          opportunityId: id,
          userId: currentUser.uid,
          role: 'Opportunity Bookmark',
          organization: 'SkillSetu AI Bookmark',
          savedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (e) {
      setCloudSyncError('Failed to save bookmarks to cloud.');
      handleFirestoreError(e, OperationType.WRITE, basePath);
    } finally {
      setIsSavingToCloud(false);
    }
  };

  // Save Resume to Cloud
  const saveResumeCloud = async (resume: ResumeData) => {
    if (!currentUser) return;
    setIsSavingToCloud(true);
    setCloudSyncError(null);
    const path = `users/${currentUser.uid}/resumes/currentDraft`;

    try {
      await setDoc(doc(db, `users/${currentUser.uid}/resumes`, 'currentDraft'), {
        userId: currentUser.uid,
        fullName: resume.personalInfo.fullName,
        summary: resume.personalInfo.summary,
        dataJson: JSON.stringify(resume),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      setCloudSyncError('Failed to save resume draft to cloud.');
      handleFirestoreError(e, OperationType.WRITE, path);
    } finally {
      setIsSavingToCloud(false);
    }
  };

  // Fetch all user cloud data on sign-in
  const fetchUserCloudData = async () => {
    if (!currentUser) return null;
    const uid = currentUser.uid;

    try {
      // 1. Fetch Profile
      let profile: StudentProfile | undefined;
      const userDocPath = `users/${uid}`;
      try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          profile = userDoc.data() as StudentProfile;
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.GET, userDocPath);
      }

      // 2. Fetch Applications
      const apps: ApplicationEntry[] = [];
      const appsPath = `users/${uid}/applications`;
      try {
        const appsSnap = await getDocs(collection(db, appsPath));
        appsSnap.forEach(d => {
          apps.push(d.data() as ApplicationEntry);
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.LIST, appsPath);
      }

      // 3. Fetch Saved Opps
      const savedIds: string[] = [];
      const savedPath = `users/${uid}/savedOpportunities`;
      try {
        const savedSnap = await getDocs(collection(db, savedPath));
        savedSnap.forEach(d => {
          savedIds.push(d.id);
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.LIST, savedPath);
      }

      // 4. Fetch Resume
      let resume: ResumeData | undefined;
      const resumePath = `users/${uid}/resumes/currentDraft`;
      try {
        const resumeDoc = await getDoc(doc(db, `users/${uid}/resumes`, 'currentDraft'));
        if (resumeDoc.exists()) {
          const raw = resumeDoc.data();
          if (raw?.dataJson) {
            resume = JSON.parse(raw.dataJson);
          }
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.GET, resumePath);
      }

      return {
        profile,
        applications: apps.length > 0 ? apps : undefined,
        savedOppIds: savedIds.length > 0 ? savedIds : undefined,
        resume
      };
    } catch (err: any) {
      console.warn('Error fetching cloud data, fallback to local:', err);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authLoading,
        isCloudConnected,
        isSavingToCloud,
        cloudSyncError,
        signInWithGoogle,
        signOutUser,
        deleteUserAccountAndData,
        saveProfileCloud,
        saveApplicationsCloud,
        saveSavedOppsCloud,
        saveResumeCloud,
        fetchUserCloudData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
