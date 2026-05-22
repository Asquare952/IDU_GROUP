'use client'


import Sidebar from "./Sidebar"
import { DashboardLayoutProps } from "./types"
import Header from "./Header"
import MobileSidebar from "./MobileSidebar"
import { useState } from "react"

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#EBECED]">
      <Sidebar />
      <MobileSidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
      <section className="min-h-screen w-full lg:ml-[280px] lg:w-[calc(100%-280px)]">
        <main className="min-h-screen w-full bg-[#EBECED]">
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
