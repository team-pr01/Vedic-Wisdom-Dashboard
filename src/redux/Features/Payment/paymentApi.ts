/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPayments: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        status?: string;
        keyword?: string;
      }
    >({
      query: ({ page = 1, limit = 10, status, keyword } = {}) => {
        const params = new URLSearchParams();

        if (page) params.append("page", page.toString());
        if (limit) params.append("limit", limit.toString());
        if (status) params.append("status", status);
        if (keyword) params.append("keyword", keyword);

        return {
          url: `/payment?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["payment"],
    }),

    getSinglePaymentById: builder.query({
      query: (id) => ({
        url: `/payment/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["payment"],
    }),

    pay: builder.mutation<any, any>({
      query: (data) => ({
        url: `/payment/pay`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["payment"],
    }),

    updatePaymentStatus: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/payment/update-status/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["payment"],
    }),
  }),
});

export const {
  useGetAllPaymentsQuery,
  useGetSinglePaymentByIdQuery,
  usePayMutation,
  useUpdatePaymentStatusMutation,
} = paymentApi;
