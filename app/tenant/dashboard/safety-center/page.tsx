"use client";
import React from "react";
import DashboardLayout from "@/app/components/Tenant-Dashboard/DashboardLayout";
import {
  CommonScamsData,
  SafetyBannerData,
  SafetyReportCards,
  SafetyTipsData,
  SafetyAction,
} from "@/app/components/Tenant-Dashboard/config/DashboardDatas";
import {
  Shield,
  Flag,
  AlertTriangle,
  MessageCircle,
  ArrowRight,
  ShieldAlert,
  Info,
  UserCheck,
  ShieldCheck,
  AlertOctagon,
  X,
} from "lucide-react";
import { useState } from "react";

const IconMap: any = {
  Flag: Flag,
  AlertTriangle: AlertTriangle,
  MessageCircle: MessageCircle,
  ShieldCheck: ShieldCheck,
  UserCheck: UserCheck,
  Info: Info,
};

const page = () => {
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  return (
    <DashboardLayout>
      <div className="p-8 bg-[#F8F9FA] min-h-screen">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-[#162B4C]">Safety Center</h2>
          <p className="text-gray-500 mt-2 text-lg">
            Your security is our priority. Learn how to stay safe while
            searching for houses.
          </p>
        </div>

        {/* Immediate Help */}
        <div className="bg-[#43A047] rounded-[2rem] p-8 mb-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="bg-white/20 p-4 rounded-2xl">
              <Shield size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-1">
                {SafetyBannerData.title}
              </h3>
              <p className="text-green-50 opacity-90">
                {SafetyBannerData.description}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none bg-white text-[#43A047] px-6 py-3 rounded-xl font-bold cursor-pointer">
              Call {SafetyBannerData.emergencyLine}
            </button>
            <button className="flex-1 md:flex-none bg-white/20 text-white px-6 py-3 rounded-xl font-bold border border-white/30 cursor-pointer">
              {SafetyBannerData.chatText}
            </button>
          </div>
        </div>

        {/* Report Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {SafetyReportCards.map((card) => {
            const Icon = IconMap[card.icon];
            return (
              <div
                key={card.id}
                className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between group"
              >
                <div>
                  <div
                    className={`${card.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-6`}
                  >
                    <Icon className={card.iconColor} size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-[#162B4C] mb-3">
                    {card.title}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>
                <button className="flex items-center gap-2 text-[#43A047] font-bold group-hover:gap-3 transition-all cursor-pointer">
                  Submit Report <ArrowRight size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {/* safety tips */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-[#162B4C] mb-8">
            Safety Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SafetyTipsData.map((tip) => {
              const Icon = IconMap[tip.icon];
              return (
                <div
                  key={tip.id}
                  className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm flex gap-5 items-start"
                >
                  <div className={`${tip.bgColor} p-3 rounded-2xl`}>
                    <Icon className={tip.color} size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#162B4C] mb-1">
                      {tip.title}
                    </h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {tip.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* common scams */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-gray-50 shadow-sm w-full">
          <div className="flex items-center gap-4 mb-12">
            <div className="bg-red-50 p-3 rounded-2xl">
              <AlertOctagon className="text-red-600" size={20} />
            </div>
            <h3 className="text-2xl md:text-2xl font-bold text-[#162B4C]">
              Common Housing Scams to Watch For
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-y-12">
            {CommonScamsData.map((scam) => (
              <div
                key={scam.id}
                className="border-b border-gray-50 last:border-0 pb-8 last:pb-0"
              >
                <h4 className="text-xl font-semibold text-red-600 mb-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                  {scam.title}
                </h4>
                <p className="text-gray-500 text-lg leading-relaxed max-w-none">
                  {scam.desc}
                </p>
              </div>
            ))}
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
                <div className="p-6 flex flex-col gap-3">
                  {SafetyAction.map((action) => (
                    <button
                      key={action.id}
                      className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer
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
