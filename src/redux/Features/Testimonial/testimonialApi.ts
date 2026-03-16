/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const staffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTestimonials: builder.query<any, { role?: string }>({
      query: ({ role = "" } = { role: "" }) => {
        const params = new URLSearchParams();
        params.append("role", role.toString());

        return {
          url: `/testimonial?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["testimonial"],
    }),

    getSingleTestimonialById: builder.query({
      query: (id) => ({
        url: `/testimonial/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["testimonial"],
    }),

    getAllTutorsTestimonials: builder.query<any, { role?: string }>({
      query: () => {
        return {
          url: `/testimonial/tutors`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["testimonial"],
    }),

    getAllGuardiansTestimonials: builder.query<any, { role?: string }>({
      query: () => {
        return {
          url: `/testimonial/guardians`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["testimonial"],
    }),

    addTestimonial: builder.mutation<any, any>({
      query: (data) => ({
        url: `/testimonial/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["testimonial"],
    }),

    deleteTestimonial: builder.mutation<any, string>({
      query: (id) => ({
        url: `/testimonial/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["testimonial"],
    }),

    updateTestimonial: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/testimonial/update/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["testimonial"],
    }),
  }),
});

export const {
  useGetAllTestimonialsQuery,
  useGetSingleTestimonialByIdQuery,
  useGetAllTutorsTestimonialsQuery,
  useGetAllGuardiansTestimonialsQuery,
  useAddTestimonialMutation,
  useDeleteTestimonialMutation,
  useUpdateTestimonialMutation,
} = staffApi;
