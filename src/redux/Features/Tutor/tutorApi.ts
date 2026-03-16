/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const tutorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTutorDashboardStats: builder.query({
      query: () => ({
        url: `/tutor/stats`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["tutor"],
    }),

    getAllTutors: builder.query<
      any,
      {
        city?: string;
        area?: string;
        keyword?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: ({
        city = "",
        area = "",
        keyword = "",
        page = 1,
        limit = 10,
      } = {}) => {
        const params = new URLSearchParams();

        if (city) params.append("city", city);
        if (area) params.append("area", area);
        if (keyword) params.append("keyword", keyword);
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        return {
          url: `/tutor?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["tutor"],
    }),

    getSingleTutorById: builder.query({
      query: (id) => ({
        url: `/tutor/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["tutor"],
    }),

    getMyApplications: builder.query<any, any | void>({
      query: ({ status, skip = 0, limit = 10 } = {}) => {
        const params = new URLSearchParams();

        if (status) params.append("status", status);
        if (skip) params.append("skip", skip.toString());
        if (limit) params.append("limit", limit.toString());

        return {
          url: `/tutor/my-applications?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["tutor", "application", "jobs"],
    }),

    addNewEducation: builder.mutation({
      query: (data) => ({
        url: `/user/education/add`,
        body: data,
        method: "POST",
      }),
      invalidatesTags: ["users", "tutor", "guardian", "staff"],
    }),

    updateEducation: builder.mutation({
      query: ({ data, id }) => ({
        url: `/user/education/update/${id}`,
        body: data,
        method: "PUT",
      }),
      invalidatesTags: ["users", "tutor", "guardian", "staff"],
    }),

    deleteEducation: builder.mutation({
      query: (id) => ({
        url: `/user/education/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users", "tutor", "guardian", "staff"],
    }),

    updateIdentityInfo: builder.mutation({
      query: (data) => ({
        url: `/tutor/update/identity-info`,
        body: data,
        method: "PATCH",
      }),
      invalidatesTags: ["users"],
    }),

    deleteIdentityInfo: builder.mutation({
      query: (id) => ({
        url: `/tutor/identity-info/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),

    setTutorOfTheMonth: builder.mutation({
      query: (id) => ({
        url: `/tutor/tutor-of-the-month/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["tutor"],
    }),
  }),
});

export const {
  useGetTutorDashboardStatsQuery,
  useGetAllTutorsQuery,
  useGetSingleTutorByIdQuery,
  useGetMyApplicationsQuery,
  useAddNewEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
  useUpdateIdentityInfoMutation,
  useDeleteIdentityInfoMutation,
  useSetTutorOfTheMonthMutation,
} = tutorApi;
