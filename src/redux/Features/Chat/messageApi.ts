/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const messageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyMessagesWithOtherSingleUser: builder.query({
            query: (otherUserId) => ({
                url: `/message/${otherUserId}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["message", "chat"],
        }),

        markMessageAsRead: builder.mutation<any, any>({
            query: (otherUserId) => ({
                url: `/message/read/${otherUserId}`,
                method: "PATCH",
                credentials: "include",
            }),
            invalidatesTags: ["message", "chat"],
        }),
    }),
});

export const {
    useGetMyMessagesWithOtherSingleUserQuery,
    useMarkMessageAsReadMutation,
} = messageApi;
