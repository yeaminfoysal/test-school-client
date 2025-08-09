import { AssessmentStep, CompetencyLevel } from '../types';

// Assessment scoring thresholds
export const SCORING_THRESHOLDS = {
  FAIL: 25,
  PASS_BASIC: 25,
  PASS_INTERMEDIATE: 50,
  PASS_ADVANCED: 75,
} as const;

// Step configurations
export const STEP_CONFIG = {
  [AssessmentStep.STEP_1]: {
    levels: [CompetencyLevel.A1, CompetencyLevel.A2],
    questionsPerLevel: 22,
    totalQuestions: 44,
    passing: {
      fail: { threshold: SCORING_THRESHOLDS.FAIL, level: null, canRetake: false },
      A1: { threshold: SCORING_THRESHOLDS.PASS_BASIC, level: CompetencyLevel.A1 },
      A2: { threshold: SCORING_THRESHOLDS.PASS_INTERMEDIATE, level: CompetencyLevel.A2 },
      continue: { threshold: SCORING_THRESHOLDS.PASS_ADVANCED, level: CompetencyLevel.A2, nextStep: AssessmentStep.STEP_2 },
    },
  },
  [AssessmentStep.STEP_2]: {
    levels: [CompetencyLevel.B1, CompetencyLevel.B2],
    questionsPerLevel: 22,
    totalQuestions: 44,
    passing: {
      fail: { threshold: SCORING_THRESHOLDS.FAIL, level: CompetencyLevel.A2 },
      B1: { threshold: SCORING_THRESHOLDS.PASS_BASIC, level: CompetencyLevel.B1 },
      B2: { threshold: SCORING_THRESHOLDS.PASS_INTERMEDIATE, level: CompetencyLevel.B2 },
      continue: { threshold: SCORING_THRESHOLDS.PASS_ADVANCED, level: CompetencyLevel.B2, nextStep: AssessmentStep.STEP_3 },
    },
  },
  [AssessmentStep.STEP_3]: {
    levels: [CompetencyLevel.C1, CompetencyLevel.C2],
    questionsPerLevel: 22,
    totalQuestions: 44,
    passing: {
      fail: { threshold: SCORING_THRESHOLDS.FAIL, level: CompetencyLevel.B2 },
      C1: { threshold: SCORING_THRESHOLDS.PASS_BASIC, level: CompetencyLevel.C1 },
      C2: { threshold: SCORING_THRESHOLDS.PASS_INTERMEDIATE, level: CompetencyLevel.C2 },
    },
  },
} as const;

// Default time limits (in minutes)
export const DEFAULT_TIME_LIMITS = {
  STEP_1: 44, // 1 minute per question
  STEP_2: 44,
  STEP_3: 44,
} as const;

// API endpoints
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  THEME: 'theme',
} as const;

// Validation rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  OTP_LENGTH: 6,
  QUESTION_MIN_OPTIONS: 2,
  QUESTION_MAX_OPTIONS: 6,
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Toast notification durations
export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  WARNING: 4000,
  INFO: 3000,
} as const;

// Certificate template settings
export const CERTIFICATE = {
  WIDTH: 800,
  HEIGHT: 600,
  MARGIN: 50,
  COLORS: {
    PRIMARY: '#2563EB',
    SECONDARY: '#059669',
    ACCENT: '#EA580C',
    TEXT: '#1F2937',
    BACKGROUND: '#FFFFFF',
  },
} as const;

// Competency areas (22 total)
export const COMPETENCIES = [
  { code: 'INF', name: 'Information and Data Literacy', description: 'Browsing, searching, filtering, evaluating and managing data' },
  { code: 'COM', name: 'Communication and Collaboration', description: 'Interacting, sharing and collaborating through digital technologies' },
  { code: 'CRT', name: 'Digital Content Creation', description: 'Creating and editing digital content' },
  { code: 'SAF', name: 'Safety', description: 'Protecting devices, personal data and privacy' },
  { code: 'PSB', name: 'Problem Solving', description: 'Solving technical problems and identifying needs' },
] as const;

// Level descriptions
export const LEVEL_DESCRIPTIONS = {
  [CompetencyLevel.A1]: 'Foundation - Basic digital skills',
  [CompetencyLevel.A2]: 'Foundation - Confident use of simple digital tools',
  [CompetencyLevel.B1]: 'Intermediate - Independent use of digital tools',
  [CompetencyLevel.B2]: 'Intermediate - Advanced use with problem-solving',
  [CompetencyLevel.C1]: 'Advanced - Expert level with teaching ability',
  [CompetencyLevel.C2]: 'Advanced - Innovation and leadership in digital skills',
} as const;