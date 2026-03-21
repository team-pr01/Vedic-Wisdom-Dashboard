/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllNews: builder.query({
      query: ({
        skip,
        limit,
        keyword,
        category,
        languageCode
      }: {
        keyword?: string;
        limit?: number;
        skip?: number;
        category?: string;
        languageCode?: string
      } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());
        if (category) params.append("category", category);
        if (languageCode) params.append("languageCode", languageCode || "en");

        return {
          url: `/news?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["news"],
    }),

    getSingleNewsById: builder.query({
      query: ({ id, languageCode }) => ({
        url: `/news/${id}/${languageCode || "en"}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["news"],
    }),

    addNews: builder.mutation<any, any>({
      query: (data) => ({
        url: `/news/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["news"],
    }),

    translateNews: builder.mutation<any, any>({
      query: (data) => ({
        url: `/ai/translate-news`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["news"],
    }),

    updateNews: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/news/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["news"],
    }),

    deleteNews: builder.mutation<any, string>({
      query: (id) => ({
        url: `/news/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["news"],
    }),
  }),
});

export const {
  useGetAllNewsQuery,
  useGetSingleNewsByIdQuery,
  useTranslateNewsMutation,
  useAddNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation
} = newsApi;
