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

  const isLoggedIn = !!token;
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
      {/* Change: Use flex on mobile, and grid only on md screens and up */}
      <nav className="z-[110] sticky top-0 left-0 right-0 flex md:grid md:grid-cols-3 items-center justify-between px-6 md:px-12 py-4 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300">
        {/* 1. LEFT SIDE: Logo */}
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

        {/* 2. CENTER: Nav Items (Visible only on Desktop) */}
        <div className="hidden md:flex justify-center">
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

        {/* 3. RIGHT SIDE: Auth/Icons + Mobile Toggle */}
        <div className="flex items-center justify-end gap-3">
          {/* Desktop Auth View */}
          <div className="hidden md:flex items-center gap-3">
            {!showLoggedInUI ? (
              <Link href="/login">
                <button className="px-8 py-2.5 rounded-xl text-white font-semibold text-sm bg-[#43A047] hover:bg-green-600 transition-all active:scale-95 cursor-pointer">
                  Log in
                </button>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <div className="relative cursor-pointer text-gray-600 hover:text-[#4CAF50]">
                  <HiOutlineBell size={24} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </div>
                <div className="flex items-center gap-2 cursor-pointer border-l pl-3 border-gray-200">
                  <Image
                    src="/Iyke ace.jpg"
                    alt="Profile"
                    width={36}
                    height={36}
                    className="rounded-full border-2 border-[#4CAF50] object-cover aspect-square"
                  />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-gray-900 leading-none">
                      David
                    </p>
                    <p className="text-[10px] text-gray-500">
                      Software engineer
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile-Only Icons (Visible when logged in on mobile) */}
          {showLoggedInUI && (
            <div className="md:hidden flex items-center gap-3 mr-2">
              <HiOutlineBell size={22} className="text-gray-600" />
              <Image
                src="/Iyke ace.jpg"
                alt="Profile"
                width={30}
                height={30}
                className="rounded-full border-2 border-[#4CAF50] object-cover aspect-square"
              />
            </div>
          )}

          {/* Mobile Toggle Button (Visible only on Mobile) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 border border-gray-200 rounded-lg bg-white shadow-sm"
          >
            {isOpen ? <HiX size={26} /> : <HiMenu size={26} />}
          </button>
        </div>
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
          {!showLoggedInUI ? (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              <button className="w-full py-4 bg-[#4CAF50] text-white font-bold rounded-2xl">
                Log in
              </button>
            </Link>
          ) : (
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl"
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
