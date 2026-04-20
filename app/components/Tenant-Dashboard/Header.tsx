"use client";
import React from "react";
import DesktopSearch from "./UI/search/DesktopSearch";
import Image from "next/image";
import AdminProfileImg from "@/public/assets/landloard-profile-img.png";
import { Menu } from "lucide-react";
import NotificationMenu from "../shared/NotificationMenu";

const Header = () => {
  return (
    <header className=" sticky top-0 p-4 bg-white border border-[#EBECED]">
      <div className=" flex items-center justify-between gap-7">
        <Menu className=" md:hidden " />
        <DesktopSearch />

        <div className=" flex items-center gap-1">
          <NotificationMenu notificationPath="/tenant/notifications" />

          <div className=" flex items-center gap-1.5 cursor-pointer">
            <Image
              src={AdminProfileImg}
              alt="Profile"
              width={30}
              height={30}
              className="rounded-full object-cover"
            />
            <div className=" hidden md:flex md:flex-col gap-0.5">
              <h3 className=" font-semibold text-[12px] text-[#3D3F42]">
                Daniel Gbesimowo
              </h3>
              <p className="font-normal text-[11px] text-[#999EA5]">
                danielgbesimowo7@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
