/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const audioTracksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAudioTracks: builder.query({
      query: () => ({
        url: `/audioTracks`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["audioTrack"],
    }),

    getAllAudioTracksOfABook: builder.query({
      query: (id) => ({
        url: `/audioTracks/book/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["audioTrack"],
    }),


    getSingleAudioTrackById: builder.query({
      query: (id) => ({
        url: `/audioTracks/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["audioTrack"],
    }),

    addAudioTrack: builder.mutation<any, any>({
      query: (data) => ({
        url: `/audioTracks/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["audioTrack"],
    }),

    deleteAudioTrack: builder.mutation<any, any>({
      query: (id) => ({
        url: `/audioTracks/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["audioTrack"],
    }),
  }),
});

export const {
  useGetAllAudioTracksQuery,
  useGetAllAudioTracksOfABookQuery,
  useGetSingleAudioTrackByIdQuery,
  useAddAudioTrackMutation,
  useDeleteAudioTrackMutation,
} = audioTracksApi;
