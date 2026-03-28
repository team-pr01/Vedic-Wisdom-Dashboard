/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const reportedMantraApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReportedMantras: builder.query<any, { status?: string }>({
      query: ({ status = "" }) => {
        return {
          url: `/reportMantra?status=${encodeURIComponent(status)}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["reportMantra"],
    }),

    getSingleReportedMantra: builder.query({
      query: (id) => ({
        url: `/reportMantra/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["reportMantra"],
    }),

     getMantraToResolve: builder.query({
      query: ({
        bookId,
        levels,
      }: {
        bookId: string;
        levels?: Record<string, string>;
      }) => {
        if (!bookId) return { url: "", method: "GET" };

        const safeLevels = levels || {};
        const params = new URLSearchParams({ bookId });

        Object.entries(safeLevels).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });

        return {
          url: `/book-text/find-by-details?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["reportMantra"],
    }),

    reportMantra: builder.mutation<any, any>({
      query: (data) => ({
        url: `/reportMantra/report`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["reportMantra"],
    }),

    deleteReportedMantra: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/reportMantra/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["reportMantra"],
    }),

    updateStatus: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/reportMantra/update-status/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["reportMantra"],
    }),

    resolveIssue: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/reportMantra/resolve/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["reportMantra"],
    }),
  }),
});

export const {
  useGetAllReportedMantrasQuery,
  useGetSingleReportedMantraQuery,
  useGetMantraToResolveQuery,
  useReportMantraMutation,
  useDeleteReportedMantraMutation,
  useUpdateStatusMutation,
  useResolveIssueMutation,
} = reportedMantraApi;
