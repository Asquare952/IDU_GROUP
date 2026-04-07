"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { HiMenu, HiX } from "react-icons/hi";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { HiOutlineBell, HiOutlineChatAlt2 } from "react-icons/hi";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const token = Cookies.get("ACCESS_TOKEN");

  // 2. Define the two types of logic you need:
  // isLoggedIn: True if a token exists (used for Join Us link)
  const isLoggedIn = !!token;

  // showLoggedInUI: True ONLY if token exists AND we aren't on public pages
  // This is what hides the Logout button on / and /login
  const showLoggedInUI = !!token && pathname !== "/login" && pathname !== "/";

  const handleLogout = () => {
    Cookies.remove("ACCESS_TOKEN");
    Cookies.remove("USER_ROLE");
    router.push("/login");
  };

  const isFetching = useIsFetching();
  const queryClient = useQueryClient();

  const isUpdatingHouses = queryClient
    .getQueryCache()
    .findAll({
      queryKey: ["properties-list"],
      exact: false,
    })
    .some((query) => query.state.status === "pending");

  return (
    <>
      <nav className="z-[110] sticky top-0 left-0 right-0 flex items-center justify-between px-6 md:px-12 py-4 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300">
        <div className="flex items-center text-2xl font-bold text-gray-900 tracking-tight">
          <Image
            src="/IDU GROUP LOGO.png"
            alt="Logo"
            width={28}
            height={28}
            className="mr-2"
          />
          Rent<span className="text-[#4CAF50]">ULO</span>
        </div>
        <div className="hidden md:flex items-center">
          <ul className="flex gap-7">
            <Link
              href="/"
              className="text-[15px] font-medium text-gray-700 hover:text-[#4CAF50]"
            >
              Home
            </Link>
            <Link
              href={isLoggedIn ? "/tenant/homepage" : "/#listing"}
              className={`text-[15px] font-medium transition-all ${
                pathname === "/tenant/homepage" || pathname === "/#listing"
                  ? "text-[#4CAF50] font-bold"
                  : "text-gray-700 hover:text-[#4CAF50]"
              }`}
            >
              Property
            </Link>
            <Link
              href="/#about"
              className="text-[15px] font-medium text-gray-700 hover:text-[#4CAF50]"
            >
              About Us
            </Link>
            {!isLoggedIn && (
              <Link
                href="/signup"
                className="text-[15px] font-medium text-gray-700 hover:text-[#4CAF50]"
              >
                Join Us
              </Link>
            )}
          </ul>
        </div>
        <div className="flex items-center gap-4">
          {!showLoggedInUI ? (
            <Link href="/login">
              <button className="px-8 py-2.5 rounded-xl text-white font-semibold text-sm bg-[#43A047] hover:bg-green-600 transition-all active:scale-95 cursor-pointer">
                Log in
              </button>
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              {/* 1. Notifications with the little red dot */}
              <div className="relative cursor-pointer text-gray-600 hover:text-[#4CAF50]">
                <HiOutlineBell size={24} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </div>

              {/* 2. Messages/Chat Icon */}
              <div className="cursor-pointer text-gray-600 hover:text-[#4CAF50]">
                <HiOutlineChatAlt2 size={24} />
              </div>
              <div className="flex items-center gap-2 cursor-pointer border-l pl-4 border-gray-200">
                <Image
                  src="/Iyke ace.jpg"
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-[#4CAF50] object-cover aspect-square"
                />
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-gray-900 leading-none">
                    David
                  </p>
                  <p className="text-[10px] text-gray-500">Software engineer</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 border border-gray-200 rounded-lg bg-white shadow-sm z-[110]"
        >
          {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-white z-[105] flex flex-col items-center justify-center transition-transform duration-500 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center space-y-8 w-full px-10">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="text-2xl font-semibold text-gray-800 hover:text-[#4CAF50]"
          >
            Home
          </Link>
          <Link
            href="/#listing"
            onClick={() => setIsOpen(false)}
            className="text-2xl font-semibold text-gray-800 hover:text-[#4CAF50]"
          >
            Property
          </Link>
          <Link
            href="/#about"
            onClick={() => setIsOpen(false)}
            className="text-2xl font-semibold text-gray-800 hover:text-[#4CAF50]"
          >
            About Us
          </Link>
          <Link
            href="/tenant/dashboard"
            onClick={() => setIsOpen(false)}
            className="text-2xl font-semibold text-gray-800 hover:text-[#4CAF50]"
          >
            Dashboard
          </Link>

          {!isLoggedIn && (
            <Link
              href="/signup"
              onClick={() => setIsOpen(false)}
              className="text-2xl font-semibold text-gray-800 hover:text-[#4CAF50]"
            >
              Join Us
            </Link>
          )}

          {/* Mobile Auth Button */}
          {!showLoggedInUI ? (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              <button className="w-full py-4 bg-[#4CAF50] text-white font-bold rounded-2xl shadow-lg">
                Log in
              </button>
            </Link>
          ) : (
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
