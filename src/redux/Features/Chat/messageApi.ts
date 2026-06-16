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

        // addCategory: builder.mutation<any, any>({
        //   query: (data) => ({
        //     url: `/category/add`,
        //     method: "POST",
        //     body: data,
        //     credentials: "include",
        //   }),
        //   invalidatesTags: ["category"],
        // }),

        // deleteCategory: builder.mutation<any, string>({
        //   query: (id) => ({
        //     url: `/category/delete/${id}`,
        //     method: "DELETE",
        //     credentials: "include",
        //   }),
        //   invalidatesTags: ["category"],
        // }),
    }),
});

export const {
    useGetMyMessagesWithOtherSingleUserQuery
} = messageApi;
