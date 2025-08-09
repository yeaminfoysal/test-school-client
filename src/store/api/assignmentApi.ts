import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import {
  Assignment,
  AssessmentStep,
  ApiResponse,
  PaginatedResponse,
} from '../../types';

interface CreateAssignmentData {
  title: string;
  description: string;
  step: AssessmentStep;
  timeLimit: number;
  dueDate: string;
  participantEmails: string[];
}

export const assignmentApi = createApi({
  reducerPath: 'assignmentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/assignments',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Assignment'],
  endpoints: (builder) => ({
    createAssignment: builder.mutation<
      ApiResponse<Assignment>,
      CreateAssignmentData
    >({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Assignment'],
    }),
    getAssignments: builder.query<
      PaginatedResponse<Assignment>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `?page=${page}&limit=${limit}`,
      providesTags: ['Assignment'],
    }),
    getMyAssignments: builder.query<
      PaginatedResponse<Assignment>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `/my-assignments?page=${page}&limit=${limit}`,
      providesTags: ['Assignment'],
    }),
    getAssignmentById: builder.query<ApiResponse<Assignment>, string>({
      query: (id) => `/${id}`,
      providesTags: ['Assignment'],
    }),
    updateAssignment: builder.mutation<
      ApiResponse<Assignment>,
      { id: string; data: Partial<CreateAssignmentData> }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Assignment'],
    }),
    deleteAssignment: builder.mutation<
      ApiResponse<{ message: string }>,
      string
    >({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Assignment'],
    }),
    toggleAssignmentStatus: builder.mutation<
      ApiResponse<Assignment>,
      string
    >({
      query: (id) => ({
        url: `/${id}/toggle-status`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Assignment'],
    }),
  }),
});

export const {
  useCreateAssignmentMutation,
  useGetAssignmentsQuery,
  useGetMyAssignmentsQuery,
  useGetAssignmentByIdQuery,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
  useToggleAssignmentStatusMutation,
} = assignmentApi;