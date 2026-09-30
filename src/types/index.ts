export type OpportunityType = 
  | 'Apprenticeship (NATS)' 
  | 'PSU Trainee' 
  | 'Private Industry' 
  | 'Lateral Entry' 
  | 'Internship';

export type BranchType = 
  | 'Electronics & Communication' 
  | 'Computer Science & IT' 
  | 'Mechanical Engineering' 
  | 'Electrical Engineering' 
  | 'Civil Engineering' 
  | 'Mechatronics' 
  | 'All Technical Branches';

export interface Opportunity {
  id: string;
  role: string;
  organization: string;
  location: string;
  qualification: string;
  branches: BranchType[];
  type: OpportunityType;
  deadline: string; // YYYY-MM-DD
  stipendOrSalary: string;
  applicationLink: string;
  notificationSnippet: string;
  minPercentage?: number;
  maxAge?: number;
  passingYearAllowed?: number[];
  selectionMode?: string;
  isSampleData: boolean;
}

export type ApplicationStatus = 
  | 'Interested' 
  | 'Applied' 
  | 'Test/Interview' 
  | 'Selected' 
  | 'Not Selected';

export interface ApplicationEntry {
  id: string;
  role: string;
  organization: string;
  location: string;
  type: OpportunityType;
  appliedDate: string;
  deadline: string;
  status: ApplicationStatus;
  notes: string;
  applicationLink?: string;
  expectedStipend?: string;
  referenceNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  name: string;
  email: string;
  phone: string;
  qualification: 'Diploma' | 'B.Tech/BE' | 'ITI';
  branch: BranchType;
  institution: string;
  boardOrUniversity: string;
  percentageOrCgpa: number;
  graduationYear: number;
  currentSemesterOrStatus: string;
  activeBacklogs: number;
  clearedBacklogs: number;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  dateOfBirth: string; // YYYY-MM-DD
  skills: string[];
  location: string;
  careerGoals: string;
}

export interface EligibilityCriteria {
  roleTitle: string;
  organization: string;
  minQualification: 'Diploma' | 'B.Tech/BE' | 'ITI' | 'Any Technical';
  allowedBranches: BranchType[];
  minPercentage: number;
  maxAgeLimit: number;
  allowedGraduationYears: number[];
  maxBacklogsAllowed: number;
  additionalCriteria: string;
}

export interface CriteriaCheckItem {
  criterion: string;
  requirement: string;
  userStatus: string;
  status: 'match' | 'mismatch' | 'needs_verification';
  explanation: string;
}

export interface EligibilityResult {
  overallStatus: 'Eligible' | 'Not Eligible' | 'Conditional / Needs Verification';
  matchPercentage: number;
  items: CriteriaCheckItem[];
  officialDisclaimer: string;
  recommendations: string[];
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn?: string;
    githubOrPortfolio?: string;
    summary: string;
  };
  education: {
    diploma: {
      degree: string;
      branch: string;
      institution: string;
      board: string;
      yearOfPassing: string;
      percentageOrCgpa: string;
    };
    tenth: {
      school: string;
      board: string;
      yearOfPassing: string;
      percentage: string;
    };
  };
  skills: {
    technical: string[];
    toolsAndSoftware: string[];
    labInstruments: string[];
    softSkills: string[];
  };
  projects: Array<{
    id: string;
    title: string;
    role: string;
    technologies: string;
    duration: string;
    description: string;
    outcome: string;
  }>;
  internships: Array<{
    id: string;
    company: string;
    role: string;
    duration: string;
    location: string;
    responsibilities: string;
  }>;
  certifications: string[];
  achievements: string[];
}

export interface InterviewQuestion {
  id: string;
  subject: string;
  branch: BranchType | 'General HR';
  difficulty: 'Beginner' | 'Intermediate' | 'Core Concept';
  question: string;
  interviewerIntent: string;
  modelAnswer: string;
  keyKeywords: string[];
  tipsForDiploma: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isDemo?: boolean;
}
