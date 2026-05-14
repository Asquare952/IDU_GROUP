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
          <div className="lg:col-span-2 space-y-8">
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
            <div className="bg-red-50/50 rounded-[2rem] border border-red-100">
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
