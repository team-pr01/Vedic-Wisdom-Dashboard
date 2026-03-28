/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const bookApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllBooks: builder.query({
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
          url: `/book?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["book"],
    }),

    getSingleBook: builder.query({
      query: (id) => ({
        url: `/book/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["book"],
    }),

    createBook: builder.mutation<any, any>({
      query: (data) => ({
        url: `/book/create-book`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["book"],
    }),

    deleteBook: builder.mutation<any, string>({
      query: (id) => ({
        url: `/book/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["book"],
    }),

    updateBook: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/book/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["book"],
    }),
  }),
});

export const {
  useGetAllBooksQuery,
  useGetSingleBookQuery,
  useCreateBookMutation,
  useDeleteBookMutation,
  useUpdateBookMutation,
} = bookApi;
