import { baseApi } from "../../API/baseApi";

const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        accessChat: builder.mutation({
            query: (targetUserId) => ({
                url: `/conversation/access/${targetUserId}`,
                method: "POST",
                credentials: "include",
            }),
            invalidatesTags: ["consultation"],
        }),


        getMyInbox: builder.query({
            query: () => ({
                url: `/conversation/inbox`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["message", "chat"],
        }),
    }),
});

export const {
    useAccessChatMutation,
    useGetMyInboxQuery,
} = chatApi;
