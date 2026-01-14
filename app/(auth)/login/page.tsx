"use client";
import React from "react";
import { Mail, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-10 overflow-hidden">
      {/* blurred bg*/}
      <div className="absolute inset-0 z-0">
        <Image
          src="/IDU GROUP HOME.png"
          alt="Background"
          fill
          priority
          className="object-cover blur-3xl brightness-[0.4] scale-110"
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl bg-white rounded-[45px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">
        {/* LEFT SIDE: Interior Image */}
        <div className="hidden md:block w-1/2 relative p-5">
          <div className="relative w-full h-full rounded-[35px] overflow-hidden">
            <Image
              src="/IDU GROUP HOME.png"
              alt="RentULO Login"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col p-8 md:p-16 justify-center text-center">
          <div className="flex justify-center mb-10">
            <div className="bg-gray-100 p-1.5 rounded-full flex items-center border border-gray-200">
              <button
                onClick={() => router.push("/signup")}
                className="px-8 py-2.5 text-sm font-bold text-gray-400 hover:text-gray-600 transition-all"
              >
                Sign up
              </button>
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

          <form className="space-y-5 text-left mt-10">
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-[#4CAF50]">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  placeholder="ikechukwuu338@gmail.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#4CAF50]/10 focus:border-[#4CAF50] transition-all"
                />
              </div>
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
                  type="password"
                  placeholder="Your password.."
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#4CAF50]/10 focus:border-[#4CAF50] transition-all"
                />
              </div>
            </div>
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-[#4CAF50] border-gray-300 rounded"
                />
                <span className="text-xs text-gray-500 font-medium group-hover:text-gray-700">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-xs text-[#4CAF50] font-bold hover:underline"
              >
                forgot password?
              </button>
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
            <div className="flex gap-4">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 bg-[#ECF5ED] py-3 rounded-2xl hover:bg-[#e2ede3] transition-all font-bold text-xs text-gray-700 shadow-sm shadow-green-50"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-4 h-4"
                  alt="Google"
                />
                Google
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 bg-[#ECF5ED] py-3 rounded-2xl hover:bg-[#e2ede3] transition-all font-bold text-xs text-gray-700 shadow-sm shadow-green-50"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                  className="w-4 h-4"
                  alt="Apple"
                />
                Apple
              </button>
            </div>
            <button className="w-full bg-[#4CAF50] text-white py-4 rounded-2xl font-bold hover:bg-[#43A047] shadow-xl shadow-green-100 transition-all active:scale-[0.98] mt-2">
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;
