/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const refundRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllRefundRequests: builder.query<
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
          url: `/refund-request?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["refundRequest"],
    }),

    requestToRefund: builder.mutation<any, any>({
      query: (data) => ({
        url: `/refund-request/request-to-refund`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["refundRequest"],
    }),

    acceptRefundRequest: builder.mutation<any, any>({
      query: (id) => ({
        url: `/refund-request/accept/${id}`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: ["refundRequest"],
    }),

    rejectRefundRequest: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/refund-request/reject/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["refundRequest"],
    }),
  }),
});

export const {
  useGetAllRefundRequestsQuery,
  useRequestToRefundMutation,
  useAcceptRefundRequestMutation,
  useRejectRefundRequestMutation,
} = refundRequestApi;
