/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const leadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllLeads: builder.query({
      query: ({
        keyword,
        limit,
        page,
        addedBy
      }: {
        keyword?: string;
        limit?: number;
        page?: number;
        addedBy?: string
      } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof page === "number") params.append("page", page.toString());
        if (addedBy) params.append("addedBy", addedBy);

        return {
          url: `/lead?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["lead"],
    }),

    getSingleLeadById: builder.query({
      query: (id) => ({
        url: `/lead/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["lead"],
    }),

    getMyLeads: builder.query({
      query: ({
        page,
        limit,
        keyword,
      }: { page?: number; limit?: number; keyword?: string } = {}) => {
        const params = new URLSearchParams();

        if (page) params.append("page", page.toString());
        if (limit) params.append("limit", limit.toString());
        if (keyword) params.append("keyword", keyword);

        return {
          url: `/lead/tutor/my-leads?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["lead"],
    }),

    // For guardian
    requestForTutor: builder.mutation<any, any>({
      query: (data) => ({
        url: `/lead/request-tutor`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["lead"],
    }),

    // For tutor
    addLead: builder.mutation<any, any>({
      query: (data) => ({
        url: `/lead/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["lead"],
    }),

    deleteLead: builder.mutation<any, string>({
      query: (id) => ({
        url: `/lead/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["lead"],
    }),

    updateLeadInfo: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/lead/update/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["lead"],
    }),
  }),
});

export const {
  useGetAllLeadsQuery,
  useGetSingleLeadByIdQuery,
  useGetMyLeadsQuery,
  useRequestForTutorMutation,
  useAddLeadMutation,
  useDeleteLeadMutation,
  useUpdateLeadInfoMutation,
} = leadApi;
