"use client";
import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Header";
import Footer from "../../components/Footer";

const page = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send data to your database
    console.log("Form submitted!");
    router.push("/"); // Send them home after signup
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-10 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/IDU GROUP HOME.png"
            alt="Background"
            fill
            priority
            className="object-cover blur-3xl brightness-[0.4] scale-110"
          />
        </div>

        <div className="relative z-10 w-full max-w-6xl bg-white rounded-[45px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[750px]">
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

          <div className="w-full md:w-1/2 flex flex-col p-8 md:p-12 justify-center text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 p-1.5 rounded-full flex items-center border border-gray-200">
                <button className="px-8 py-2.5 bg-[#4CAF50] text-white text-sm font-bold rounded-full shadow-lg">
                  Sign up
                </button>
                <Link
                  href="/login"
                  className="px-8 py-2.5 text-sm font-bold text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
                >
                  Log in
                </Link>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
              Create Your Rent<span className="text-[#4CAF50]">ULO</span>{" "}
              Account
            </h1>
            <p className="text-gray-500 text-sm font-medium mb-6">
              Fill in your details to get started
            </p>

            {/* Registration Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4 text-left overflow-y-auto pr-2 max-h-[550px] custom-scrollbar"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    First Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-4 flex items-center text-[#4CAF50]">
                      <User size={16} />
                    </span>
                    <input
                      required
                      type="text"
                      placeholder="John"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-[#4CAF50] transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Last Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Doe"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-[#4CAF50] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Gender
                  </label>
                  <div className="relative">
                    <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none appearance-none cursor-pointer">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Phone No
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-4 flex items-center text-[#4CAF50]">
                      <Phone size={16} />
                    </span>
                    <input
                      required
                      type="tel"
                      placeholder="080..."
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-[#4CAF50]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-[#4CAF50]">
                    <Mail size={16} />
                  </span>
                  <input
                    required
                    type="email"
                    placeholder="example@rentulonigeria.com"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-[#4CAF50]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-4 flex items-center text-[#4CAF50]">
                      <MapPin size={16} />
                    </span>
                    <input
                      required
                      type="text"
                      placeholder="123 Street"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    State
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Lagos"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-[#4CAF50]">
                    <Lock size={16} />
                  </span>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-[#4CAF50]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-[#4CAF50]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-center gap-8 py-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="role"
                    required
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
                    Seeker?
                  </span>
                </label>
              </div>

              <p className="text-[10px] text-gray-400 text-center">
                By creating an account, you agree to our
                <Link
                  href="/terms"
                  className="text-[#4CAF50] font-bold hover:underline ml-1"
                >
                  Terms and Conditions
                </Link>
              </p>

              <button className="w-full bg-[#4CAF50] text-white py-4 rounded-2xl font-bold hover:bg-[#43A047] shadow-xl shadow-green-100 transition-all active:scale-[0.98] cursor-pointer">
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default page;
