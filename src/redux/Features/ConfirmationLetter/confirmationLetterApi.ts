/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const confirmationLetter = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobDetailsForConfirmationLetter: builder.query<any, any>({
      query: (id) => {
        return {
          url: `/confirmation-letter/details/${id}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["confirmationLetter"],
    }),

    getAllConfirmationLetters: builder.query<any, any>({
      query: () => {
        return {
          url: `/confirmation-letter`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["confirmationLetter"],
    }),

    getSingleConfirmationLetterById: builder.query({
      query: (id) => ({
        url: `/confirmation-letter/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["confirmationLetter"],
    }),

    getAllTutorsConfirmationLetters: builder.query<any, any>({
      query: () => {
        return {
          url: `/confirmation-letter/tutor/my`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["confirmationLetter"],
    }),

    getAllGuardiansConfirmationLetters: builder.query<any, any>({
      query: () => {
        return {
          url: `/confirmation-letter/guardian/my`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["confirmationLetter"],
    }),

    sendConfirmationLetter: builder.mutation<any, any>({
      query: (data) => ({
        url: `/confirmation-letter/send`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["confirmationLetter"],
    }),

    signOnLetterForTutor: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/confirmation-letter/sign/tutor/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["confirmationLetter"],
    }),

    signOnLetterForGuardian: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/confirmation-letter/sign/guardian/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["confirmationLetter"],
    }),

    deleteConfirmationLetter: builder.mutation<any, any>({
      query: (id) => ({
        url: `/confirmation-letter/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["confirmationLetter"],
    }),
  }),
});

export const {
  useGetJobDetailsForConfirmationLetterQuery,
  useGetAllConfirmationLettersQuery,
  useGetSingleConfirmationLetterByIdQuery,
  useGetAllTutorsConfirmationLettersQuery,
  useGetAllGuardiansConfirmationLettersQuery,
  useSendConfirmationLetterMutation,
  useSignOnLetterForTutorMutation,
  useSignOnLetterForGuardianMutation,
  useDeleteConfirmationLetterMutation,
} = confirmationLetter;
