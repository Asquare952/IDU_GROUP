"use client";
import React from "react";
import {
  LockedPropertyData,
  steps,
  ImportantNoticeData,
} from "@/app/components/Tenant-Dashboard/config/DashboardDatas";
import DashboardLayout from "@/app/components/Tenant-Dashboard/DashboardLayout";
import { MapPin, Clock, Calendar, MessageSquare } from "lucide-react";

const page = () => {
  return (
    <DashboardLayout>
      <section className="flex flex-col gap-8 px-2.5 py-2.5 bg-[#F8F9FA] min-h-screen">
        <div className="flex flex-col gap-1 p-3">
          <h2 className="text-3xl font-bold text-[#162B4C]">My Lock</h2>
          <p className="text-gray-500">Track your reservation and next steps</p>
        </div>

        {LockedPropertyData.map((item) => (
          <div
            key={item.id}
            className="flex h-[550px] bg-white rounded-2xl shadow-sm overflow-hidden border-green-700 border-gray-100"
          >
            <div className="card-bg flex-8 rounded-l-2xl"></div>
            <div className="flex flex-col gap-5 flex-9 p-6 md:p-10">
              <div className="flex flex-col gap-1.5">
                <h2 className="text-4xl font-bold text-[#162B4C] leading-tight">
                  {item.title}
                </h2>
                <p className="text-gray-500 flex items-center gap-1 font-medium">
                  <MapPin className="w-5 h-5 text-[#43A047]" />
                  {item.address}
                </p>
              </div>

              <div className="bg-[#98E682] rounded-2xl p-6 my-2">
                <div className="flex items-center gap-2 mb-2 text-[#1B401C]">
                  <Clock size={20} />
                  <span className="font-bold uppercase text-xs tracking-widest">
                    Lock Expires In
                  </span>
                </div>
                <h3 className="text-5xl font-black text-[#1B401C]">
                  {item.expiry}
                </h3>
                <div className="w-full bg-white/30 h-2.5 mt-4 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1B401C] h-full rounded-full"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase">
                    Rent Price
                  </p>
                  <h3 className="text-[#43A047] text-3xl font-bold">
                    {item.price}
                    <span className="text-gray-400 text-sm font-normal">
                      {item.period}
                    </span>
                  </h3>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase">
                    Lock Fee Paid
                  </p>
                  <h3 className="text-[#162B4C] text-3xl font-bold">
                    {item.lockFee}
                  </h3>
                </div>
              </div>

              <div className="mt-auto bg-gray-50 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase">
                    Landlord Details
                  </p>
                  <p className="font-bold text-[#162B4C]">{item.landlord}</p>
                </div>
                {item.isVerified && (
                  <span className="text-green-600 text-[10px] font-bold border border-green-200 bg-green-50 px-2 py-1 rounded">
                    ✓ VERIFIED
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 p-8 gap-8">
          <h2 className="font-bold text-2xl text-[#162B4C]">
            Application Progress
          </h2>
          <div className="flex flex-col">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="relative flex gap-6 pb-10 last:pb-0"
              >
                {index !== steps.length - 1 && (
                  <div className="absolute left-[15px] top-[30px] w-[2px] h-full bg-gray-200"></div>
                )}
                <div
                  className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 
                            ${step.status === "completed" ? "bg-[#43A047] border-[#43A047] text-white" : "bg-white border-gray-200 text-gray-400"}`}
                >
                  {step.status === "completed" ? (
                    <span className="text-2xs font-bold">✓</span>
                  ) : (
                    <span className="text-xs font-bold">{step.id}</span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <h3
                    className={`font-bold text-xl lg:text-2xl ${step.status === "completed" ? "text-[#162B4C]" : "text-gray-400"}`}
                  >
                    {step.title}
                  </h3>
                  {step.subtitle && (
                    <p className="text-sm text-gray-500">{step.subtitle}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <button className="flex items-center justify-center gap-3 bg-[#43A047] border-2 border-[#43A047] text-[#ffffff]  py-4 px-6 rounded-xl cursor-pointer hover:bg-[#ffffff] hover:text-green-600">
            <Calendar size={20} />
            <span>Continue Application</span>
          </button>
          <button className="flex items-center justify-center gap-3 border-2 border-[#43A047] text-[#43A047] hover:bg-[#43A047] hover:text-white py-4 px-6 rounded-xl font-bold transition-all active:scale-95">
            <Clock size={20} />
            <span>Reschedule Inspection</span>
          </button>
          <button className="flex items-center justify-center gap-3 border-2 border-[#43A047] text-[#43A047] hover:bg-[#43A047] hover:text-white py-4 px-6 rounded-xl font-bold transition-all active:scale-95">
            <MessageSquare size={20} />
            <span>Chat with Landlord</span>
          </button>
        </div>

        <div className="mt-8 p-6 bg-[#fff9E6] border border-[#ffd966] rounded-2xl flex gap-4 items-start shadow-sm">
          <div className="text-[#b45309] mt-1">
            <ImportantNoticeData.icon size={24} />
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-[#92400E]">
              {ImportantNoticeData.title}
            </h4>
            <p className="text-[#B45309] leading-relaxed font-medium">
              {ImportantNoticeData.message}
            </p>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default page;
