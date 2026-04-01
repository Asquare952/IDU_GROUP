import React from "react";
import DashboardLayout from "@/app/components/Tenant-Dashboard/DashboardLayout";
import { User, Bell, ShieldCheck, HelpCircle } from "lucide-react";
import {
  NotificationSettingsData,
  PrivacySecurityData,
  SupportLinks,
} from "@/app/components/Tenant-Dashboard/config/DashboardDatas";

const page = () => {
  return (
    <DashboardLayout>
      <div className="p-8 bg-[#F8F9FA] min-h-screen">
        <div className="mb-6">
          <h2 className="text-4xl font-bold text-[#162B4C]">Settings</h2>
          <p className="text-gray-500 mt-1">
            Manage your account preferences and settings
          </p>
        </div>
        <div className="flex items-center justify-between bg-white rounded-3xl p-8 mb-8 shadow-sm border border-gray-50">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-[#43A047] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                OA
              </div>
              <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full border border-gray-100 shadow-sm">
                <User size={14} className="text-gray-400 cursor-pointer" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-[#162B4C]">Ola Adeniji</h3>
              <p className="text-gray-500 flex items-center gap-1">
                Verified User <span className="text-[#43A047]">✓</span>
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="bg-[#43A047] text-white px-6 py-2.5 rounded-xl font-semibold cursor-pointer hover:bg-green-700 transition-all">
              Edit Profile
            </button>
            <button className="bg-gray-50 text-gray-600 px-6 py-2.5 rounded-xl font-semibold border border-gray-100 cursor-pointer hover:bg-gray-100 transition-all">
              Change Photo
            </button>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-[#E8F5E9] p-2 rounded-lg">
              <User size={20} className="text-gray-400" />
            </div>
            <h4 className="text-xl font-semibold text-[#162B4C]">
              Profile Settings
            </h4>
          </div>

          <div className="flex flex-col gap-8 mb-1">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-[#162B4C]">Full Name</p>
                <p className="text-gray-500">Ola Adeniji</p>
              </div>
              <button className="text-[#43A047] font-bold text-sm cursor-pointer hover:underline">
                Edit
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-[#162B4C]">Email</p>
                <p className="text-gray-500">ola.adeniji@email.com</p>
              </div>
              <button className="text-[#43A047] font-bold text-sm cursor-pointer hover:underline">
                Edit
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-[#162B4C]">Phone Number</p>
                <p className="text-gray-500">+234 801 234 5678</p>
              </div>
              <button className="text-[#43A047] font-bold text-sm cursor-pointer hover:underline">
                Edit
              </button>
            </div>
          </div>
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

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 mt-8">
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
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#E8F5E9] p-2 rounded-lg">
              <HelpCircle className="text-[#43A047]" size={20} />
            </div>
            <h4 className="text-xl font-bold text-[#162B4C]">Support & Help</h4>
          </div>

          <div className="flex flex-col">
            {SupportLinks.map((link) => (
              <div
                key={link.id}
                className="flex justify-between items-center py-5 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 px-2 rounded-xl transition-all"
              >
                <span className="font-medium text-[#162B4C]">{link.label}</span>
                <span className="text-gray-400">→</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-red-100 mt-8 mb-24">
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
      </div>
    </DashboardLayout>
  );
};

export default page;
