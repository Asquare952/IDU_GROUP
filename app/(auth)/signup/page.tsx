"use client";
import React from "react";
import { User, Mail, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-10 overflow-hidden">
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
        {/* Left Image */}
        <div className="hidden md:block w-1/2 relative p-5">
          <div className="relative w-full h-full rounded-[35px] overflow-hidden">
            <Image
              src="/IDU GROUP HOME.png"
              alt="RentULO"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col p-8 md:p-16 justify-center text-center">
          <div className="flex justify-center mb-10">
            <div className="bg-gray-100 p-1.5 rounded-full flex items-center border border-gray-200">
              <button className="px-8 py-2.5 bg-[#4CAF50] text-white text-sm font-bold rounded-full shadow-lg">
                Sign up
              </button>
              <button
                onClick={() => router.push("/login")}
                className="px-8 py-2.5 text-sm font-bold text-gray-400 hover:text-gray-600 transition-all"
              >
                Log in
              </button>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Create Your Rent<span className="text-[#4CAF50]">ULO</span> Account
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Join our community of verified house seekers and landlords
          </p>

          <form className="space-y-5 text-left mt-8">
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">
                Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-[#4CAF50]">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Your name.."
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#4CAF50]/10 focus:border-[#4CAF50] transition-all"
                />
              </div>
            </div>
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

            <div className="flex justify-center gap-6 py-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="role"
                  className="accent-[#4CAF50] w-4 h-4"
                />
                <span className="text-sm font-semibold text-gray-600 group-hover:text-[#4CAF50]">
                  Landlord?
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="role"
                  className="accent-[#4CAF50] w-4 h-4"
                />
                <span className="text-sm font-semibold text-gray-600 group-hover:text-[#4CAF50]">
                  Properties seeker?
                </span>
              </label>
            </div>

            <p className="text-[10px] text-gray-400 text-center leading-relaxed">
              By creating an account, you agree to our
              <Link
                href="/terms"
                className="text-[#4CAF50] font-bold hover:underline gap-4"
              >
                Terms and Conditions
              </Link>
            </p>

            <button className="w-full bg-[#4CAF50] text-white py-4 rounded-2xl font-bold hover:bg-[#43A047] shadow-xl shadow-green-100 transition-all active:scale-[0.98]">
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;
