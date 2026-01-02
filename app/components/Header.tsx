"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-transparent flex items-center justify-between py-6 px-6 md:px-12 relative z-[100]">
      <div className="flex items-center text-2xl font-bold text-gray-900 tracking-tight">
        <Image
          src="/IDU GROUP LOGO.png"
          alt="RentULO Logo"
          width={28}
          height={28}
          className="mr-2"
        />
        Rent<span className="text-[#4CAF50]">ULO</span>
      </div>
      {/* 123 */}
      <div className="hidden md:flex items-center space-x-10 ">
        <ul className="flex gap-7">
          <a href="/">Home</a>
          <a href="#listing">House</a>
          <a href="#post">Property</a>
          <a href="#about">About Us</a>
          <a href="#join">Join Us</a>
        </ul>
      </div>

      <div className="flex items-center gap-4">
        <button className="px-6 md:px-8 py-2 md:py-2.5 rounded-lg md:rounded-xl text-white font-semibold text-sm transition duration-150 active:scale-95 shadow-sm cursor-pointer bg-[#43A047] hover:bg-green-600">
          Log in
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 border border-gray-200 rounded-lg bg-white shadow-sm z-[110]"
        >
          <span
            className={`bg-gray-800 block transition-all duration-300 h-0.5 w-5 rounded-sm ${isOpen ? "rotate-45 translate-y-1" : "-translate-y-1"}`}
          ></span>
          <span
            className={`bg-gray-800 block transition-all duration-300 h-0.5 w-5 rounded-sm my-0.5 ${isOpen ? "opacity-0" : "opacity-100"}`}
          ></span>
          <span
            className={`bg-gray-800 block transition-all duration-300 h-0.5 w-5 rounded-sm ${isOpen ? "-rotate-45 -translate-y-1" : "translate-y-1"}`}
          ></span>
        </button>
      </div>
      <div
        className={`fixed inset-0 bg-white z-[105] flex flex-col items-center justify-center transition-transform duration-300 md:hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div
          className={`fixed inset-0 bg-white z-[105] flex flex-col items-center justify-center transition-transform duration-300 md:hidden ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col items-center space-y-8">
            <a
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-2xl font-semibold text-gray-800"
            >
              Home
            </a>
            <a
              href="#listing"
              onClick={() => setIsOpen(false)}
              className="text-2xl font-semibold text-gray-800"
            >
              House
            </a>
            <a
              href="#post"
              onClick={() => setIsOpen(false)}
              className="text-2xl font-semibold text-gray-800"
            >
              Property
            </a>
            <a
              href="#about"
              onClick={() => setIsOpen(false)}
              className="text-2xl font-semibold text-gray-800"
            >
              About Us
            </a>
            <a
              href="#join"
              onClick={() => setIsOpen(false)}
              className="text-2xl font-semibold text-gray-800"
            >
              Join Us
            </a>

            <button className="mt-4 px-10 py-3 rounded-full bg-[#4CAF50] text-white font-bold text-lg shadow-lg cursor-pointer">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
