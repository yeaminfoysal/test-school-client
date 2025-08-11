import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import {
  Question,
  Competency,
  CompetencyLevel,
  ApiResponse,
  PaginatedResponse,
} from '../../types';

interface CreateQuestionData {
  competency: string;
  level: CompetencyLevel;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export const questionApi = createApi({
  reducerPath: 'questionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://test-school-server-ten.vercel.app/api/questions',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Question', 'Competency'],
  endpoints: (builder) => ({
    getQuestions: builder.query<
      PaginatedResponse<Question>,
      {
        page?: number;
        limit?: number;
        competency?: string;
        currentLevel?: CompetencyLevel;
        student?: string
      }
    >({
      query: ({ page = 1, limit = 20, competency, currentLevel, student }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (competency) params.append('competency', competency);
        if (currentLevel) params.append('currentLevel', currentLevel);
        if (student) params.append('student', student);
        return `?${params.toString()}`;
      },
      providesTags: ['Question'],
    }),
    createQuestion: builder.mutation<
      ApiResponse<Question>,
      CreateQuestionData
    >({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Question'],
    }),
    updateQuestion: builder.mutation<
      ApiResponse<Question>,
      { id: string; data: Partial<CreateQuestionData> }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Question'],
    }),
    deleteQuestion: builder.mutation<
      ApiResponse<{ message: string }>,
      string
    >({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Question'],
    }),
    getCompetencies: builder.query<ApiResponse<Competency[]>, void>({
      query: () => '/competencies',
      providesTags: ['Competency'],
    }),
    createCompetency: builder.mutation<
      ApiResponse<Competency>,
      { name: string; description: string; code: string }
    >({
      query: (data) => ({
        url: '/competencies',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Competency'],
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useGetCompetenciesQuery,
  useCreateCompetencyMutation,
} = questionApi;