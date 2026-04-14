"use client"

import { sidebarItems, sidebarItems2 } from "./config/SidebarItems"
import { useAuth } from "../context/AuthContext"
import Link from "next/link"
import { usePathname } from "next/navigation"
import rentUloLogo from "@/public/assets/IDU-LOGO-1.png"
import Image from "next/image"


const Sidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:gap-4 fixed left-0 top-0 h-screen p-3 bg-white shadow border border-[#EBECED]">
      <div className=" flex items-center gap-1 mt-3.5">
        <Image src={rentUloLogo} width={32.7} alt="" />
        <h2 className=" font-bold text-[22px] text-[#000000]">
          Rent<span className="text-[#43A047]">ULO</span>
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <nav className=" flex flex-col gap-6 mt-10">
          {sidebarItems.map((item) => {
            const { id, name, path, action, icon: Icon } = item;
            const isActive = !!path && pathname === path;
            const className = `flex items-center gap-2 py-3 px-6 rounded-[8px] ${isActive ? "bg-[#43A047] text-white" : " hover:bg-[#43A047] hover:text-white"}`;
            const logoutClassName = "flex items-center gap-2 py-3 px-6 rounded-[8px] text-[#DC2626]";

            if (action === "logout") {
              return (
                <button
                  key={id}
                  type="button"
                  onClick={logout}
                  className={logoutClassName}
                >
                  <Icon />
                  <span>{name}</span>
                </button>
              );
            }

            return (
              <Link
                href={path ?? "#"}
                key={id}
                className={className}
              >
                <Icon />
                <span>{name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="">
          <nav className=" flex flex-col gap-2 mt-10">
            <h1>Others</h1>
            {sidebarItems2.map((item) => {
              const { id, name, path, action, icon: Icon } = item;
              const isActive = !!path && pathname === path;
              const className = `flex items-center gap-2 py-3 px-6 rounded-[8px] ${isActive ? "bg-[#43A047] text-white" : " hover:bg-[#43A047] hover:text-white"}`;
              const logoutClassName = "flex items-center gap-2 py-3 px-6 rounded-[8px] text-[#DC2626]";

              if (action === "logout") {
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={logout}
                    className={logoutClassName}
                  >
                    <Icon />
                    <span>{name}</span>
                  </button>
                );
              }

              return (
                <Link
                  href={path ?? "#"}
                  key={id}
                  className={className}
                >
                  <Icon />
                  <span>{name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div style={{ height: "100px" }} />
      </div>
    </aside>
  );
}

export default Sidebar
