import { EligibilityCriteria } from '../types';

export const ELIGIBILITY_PRESETS: EligibilityCriteria[] = [
  {
    roleTitle: 'Technician Apprentice (BEL / DRDO)',
    organization: 'Bharat Electronics / DRDO NATS Program',
    minQualification: 'Diploma',
    allowedBranches: ['Electronics & Communication', 'Mechanical Engineering', 'Computer Science & IT', 'Electrical Engineering'],
    minPercentage: 60.0,
    maxAgeLimit: 25,
    allowedGraduationYears: [2024, 2025, 2026],
    maxBacklogsAllowed: 0,
    additionalCriteria: 'Must have passed 3-year AICTE/State Board recognized Diploma. Candidate must not have previously undergone 1 year of apprenticeship in any other PSU/corporate under the Apprentices Act.'
  },
  {
    roleTitle: 'Diploma Engineer Trainee (DET)',
    organization: 'Tata Motors & Automotive Ancillaries',
    minQualification: 'Diploma',
    allowedBranches: ['Mechanical Engineering', 'Mechatronics', 'Electrical Engineering', 'Electronics & Communication'],
    minPercentage: 60.0,
    maxAgeLimit: 24,
    allowedGraduationYears: [2025, 2026],
    maxBacklogsAllowed: 0,
    additionalCriteria: 'First attempt completion preferred. Minimum height/weight physical fitness norms for manufacturing plant operations. No active backlogs.'
  },
  {
    roleTitle: 'Junior Engineer (DMRC / State Metro)',
    organization: 'Delhi Metro Rail Corporation',
    minQualification: 'Diploma',
    allowedBranches: ['Civil Engineering', 'Electrical Engineering', 'Electronics & Communication'],
    minPercentage: 60.0,
    maxAgeLimit: 28,
    allowedGraduationYears: [2022, 2023, 2024, 2025, 2026],
    maxBacklogsAllowed: 0,
    additionalCriteria: 'Age relaxation applicable for OBC (3 yrs), SC/ST (5 yrs) as per central government directives. Visual acuity Aye-One / Aye-Three medical standards required.'
  },
  {
    roleTitle: 'TCS Smart Hiring & IT Support',
    organization: 'Tata Consultancy Services',
    minQualification: 'Diploma',
    allowedBranches: ['Computer Science & IT', 'Electronics & Communication', 'Electrical Engineering'],
    minPercentage: 55.0,
    maxAgeLimit: 26,
    allowedGraduationYears: [2025, 2026],
    maxBacklogsAllowed: 1,
    additionalCriteria: 'Full time diploma course only (no correspondence/part-time). Maximum 2-year education gap permitted from 10th to Diploma.'
  },
  {
    roleTitle: 'Lateral Entry B.Tech / BE (LEET)',
    organization: 'State Technical University Lateral Admission',
    minQualification: 'Diploma',
    allowedBranches: ['All Technical Branches'],
    minPercentage: 45.0,
    maxAgeLimit: 32,
    allowedGraduationYears: [2023, 2024, 2025, 2026],
    maxBacklogsAllowed: 0,
    additionalCriteria: 'Must have cleared all subjects of diploma prior to university counseling. 40% minimum marks applicable for reserved categories (SC/ST/OBC non-creamy).'
  }
];
