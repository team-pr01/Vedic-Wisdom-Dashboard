/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const templeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTemples: builder.query({
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
          url: `/temple?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["temple"],
    }),

    getSingleTempleById: builder.query({
      query: (id) => ({
        url: `/temple/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["temple"],
    }),

    addTemple: builder.mutation<any, any>({
      query: (data) => ({
        url: `/temple/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["temple"],
    }),

    updateTemple: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/temple/update/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["temple"],
    }),

    deleteTemple: builder.mutation<any, any>({
      query: (id) => ({
        url: `/temple/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["temple"],
    }),
  }),
});

export const {
  useGetAllTemplesQuery,
  useGetSingleTempleByIdQuery,
  useAddTempleMutation,
  useUpdateTempleMutation,
  useDeleteTempleMutation,
} = templeApi;
