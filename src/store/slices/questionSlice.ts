import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Question, Competency } from '../../types';

interface QuestionState {
  questions: Question[];
  competencies: Competency[];
  currentQuestion: Question | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: QuestionState = {
  questions: [],
  competencies: [],
  currentQuestion: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
};

const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },
    setCompetencies: (state, action: PayloadAction<Competency[]>) => {
      state.competencies = action.payload;
    },
    setCurrentQuestion: (state, action: PayloadAction<Question>) => {
      state.currentQuestion = action.payload;
    },
    addQuestion: (state, action: PayloadAction<Question>) => {
      state.questions.unshift(action.payload);
    },
    updateQuestion: (state, action: PayloadAction<Question>) => {
      const index = state.questions.findIndex(
        (question) => question._id === action.payload._id
      );
      if (index !== -1) {
        state.questions[index] = action.payload;
      }
    },
    removeQuestion: (state, action: PayloadAction<string>) => {
      state.questions = state.questions.filter(
        (question) => question._id !== action.payload
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (
      state,
      action: PayloadAction<{
        page: number;
        limit: number;
        total: number;
        pages: number;
      }>
    ) => {
      state.pagination = action.payload;
    },
  },
});

export const {
  setQuestions,
  setCompetencies,
  setCurrentQuestion,
  addQuestion,
  updateQuestion,
  removeQuestion,
  setLoading,
  setError,
  clearError,
  setPagination,
} = questionSlice.actions;

export default questionSlice.reducer;