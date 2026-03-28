/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const popupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPopups: builder.query<any, { keyword?: string }>({
      query: () => {
        return {
          url: `/popup`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["popup"],
    }),

    getSinglePopup: builder.query({
      query: (id) => ({
        url: `/popup/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["popup"],
    }),

    addPopup: builder.mutation<any, any>({
      query: (data) => ({
        url: `/popup/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["popup"],
    }),

    updatePopup: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/popup/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["popup"],
    }),

    deletePopup: builder.mutation<any, string>({
      query: (id) => ({
        url: `/popup/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["popup"],
    }),


  }),
});

export const {
  useGetAllPopupsQuery,
  useGetSinglePopupQuery,
  useAddPopupMutation,
  useUpdatePopupMutation,
  useDeletePopupMutation,
} = popupApi;
