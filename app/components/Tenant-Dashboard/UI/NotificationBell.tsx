import { Bell } from 'lucide-react';

const NotificationBell = () => {
  return (
    <div className=' relative cursor-pointer'>
      <Bell width={30}/>
      <span className=' absolute right-0 top-0 bg-[#FF4343] py-0.5 px-[3px] rounded-full h-[13px] w-[13px]'></span>
    </div>
  )
}

export default NotificationBell
