import React from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <div>
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-45">
          <div className="flex items-center text-2xl font-bold text-black-500 tracking-wider">
            <Image
              src="/IDU GROUP LOGO.png"
              alt="Rentulo Logo Icon"
              width={28}
              height={28} 
              className="mr-2" 
            />
            RENT
            <span className="text-green-500 font-family: ui-monospace, SFMono-Regular, ...">
              ULO
            </span>
          </div>
          <div className="hidden md:flex space-x-8 text-black text-lg">
            <Link
              href="/"
              className="hover:text-gray-300 transition duration-150 "
            >
              Home
            </Link>
            <Link
              href="/house"
              className="hover:text-gray-300 transition duration-150"
            >
              House
            </Link>
            <Link
              href="/property"
              className="hover:text-gray-300 transition duration-150"
            >
              Property
            </Link>
            <Link
              href="/about"
              className="hover:text-gray-300 transition duration-150"
            >
              About Us
            </Link>
            <Link
              href="/join"
              className="hover:text-gray-300 transition duration-150"
            >
              Join Us
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <button
              className="px-6 py-2 rounded-lg text-black font-semibold hover:text-gray-300 transition duration-150 cursor-pointer"
              style={{ backgroundColor: "#84D8B5" }}
            >
              Log in
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
