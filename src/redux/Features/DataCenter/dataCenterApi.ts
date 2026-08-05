/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const donationProgramApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addData: builder.mutation<any, any>({
            query: (data) => ({
                url: `/vedic-knowledge/upload`,
                method: "POST",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["vedicKnowledge"],
        }),

        deleteData: builder.mutation<any, string>({
            query: (id) => ({
                url: `/vedic-knowledge/delete/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["vedicKnowledge"],
        }),


    }),
});

export const {
    useAddDataMutation,
    useDeleteDataMutation
} = donationProgramApi;
