"use client";
import React from "react";
import { Mail, Lock, Phone, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin } from "../../api/features/auth/auth.queries";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/app/lib/login.schema";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useAuth } from "@/app/components/context/AuthContext";
import Cookies from "js-cookie";
import { AuthResponse } from "../../api/features/auth/types";
import GoogleAuthButton from "@/app/components/auth/GoogleAuthButton";
import { writeCachedProfile } from "@/app/api/features/auth/profile-cache";

const Page = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: loginUser, isPending } = useLogin();

  const getRedirectPath = (role: "landlord" | "tenant") => {
    return role === "landlord" ? "/landlord/dashboard" : "/tenant/dashboard";
  };

  useEffect(() => {
    const token = Cookies.get("ACCESS_TOKEN");
    const role = Cookies.get("USER_ROLE");
    const searchParams = new URL(window.location.href).searchParams;
    const redirectTo = searchParams.get("redirectTo");

    // Check if the current page has a payment reference, or if the redirect target does
    let hasPaymentRef =
      searchParams.has("reference") || searchParams.has("trxref");
    if (!hasPaymentRef && redirectTo) {
      try {
        const redirectToUrl = new URL(redirectTo, window.location.origin);
        hasPaymentRef =
          redirectToUrl.searchParams.has("reference") ||
          redirectToUrl.searchParams.has("trxref");
      } catch {
        hasPaymentRef =
          redirectTo.includes("reference=") || redirectTo.includes("trxref=");
      }
    }

    const isPaymentReturn = typeof window !== "undefined" && hasPaymentRef;

    if (token) {
      if (isPaymentReturn && redirectTo) {
        router.replace(redirectTo);
      } else if (!isPaymentReturn) {
        if (role === "landlord") {
          router.replace("/landlord/dashboard");
        } else if (role === "tenant") {
          router.replace("/tenant/dashboard");
        }
      }
    }
  }, [router]);

  type LoginFormValues = z.infer<typeof loginSchema> & {
    remember?: boolean;
  };

  const onSubmit = (data: LoginFormValues) => {
    let identifier = data.identifier;
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    if (!isEmail) {
      if (/^0\d{10}$/.test(identifier)) {
        identifier = "+234" + identifier.slice(1);
      } else if (/^\d{10}$/.test(identifier)) {
        identifier = "+234" + identifier;
      }
    }
    const payload = {
      user: identifier,
      password: data.password,
    };

    loginUser(payload, {
      onSuccess: (response: AuthResponse) => {
        const accessToken = response.accessToken ?? response.token;
        const role = response.user?.role ?? response.role;

        if (!accessToken || !role) {
          toast.error("Login response missing token or role");
          return;
        }

        if (response.user) {
          writeCachedProfile(response.user, data.remember ? 7 : 1);
        }

        login(accessToken, role, data.remember);
        toast.success("Login successful");
        router.replace(getRedirectPath(role));
      },

      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Login failed");
      },
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const watchIdentifier = watch("identifier");
  const isPhoneNumber = /^[0-9+]/.test(watchIdentifier || "");

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
            priority
            sizes="100vw"
            className="object-cover blur-3xl brightness-[0.4] scale-110"
          />
        </div>

        <div className="relative z-10 w-full max-w-6xl bg-white rounded-[45px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[750px] mt-12 md:mt-0">
          <div className="hidden md:block w-1/2 relative p-5">
            <div className="relative w-full h-full rounded-[35px] overflow-hidden">
              <Image
                src="/IDU GROUP HOME.webp"
                alt="RentULO Login"
                fill
                priority
                sizes="50vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col p-8 md:p-16 justify-center text-center">
            <div className="flex justify-center mb-10">
              <div className="bg-gray-100 p-1.5 rounded-full flex items-center border border-gray-200">
                <Link
                  href="/signup"
                  className="px-8 py-2.5 text-sm font-bold text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
                >
                  Sign up
                </Link>
                <button className="px-8 py-2.5 bg-[#4CAF50] text-white text-sm font-bold rounded-full shadow-lg">
                  Log in
                </button>
              </div>
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Access your account and continue your housing journey
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 text-left mt-10"
            >
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">
                  Email or Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-[#4CAF50]">
                    {isPhoneNumber ? <Phone size={18} /> : <Mail size={18} />}
                  </span>
                  <input
                    {...register("identifier")}
                    placeholder="Email or phone number"
                    type="text"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#4CAF50]/10 focus:border-[#4CAF50] transition-all"
                  />
                </div>
                {errors.identifier && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.identifier.message as string}
                  </p>
                )}
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-[#4CAF50]">
                    <Lock size={18} />
                  </span>
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Your password..."
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#4CAF50]/10 focus:border-[#4CAF50] transition-all"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message as string}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-[#4CAF50] cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register("remember")}
                    className="w-4 h-4 accent-[#4CAF50] border-gray-300 rounded"
                  />
                  <span className="text-xs text-gray-500 font-medium group-hover:text-gray-700">
                    Remember me
                  </span>
                </label>
                <div className="flex justify-end mb-4">
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-[#4CAF50] hover:underline transition-all"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-tighter">
                  <span className="bg-white px-3 text-gray-400 font-bold">
                    or continue with
                  </span>
                </div>
              </div>

              {/* <div className="flex-1">
                  <GoogleAuthButton mode="login" />
                </div> */}


              <button
                className="w-full bg-[#4CAF50] text-white py-4 rounded-2xl font-bold hover:bg-[#43A047] shadow-xl shadow-green-100 transition-all active:scale-[0.98] mt-2 cursor-pointer"
                disabled={isPending}
              >
                {isPending ? "Log in..." : "Log in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
