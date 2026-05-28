"use client";

import React, { useState } from "react";
import { Mail, Lock, ArrowLeft, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useLoginAdmin, useAuthStatus } from "@/app/api/features/admin";
import Cookies from "js-cookie";

interface SuperAdminLoginForm {
  user: string;
  password: string;
}

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLoginAdmin();
  const { refetch } = useAuthStatus();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SuperAdminLoginForm>();

 const onSubmit = async (data: SuperAdminLoginForm) => {
   try {
     const response = await loginMutation.mutateAsync({
       user: data.user,
       password: data.password,
     });
     
     // Store the token in cookie
     if (response?.accessToken || response?.token) {
       const token = response.accessToken ?? response.token;
       Cookies.set("ACCESS_TOKEN", token, { path: "/" });
     }
     
     await refetch();
     toast.success("Welcome back, Admin!");
     router.push("/super-admin/dashboard");
   } catch (err: any) {
     const message =
       err.response?.data?.message || err.message || "Login failed";
     toast.error(message);
   }
 };

  const isPending = loginMutation.isPending;

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-10 overflow-hidden">
        <div className="absolute top-8 left-8 z-20">
          <Link
            href="/"
            className="flex items-center gap-2 text-white hover:text-[#4CAF50] transition-colors font-medium text-sm"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        <div className="absolute inset-0 z-0">
          <Image
            src="/IDU GROUP HOME.webp"
            alt="Background"
            fill
            sizes="100vw"
            className="object-cover blur-3xl brightness-[0.3] scale-110"
          />
        </div>

        <div className="relative z-10 w-full max-w-5xl bg-white rounded-[45px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          <div className="hidden md:block w-1/2 relative p-5">
            <div className="relative w-full h-full rounded-[35px] overflow-hidden">
              <Image
                src="/IDU GROUP HOME.webp"
                alt="RentULO Admin"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12">
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 bg-[#4CAF50]/10 rounded-lg">
                <Shield size={24} className="text-[#4CAF50]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Super Admin Access
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email or Phone Number
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    {...register("user", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email",
                      },
                    })}
                    type="text"
                    placeholder="+234 123 456 7890"
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                  />
                </div>
                {errors.user && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.user.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Min 6 characters" },
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#4CAF50] text-white py-4 rounded-2xl font-bold hover:bg-[#43A047] shadow-xl shadow-green-100 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isPending ? "Logging in..." : "Log In to Dashboard"}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs text-gray-400 hover:text-[#4CAF50] transition-colors"
                >
                  User Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
