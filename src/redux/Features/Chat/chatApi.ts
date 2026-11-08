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

        createGroupChat: builder.mutation({
            query: (data) => ({
                url: `/conversation/group/create`,
                method: "POST",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["consultation"],
        }),
    }),
});

export const {
    useAccessChatMutation,
    useGetMyInboxQuery,
    useCreateGroupChatMutation,
} = chatApi;
