import { Bell } from 'lucide-react';

interface NotificationBellProps {
  count?: number;
  isLoading?: boolean;
}

const NotificationBell = ({ count = 0, isLoading = false }: NotificationBellProps) => {
  return (
    <div className='relative cursor-pointer'>
      <Bell size={24} />
      {count > 0 && (
        <span className='absolute right-0 top-0 flex h-3 w-3 items-center justify-center rounded-full bg-[#FF4343] text-[9px] text-white'>
          {count}
        </span>
      )}
    </div>
  )
}

export default NotificationBell
