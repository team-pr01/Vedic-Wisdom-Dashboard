/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";


const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllCourses: builder.query({
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
          url: `/course?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["course"],
    }),

    getSingleCourseById: builder.query({
      query: (id) => ({
        url: `/course/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["course"],
    }),

    addCourse: builder.mutation<any, any>({
      query: (data) => ({
        url: `/course/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["course"],
    }),

    updateCourse: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/course/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["course"],
    }),

    deleteCourse: builder.mutation<any, string>({
      query: (id) => ({
        url: `/course/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["course"],
    }),
  }),
});

export const {
  useGetAllCoursesQuery,
  useGetSingleCourseByIdQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation
} = courseApi;
