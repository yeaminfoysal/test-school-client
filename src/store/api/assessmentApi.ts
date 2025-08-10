/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import {
  Assessment,
  AssessmentStep,
  ApiResponse,
  PaginatedResponse,
} from '../../types';

export const assessmentApi = createApi({
  reducerPath: 'assessmentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api/assessments',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Assessment'],
  endpoints: (builder) => ({
    startAssessment: builder.mutation<
      ApiResponse<Assessment>,
      { step: AssessmentStep; assignmentId?: string }
    >({
      query: (data) => ({
        url: '/start',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Assessment'],
    }),
    submitAssessment: builder.mutation<
      ApiResponse<any>,
      {
        level:string;
        student: string;
        answers: number[];
        totalCorrect: number;
        totalQuestions: number;
      }
    >({
      query: (data) => ({
        url: '/submit',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Assessment'],
    }),

    getUserAssessments: builder.query<
      PaginatedResponse<Assessment>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `/user-assessments?page=${page}&limit=${limit}`,
      providesTags: ['Assessment'],
    }),
    getAssessmentById: builder.query<ApiResponse<Assessment>, string>({
      query: (id) => `/${id}`,
      providesTags: ['Assessment'],
    }),
    getAssessmentResult: builder.query<
      ApiResponse<{ assessment: Assessment; nextStep?: AssessmentStep }>,
      string
    >({
      query: (id) => `/${id}/result`,
      providesTags: ['Assessment'],
    }),
    getAllAssessments: builder.query<
      PaginatedResponse<Assessment>,
      { page?: number; limit?: number; userId?: string }
    >({
      query: ({ page = 1, limit = 10, userId }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (userId) params.append('userId', userId);
        return `?${params.toString()}`;
      },
      providesTags: ['Assessment'],
    }),
  }),
});

export const {
  useStartAssessmentMutation,
  useSubmitAssessmentMutation,
  useGetUserAssessmentsQuery,
  useGetAssessmentByIdQuery,
  useGetAssessmentResultQuery,
  useGetAllAssessmentsQuery,
} = assessmentApi;