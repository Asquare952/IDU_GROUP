import { Bell } from "lucide-react";

interface NotificationBellProps {
  count?: number;
  isLoading?: boolean;
}

const NotificationBell = ({
  count = 0,
  isLoading = false,
}: NotificationBellProps) => {
  return (
    <div className=" relative cursor-pointer">
      <Bell width={30} />
      {count > 0 && (
        <span className=" absolute right-0 top-0 bg-[#FF4343] py-0.5 px-[3px] rounded-full h-[13px] w-[13px] flex items-center justify-center text-white text-xs">
          {count}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;
