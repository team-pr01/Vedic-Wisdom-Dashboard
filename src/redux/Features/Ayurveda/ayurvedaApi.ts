/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const ayurvedaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllAyurveda: builder.query({
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
          url: `/ayurveda?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["ayurveda"],
    }),

    getSingleAyurvedaById: builder.query({
      query: (id) => ({
        url: `/ayurveda/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["ayurveda"],
    }),

    addAyurveda: builder.mutation<any, any>({
      query: (data) => ({
        url: `/ayurveda/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["ayurveda"],
    }),

    updateAyurveda: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/ayurveda/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["ayurveda"],
    }),

    deleteAyurveda: builder.mutation<any, string>({
      query: (id) => ({
        url: `/ayurveda/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["ayurveda"],
    }),
  }),
});

export const {
  useGetAllAyurvedaQuery,
  useGetSingleAyurvedaByIdQuery,
  useAddAyurvedaMutation,
  useUpdateAyurvedaMutation,
  useDeleteAyurvedaMutation
} = ayurvedaApi;
