/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const referralApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReferralsOfAnUser: builder.query({
      query: ({
        skip,
        limit,
        userId,
      }: any = {}) => {
        const params = new URLSearchParams();

        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());

        return {
          url: `/referral/user/${userId}?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["referral"],
    }),

    // getSingleRecipeById: builder.query({
    //   query: (id) => ({
    //     url: `/food/${id}`,
    //     method: "GET",
    //     credentials: "include",
    //   }),
    //   providesTags: ["food"],
    // }),

  }),
});

export const {
  useGetAllReferralsOfAnUserQuery,
} = referralApi;
