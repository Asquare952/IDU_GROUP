"use client";

import { FC, FormEvent, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import { Menu, Search, X } from "lucide-react";
import { useUserProfile } from "@/app/api/features/auth/auth.queries";
import { AuthResponse } from "@/app/api/features/auth/types";
import { readCachedProfile } from "@/app/api/features/auth/profile-cache";
import DesktopSearch from "./UI/search/DesktopSearch";
import NotificationBell from "./UI/NotificationBell";
import Link from "next/link";

interface HeaderProps {
  onMenuClick: () => void;
}

type HeaderUser = NonNullable<AuthResponse["user"]>;

type DecodedToken = {
  id?: string;
  sub?: string;
  userId?: string;
  _id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
};

const Header: FC<HeaderProps> = ({ onMenuClick }) => {
  const [userId, setUserId] = useState<string>();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [cachedProfile, setCachedProfile] = useState<HeaderUser>();
  const [decodedProfile, setDecodedProfile] = useState<Partial<HeaderUser>>({});
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mobileSearchValue, setMobileSearchValue] = useState("");

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
        first_name: decoded.first_name,
        last_name: decoded.last_name,
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
  const displayFirstName =
    cachedProfile?.first_name ?? user?.first_name ?? decodedProfile.first_name ?? "";
  const displayLastName =
    cachedProfile?.last_name ?? user?.last_name ?? decodedProfile.last_name ?? "";
  const displayEmail =
    cachedProfile?.email ?? user?.email ?? decodedProfile.email ?? "";
  const displayProfileImage = cachedProfile?.profileImage ?? user?.profileImage;
  const initials =
    `${displayFirstName[0] ?? ""}${displayLastName[0] ?? ""}`.trim() ||
    "U";

  const handleMobileSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <header className="sticky top-0 border border-[#EBECED] bg-white p-4">
      <div className="lg:hidden">
        {isMobileSearchOpen ? (
          <form
            onSubmit={handleMobileSearchSubmit}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              aria-label="Close search"
              className="rounded-full p-2 text-[#3D3F42]"
              onClick={() => setIsMobileSearchOpen(false)}
            >
              <X />
            </button>
            <div className="relative flex-1 rounded-full bg-[#F8F8F8A8]">
              <input
                type="text"
                value={mobileSearchValue}
                onChange={(e) => setMobileSearchValue(e.target.value)}
                placeholder="Search houses, areas, landlords"
                autoFocus
                className="w-full rounded-full border-none bg-transparent py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#43A047]"
              />
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999EA5]" />
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <button
              aria-label="Open sidebar"
              className="lg:hidden"
              onClick={onMenuClick}
              type="button"
            >
              <Menu />
            </button>

            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                aria-label="Open search"
                className="rounded-full p-2 text-[#3D3F42]"
                onClick={() => setIsMobileSearchOpen(true)}
              >
                <Search />
              </button>
              <NotificationBell />
              {isLoading && !displayUser ? (
                <p className="text-sm text-[#999EA5]">Loading...</p>
              ) : displayUser ? (
                <Link href="/tenant/profile" className="flex items-center gap-1.5 cursor-pointer">
                  {displayProfileImage ? (
                    <Image
                      src={displayProfileImage}
                      alt="User profile"
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#43A047] text-sm font-semibold text-white">
                      {initials}
                    </div>
                  )}
                </Link>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <div className="hidden items-center justify-between gap-7 lg:flex">
        <DesktopSearch />

        <div className="flex items-center gap-2">
            <NotificationBell />
          {isLoading && !displayUser ? (
            <p>Loading...</p>
          ) : displayUser ? (
            <Link href="/tenant/profile" className="flex items-center gap-1.5 cursor-pointer">
              {displayProfileImage ? (
                <Image
                  src={displayProfileImage}
                  alt="User profile"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#43A047] text-sm font-semibold text-white">
                  {initials}
                </div>
              )}

              <div className="hidden gap-0.5 xl:flex xl:flex-col">
                <h3 className="font-semibold text-[12px] text-[#3D3F42]">
                  {displayFirstName} {displayLastName}
                </h3>
                <p className="text-[11px] font-normal text-[#999EA5]">
                  {displayEmail}
                </p>
              </div>
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;
