/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const consultantsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* GET ALL (search + filter + pagination) */
    getAllConsultants: builder.query({
      query: ({ keyword, category, skip = 0, limit = 10 }) => ({
        url: `/consultant`,
        method: "GET",
        credentials: "include",
        params: {
          keyword,
          category,
          skip,
          limit,
        },
      }),
      providesTags: ["consultant"],
    }),

    /* GET SINGLE */
    getSingleConsultantById: builder.query({
      query: (id: string) => ({
        url: `/consultant/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["consultant"],
    }),

    /* ADD */
    addConsultant: builder.mutation<any, any>({
      query: (data) => ({
        url: `/consultant`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["consultant"],
    }),

    /* UPDATE */
    updateConsultant: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/consultant/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["consultant"],
    }),

    /* DELETE */
    deleteConsultant: builder.mutation<any, string>({
      query: (id) => ({
        url: `/consultant/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["consultant"],
    }),
  }),
});

export const {
  useGetAllConsultantsQuery,
  useGetSingleConsultantByIdQuery,
  useAddConsultantMutation,
  useUpdateConsultantMutation,
  useDeleteConsultantMutation,
} = consultantsApi;