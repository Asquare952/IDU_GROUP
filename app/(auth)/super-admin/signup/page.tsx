"use client";

import React, { useState } from "react";
import {
  Mail,
  Lock,
  ArrowLeft,
  Shield,
  User,
  Phone,
  MapPin,
  KeyRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRegisterAdmin, useVerifyAdminOTP } from "@/app/api/features/admin";

interface SuperAdminSignupForm {
  full_name: string;
  gender: "male" | "female" | "others";
  phone_no: string;
  email: string;
  address: string;
  state: string;
  password: string;
  confirmPassword: string;
  adminSecretKey: string;
}

export default function SuperAdminSignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");

  const registerMutation = useRegisterAdmin();
  const verifyMutation = useVerifyAdminOTP();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SuperAdminSignupForm>();

  const password = watch("password");

  const onSubmitStep1 = async (data: SuperAdminSignupForm) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const payload = {
        full_name: data.full_name,
        gender: data.gender,
        phone_no: data.phone_no,
        email: data.email,
        address: data.address,
        state: data.state,
        password: data.password,
        adminSecretKey: data.adminSecretKey,
      };

      await registerMutation.mutateAsync(payload);
      setEmail(data.email);
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Registration failed";
      toast.error(message);
    }
  };

  const onSubmitStep2 = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await verifyMutation.mutateAsync({ email, otpCode });
      toast.success("Account verified! Please log in.");
      router.push("/super-admin/login");
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "OTP verification failed";
      toast.error(message);
    }
  };

  const [otpCode, setOtpCode] = useState("");

  const isPending = registerMutation.isPending || verifyMutation.isPending;

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-10 overflow-hidden">
        {/* Back to Home */}
        <div className="absolute top-8 left-8 z-20">
          <Link
            href="/"
            className="flex items-center gap-2 text-white hover:text-[#4CAF50] transition-colors font-medium text-sm"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/IDU GROUP HOME.webp"
            alt="Background"
            fill
            sizes="100vw"
            className="object-cover blur-3xl brightness-[0.3] scale-110"
          />
        </div>

        {/* Card */}
        <div className="relative z-10 w-full max-w-5xl bg-white rounded-[45px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          {/* Left Image Panel */}
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

          {/* Right Form Panel */}
          <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12">
            {/* Toggle Tabs - Same as regular signup */}
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 rounded-full p-1 flex">
                <button className="px-6 py-2 rounded-full bg-[#4CAF50] text-white text-sm font-medium">
                  Sign up
                </button>
                <Link
                  href="/super-admin/login"
                  className="px-6 py-2 rounded-full text-gray-500 text-sm font-medium hover:text-gray-700"
                >
                  Log in
                </Link>
              </div>
            </div>

            {/* Title - Same style as regular signup */}
            <div className="text-center mb-2">
              <h2 className="text-3xl font-bold text-gray-900">
                Create Your <span className="text-[#4CAF50]">Admin</span>{" "}
                Account
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Fill in your details to get started
              </p>
            </div>

            {step === 1 ? (
              <form
                onSubmit={handleSubmit(onSubmitStep1)}
                className="space-y-4 mt-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4CAF50]"
                    />
                    <input
                      {...register("full_name", { required: "Required" })}
                      type="text"
                      placeholder="Admin Ace"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] text-sm bg-gray-50/50"
                    />
                  </div>
                  {errors.full_name && (
                    <p className="text-red-500 text-xs mt-0.5">
                      {errors.full_name.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Gender
                    </label>
                    <select
                      {...register("gender", { required: "Required" })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] text-sm bg-gray-50/50"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="others">Others</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Phone No
                    </label>
                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4CAF50]"
                      />
                      <input
                        {...register("phone_no", { required: "Required" })}
                        type="tel"
                        placeholder="090********"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] text-sm bg-gray-50/50"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4CAF50]"
                    />
                    <input
                      {...register("email", {
                        required: "Required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email",
                        },
                      })}
                      type="email"
                      placeholder="example@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] text-sm bg-gray-50/50"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-0.5">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4CAF50]"
                      />
                      <input
                        {...register("address", { required: "Required" })}
                        type="text"
                        placeholder="Address"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] text-sm bg-gray-50/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      State
                    </label>
                    <input
                      {...register("state", { required: "Required" })}
                      type="text"
                      placeholder="Lagos"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] text-sm bg-gray-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4CAF50]"
                    />
                    <input
                      {...register("password", {
                        required: "Required",
                        minLength: { value: 6, message: "Min 6 chars" },
                      })}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-12 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] text-sm bg-gray-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4CAF50]"
                    />
                    <input
                      {...register("confirmPassword", {
                        required: "Required",
                        validate: (value) =>
                          value === password || "Passwords don't match",
                      })}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-12 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] text-sm bg-gray-50/50"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Admin Secret Key
                  </label>
                  <div className="relative">
                    <KeyRound
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4CAF50]"
                    />
                    <input
                      {...register("adminSecretKey", { required: "Required" })}
                      type="password"
                      placeholder="rentulo_*************"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] text-sm bg-gray-50/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-[#4CAF50] text-white py-3 rounded-2xl font-bold hover:bg-[#43A047] shadow-lg shadow-green-100 transition-all active:scale-[0.98] disabled:opacity-50 mt-2 cursor-pointer"
                >
                  {registerMutation.isPending
                    ? "Creating Account..."
                    : "Create Admin Account"}
                </button>
              </form>
            ) : (
              <form onSubmit={onSubmitStep2} className="space-y-6 mt-4">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900">
                    Verify OTP
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Enter the 6-digit code sent to <strong>{email}</strong>
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength={6}
                    placeholder="123456"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-3 rounded-2xl transition-all disabled:opacity-60"
                >
                  {verifyMutation.isPending ? "Verifying..." : "Verify Account"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-gray-500 hover:text-gray-700 text-sm py-2"
                >
                  ← Back to Registration
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
