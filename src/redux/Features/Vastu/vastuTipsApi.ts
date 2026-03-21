/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const vastuTipsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllVastuTips: builder.query({
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
          url: `/vastu-tips?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["vastuTips"],
    }),

    getSingleVastuTipsById: builder.query({
      query: (id) => ({
        url: `/vastu-tips/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["vastuTips"],
    }),

    addVastuTips: builder.mutation<any, any>({
      query: (data) => ({
        url: `/vastu-tips/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["vastuTips"],
    }),

    updateVastuTips: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/vastu-tips/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["vastuTips"],
    }),

    deleteVastuTips: builder.mutation<any, string>({
      query: (id) => ({
        url: `/vastu-tips/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["vastuTips"],
    }),
  }),
});

export const {
  useGetAllVastuTipsQuery,
  useGetSingleVastuTipsByIdQuery,
  useAddVastuTipsMutation,
  useUpdateVastuTipsMutation,
  useDeleteVastuTipsMutation
} = vastuTipsApi;
