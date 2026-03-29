import { baseApi } from "../../API/baseApi";

const consultationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllConsultations: builder.query({
      query: ({
        skip,
        limit,
        keyword,
        status
      }: {
        keyword?: string;
        limit?: number;
        skip?: number;
        status?: string
      } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());
        if (status) params.append("status", status);

        return {
          url: `/consultation?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["consultation"],
    }),

    getSingleConsultation: builder.query({
      query: (id) => ({
        url: `/consultation/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["consultation"],
    }),

    scheduleConsultation: builder.mutation({
      query: ({ data, id }) => ({
        url: `/consultation/schedule/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),

    updateConsultationStatus: builder.mutation({
      query: ({ data, id }) => ({
        url: `/consultation/update-status/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),

    deleteConsultation: builder.mutation({
      query: (id) => ({
        url: `/consultation/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),
  }),
});

export const {
  useGetAllConsultationsQuery,
  useGetSingleConsultationQuery,
  useScheduleConsultationMutation,
  useUpdateConsultationStatusMutation,
  useDeleteConsultationMutation,
} = consultationApi;
