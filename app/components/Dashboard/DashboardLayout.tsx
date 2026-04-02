import Sidebar from "./Sidebar"
import { DashboardLayoutProps } from "./types"
import Header from "./Header"

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className=' no-scrollbar relative h-screen w-screen overflow-x-hidden'>
      <section className=" flex flex-row">
        <Sidebar />
        <main className=" bg-[#EBECED] h-full w-full lg:ml-62.5  min-h-[calc(100vh-var(--header-height))]">
          <div className="sticky top-0 z-50">
            <Header />
          </div>
          {children}
        </main>
      </section>
    </main>
  )
}

export default DashboardLayout
