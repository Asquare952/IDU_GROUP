"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { HiMenu, HiX } from "react-icons/hi";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const token = Cookies.get("ACCESS_TOKEN");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    Cookies.remove("ACCESS_TOKEN");
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
              href="/#listing"
              className="text-[15px] font-medium text-gray-700 hover:text-[#4CAF50]"
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
          {!isLoggedIn ? (
            <Link href="/login">
              <button className="hidden md:block px-8 py-2.5 rounded-xl text-white font-semibold text-sm bg-[#43A047] hover:bg-green-600 transition-all active:scale-95 cursor-pointer">
                Log in
              </button>
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="hidden md:block px-8 py-2.5 rounded-xl text-white font-semibold text-sm bg-red-500 hover:bg-red-600 transition-all active:scale-95 cursor-pointer"
            >
              Logout
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 border border-gray-200 rounded-lg bg-white shadow-sm z-[110]"
          >
            {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </nav>
      <div
        className={`fixed inset-0 bg-white z-[105] flex flex-col items-center justify-center transition-transform duration-500 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* mobile view section */}
        <div className="flex flex-col items-center space-y-8">
          <Link
            href="#"
            onClick={() => setIsOpen(false)}
            className="text-2xl font-semibold text-gray-800 hover:text-[#4CAF50]"
          >
            Home
          </Link>

          {/* PROPERTY - scrolls to listing section */}
          <Link
            href="/#listing"
            onClick={() => setIsOpen(false)}
            className="text-2xl font-semibold text-gray-800 hover:text-[#4CAF50]"
          >
            Property
          </Link>

          {/* ABOUT US - scrolls to about section */}
          <Link
            href="/#about"
            onClick={() => setIsOpen(false)}
            className="text-2xl font-semibold text-gray-800 hover:text-[#4CAF50]"
          >
            About Us
          </Link>

          {/* SHOW JOIN US ONLY IF NOT LOGGED IN */}
          {!isLoggedIn && (
            <Link
              href="/signup"
              onClick={() => setIsOpen(false)}
              className="text-2xl font-semibold text-gray-800 hover:text-[#4CAF50]"
            >
              Join Us
            </Link>
          )}

          {/* LOGIN / LOGOUT BUTTON */}
          {!isLoggedIn ? (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="block w-full"
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
