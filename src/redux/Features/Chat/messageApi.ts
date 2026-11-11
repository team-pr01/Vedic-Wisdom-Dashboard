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
    }),
});

export const {
    useGetMessagesByConversationIdQuery,
    useReactToMessageMutation,
} = messageApi;
