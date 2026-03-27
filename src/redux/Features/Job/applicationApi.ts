/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const applicationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllApplicationsByJobId: builder.query({
      query: ({
        jobId,
        skip,
        limit,
        keyword,
        status
      }: {
        jobId?: string;
        keyword?: string;
        limit?: number;
        skip?: number;
        status?: string
      } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());
        if (status) params.append("status", status);

        return {
          url: `/application/job/${jobId}?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["application"],
    }),

    getSingleApplicationById: builder.query({
      query: (id) => ({
        url: `/application/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["application"],
    }),

    updateApplicationStatus: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/application/update-status/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["application"],
    }),

    deleteApplication: builder.mutation<any, string>({
      query: (id) => ({
        url: `/application/application/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["application"],
    }),
  }),
});

export const {
  useGetAllApplicationsByJobIdQuery,
  useGetSingleApplicationByIdQuery,
  useUpdateApplicationStatusMutation,
  useDeleteApplicationMutation
} = applicationApi;
