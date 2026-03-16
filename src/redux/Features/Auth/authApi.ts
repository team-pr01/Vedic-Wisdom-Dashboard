import { baseApi } from "../../API/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["users"],
    }),

    verifyOtp: builder.mutation({
      query: (verifyOtpData) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: verifyOtpData,
        credentials: "include",
      }),
      invalidatesTags: ["users"],
    }),

    resendOtp: builder.mutation({
      query: (OtpData) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: OtpData,
        credentials: "include",
      }),
      invalidatesTags: ["users"],
    }),

    forgotPassword: builder.mutation({
      query: (forgotPasswordData) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: forgotPasswordData,
        credentials: "include",
      }),
      invalidatesTags: ["users"],
    }),

    resendForgetPasswordOtp: builder.mutation({
      query: (OtpData) => ({
        url: "/auth/resend-forgot-password-otp",
        method: "POST",
        body: OtpData,
        credentials: "include",
      }),
      invalidatesTags: ["users"],
    }),

    verifyResetPasswordOtp: builder.mutation({
      query: (verifyOtpData) => ({
        url: "/auth/verify-reset-password-otp",
        method: "POST",
        body: verifyOtpData,
        credentials: "include",
      }),
      invalidatesTags: ["users"],
    }),

    resetPassword: builder.mutation({
      query: (resetPasswordData) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body: resetPasswordData,
        credentials: "include",
      }),
      invalidatesTags: ["users"],
    }),

    changePassword: builder.mutation({
      query: (resetPasswordData) => ({
        url: `/auth/change-password`,
        method: "POST",
        body: resetPasswordData,
        credentials: "include",
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResendForgetPasswordOtpMutation,
  useVerifyResetPasswordOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
