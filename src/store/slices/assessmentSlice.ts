import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Assessment, Timer } from '../../types';

interface AssessmentState {
  currentAssessment: Assessment | null;
  currentQuestionIndex: number;
  answers: number[];
  timer: Timer;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: AssessmentState = {
  currentAssessment: null,
  currentQuestionIndex: 0,
  answers: [],
  timer: {
    timeLeft: 10,
    isRunning: false,
    isPaused: false,
  },
  isSubmitting: false,
  error: null,
};

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    setCurrentAssessment: (state, action: PayloadAction<Assessment>) => {
      state.currentAssessment = action.payload;
      state.currentQuestionIndex = 0;
      state.answers = new Array(action.payload.questions.length).fill(-1);
      state.timer = {
        timeLeft: action.payload.timeLimit * 60, // Convert minutes to seconds
        isRunning: false,
        isPaused: false,
      };
    },
    startTimer: (state) => {
      state.timer.isRunning = true;
      state.timer.isPaused = false;
    },
    pauseTimer: (state) => {
      state.timer.isPaused = true;
    },
    resumeTimer: (state) => {
      state.timer.isPaused = false;
    },
    decrementTimer: (state) => {
      if (state.timer.isRunning && !state.timer.isPaused && state.timer.timeLeft > 0) {
        state.timer.timeLeft -= 1;
      }
    },
    setCurrentQuestion: (state, action: PayloadAction<number>) => {
      if (
        state.currentAssessment &&
        action.payload >= 0 &&
        action.payload < state.currentAssessment.questions.length
      ) {
        state.currentQuestionIndex = action.payload;
      }
    },
    setAnswer: (
      state,
      action: PayloadAction<{ questionIndex: number; answer: number }>
    ) => {
      const { questionIndex, answer } = action.payload;
      if (questionIndex >= 0 && questionIndex < state.answers.length) {
        state.answers[questionIndex] = answer;
      }
    },
    nextQuestion: (state) => {
      if (
        state.currentAssessment &&
        state.currentQuestionIndex < state.currentAssessment.questions.length - 1
      ) {
        state.currentQuestionIndex += 1;
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetAssessment: (state) => {
      state.currentAssessment = null;
      state.currentQuestionIndex = 0;
      state.answers = [];
      state.timer = {
        timeLeft: 0,
        isRunning: false,
        isPaused: false,
      };
      state.isSubmitting = false;
      state.error = null;
    },
  },
});

export const {
  setCurrentAssessment,
  startTimer,
  pauseTimer,
  resumeTimer,
  decrementTimer,
  setCurrentQuestion,
  setAnswer,
  nextQuestion,
  previousQuestion,
  setSubmitting,
  setError,
  clearError,
  resetAssessment,
} = assessmentSlice.actions;

export default assessmentSlice.reducer;