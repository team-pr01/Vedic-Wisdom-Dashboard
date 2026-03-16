/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

type TGetStaffQuery = {
  page?: number;
  limit?: number;
};

const staffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllStaffs: builder.query<any, TGetStaffQuery>({
      query: ({ page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        return {
          url: `/staff?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["staff"],
    }),

    getSingleStaffById: builder.query({
      query: (id) => ({
        url: `/staff/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["staff"],
    }),

    addStaff: builder.mutation<any, any>({
      query: (data) => ({
        url: `/auth/add-staff`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["staff"],
    }),

    removeStaff: builder.mutation<any, string>({
      query: (id) => ({
        url: `/staff/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["staff"],
    }),

    updateStaffInfo: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/staff/update/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["staff"],
    }),
  }),
});

export const {
  useGetAllStaffsQuery,
  useGetSingleStaffByIdQuery,
  useAddStaffMutation,
  useRemoveStaffMutation,
  useUpdateStaffInfoMutation,
} = staffApi;
