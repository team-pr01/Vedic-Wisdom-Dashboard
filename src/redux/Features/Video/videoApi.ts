/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";


const videoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllVideos: builder.query({
      query: ({
        skip,
        limit,
        keyword,
        category
      }: {
        keyword?: string;
        limit?: number;
        skip?: number;
        category?: string
      } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());
        if (category) params.append("category", category);

        return {
          url: `/reels?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["reels"],
    }),

    getSingleVideoById: builder.query({
      query: (id) => ({
        url: `/reels/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["reels"],
    }),

    addVideo: builder.mutation<any, any>({
      query: (data) => ({
        url: `/reels/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["reels"],
    }),

    updateVideo: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/reels/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["reels"],
    }),

    deleteVideo: builder.mutation<any, string>({
      query: (id) => ({
        url: `/reels/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["reels"],
    }),
  }),
});

export const {
  useGetAllVideosQuery,
  useGetSingleVideoByIdQuery,
  useAddVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation
} = videoApi;
