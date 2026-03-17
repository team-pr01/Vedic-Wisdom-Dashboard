/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const audioBooksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAudioBooks: builder.query({
      query: ({
        skip,
        limit,
        keyword,
        isPremium
      }: {
        keyword?: string;
        limit?: number;
        skip?: number;
        isPremium?: string
      } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());
        if (isPremium) params.append("isPremium", isPremium);

        return {
          url: `/audioBook?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["audioBook"],
    }),

    getSingleAudioBookById: builder.query({
      query: (id) => ({
        url: `/audioBook/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["audioBook"],
    }),

    addAudioBook: builder.mutation<any, any>({
      query: (data) => ({
        url: `/audioBook/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["audioBook"],
    }),

    updateAudioBook: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/audioBook/update/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["audioBook"],
    }),

    deleteAudioBook: builder.mutation<any, any>({
      query: (id) => ({
        url: `/audioBook/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["audioBook"],
    }),
  }),
});

export const {
  useGetAllAudioBooksQuery,
  useGetSingleAudioBookByIdQuery,
  useAddAudioBookMutation,
  useUpdateAudioBookMutation,
  useDeleteAudioBookMutation
} = audioBooksApi;
