import { baseApi } from "../../API/baseApi";

const messageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMessagesByConversationId: builder.query({
            query: (id) => ({
                url: `/message/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["message", "chat"],
        }),

        reactToMessage: builder.mutation({
            query: ({ id, data }) => ({
                url: `/message/react/${id}`,
                method: "PATCH",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["message", "chat"],
        }),

        deleteForMe: builder.mutation({
            query: (messageId) => ({
                url: `/message/delete-for-me/${messageId}`,
                method: "DELETE",
                credentials: "include",
            }),
        }),

        deleteForEveryone: builder.mutation({
            query: (messageId) => ({
                url: `/message/delete-for-everyone/${messageId}`,
                method: "DELETE",
                credentials: "include",
            }),
        }),
    }),
});

export const {
    useGetMessagesByConversationIdQuery,
    useReactToMessageMutation,
    useDeleteForMeMutation,
    useDeleteForEveryoneMutation,
} = messageApi;
