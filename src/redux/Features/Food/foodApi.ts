/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";


const foodApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllRecipes: builder.query({
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
          url: `/food?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["food"],
    }),

    getSingleRecipeById: builder.query({
      query: (id) => ({
        url: `/food/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["food"],
    }),

    addRecipe: builder.mutation<any, any>({
      query: (data) => ({
        url: `/food/add-recipe`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["food"],
    }),

    updateRecipe: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/food/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["food"],
    }),

    deleteRecipe: builder.mutation<any, string>({
      query: (id) => ({
        url: `/food/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["food"],
    }),
  }),
});

export const {
  useGetAllRecipesQuery,
  useGetSingleRecipeByIdQuery,
  useAddRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation
} = foodApi;
