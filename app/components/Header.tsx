"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiMenu,
  HiOutlineHeart,
  HiOutlineLockClosed,
  HiX,
} from "react-icons/hi";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { HiOutlineUser, HiOutlineCog, HiOutlineLogout } from "react-icons/hi";
import NotificationMenu from "./shared/NotificationMenu";
import { useState } from "react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const token = Cookies.get("ACCESS_TOKEN");

  const isLoggedIn = !!token;
  const showLoggedInUI = !!token && pathname !== "/login";

  const handleLogout = () => {
    Cookies.remove("ACCESS_TOKEN");
    Cookies.remove("USER_ROLE");
    router.push("/login");
  };

  return (
    <>
      <nav className="z-[110] sticky top-0 left-0 right-0 flex md:grid md:grid-cols-3 items-center justify-between px-6 md:px-12 py-4 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300">
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
        <div className="hidden md:flex justify-center">
          <ul className="flex gap-7">
            <Link
              href="/"
              className={`text-[15px] font-medium transition-all ${pathname === "/" ? "text-[#4CAF50] font-bold" : "text-gray-700 hover:text-[#4CAF50]"}`}
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

            {isLoggedIn && (
              <Link
                href="/tenant/dashboard"
                className={`text-[15px] font-medium transition-all ${pathname.includes("dashboard") ? "text-[#4CAF50] font-bold" : "text-gray-700 hover:text-[#4CAF50]"}`}
              >
                Dashboard
              </Link>
            )}

            <Link
              href="/#about"
              className="text-[15px] font-medium text-gray-700 hover:text-[#4CAF50]"
            >
              About Us
            </Link>
          </ul>
        </div>
        <div className="flex items-center justify-end gap-3">
          {/* UPDATED: Landing page shows Logout button if logged in, else Login */}
          {pathname === "/" ? (
            isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-8 py-2.5 rounded-xl text-white font-semibold text-sm bg-red-500 hover:bg-red-600 transition-all active:scale-95 cursor-pointer"
              >
                Log out
              </button>
            ) : (
              <Link href="/login">
                <button className="px-8 py-2.5 rounded-xl text-white font-semibold text-sm bg-[#43A047] hover:bg-green-600 transition-all active:scale-95 cursor-pointer">
                  Log in
                </button>
              </Link>
            )
          ) : showLoggedInUI ? (
            <div className="relative flex items-center gap-3">
              <NotificationMenu notificationPath="/tenant/notifications" />

              <div
                className="flex items-center gap-2 cursor-pointer border-l pl-3 border-gray-200 active:scale-95 transition-all"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
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
                  <p className="text-[10px] text-gray-500">Software engineer</p>
                </div>
              </div>

              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 top-14 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                      <p className="text-sm font-bold text-gray-900">David</p>
                      <p className="text-[10px] text-gray-500 truncate">
                        david.engineer@rentulo.com
                      </p>
                    </div>
                    <div className="p-2 flex flex-col gap-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          router.push("/tenant/profile");
                        }}
                        className="flex items-center gap-3 p-2.5 text-sm text-gray-600 hover:bg-green-50 hover:text-[#4CAF50] rounded-xl transition-all"
                      >
                        <HiOutlineUser size={18} /> Profile
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          router.push("/tenant/dashboard/settings");
                        }}
                        className="flex items-center gap-3 p-2.5 text-sm text-gray-600 hover:bg-green-50 hover:text-[#4CAF50] rounded-xl transition-all"
                      >
                        <HiOutlineCog size={18} /> Settings
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          router.push("/tenant/dashboard/locked-houses");
                        }}
                        className="flex items-center gap-3 p-2.5 text-sm text-gray-600 hover:bg-green-50 hover:text-[#4CAF50] rounded-xl transition-all"
                      >
                        <HiOutlineLockClosed size={18} /> Locked house
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          router.push("/tenant/dashboard/saved-houses");
                        }}
                        className="flex items-center gap-3 p-2.5 text-sm text-gray-600 hover:bg-green-50 hover:text-[#4CAF50] rounded-xl transition-all"
                      >
                        <HiOutlineHeart size={18} /> Saved house
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 p-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl mt-1 border-t border-gray-50 pt-3 transition-all"
                      >
                        <HiOutlineLogout size={18} /> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden md:block">
              <button className="px-8 py-2.5 rounded-xl text-white font-semibold text-sm bg-[#43A047] hover:bg-green-600 transition-all active:scale-95 cursor-pointer">
                Log in
              </button>
            </Link>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 border border-gray-200 rounded-lg bg-white shadow-sm ml-2"
          >
            {isOpen ? <HiX size={26} /> : <HiMenu size={26} />}
          </button>
        </div>
      </nav>
      <div
        className={`fixed inset-0 bg-white z-[105] flex flex-col items-center justify-center transition-transform duration-500 ease-in-out md:hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col items-center space-y-8 w-full px-10">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="text-2xl font-semibold text-gray-800"
          >
            Home
          </Link>
          {isLoggedIn && (
            <Link
              href="/tenant/dashboard"
              onClick={() => setIsOpen(false)}
              className="text-2xl font-semibold text-gray-800"
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/#listing"
            onClick={() => setIsOpen(false)}
            className="text-2xl font-semibold text-gray-800"
          >
            Property
          </Link>
          <Link
            href="/#about"
            onClick={() => setIsOpen(false)}
            className="text-2xl font-semibold text-gray-800"
          >
            About Us
          </Link>

          {isLoggedIn ? (
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              <button className="w-full py-4 bg-[#4CAF50] text-white font-bold rounded-2xl shadow-lg">
                Log in
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
