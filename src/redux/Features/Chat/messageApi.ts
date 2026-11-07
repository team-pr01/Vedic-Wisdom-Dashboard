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
    }),
});

export const {
    useGetMessagesByConversationIdQuery,
} = messageApi;
