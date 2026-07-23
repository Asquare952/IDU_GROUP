"use client";

import { sidebarItems, sidebarItems2 } from "./config/SidebarItems";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import rentUloLogo from "@/public/assets/IDU-LOGO-1.png";
import Image from "next/image";
import { X } from "lucide-react";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const pathname = usePathname();
  const { logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] lg:hidden">
      {/* Backdrop */}
      <button
        aria-label="Close sidebar"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        type="button"
      />

      {/* Sidebar Panel */}
      <aside className="relative z-10 flex h-full w-[280px] flex-col border-r border-[#EBECED] bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <Image
              src={rentUloLogo}
              width={32}
              height={32}
              alt="RentULO Logo"
            />
            <h2 className="text-[22px] font-bold text-[#000000]">
              Rent<span className="text-[#43A047]">ULO</span>
            </h2>
          </Link>

          <button
            aria-label="Close sidebar"
            className="rounded-md p-2 text-[#3D3F42] hover:bg-gray-100"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Navigation - takes available space */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-3 py-4">
          <nav className="flex flex-col gap-5">
            {sidebarItems.map((item) => {
              const { id, name, path, icon: Icon } = item;
              const isActive = !!path && pathname === path;

              return (
                <Link
                  href={path ?? "#"}
                  key={id}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#43A047] text-white"
                      : "text-[#3D3F42] hover:bg-[#43A047] hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  <span>{name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Others Section - pushed to bottom */}
        <div className="border-t border-[#EBECED] px-3 py-3">
          <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
            Others
          </h3>
          <nav className="flex flex-col gap-2">
            {sidebarItems2.map((item) => {
              const { id, name, path, action, icon: Icon } = item;
              const isActive = !!path && pathname === path;

              if (action === "logout") {
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      onClose();
                      logout();
                    }}
                    className="flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium text-[#DC2626] transition-all hover:bg-red-50"
                  >
                    <Icon size={20} />
                    <span>{name}</span>
                  </button>
                );
              }

              return (
                <Link
                  href={path ?? "#"}
                  key={id}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#43A047] text-white"
                      : "text-[#3D3F42] hover:bg-[#43A047] hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  <span>{name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default MobileSidebar;
