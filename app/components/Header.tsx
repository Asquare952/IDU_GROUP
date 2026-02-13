"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
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
      <nav className="z-[100] sticky top-0 left-0 right-0 flex items-center justify-between px-6 md:px-12 py-4 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300">
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
            {["Home", "House", "Property", "About Us", "Join Us"].map(
              (item) => (
                <Link
                  key={item}
                  href={item === "Join Us" ? "/signup" : "/#"}
                  className="text-[15px] font-medium text-gray-700 hover:text-[#4CAF50] transition-colors"
                >
                  {item}
                </Link>
              ),
            )}
          </ul>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <button className="hidden md:block px-8 py-2.5 rounded-xl text-white font-semibold text-sm bg-[#43A047] hover:bg-green-600 transition-all active:scale-95 cursor-pointer">
              Log in
            </button>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 border border-gray-200 rounded-lg bg-white shadow-sm z-[110] cursor-pointer"
          >
            <span
              className={`bg-gray-800 block transition-all duration-300 h-0.5 w-5 rounded-sm ${isOpen ? "rotate-45 translate-y-1.5" : "-translate-y-1"}`}
            ></span>
            <span
              className={`bg-gray-800 block transition-all duration-300 h-0.5 w-5 rounded-sm my-0.5 ${isOpen ? "opacity-0" : "opacity-100"}`}
            ></span>
            <span
              className={`bg-gray-800 block transition-all duration-300 h-0.5 w-5 rounded-sm ${isOpen ? "-rotate-45 -translate-y-1" : "translate-y-1"}`}
            ></span>
          </button>
        </div>
      </nav>
      <div
        className={`fixed inset-0 bg-white z-[105] flex flex-col items-center justify-center transition-transform duration-500 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center space-y-8">
          {["Home", "House", "Property", "About Us", "Join Us"].map((item) => (
            <Link
              key={item}
              href={item === "Join Us" ? "/signup" : "/#"}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-semibold text-gray-800 hover:text-[#4CAF50]"
            >
              {item}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => {
              console.log("Login clicked!");
              setIsOpen(false);
            }}
            className="relative z-[999] block w-full"
          >
            <button className="w-full py-4 bg-[#4CAF50] text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform">
              Log in
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
