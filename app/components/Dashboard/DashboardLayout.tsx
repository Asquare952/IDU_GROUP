import Sidebar from "./Sidebar"
import { DashboardLayoutProps } from "./types"
import Header from "./Header"

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <section className=" flex flex-row">
        <Sidebar />
        <main className="bg-[#EBECED] h-screen w-full lg:ml-62.5 overflow-y-auto">
          <div className="sticky top-0 z-50">
            <Header />
          </div>
          {children}
        </main>
      </section>
    </main>
  );
}

export default DashboardLayout
