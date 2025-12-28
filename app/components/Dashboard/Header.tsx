import DesktopSearch from "./UI/search/DesktopSearch"
import NotificationBell from "./UI/NotificationBell"
import Chats from "./UI/Chats"
import Image from "next/image"
import AdminProfileImg from "@/public/assets/landloard-profile-img.png"

const Header = () => {
  return (
    <header className=' sticky top-0 flex items-center justify-between p-4 bg-white border border-[#EBECED]'>
      <h2 className='text-[#999EA5] font-bold text-2xl'>Dashboard</h2>
      <div className=' flex items-center gap-1.5'>
        <DesktopSearch />

        <div className=" flex items-center gap-2">
          <NotificationBell />
          <Chats />
          <div className=" flex items-center gap-1.5 cursor-pointer">
            <Image src={AdminProfileImg} alt="" />
            <div className=" flex flex-col gap-0.5">
              <h3 className=" font-semibold text-[12px] text-[#3D3F42]">Daniel Gbesimowo</h3>
              <p className="font-normal text-[11px] text-[#999EA5]">danielgbesimowo7@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
