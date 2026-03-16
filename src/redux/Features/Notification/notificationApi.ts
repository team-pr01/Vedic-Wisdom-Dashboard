/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query({
      query: () => ({
        url: `/notification/my`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["notification"],
    }),

    getAllNotification: builder.query<any, { role?: string }>({
      query: () => {
        return {
          url: `/notification`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["notification"],
    }),

    sendNotification: builder.mutation<any, any>({
      query: (data) => ({
        url: `/notification/send`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["notification"],
    }),

    markAsRead: builder.mutation<any, any>({
      query: (id) => ({
        url: `/notification/read/${id}`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: ["notification"],
    }),

    notifyTutorViewedCV: builder.mutation<any, any>({
      query: ({data, id}) => ({
        url: `/application/viewed-cv/${id}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["notification", "application"],
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useGetAllNotificationQuery,
  useSendNotificationMutation,
  useMarkAsReadMutation,
  useNotifyTutorViewedCVMutation,
} = notificationApi;
