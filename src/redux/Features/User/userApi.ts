import { baseApi } from "../../API/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: ({
        skip,
        limit,
        keyword,
        role,
        premiumUnlocked,
        city,
        state,
        country,
        status
      }: {
        keyword?: string;
        role?: string;
        premiumUnlocked?: string;
        limit?: number;
        skip?: number;
        city?: string;
        state?: string;
        country?: string;
        status?: string
      } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (role) params.append("role", role);
        if (premiumUnlocked) params.append("premiumUnlocked", premiumUnlocked);
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());
        if (city) params.append("city", city);
        if (state) params.append("state", state);
        if (country) params.append("country", country);
        if (status) params.append("status", status);

        return {
          url: `/user?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["users"],
    }),

    getSingleUserById: builder.query({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["users"],
    }),

    getMe: builder.query({
      query: () => ({
        url: `/user/me`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["users"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/user/update-profile`,
        body: data,
        method: "PATCH",
      }),
      invalidatesTags: ["users"],
    }),

    deleteAccount: builder.mutation({
      query: (data) => ({
        url: `/user/delete-account`,
        body: data,
        method: "PATCH",
      }),
      invalidatesTags: ["users"],
    }),

    restoreDeletedAccount: builder.mutation({
      query: (id) => ({
        url: `/user/account/restore/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["users"],
    }),

    suspendUser: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/user/suspend/${userId}`,
        body: data,
        method: "PATCH",
      }),
      invalidatesTags: ["users"],
    }),

    activeUser: builder.mutation({
      query: (userId) => ({
        url: `/user/suspension/withdraw/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["users"],
    }),

    requestToUnlockProfile: builder.mutation({
      query: (data) => ({
        url: `/user/request-to-unlock-profile`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["users"],
    }),

    toggleProfileStatus: builder.mutation({
      query: (id) => ({
        url: `/user/profile-lock/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["users"],
    }),

    assignPages: builder.mutation({
      query: (data) => ({
        url: `/user/assign-page`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const { useGetAllUsersQuery, useGetSingleUserByIdQuery, useGetMeQuery, useUpdateProfileMutation, useDeleteAccountMutation, useRestoreDeletedAccountMutation, useSuspendUserMutation, useActiveUserMutation, useRequestToUnlockProfileMutation, useToggleProfileStatusMutation, useAssignPagesMutation } = userApi;
