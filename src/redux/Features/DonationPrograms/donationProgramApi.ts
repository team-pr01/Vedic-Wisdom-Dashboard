/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const donationProgramApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDonationPrograms: builder.query({
      query: ({
        skip,
        limit,
        keyword,
      }: {
        keyword?: string;
        limit?: number;
        skip?: number;
      } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());

        return {
          url: `/donation-program?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["donation"],
    }),

    getSingleDonationPrograms: builder.query({
      query: (id) => ({
        url: `/donation-program/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["donation"],
    }),

    addDonationProgram: builder.mutation<any, any>({
      query: (data) => ({
        url: `/donation-program/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["donation"],
    }),

    updateDonationProgram: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/donation-program/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["donation"],
    }),

    deleteDonationProgram: builder.mutation<any, string>({
      query: (id) => ({
        url: `/donation-program/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["donation"],
    }),


  }),
});

export const {
  useGetAllDonationProgramsQuery,
  useGetSingleDonationProgramsQuery,
  useAddDonationProgramMutation,
  useUpdateDonationProgramMutation,
  useDeleteDonationProgramMutation,
} = donationProgramApi;
