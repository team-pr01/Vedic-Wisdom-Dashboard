/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const guardianApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGuardianDashboardStats: builder.query({
      query: () => ({
        url: `/guardian/stats`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["guardian"],
    }),

    getAllGuardians: builder.query<
      any,
      {
        city?: string;
        area?: string;
        keyword?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: ({
        city = "",
        area = "",
        keyword = "",
        page = 1,
        limit = 10,
      } = {}) => {
        const params = new URLSearchParams();

        if (city) params.append("city", city);
        if (area) params.append("area", area);
        if (keyword) params.append("keyword", keyword);
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        return {
          url: `/guardian?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["guardian"],
    }),

     getSingleGuardianById: builder.query({
      query: (id) => ({
        url: `/guardian/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["guardian"],
    }),

     getSingleGuardianByCustomGuardianId: builder.query({
      query: (id) => ({
        url: `/guardian/single/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["guardian"],
    }),

    setGuardianOfTheMonth: builder.mutation({
      query: (id) => ({
        url: `/guardian/guardian-of-the-month/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["guardian"],
    }),
  }),
});

export const { useGetGuardianDashboardStatsQuery, useGetAllGuardiansQuery, useGetSingleGuardianByIdQuery, useGetSingleGuardianByCustomGuardianIdQuery, useSetGuardianOfTheMonthMutation } =
  guardianApi;
