import { baseApi } from "../../API/baseApi";

const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyChatList: builder.query({
            query: () => ({
                url: `/chat/chat-list`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["message", "chat"],
        }),
    }),
});

export const {
    useGetMyChatListQuery,
} = chatApi;
