/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const vendorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllVendors: builder.query({
      query: ({
        skip,
        limit,
        keyword,
        status
      }: {
        keyword?: string;
        limit?: number;
        skip?: number;
        status?: string
      } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());
        if (status) params.append("status", status);

        return {
          url: `/vendor?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["vendor"],
    }),

    getSingleVendorById: builder.query({
      query: (id) => ({
        url: `/vendor/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["vendor"],
    }),

    getAllProductsOfAVendor: builder.query({
      query: ({
        vendorId,
        skip,
        limit,
        keyword,
        category
      }: {
        vendorId?: string;
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
          url: `/vendor/${vendorId}/products?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["vendor"],
    }),

    updateVendorStatus: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/vendor/update-status/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["vendor"],
    }),

    suspendVendor: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/vendor/suspend/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["vendor"],
    }),

    withdrawVendorSuspension: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/vendor/withdraw-suspension/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["vendor"],
    }),
  }),
});

export const {
  useGetAllVendorsQuery,
  useGetSingleVendorByIdQuery,
  useGetAllProductsOfAVendorQuery,
  useUpdateVendorStatusMutation,
  useSuspendVendorMutation,
  useWithdrawVendorSuspensionMutation
} = vendorApi;
