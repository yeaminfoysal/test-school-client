import { CompetencyLevel, AssessmentStep } from '../types';
import { STEP_CONFIG, SCORING_THRESHOLDS } from './constants';

/**
 * Calculate score percentage from answers
 */
export const calculateScore = (
  answers: number[],
  correctAnswers: number[]
): number => {
  if (answers.length === 0 || correctAnswers.length === 0) return 0;
  
  let correct = 0;
  for (let i = 0; i < Math.min(answers.length, correctAnswers.length); i++) {
    if (answers[i] === correctAnswers[i]) {
      correct++;
    }
  }
  
  return (correct / correctAnswers.length) * 100;
};

/**
 * Determine competency level based on score and step
 */
export const determineLevel = (
  score: number,
  step: AssessmentStep
): { level: CompetencyLevel | null; canProceed: boolean; nextStep?: AssessmentStep } => {
  const stepConfig = STEP_CONFIG[step];
  const { passing } = stepConfig;
  
  if (score < SCORING_THRESHOLDS.FAIL) {
    return {
      level: passing.fail.level,
      canProceed: false,
    };
  }
  
  if (score >= SCORING_THRESHOLDS.PASS_ADVANCED && 'continue' in passing) {
    return {
      level: passing.continue.level,
      canProceed: true,
      nextStep: passing.continue.nextStep,
    };
  }
  
  if (score >= SCORING_THRESHOLDS.PASS_INTERMEDIATE) {
    const key = step === AssessmentStep.STEP_1 ? 'A2' : 
                step === AssessmentStep.STEP_2 ? 'B2' : 'C2';
    return {
      level: passing[key as keyof typeof passing].level,
      canProceed: false,
    };
  }
  
  if (score >= SCORING_THRESHOLDS.PASS_BASIC) {
    const key = step === AssessmentStep.STEP_1 ? 'A1' : 
                step === AssessmentStep.STEP_2 ? 'B1' : 'C1';
    return {
      level: passing[key as keyof typeof passing].level,
      canProceed: false,
    };
  }
  
  return {
    level: passing.fail.level,
    canProceed: false,
  };
};

/**
 * Format time in MM:SS format
 */
export const formatTime = (seconds: number): string => {
  if (seconds < 0) return '00:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
};

/**
 * Get progress percentage for assessment
 */
export const getProgressPercentage = (
  currentQuestion: number,
  totalQuestions: number
): number => {
  if (totalQuestions === 0) return 0;
  return Math.round(((currentQuestion + 1) / totalQuestions) * 100);
};

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password);
};

/**
 * Get level color for UI display
 */
export const getLevelColor = (level: CompetencyLevel): string => {
  const colors = {
    [CompetencyLevel.NONE]: 'text-gray-500',
    [CompetencyLevel.A1]: 'text-red-500',
    [CompetencyLevel.A2]: 'text-orange-500',
    [CompetencyLevel.B1]: 'text-yellow-500',
    [CompetencyLevel.B2]: 'text-blue-500',
    [CompetencyLevel.C1]: 'text-indigo-500',
    [CompetencyLevel.C2]: 'text-purple-500',
  };
  return colors[level] || colors[CompetencyLevel.NONE];
};

/**
 * Get level background color for UI display
 */
export const getLevelBgColor = (level: CompetencyLevel): string => {
  const colors = {
    [CompetencyLevel.NONE]: 'bg-gray-100',
    [CompetencyLevel.A1]: 'bg-red-100',
    [CompetencyLevel.A2]: 'bg-orange-100',
    [CompetencyLevel.B1]: 'bg-yellow-100',
    [CompetencyLevel.B2]: 'bg-blue-100',
    [CompetencyLevel.C1]: 'bg-indigo-100',
    [CompetencyLevel.C2]: 'bg-purple-100',
  };
  return colors[level] || colors[CompetencyLevel.NONE];
};

/**
 * Format date for display
 */
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

/**
 * Generate certificate ID
 */
export const generateCertificateId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 5);
  return `CERT-${timestamp.toUpperCase()}-${randomStr.toUpperCase()}`;
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};

/**
 * Get next assessment step user is eligible for
 */
export const getNextEligibleStep = (currentLevel: CompetencyLevel): AssessmentStep | null => {
  switch (currentLevel) {
    case CompetencyLevel.NONE:
      return AssessmentStep.STEP_1;
    case CompetencyLevel.A1:
    case CompetencyLevel.A2:
      return AssessmentStep.STEP_2;
    case CompetencyLevel.B1:
    case CompetencyLevel.B2:
      return AssessmentStep.STEP_3;
    case CompetencyLevel.C1:
    case CompetencyLevel.C2:
      return null; // Already at highest level
    default:
      return AssessmentStep.STEP_1;
  }
};