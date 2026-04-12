"use client";
import React from "react";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  ExternalLink,
  Bell,
  Shield,
} from "lucide-react";
import { NOTIFICATION_SETTINGS } from "./constants/settingsData";

// 1. Define the Toggle component here so TypeScript doesn't complain
const Toggle = ({ defaultChecked }: { defaultChecked: boolean }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      defaultChecked={defaultChecked}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#43A047]"></div>
  </label>
);

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 bg-[#F5F7F9] min-h-screen">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#162B4C]">Settings</h2>
          <p className="text-slate-500 font-medium">
            Manage your account and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Profile, Notifications, Security */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Section */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-green-50 rounded-lg">
                  <User className="text-[#43A047]" size={20} />
                </div>
                <h3 className="text-xl font-bold text-[#162B4C]">
                  Profile Information
                </h3>
              </div>

              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 bg-[#43A047] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  DU
                </div>
                <div>
                  <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">
                    Change Photo
                  </button>
                  <p className="text-xs text-slate-400 mt-2">
                    JPG or PNG. Max size 2MB.
                  </p>
                </div>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      defaultValue="John"
                      className="w-full bg-[#F0F2F5] border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-[#43A047]/20 outline-none font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Doe"
                      className="w-full bg-[#F0F2F5] border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-[#43A047]/20 outline-none font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center gap-1">
                    <Phone size={12} /> Phone Number
                  </label>
                  <input
                    type="text"
                    defaultValue="+234 810 000 0000"
                    className="w-full bg-[#F0F2F5] border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-[#43A047]/20 outline-none font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center gap-1">
                    <Mail size={12} /> Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="john.doe@example.com"
                    className="w-full bg-[#F0F2F5] border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-[#43A047]/20 outline-none font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center gap-1">
                    <MapPin size={12} /> Address
                  </label>
                  <input
                    type="text"
                    defaultValue="123 Main St, City, State 12345"
                    className="w-full bg-[#F0F2F5] border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-[#43A047]/20 outline-none font-medium"
                  />
                </div>
                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    className="px-6 py-3 rounded-xl font-bold text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#43A047] text-white rounded-xl font-bold shadow-lg shadow-[#43A047]/20 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Notification Preferences Section */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Bell className="text-[#43A047]" size={20} />
                </div>
                <h3 className="text-xl font-bold text-[#162B4C]">
                  Notification Preferences
                </h3>
              </div>
              <div className="space-y-4">
                {NOTIFICATION_SETTINGS.map((setting) => (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between p-4 bg-[#F0F2F5] rounded-2xl"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-[#3D3F42]">
                        {setting.title}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {setting.desc}
                      </p>
                    </div>
                    <Toggle defaultChecked={setting.defaultActive} />
                  </div>
                ))}
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Shield className="text-[#43A047]" size={20} />
                </div>
                <h3 className="text-xl font-bold text-[#162B4C]">Security</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#F0F2F5] rounded-2xl">
                  <div>
                    <h4 className="font-bold text-sm text-[#3D3F42]">
                      Change Password
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      Last changed 3 months ago
                    </p>
                  </div>
                  <button className="bg-white text-slate-600 px-5 py-2 rounded-xl text-xs font-bold border border-slate-100 hover:bg-slate-50 transition-all cursor-pointer">
                    Update
                  </button>
                </div>
              </div>
              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between p-4 bg-[#F0F2F5] rounded-2xl">
                  <div>
                    <h4 className="font-bold text-sm text-[#3D3F42]">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <button className="bg-green-600 text-white px-5 py-2 rounded-xl text-xs font-bold border border-slate-100 cursor-pointer">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar Cards */}
          <div className="space-y-6">
            <div className="bg-[#43A047] rounded-[2rem] p-8 text-white shadow-xl shadow-green-100">
              <h3 className="font-bold text-xl mb-6">Account Status</h3>
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between border-b border-white/20 pb-3">
                  <span>Account Type</span>
                  <span>Landlord Pro</span>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-3">
                  <span>Member Since</span>
                  <span>Jan 2024</span>
                </div>
                <div className="flex justify-between pb-3">
                  <span>Properties</span>
                  <span>12 Active</span>
                </div>
              </div>
              <button className="w-full mt-6 bg-white text-[#43A047] py-3 rounded-2xl font-black text-sm">
                Upgrade Plan
              </button>
            </div>

            {/* <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-[#162B4C]">
                <CreditCard size={20} />
                <h3 className="font-bold text-lg">Billing</h3>
              </div>
              <button className="w-full bg-slate-50 text-slate-600 py-3 rounded-xl font-bold text-sm border border-slate-100">
                Manage Billing
              </button>
            </div> */}

            <div className="bg-red-50/50 rounded-[2rem] p-8 border border-red-100">
              <h3 className="font-bold text-red-600 text-lg mb-2">
                Danger Zone
              </h3>
              <button className="w-full bg-red-600 text-white py-3 rounded-2xl font-black text-sm shadow-lg shadow-red-200 cursor-pointer">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
