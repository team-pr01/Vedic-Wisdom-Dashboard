import { baseApi } from "../../API/baseApi";

const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query({
      query: () => ({
        url: `/admin/stats`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["admin"],
    }),
  }),
});

export const { useGetAdminStatsQuery } = adminApi;
