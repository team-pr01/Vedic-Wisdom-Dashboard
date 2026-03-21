/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const emergencyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllEmergencies: builder.query({
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
          url: `/emergency?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["emergency"],
    }),

    getSingleEmergencyById: builder.query({
      query: (id) => ({
        url: `/emergency/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["emergency"],
    }),

    forwardMessageToOthers: builder.mutation<any, any>({
      query: (data) => ({
        url: `/emergency/forward`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["emergency"],
    }),

    updateStatus: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/emergency/update-status/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["emergency"],
    }),

    deleteEmergency: builder.mutation<any, string>({
      query: (id) => ({
        url: `/emergency/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["emergency"],
    }),
  }),
});

export const {
  useGetAllEmergenciesQuery,
  useGetSingleEmergencyByIdQuery,
  useForwardMessageToOthersMutation,
  useUpdateStatusMutation,
  useDeleteEmergencyMutation
} = emergencyApi;
