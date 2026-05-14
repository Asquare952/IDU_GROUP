'use client'


import Sidebar from "./Sidebar"
import { DashboardLayoutProps } from "./types"
import Header from "./Header"
import MobileSidebar from "./MobileSidebar"
import { useState } from "react"

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  return (
    <main className=" no-scrollbar relative h-screen w-screen overflow-x-hidden">
      <section className=" flex flex-row">
        <Sidebar />
        <MobileSidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
        <main className=" bg-[#EBECED] h-full w-full lg:ml-62.5  min-h-[calc(100vh-var(--header-height))]">
          <div className="sticky top-0 z-50">
            <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
          </div>
          {children}
        </main>
      </section>
    </main>
  );
}

export default DashboardLayout
