"use client";
import React from "react";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import NotificationItem from "@/app/components/shared/NotificationItems";
import { TENANT_NOTIFICATIONS } from "./data/notifications";
import { Bell, Check } from "lucide-react";

const page = () => {
  return (
    <DashboardLayout>
      <div className="p-10 bg-[#FBFBFC] min-h-screen">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-green-50 rounded-full">
              <Bell size={40} className="text-[#43A047]" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-[#162B4C] mb-2">
            Notifications
          </h2>
          <p className="text-slate-500 text-sm">
            Stay updated on your rental applications and payment reminders.
          </p>
        </div>
        <div className="max-w-2xl mx-auto mb-8">
          <button className="w-full bg-[#43A047] hover:bg-green-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]">
            <Check size={20} /> Mark all as read
          </button>
        </div>
        <div className="max-w-2xl mx-auto">
          {TENANT_NOTIFICATIONS.map((notif) => (
            <NotificationItem
              key={notif.id}
              type={notif.type}
              message={notif.message}
              time={notif.time}
              isRead={notif.isRead}
              accentColor="#43A047"
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default page;
