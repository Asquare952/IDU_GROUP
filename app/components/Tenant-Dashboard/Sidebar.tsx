"use client"

import { sidebarItems } from "./config/SidebarItems"
import { useAuth } from "../context/AuthContext"
import Link from "next/link"
import { usePathname } from "next/navigation"
import rentUloLogo from "@/public/assets/IDU-LOGO-1.png"
import Image from "next/image"

const Sidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:gap-4 fixed left-0 top-0 z-50 h-full p-3 bg-white shadow border border-[#EBECED] ">
      <Link href="/" className=" flex items-center gap-1 mt-3.5">
        <Image src={rentUloLogo} width={32.7} alt="" />
        <h2 className=" font-bold text-2xl text-[#000000]">Rent<span className="text-[#43A047]">ULO</span></h2>
      </Link>

      <div className="h-full overflow-y-auto hide-scrollbar">
        <nav className=" flex flex-col gap-6 mt-10">
          {sidebarItems.map((item) => {
            const { id, name, path, action, icon: Icon } = item;
            const isActive = !!path && pathname === path
            const className = `flex items-center gap-2 rounded-lg px-6 py-3 ${isActive ? "bg-[#43A047] text-white" : " hover:bg-[#43A047] hover:text-white"}`
            const logoutClassName = "flex items-center gap-2 rounded-lg px-6 py-3 text-[#DC2626]"

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
              )
            }

            return (
              <Link href={path ?? "#"} key={id} className={className} >
                <Icon />
                <span>{name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="">


        </div>
      </div>


    </aside>
  )
}

export default Sidebar
