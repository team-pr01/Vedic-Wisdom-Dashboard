/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const noticeBoardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotices: builder.query<
      any,
      {
        role?: string;
      }
    >({
      query: (filters) => {
        const params = new URLSearchParams();

        if (filters.role) params.append("role", filters.role);

        return {
          url: `/notice-board?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["notice"],
    }),

    getAllTutorsNotice: builder.query<any, { role?: string }>({
      query: () => {
        return {
          url: `/notice-board/tutors`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["notice"],
    }),
    getAllGuardiansNotice: builder.query<any, { role?: string }>({
      query: () => {
        return {
          url: `/notice-board/guardians`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["notice"],
    }),

    getSingleNoticeById: builder.query({
      query: (id) => ({
        url: `/notice-board/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["notice"],
    }),

    addNotice: builder.mutation<any, any>({
      query: (data) => ({
        url: `/notice-board/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["notice"],
    }),

    deleteNotice: builder.mutation<any, string>({
      query: (id) => ({
        url: `/notice-board/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["notice"],
    }),

    updateNotice: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/notice-board/update/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["notice"],
    }),
  }),
});

export const {
  useGetAllNoticesQuery,
  useGetSingleNoticeByIdQuery,
  useGetAllTutorsNoticeQuery,
  useGetAllGuardiansNoticeQuery,
  useAddNoticeMutation,
  useDeleteNoticeMutation,
  useUpdateNoticeMutation,
} = noticeBoardApi;
