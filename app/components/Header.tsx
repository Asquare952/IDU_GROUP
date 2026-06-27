"use client";

import Image from "next/image";
import Link from "next/link";
import {
  HiMenu,
  HiOutlineHeart,
  HiOutlineLockClosed,
  HiX,
  HiOutlineViewGrid,
} from "react-icons/hi";
import { CiViewList } from "react-icons/ci";
import { useRouter, usePathname } from "next/navigation";
import { HiOutlineUser, HiOutlineCog, HiOutlineLogout } from "react-icons/hi";
import NotificationMenu from "./shared/NotificationMenu";
import { useState, useEffect, type ReactNode } from "react";
import { useAuth } from "./context/AuthContext";
import { useUserProfile } from "@/app/api/features/auth/auth.queries";
import { AuthResponse } from "@/app/api/features/auth/types";
import { readCachedProfile } from "@/app/api/features/auth/profile-cache";
import { getProfileDisplayFields } from "@/app/api/features/auth/profile-display";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { getCurrentUserRole } from "../lib/auth";


type HeaderUser = NonNullable<AuthResponse["user"]>;

type DecodedToken = {
  id?: string;
  sub?: string;
  userId?: string;
  _id?: string;
  email?: string;
  full_name?: string;
};

const Header = () => {
  const [userId, setUserId] = useState<string>();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [cachedProfile, setCachedProfile] = useState<HeaderUser>();
  const [decodedProfile, setDecodedProfile] = useState<Partial<HeaderUser>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, logout } = useAuth();

  const showLoggedInUI = isLoggedIn && pathname !== "/login";
  const showJoinUs = !isLoggedIn;
  const isJoinUsPage = pathname === "/signup" || pathname === "/confirm-otp";
  const userRole = isHydrated ? getCurrentUserRole() : null;


  useEffect(() => {
    const token = Cookies.get("ACCESS_TOKEN");
    setCachedProfile(readCachedProfile() as HeaderUser | undefined);

    if (!token) {
      setHasCheckedAuth(true);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUserId(decoded.id ?? decoded.userId ?? decoded._id ?? decoded.sub);
      setDecodedProfile({
        email: decoded.email,
        full_name: decoded.full_name,
      });
    } catch {
      setUserId(undefined);
      setDecodedProfile({});
    } finally {
      setHasCheckedAuth(true);
    }
  }, []);

  const { data: user, isLoading } = useUserProfile(userId, hasCheckedAuth);
  const displayUser = {
    ...user,
    ...cachedProfile,
  };
  const cachedDisplay = getProfileDisplayFields(cachedProfile);
  const userDisplay = getProfileDisplayFields(user);
  const decodedDisplay = getProfileDisplayFields(decodedProfile);

  const displayFirstName =
    userDisplay.firstName || cachedDisplay.firstName || decodedDisplay.firstName;
  const displayLastName =
    userDisplay.lastName || cachedDisplay.lastName || decodedDisplay.lastName;
  const displayName =
    [displayFirstName, displayLastName].filter(Boolean).join(" ").trim() ||
    userDisplay.fullName ||
    cachedDisplay.fullName ||
    decodedDisplay.fullName;
  const displayEmail =
    userDisplay.email || cachedDisplay.email || decodedDisplay.email;
  const displayProfileImage = user
    ? userDisplay.profileImage
    : cachedDisplay.profileImage || decodedDisplay.profileImage;
  const initials =
    (displayName || "")
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() ||
    "U";

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  type ProfileMenuItem = {
    label: string;
    href?: string;
    icon: ReactNode;
  };

  const landlordMenuItems: ProfileMenuItem[] = [
    {
      label: "Profile",
      href: "/landlord/profile",
      icon: <HiOutlineUser size={18} />,
    },
    {
      label: "Dashboard",
      href: "/landlord/dashboard",
      icon: <HiOutlineViewGrid size={18} />,
    },
    {
      label: "Settings",
      href: "/landlord/settings",
      icon: <HiOutlineCog size={18} />,
    },
    {
      label: "My listings",
      href: "/landlord/my-listings",
      icon: <CiViewList size={18} />,
    },
  ];

  const tenantMenuItems: ProfileMenuItem[] = [
    {
      label: "Profile",
      href: "/tenant/profile",
      icon: <HiOutlineUser size={18} />,
    },
    {
      label: "Dashboard",
      href: "/tenant/dashboard",
      icon: <HiOutlineViewGrid size={18} />,
    },
    {
      label: "Settings",
      href: "/tenant/settings",
      icon: <HiOutlineCog size={18} />,
    },
    {
      label: "Locked house",
      href: "/tenant/locked-house",
      icon: <HiOutlineLockClosed size={18} />,
    },
    {
      label: "Saved house",
      href: "/tenant/saved-house",
      icon: <HiOutlineHeart size={18} />,
    },
  ];

  const profileMenuItems =
    isHydrated && userRole === "landlord"
      ? landlordMenuItems
      : tenantMenuItems;

  const handleLogout = () => {
    setIsOpen(false);
    setIsProfileOpen(false);
    logout();
  };

  return (
    <>
      <nav className="z-[110] sticky top-0 left-0 right-0 flex md:grid md:grid-cols-3 items-center justify-between px-6 md:px-12 py-4 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300">
        <Link
          href="/"
          className="flex items-center text-2xl font-bold text-gray-900 tracking-tight"
        >
          <Image
            src="/IDU GROUP LOGO.png"
            alt="Logo"
            width={28}
            height={28}
            className="mr-2"
          />
          Rent<span className="text-[#4CAF50]">ULO</span>
        </Link>
        <div className="hidden md:flex justify-center">
          <ul className="flex gap-7">
            <Link
              href="/"
              className={`text-[15px] font-medium transition-all ${pathname === "/" ? "text-[#4CAF50] font-bold" : "text-gray-700 hover:text-[#4CAF50]"}`}
            >
              Home
            </Link>

            <Link
              href="/#listing"
              className={`text-[15px] font-medium transition-all ${
                pathname === "/tenant/homepage" || pathname === "/#listing"
                  ? "text-[#4CAF50] font-bold"
                  : "text-gray-700 hover:text-[#4CAF50]"
              }`}
            >
              Property
            </Link>

            <Link
              href="/about-us"
              className={`text-[15px] font-medium transition-all ${pathname.includes("about-us") ? "text-[#4CAF50] font-bold" : "text-gray-700 hover:text-[#4CAF50]"}`}
            >
              About Us
            </Link>

            {showJoinUs && (
              <Link
                href="/signup"
                className={`text-[15px] font-medium transition-all ${
                  isJoinUsPage
                    ? "text-[#4CAF50] font-bold"
                    : "text-gray-700 hover:text-[#4CAF50]"
                }`}
              >
                Join us
              </Link>
            )}
          </ul>
        </div>
        <div className="flex items-center justify-end gap-3">
          <div className="flex items-center gap-3">
            {showLoggedInUI ? (
              <div className="relative flex items-center gap-3">
                {/* Notification bell — hidden on mobile, shown on md+ */}
                <div className="hidden md:block">
                  <NotificationMenu notificationPath="/tenant/notifications" />
                </div>

                {/* Profile trigger — just image on mobile, image + name on desktop */}
                {isLoading && !displayUser ? (
                  <p className="text-sm text-[#999EA5]">Loading...</p>
                ) : displayUser ? (
                  <div
                    className="flex items-center gap-2 cursor-pointer md:border-l md:pl-3 md:border-gray-200 active:scale-95 transition-all"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    {displayProfileImage ? (
                      <Image
                        src={displayProfileImage}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full border-2 border-[#4CAF50] object-cover aspect-square"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#43A047] text-sm font-semibold text-white">
                        {initials}
                      </div>
                    )}
                    <div className="hidden lg:block text-left">
                      <p className="text-xs font-bold text-gray-900 leading-none">
                        {displayName}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {displayEmail}
                      </p>
                    </div>
                  </div>
                ) : null}

                {/* Dropdown — fixed positioning for mobile, absolute for desktop */}
                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    {/* MOBILE DROPDOWN: fixed to top-right of viewport, pushed down below header */}
                    <div className="fixed right-4 top-20 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 overflow-hidden md:hidden">
                      <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-sm font-bold text-gray-900">
                          {displayName}
                        </p>
                        <p className="text-[10px] text-gray-500 truncate">
                          {displayEmail}
                        </p>
                      </div>
                      <div className="p-2 flex flex-col gap-1">
                        {profileMenuItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href ?? "#"}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 p-2.5 text-sm text-gray-600 hover:bg-green-50 hover:text-[#4CAF50] rounded-xl transition-all"
                          >
                            {item.icon}
                            {item.label}
                          </Link>
                        ))}

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
                    {/* DESKTOP DROPDOWN: absolute positioned relative to parent */}
                    <div className="hidden md:block absolute right-0 top-14 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 overflow-hidden">
                      <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-sm font-bold text-gray-900">
                          {displayName}
                        </p>
                        <p className="text-[10px] text-gray-500 truncate">
                          {displayEmail}
                        </p>
                      </div>
                      <div className="p-2 flex flex-col gap-1">
                        {profileMenuItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href ?? "#"}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 p-2.5 text-sm text-gray-600 hover:bg-green-50 hover:text-[#4CAF50] rounded-xl transition-all"
                          >
                            {item.icon}
                            {item.label}
                          </Link>
                        ))}

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
              <Link
                href="/login"
                className="hidden md:inline-flex px-8 py-2.5 rounded-xl text-white font-semibold text-sm bg-[#43A047] hover:bg-green-600 transition-all active:scale-95 cursor-pointer"
              >
                Log in
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 border border-gray-200 rounded-lg bg-white shadow-sm ml-2"
          >
            {isOpen ? <HiX size={26} /> : <HiMenu size={26} />}
          </button>
        </div>
      </nav>
      {isOpen && (
        <>
          {/* BACKDROP — click outside to close */}
          <div
            className="fixed inset-0 bg-black/40 z-[104] md:hidden backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* SLIDE-IN MENU */}
          <div
            className={`fixed top-0 right-0 h-full w-[280px] max-w-[75vw] bg-white z-[105] shadow-[-4px_0_24px_rgba(0,0,0,0.1)] md:hidden flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            {/* Header with logo + close button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="text-lg font-bold text-gray-900">
                Rent<span className="text-[#4CAF50]">ULO</span>
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HiX size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Menu links — smaller text, left-aligned, active state */}
            <div className="flex flex-col p-4 gap-1">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className={`text-base font-medium px-4 py-3 rounded-xl transition-all ${pathname === "/" ? "text-[#4CAF50] bg-green-50" : "text-gray-700 hover:bg-gray-50"}`}
              >
                Home
              </Link>
              <Link
                href={isLoggedIn ? "/tenant/homepage" : "/#listing"}
                onClick={() => setIsOpen(false)}
                className={`text-base font-medium px-4 py-3 rounded-xl transition-all ${pathname === "/tenant/homepage" || pathname === "/#listing" ? "text-[#4CAF50] bg-green-50" : "text-gray-700 hover:bg-gray-50"}`}
              >
                Property
              </Link>
              <Link
                href="/about-us"
                onClick={() => setIsOpen(false)}
                className={`text-base font-medium px-4 py-3 rounded-xl transition-all ${pathname.includes("about-us") ? "text-[#4CAF50] bg-green-50" : "text-gray-700 hover:bg-gray-50"}`}
              >
                About Us
              </Link>
              {showJoinUs && (
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-medium px-4 py-3 rounded-xl transition-all ${isJoinUsPage ? "text-[#4CAF50] bg-green-50" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  Join us
                </Link>
              )}
            </div>

            {/* Bottom button */}
            <div className="mt-auto p-4 border-t border-gray-100">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full inline-flex items-center justify-center py-3 bg-[#4CAF50] text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
