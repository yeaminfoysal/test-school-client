// User Types
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  currentLevel: CompetencyLevel;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  SUPERVISOR = 'supervisor',
}

export enum CompetencyLevel {
  NONE = 'none',
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface OTPVerification {
  email: string;
  otp: string;
}

// Assessment Types
export interface Question {
  _id: string;
  competency: Competency;
  level: CompetencyLevel;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Competency {
  _id: string;
  name: string;
  description: string;
  code: string;
}

export interface Assessment {
  _id: string;
  user: string;
  step: AssessmentStep;
  questions: Question[];
  answers: number[];
  score: number;
  level: CompetencyLevel;
  startTime: string;
  endTime?: string;
  timeLimit: number; // in minutes
  isCompleted: boolean;
  isPassed: boolean;
}

export enum AssessmentStep {
  STEP_1 = 1,
  STEP_2 = 2,
  STEP_3 = 3,
}

// Assignment Types
export interface Assignment {
  _id: string;
  title: string;
  description: string;
  creator: User;
  participants: User[];
  step: AssessmentStep;
  timeLimit: number;
  dueDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Certificate Types
export interface Certificate {
  _id: string;
  user: User;
  level: CompetencyLevel;
  score: number;
  issuedAt: string;
  certificateId: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message: string;
}

// Timer Types
export interface Timer {
  timeLeft: number; // in seconds
  isRunning: boolean;
  isPaused: boolean;
}

// Dashboard Types
export interface DashboardStats {
  totalUsers: number;
  totalAssessments: number;
  totalCertificates: number;
  completionRate: number;
  levelDistribution: Record<CompetencyLevel, number>;
}