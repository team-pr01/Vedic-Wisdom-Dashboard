import { useForm } from "react-hook-form";
import Button from "../../../components/Reusable/Button/Button";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login = () => {
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
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-20 font-Inter mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  errors.email ? "border-red-500" : "border-neutral-50"
                } placeholder-neutral-55 text-neutral-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-10 focus:border-transparent font-Roboto transition-all duration-200`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 font-Roboto">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-20 font-Inter mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  errors.password ? "border-red-500" : "border-neutral-50"
                } placeholder-neutral-55 text-neutral-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-10 focus:border-transparent font-Roboto transition-all duration-200`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 font-Roboto">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  {...register("rememberMe")}
                  className="h-4 w-4 text-primary-10 focus:ring-primary-10 border-neutral-50 rounded transition-colors duration-200"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-neutral-20 font-Roboto"
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
            type="submit"
            variant="primary"
            isLoading={isLoading}
            fullWidth
          >
            Sign In
          </Button>
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
