import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNotificationCount, } from "@/app/api/features/notification";


const NotificationBell = () => {
  const router = useRouter();
  const { data: notificationCount } =
    useNotificationCount();
  return (
    <div className=" relative cursor-pointer" onClick={() => router.push("/tenant/notifications")}>
      <Bell size={34} />
      {notificationCount?.count && notificationCount.count > 0 ? (
        <span className=" absolute right-0 top-0 bg-[#FF4343] py-3 px-3 rounded-full h-[13px] w-[13px] flex items-center justify-center text-white text-xs">
          {notificationCount.count}
        </span>
      ) : null}
    </div>
  );
};

export default NotificationBell;
