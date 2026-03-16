/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const verificationRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllVerificationRequests: builder.query<
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
          url: `/profile-verification?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["verificationRequest"],
    }),

     getMyVerificationRequest: builder.query({
      query: () => ({
        url: `/profile-verification/my-request`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["verificationRequest"],
    }),

    sendVerificationRequest: builder.mutation<any, any>({
      query: () => ({
        url: `/profile-verification/send-request`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["verificationRequest"],
    }),

    submitAddressCode: builder.mutation<any, any>({
      query: (data) => ({
        url: `/profile-verification/submit-address-code`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["verificationRequest"],
    }),

    // For admin
    acceptRequest: builder.mutation<any, any>({
      query: (id) => ({
        url: `/profile-verification/status/accepted/${id}`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: ["verificationRequest"],
    }),

    reviewRequest: builder.mutation<any, any>({
      query: (id) => ({
        url: `/profile-verification/status/reviewing/${id}`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: ["verificationRequest"],
    }),

    markAsInvoiceDue: builder.mutation<any, any>({
      query: (id) => ({
        url: `/profile-verification/status/invoice-due/${id}`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: ["verificationRequest"],
    }),

    markAsAddressVerificationLetterSent: builder.mutation<any, any>({
      query: (id) => ({
        url: `/profile-verification/status/address-verification/${id}`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: ["verificationRequest"],
    }),

    markAsVerified: builder.mutation<any, any>({
      query: (id) => ({
        url: `/profile-verification/status/verified/${id}`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: ["verificationRequest"],
    }),
  }),
});

export const {
  useGetAllVerificationRequestsQuery,
  useGetMyVerificationRequestQuery,
  useSendVerificationRequestMutation,
  useSubmitAddressCodeMutation,
  useAcceptRequestMutation,
  useReviewRequestMutation,
  useMarkAsInvoiceDueMutation,
  useMarkAsAddressVerificationLetterSentMutation,
  useMarkAsVerifiedMutation
} = verificationRequestApi;
