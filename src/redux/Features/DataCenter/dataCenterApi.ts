/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const donationProgramApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getAllDocuments: builder.query({
            query: ({
                skip,
                limit,
                keyword,
            }: {
                keyword?: string;
                limit?: number;
                skip?: number;
            } = {}) => {
                const params = new URLSearchParams();

                if (keyword) params.append("keyword", keyword);
                if (typeof limit === "number") params.append("limit", limit.toString());
                if (typeof skip === "number") params.append("skip", skip.toString());

                return {
                    url: `/vedic-knowledge?${params.toString()}`,
                    method: "GET",
                    credentials: "include",
                };
            },
            providesTags: ["vedicKnowledge"],
        }),


        addData: builder.mutation<any, any>({
            query: (data) => ({
                url: `/vedic-knowledge/upload`,
                method: "POST",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["vedicKnowledge"],
        }),

        deleteDocument: builder.mutation<any, string>({
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
    useGetAllDocumentsQuery,
    useAddDataMutation,
    useDeleteDocumentMutation
} = donationProgramApi;
