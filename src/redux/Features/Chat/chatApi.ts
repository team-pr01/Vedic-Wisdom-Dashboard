import { baseApi } from "../../API/baseApi";

const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        accessChat: builder.mutation({
            query: (targetUserId) => ({
                url: `/conversation/access/${targetUserId}`,
                method: "POST",
                credentials: "include",
            }),
            invalidatesTags: ["message", "chat"],
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
            invalidatesTags: ["message", "chat"],
        }),

        addMembersToGroup: builder.mutation({
            query: ({id, data}) => ({
                url: `/conversation/add-members/${id}`,
                method: "PATCH",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["message", "chat"],
        }),

        changeMessageRequestStatus: builder.mutation({
            query: ({ id, data }) => ({
                url: `/conversation/request/${id}`,
                method: "PATCH",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["message", "chat"],
        }),

        deleteChat: builder.mutation({
            query: (id) => ({
                url: `/conversation/delete-chat/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["message", "chat"],
        }),

        leaveGroup: builder.mutation({
            query: (id) => ({
                url: `/conversation/leave-group/${id}`,
                method: "PATCH",
                credentials: "include",
            }),
            invalidatesTags: ["message", "chat"],
        }),
    }),
});

export const {
    useAccessChatMutation,
    useGetMyInboxQuery,
    useCreateGroupChatMutation,
    useAddMembersToGroupMutation,
    useChangeMessageRequestStatusMutation,
    useDeleteChatMutation,
    useLeaveGroupMutation
} = chatApi;
