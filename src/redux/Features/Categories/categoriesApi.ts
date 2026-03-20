/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";


const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllCategoriesByAreaName: builder.query({
      query: (areaName) => ({
        url: `/category/${areaName}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["category"],
    }),

    getSingleCategory: builder.query({
      query: (id) => ({
        url: `/category/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["category"],
    }),

    addCategory: builder.mutation<any, any>({
      query: (data) => ({
        url: `/category/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["category"],
    }),

    deleteCategory: builder.mutation<any, string>({
      query: (id) => ({
        url: `/category/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["category"],
    }),
  }),
});

export const {
  useGetAllCategoriesByAreaNameQuery,
  useGetSingleCategoryQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
