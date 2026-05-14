
import { sidebarItems } from "./config/SidebarItems"
import { useAuth } from "../context/AuthContext"
import Link from "next/link"
import { usePathname } from "next/navigation"
import rentUloLogo from "@/public/assets/IDU-LOGO-1.png"
import Image from "next/image"
import React from "react"
import { X } from 'lucide-react';

interface MobileSidebarProp {
  isOpen: boolean;
  onClose: () => void;
}
const MobileSidebar: React.FC<MobileSidebarProp> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { logout } = useAuth();


  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-70 lg:hidden">
      <button aria-label="Close sidebar"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        type="button" />
      <aside className="relative z-10 flex h-full w-70 flex-col gap-4 border border-[#EBECED] bg-white p-3 shadow rounded-r-xl">
        <div className="mt-3.5 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            <Image src={rentUloLogo} width={32.7} alt="" />
            <h2 className="text-[22px] font-semibold text-[#000000]">
              RENT<span className="text-[#43A047]">ULO</span>
            </h2>
          </div>

          <button
            aria-label="Close sidebar"
            className="rounded-md p-2 text-[#3D3F42]"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="h-full overflow-y-auto hide-scrollbar">
          <nav className=" flex flex-col gap-6 mt-10">
            {sidebarItems.map((item) => {
              const { id, name, path, action, icon: Icon } = item;
              const isActive = !!path && pathname === path
              const className = `flex items-center gap-2 py-3 pl-6 pr-17.5 rounded-lg ${isActive ? "bg-[#43A047] text-white" : " hover:bg-[#43A047] hover:text-white"}`
              const logoutClassName = "flex items-center gap-2 py-3 pl-6 pr-17.5 rounded-lg cursor-pointer text-[#DC2626]"

              if (action === "logout") {
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      onClose();
                      logout();
                    }}
                    className={logoutClassName}
                  >
                    <Icon />
                    <span>{name}</span>
                  </button>
                )
              }

              return (
                <Link href={path ?? "#"} key={id} onClick={onClose} className={className} >
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
    </div>

  )
}

export default MobileSidebar
