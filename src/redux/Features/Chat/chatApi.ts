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


        getGroupMembers: builder.query({
            query: (id) => ({
                url: `/conversation/group-members/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["message", "chat"],
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

        updateGroupInfo: builder.mutation({
            query: ({ conversationId, data }) => ({
                url: `/conversation/group/update-info/${conversationId}`,
                method: "PATCH",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["message", "chat"],
        }),

        addMembersToGroup: builder.mutation({
            query: ({ id, data }) => ({
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

        makeGroupAdmin: builder.mutation({
            query: ({ conversationId, data }) => ({
                url: `/conversation/make-admin/${conversationId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["message", "chat"],
        }),

        removeFromAdmin: builder.mutation({
            query: ({ conversationId, data }) => ({
                url: `/conversation/remove-admin/${conversationId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["message", "chat"],
        }),

        removeFromGroup: builder.mutation({
            query: ({ conversationId, data }) => ({
                url: `/conversation/remove-member/${conversationId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["message", "chat"],
        }),

        toggleBlockUser: builder.mutation({
            query: ({ conversationId, data }) => ({
                url: `/conversation/toggle-block/${conversationId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["message", "chat"],
        }),

        getMyBlockedUsers: builder.query({
            query: () => `/conversation/blocked-list`,
            providesTags: ["message", "chat"],
        }),
    }),
});

export const {
    useAccessChatMutation,
    useGetGroupMembersQuery,
    useGetMyInboxQuery,
    useCreateGroupChatMutation,
    useUpdateGroupInfoMutation,
    useAddMembersToGroupMutation,
    useChangeMessageRequestStatusMutation,
    useDeleteChatMutation,
    useLeaveGroupMutation,
    useMakeGroupAdminMutation,
    useRemoveFromAdminMutation,
    useRemoveFromGroupMutation,
    useToggleBlockUserMutation,
    useGetMyBlockedUsersQuery,
} = chatApi;
