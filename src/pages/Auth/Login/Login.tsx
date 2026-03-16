import { useForm } from "react-hook-form";
import Button from "../../../components/Reusable/Button/Button";
import TextInput from "../../../components/Reusable/TextInput/TextInput";
import PasswordInput from "../../../components/Reusable/PasswordInput/PasswordInput";
import { useState } from "react";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    console.log("Login data:", data);
  };

  const isLoading = false;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white border border-neutral-55 rounded-xl p-8">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-neutral-10 font-Inter">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-45 font-Roboto">
            Please sign in to your account
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email */}
            <TextInput
              label="Email Address"
              placeholder="Enter your email"
              type="email"
              error={errors.email}
              {...register("email", {
                required: "Email is required",
                setValueAs: (value) => value.replace(/\s+/g, ""),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />

            {/* Password Field */}
            <PasswordInput
              label="Password"
              placeholder="Must be at least 8 Characters"
              error={errors.password}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              isPasswordVisible={isPasswordVisible}
              setIsPasswordVisible={setIsPasswordVisible}
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  {...register("rememberMe")}
                  className="h-4 w-4 text-primary-10 focus:ring-primary-10 border-neutral-50 rounded transition-colors duration-200 cursor-pointer"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-neutral-20 font-Roboto cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-primary-10 hover:text-primary-10/80 transition-colors duration-200 font-Roboto"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
          label="Sign In"
            type="submit"
            variant="primary"
            isLoading={isLoading}
            fullWidth
          />
        </form>

        {/* Optional: Social Login */}
        {/* <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background-10 text-neutral-45 font-Roboto">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="w-full inline-flex justify-center py-2 px-4 border border-neutral-50 rounded-lg shadow-sm bg-white text-sm font-medium text-neutral-20 hover:bg-neutral-50/10 transition-colors duration-200 font-Roboto">
              Google
            </button>
            <button className="w-full inline-flex justify-center py-2 px-4 border border-neutral-50 rounded-lg shadow-sm bg-white text-sm font-medium text-neutral-20 hover:bg-neutral-50/10 transition-colors duration-200 font-Roboto">
              GitHub
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
