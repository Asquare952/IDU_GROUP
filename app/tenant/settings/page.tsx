"use client";

import React from "react";
import Link from "next/link";
import DashboardLayout from "@/app/components/Tenant-Dashboard/DashboardLayout";
import { useState } from "react";

import {
  Bell,
  ShieldCheck,
  HelpCircle,
  AlertTriangle,
  X,
  ShieldAlert,
} from "lucide-react";
import {
  NotificationSettingsData,
  PrivacySecurityData,
  SupportLinks,
  SafetyAction,
} from "@/app/components/Tenant-Dashboard/config/DashboardDatas";

const page = () => {
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="p-8 bg-[#F8F9FA] min-h-screen">
        <div className="mb-6">
          <h2 className="text-4xl font-bold text-[#162B4C]">Settings</h2>
          <p className="text-gray-500 mt-1">
            Manage your account preferences and settings
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 mt-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-[#E8F5E9] p-2 rounded-lg">
              <Bell size={20} className="text-[#43A047]" />
            </div>
            <h4 className="text-xl font-bold text-[#162B4C]">
              Notification Preferences
            </h4>
          </div>
          <div className="flex flex-col">
            {NotificationSettingsData.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-6 border-b border-gray-50 last:border-0"
              >
                <span className="text-lg font-medium text-[#162B4C]">
                  {item.label}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={item.isActive}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B401C]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 mt-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-[#E8F5E9] p-2 rounded-lg">
              <ShieldCheck className="text-[#43A047]" size={20} />
            </div>
            <h4 className="text-xl font-bold text-[#162B4C]">
              Privacy & Security
            </h4>
          </div>
          <div className="flex flex-col">
            {PrivacySecurityData.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-6 border-b border-gray-50 last:border-0"
              >
                <span className="text-lg font-medium text-[#162B4C]">
                  {item.label}
                </span>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={item.isActive}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B401C]"></div>
                </label>
              </div>
            ))}
          </div>
        </div> */}

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#E8F5E9] p-2 rounded-lg">
              <HelpCircle className="text-[#43A047]" size={20} />
            </div>
            <h4 className="text-xl font-bold text-[#162B4C]">Support & Help</h4>
          </div>

          <div className="flex flex-col">
            {SupportLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="flex justify-between items-center py-5 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 px-2 rounded-xl transition-all"
              >
                <span className="font-medium text-[#162B4C]">{link.label}</span>
                <span className="text-gray-400">→</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-red-100 mt-8">
          <h4 className="text-xl font-bold text-red-600 mb-6">Danger Zone</h4>
          <div className="flex flex-col gap-4">
            <button className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-xl cursor-pointer hover:bg-red-100 transition-colors">
              Deactivate Account
            </button>
            <button className="w-full bg-red-600 text-white font-bold py-4 rounded-xl cursor-pointer hover:bg-red-700 transition-colors shadow-sm">
              Delete Account Permanently
            </button>
          </div>
        </div>
        <div className="p-6 flex flex-col gap-3">
          {isSafetyOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-end p-6 md:p-10">
              <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[360px] overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
                <div className="p-8 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-red-50 p-3 rounded-2xl">
                      <ShieldAlert className="text-[#FF3B30]" size={24} />
                    </div>
                    <button
                      onClick={() => setIsSafetyOpen(false)}
                      className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <h3 className="text-2xl font-bold text-[#162B4C] leading-tight">
                    Safety Assistance
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    If you feel unsafe or suspect a scam, choose an immediate
                    action below.
                  </p>
                </div>
                <div className="p-6 flex flex-col gap-4">
                  {SafetyAction.map((action) => (
                    <button
                      key={action.id}
                      className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer
                ${
                  action.variant === "danger"
                    ? "bg-[#FF3B30] text-white hover:bg-red-700"
                    : action.variant === "Success" ||
                        action.variant === "success"
                      ? "bg-[#43A047] text-white hover:bg-green-700"
                      : "bg-[#F2F2F7] text-[#162B4C] hover:bg-gray-200"
                }`}
                    >
                      <action.icon size={20} />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsSafetyOpen(true)}
          className="fixed bottom-10 right-10 bg-[#FF3B30] text-white p-5 rounded-full shadow-2xl hover:bg-red-700 transition-all z-40 active:scale-90"
        >
          <AlertTriangle size={32} />
        </button>
      </div>
    </DashboardLayout>
  );
};

export default page;
