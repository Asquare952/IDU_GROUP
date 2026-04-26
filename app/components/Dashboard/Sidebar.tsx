"use client";
import { sidebarItems, sidebarItems2 } from "./config/SidebarItems";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import rentUloLogo from "@/public/assets/IDU-LOGO-1.png";
import Image from "next/image";

const Sidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:gap-4 fixed left-0 top-0 h-screen p-3 bg-white shadow border border-[#EBECED]">
      <div className="flex items-center gap-1 mt-3.5">
        <Image src={rentUloLogo} width={32.7} alt="RentULO Logo" />
        <h2 className="font-bold text-[22px] text-[#000000]">
          Rent<span className="text-[#43A047]">ULO</span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <nav className="flex flex-col gap-6 mt-10">
          {sidebarItems.map((item) => {
            const { id, name, path, icon: Icon } = item;
            const isActive = pathname === path;

            // We use 'as string' or a fallback to satisfy TypeScript
            return (
              <Link
                href={path as string}
                key={id}
                className={`flex items-center gap-2 py-3 px-6 rounded-[8px] transition-all ${
                  isActive
                    ? "bg-[#43A047] text-white"
                    : "hover:bg-[#43A047] hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span>{name}</span>
              </Link>
            );
          })}
        </nav>

        {/* SECTION 2: OTHERS */}
        <div className="flex flex-col gap-2 mt-10">
          <h1 className="px-6 text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Others
          </h1>
          {sidebarItems2.map((item) => {
            const { id, name, path, icon: Icon, action } = item;
            const isActive = pathname === path;

            // Handle the Logout Action specifically
            if (action === "logout" || name === "Logout") {
              return (
                <button
                  key={id}
                  onClick={logout}
                  className="flex items-center gap-2 py-3 px-6 rounded-[8px] text-red-500 hover:bg-red-50 transition-all w-full text-left mt-2"
                >
                  <Icon size={20} />
                  <span>{name}</span>
                </button>
              );
            }

            // Standard Link for Help/Settings
            return (
              <Link
                href={(path as string) || "#"}
                key={id}
                className={`flex items-center gap-2 py-3 px-6 rounded-[8px] transition-all ${
                  isActive
                    ? "bg-[#43A047] text-white"
                    : "hover:bg-[#43A047] hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span>{name}</span>
              </Link>
            );
          })}
        </div>

        <div style={{ height: "100px" }} />
      </div>
    </aside>
  );
};

export default Sidebar;
