/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllJobs: builder.query({
      query: ({
        skip,
        limit,
        keyword,
        status
      }: {
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
          url: `/job?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["job"],
    }),

    getSingleJobById: builder.query({
      query: (id) => ({
        url: `/job/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["job"],
    }),

    postJob: builder.mutation<any, any>({
      query: (data) => ({
        url: `/job/post`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["job"],
    }),

    updateJob: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/job/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["job"],
    }),

    updateJobStatus: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/job/update-status/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["job"],
    }),

    deleteJob: builder.mutation<any, string>({
      query: (id) => ({
        url: `/job/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["job"],
    }),
  }),
});

export const {
  useGetAllJobsQuery,
  useGetSingleJobByIdQuery,
  usePostJobMutation,
  useUpdateJobMutation,
  useUpdateJobStatusMutation,
  useDeleteJobMutation,
} = jobApi;
