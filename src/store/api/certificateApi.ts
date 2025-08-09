import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import {
  Certificate,
  ApiResponse,
  PaginatedResponse,
} from '../../types';

export const certificateApi = createApi({
  reducerPath: 'certificateApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/certificates',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Certificate'],
  endpoints: (builder) => ({
    getMyCertificates: builder.query<
      PaginatedResponse<Certificate>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `/my-certificates?page=${page}&limit=${limit}`,
      providesTags: ['Certificate'],
    }),
    getAllCertificates: builder.query<
      PaginatedResponse<Certificate>,
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
      providesTags: ['Certificate'],
    }),
    getCertificateById: builder.query<ApiResponse<Certificate>, string>({
      query: (id) => `/${id}`,
      providesTags: ['Certificate'],
    }),
    downloadCertificate: builder.mutation<
      Blob,
      string
    >({
      query: (id) => ({
        url: `/${id}/download`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
    verifyCertificate: builder.query<
      ApiResponse<{ certificate: Certificate; isValid: boolean }>,
      string
    >({
      query: (certificateId) => `/verify/${certificateId}`,
    }),
  }),
});

export const {
  useGetMyCertificatesQuery,
  useGetAllCertificatesQuery,
  useGetCertificateByIdQuery,
  useDownloadCertificateMutation,
  useVerifyCertificateQuery,
} = certificateApi;