"use client";
import React from "react";
import DesktopSearch from "./UI/search/DesktopSearch";
import NotificationBell from "./UI/NotificationBell";
import Chats from "./UI/Chats";
import Image from "next/image";
import AdminProfileImg from "@/public/assets/landloard-profile-img.png";
import { Menu } from "lucide-react";
import { useNotificationCount } from "../../api/features/notification/useNotification";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Header = () => {
  const { data, isLoading } = useNotificationCount();
  const count = data?.count || 0;

  const pathname = usePathname();
  const notificationPath = pathname.includes("/tenant")
    ? "/tenant/notifications"
    : "/landlord/notifications";

  return (
    <header className="sticky top-0 p-4 bg-white border border-[#EBECED] z-50">
      <div className="flex items-center justify-between gap-7">
        <div className="flex items-center gap-2">
          <Menu className="md:hidden cursor-pointer" />
        </div>
        <div className="flex items-center gap-6">
          <DesktopSearch />

          <div className="flex items-center gap-4">
            <Link href={notificationPath}>
              <NotificationBell count={count} isLoading={isLoading} />
            </Link>

            <Chats />
            <div className="flex items-center gap-2.5 cursor-pointer border-l pl-4 border-gray-100">
              <div className="relative w-10 h-10">
                <Image
                  src={AdminProfileImg}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div className="hidden md:flex md:flex-col gap-0">
                <h3 className="font-semibold text-[13px] text-[#162B4C] leading-tight">
                  Daniel Gbesimowo
                </h3>
                <p className="font-normal text-[11px] text-[#999EA5]">
                  {pathname.includes("/tenant")
                    ? "Tenant Account"
                    : "Landlord Account"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
