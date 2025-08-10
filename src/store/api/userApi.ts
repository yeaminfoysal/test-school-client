import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import {
  User,
  UserRole,
  ApiResponse,
  PaginatedResponse,
  DashboardStats,
} from '../../types';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api/users',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<
      PaginatedResponse<User>,
      { page?: number; limit?: number; role?: UserRole }
    >({
      query: ({ page = 1, limit = 10, role }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (role) params.append('role', role);
        return `?${params.toString()}`;
      },
      providesTags: ['User'],
    }),
    getUserById: builder.query<ApiResponse<User>, string>({
      query: (id) => `/${id}`,
      providesTags: ['User'],
    }),
    updateUserRole: builder.mutation<
      ApiResponse<User>,
      { id: string; role: UserRole }
    >({
      query: ({ id, role }) => ({
        url: `/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<
      ApiResponse<{ message: string }>,
      string
    >({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getDashboardStats: builder.query<ApiResponse<DashboardStats>, void>({
      query: () => '/dashboard/stats',
      providesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useGetDashboardStatsQuery,
} = userApi;