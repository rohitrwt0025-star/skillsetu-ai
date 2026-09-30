import { ApplicationEntry, StudentProfile, ResumeData } from '../types';
import { DEFAULT_STUDENT_PROFILE, SAMPLE_RESUME_PROFILES } from '../data/sampleProfiles';

const APPS_STORAGE_KEY = 'skillsetu_applications_v1';
const SAVED_OPPS_KEY = 'skillsetu_saved_opps_v1';
const PROFILE_KEY = 'skillsetu_student_profile_v1';
const RESUME_KEY = 'skillsetu_resume_data_v1';

export function getStoredApplications(): ApplicationEntry[] {
  try {
    const raw = localStorage.getItem(APPS_STORAGE_KEY);
    if (!raw) {
      // Seed with 2 realistic starter applications
      const initial: ApplicationEntry[] = [
        {
          id: 'app-seed-1',
          role: 'Technician Apprentice (ECE / Instrumentation)',
          organization: 'Bharat Electronics Limited (BEL)',
          location: 'Bengaluru, Karnataka',
          type: 'Apprenticeship (NATS)',
          appliedDate: '2026-09-20',
          deadline: '2026-10-25',
          status: 'Applied',
          notes: 'Registered on NATS portal. Enrollment ID generated; waiting for written test shortlist announcement.',
          applicationLink: 'https://nats.education.gov.in',
          expectedStipend: '₹12,500/mo',
          referenceNumber: 'NATS/BEL/2026/8942',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'app-seed-2',
          role: 'Diploma Engineer Trainee (DET)',
          organization: 'Tata Motors',
          location: 'Pune Plant',
          type: 'Private Industry',
          appliedDate: '2026-09-25',
          deadline: '2026-10-18',
          status: 'Test/Interview',
          notes: 'Aptitude test scheduled for Oct 12 at polytechnic campus auditorium.',
          applicationLink: 'https://www.tatamotors.com/careers',
          expectedStipend: '₹22,000/mo',
          referenceNumber: 'TM/DET/26/0411',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load applications from localStorage', e);
    return [];
  }
}

export function saveStoredApplications(apps: ApplicationEntry[]): void {
  try {
    localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(apps));
  } catch (e) {
    console.error('Failed to save applications to localStorage', e);
  }
}

export function getSavedOpportunityIds(): string[] {
  try {
    const raw = localStorage.getItem(SAVED_OPPS_KEY);
    if (!raw) {
      const initial = ['opp-1', 'opp-2'];
      localStorage.setItem(SAVED_OPPS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return ['opp-1', 'opp-2'];
  }
}

export function toggleSaveOpportunityId(id: string): string[] {
  try {
    const current = getSavedOpportunityIds();
    const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
    localStorage.setItem(SAVED_OPPS_KEY, JSON.stringify(next));
    return next;
  } catch {
    return [];
  }
}

export function getStoredStudentProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_STUDENT_PROFILE;
    return { ...DEFAULT_STUDENT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STUDENT_PROFILE;
  }
}

export function saveStoredStudentProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to localStorage', e);
  }
}

export function getStoredResumeData(): ResumeData {
  try {
    const raw = localStorage.getItem(RESUME_KEY);
    if (!raw) return SAMPLE_RESUME_PROFILES.ece;
    return JSON.parse(raw);
  } catch {
    return SAMPLE_RESUME_PROFILES.ece;
  }
}

export function saveStoredResumeData(resume: ResumeData): void {
  try {
    localStorage.setItem(RESUME_KEY, JSON.stringify(resume));
  } catch (e) {
    console.error('Failed to save resume data to localStorage', e);
  }
}
