/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const vastuApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllVastu: builder.query({
      query: ({
        skip,
        limit,
        keyword,
        category
      }: {
        keyword?: string;
        limit?: number;
        skip?: number;
        category?: string
      } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());
        if (category) params.append("category", category);

        return {
          url: `/vastu?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["vastu"],
    }),

    getSingleVastuById: builder.query({
      query: (id) => ({
        url: `/vastu/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["vastu"],
    }),

    addVastu: builder.mutation<any, any>({
      query: (data) => ({
        url: `/vastu/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["vastu"],
    }),

    updateVastu: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/vastu/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["vastu"],
    }),

    deleteVastu: builder.mutation<any, string>({
      query: (id) => ({
        url: `/vastu/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["vastu"],
    }),
  }),
});

export const {
  useGetAllVastuQuery,
  useGetSingleVastuByIdQuery,
  useAddVastuMutation,
  useUpdateVastuMutation,
  useDeleteVastuMutation
} = vastuApi;
