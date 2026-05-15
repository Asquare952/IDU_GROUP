"use client";

import { FC, FormEvent, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import { Menu, Search, X, LogOut, Settings } from "lucide-react";
import DesktopSearch from "./UI/search/DesktopSearch";
import NotificationBell from "./UI/NotificationBell";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: FC<HeaderProps> = ({ onMenuClick }) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mobileSearchValue, setMobileSearchValue] = useState("");

  const handleMobileSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleLogout = () => {
    Cookies.remove("ACCESS_TOKEN");
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Mobile Header */}
      <div className="lg:hidden p-4">
        {isMobileSearchOpen ? (
          <form
            onSubmit={handleMobileSearchSubmit}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              aria-label="Close search"
              className="rounded-full p-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMobileSearchOpen(false)}
            >
              <X size={20} />
            </button>
            <div className="relative flex-1 rounded-full bg-gray-50">
              <input
                type="text"
                value={mobileSearchValue}
                onChange={(e) => setMobileSearchValue(e.target.value)}
                placeholder="Search users, properties, transactions..."
                autoFocus
                className="w-full rounded-full border-none bg-transparent py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#43A047]"
              />
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <button
              aria-label="Open sidebar"
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={onMenuClick}
              type="button"
            >
              <Menu size={24} />
            </button>

            {/* Mobile Logo */}
            <div className="flex items-center gap-2">
              <Image
                src="/IDU GROUP LOGO.png"
                alt="RentULO"
                width={28}
                height={28}
              />
              <span className="font-bold text-lg text-gray-900">
                Rent<span className="text-[#4CAF50]">ULO</span>
              </span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                aria-label="Open search"
                className="rounded-full p-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMobileSearchOpen(true)}
              >
                <Search size={20} />
              </button>
              <NotificationBell />
              <button
                onClick={handleLogout}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                aria-label="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between px-6 py-3 gap-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <DesktopSearch />
        </div>
        <div className="flex items-center gap-1">
          {/* Notification Bell */}
          <NotificationBell />

          {/* Settings Icon */}
          <button
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium cursor-pointer"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
