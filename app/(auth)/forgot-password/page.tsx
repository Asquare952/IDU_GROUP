"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineMail, HiArrowLeft } from "react-icons/hi";
import { useForgotPassword } from "../../api/features/auth/auth.queries";

const page = () => {
  const [email, setEmail] = useState("");
  const { mutate, isPending } = useForgotPassword();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email });
  };

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="min-h-screen flex flex-col items-center justify-start md:justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/IDU GROUP HOME.webp"
            alt="Background"
            fill
            priority
            sizes="100vw"
            className="object-cover blur-xl brightness-[0.5] scale-105"
          />
        </div>
        <div className="relative z-10 w-full flex flex-col items-center mt-12 md:mt-0">
          <Link
            href="/login"
            className="self-start flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors mb-6 md:fixed md:top-8 md:left-8"
          >
            <HiArrowLeft /> Back to Login
          </Link>
          <div className="w-full max-w-[460px] bg-white rounded-[32px] shadow-2xl p-8 md:p-14 border border-white/10 flex flex-col items-center mt-20 md:mt-0">
            <div className="flex items-center text-2xl font-bold text-gray-900 tracking-tight mb-6">
              <Image
                src="/IDU GROUP LOGO.png"
                alt="Logo"
                width={32}
                height={32}
                className="mr-2"
              />
              Rent<span className="text-[#4CAF50]">ULO</span>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Recover Your Account
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed px-4">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[1.5px] ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#4CAF50] transition-colors">
                    <HiOutlineMail size={20} />
                  </div>
                  <input
                    type="email"
                    required
                    disabled={isPending}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="johndoe@example.com"
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-[20px] text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/10 focus:border-[#4CAF50] focus:bg-white transition-all placeholder:text-gray-400 text-gray-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className={`w-full py-4 md:py-5 bg-[#4CAF50] text-white font-bold rounded-[20px] shadow-xl transition-all duration-200 cursor-pointer
                ${isPending ? "opacity-70 cursor-not-allowed" : "hover:bg-green-600 active:scale-[0.97]"}`}
              >
                {isPending ? "Sending Link..." : "Recover Password"}
              </button>
            </form>

            <p className="mt-8 text-sm text-gray-400 flex items-center justify-center gap-2">
              Need help?
              <Link
                href="/support"
                className="text-[#4CAF50] font-bold hover:underline"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
