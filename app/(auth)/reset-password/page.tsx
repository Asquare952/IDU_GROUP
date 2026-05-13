"use client";
import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineLockClosed, HiArrowLeft, HiEye, HiEyeOff } from "react-icons/hi";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useResetPassword } from "../../api/features/auth/auth.queries";

// Separate content to handle useSearchParams in Suspense
const ResetPasswordContent = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const otpCode = searchParams.get("otpCode") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const {mutate: resetPassword, isPending} = useResetPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    // console.log("Submitting:", { email, otpCode, password });
    resetPassword({
      email,
      otpCode,
      newPassword: password
    })
  };

  return (
    <>
    {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    <div className="min-h-screen flex flex-col items-center justify-start px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/IDU GROUP HOME.webp"
          alt="Background"
          fill
          priority
          className="object-cover blur-xl brightness-[0.5] scale-105"
        />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center mt-12 md:mt-20">
        <Link
          href="/login"
          className="self-start flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white mb-6 md:fixed md:top-8 md:left-8"
        >
          <HiArrowLeft /> Back to Login
        </Link>
        <div className="w-full max-w-[460px] bg-white rounded-[32px] shadow-2xl p-8 md:p-14 border border-white/10 flex flex-col items-center mt-20 md:mt-o">
          <div className="flex items-center text-2xl font-bold text-gray-900 mb-6">
            <Image src="/IDU GROUP LOGO.png" alt="Logo" width={32} height={32} className="mr-2" />
            Rent<span className="text-[#4CAF50]">ULO</span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-500 text-sm">Make sure both passwords are matching</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4CAF50] text-xl transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-transparent rounded-2xl focus:border-[#4CAF50] focus:bg-white outline-none transition-all"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative group">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4CAF50] text-xl transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:border-[#4CAF50] focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-[#4CAF50] text-white font-bold rounded-2xl shadow-xl hover:bg-green-600 active:scale-[0.98] transition-all mt-4 cursor-pointer"
            >
              Reset password
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

// Main page export with Suspense for Next.js 13+ searchParams
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}