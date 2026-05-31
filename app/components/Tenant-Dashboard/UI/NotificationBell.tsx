import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNotificationCount, } from "@/app/api/features/notification";


const NotificationBell = () => {
  const router = useRouter();
  const { data: notificationCount } =
    useNotificationCount();
  return (
    <div className="relative cursor-pointer" onClick={() => router.push("/tenant/notifications")}>
      <Bell size={24} />
      {notificationCount?.count && notificationCount.count > 0 ? (
        <span className="absolute right-0 top-0 flex h-3 w-3 items-center justify-center rounded-full bg-[#FF4343] text-[9px] text-white">
          {notificationCount.count}
        </span>
      ) : null}
    </div>
  );
};

export default NotificationBell;
