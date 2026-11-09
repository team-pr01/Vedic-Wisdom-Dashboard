import { baseApi } from "../../API/baseApi";

const reportApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        reportSpam: builder.mutation({
            query: (data) => ({
                url: `/report`,
                method: "POST",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["report"],
        }),
    }),
});

export const {
    useReportSpamMutation
} = reportApi;
