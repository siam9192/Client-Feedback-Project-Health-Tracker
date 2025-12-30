"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";

import validators from "@/utils/validators";
import useMutation from "@/hooks/useMutation";
import { LoginPayload } from "@/types/auth.type";
import { login } from "@/services/api/auth.api.service";
import { useRouter } from "next/navigation";

type LoginFormValues = z.infer<typeof validators.loginSchema>;

function page() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(validators.loginSchema),
  });
  const { mutate } = useMutation<null, LoginPayload>(login);

  const router = useRouter();

  const onSubmit = (data: LoginFormValues) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Login successful");
        reset();
        router.replace("/");
      },
      onError: () => {
        toast.error("Wrong email or password");
      },
      invalidateKeys: ["current-user"],
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl w-full max-w-md">
        <div className="space-y-5 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-900">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 ">Login to your account to continue</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              type="text"
              placeholder="Enter username or email"
              className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              {...register("email")}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default page;
