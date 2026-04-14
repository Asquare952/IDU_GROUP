"use client";
import React from "react";
import DashboardLayout from "@/app/components/Tenant-Dashboard/DashboardLayout";
import {
  SavedHousesData,
  SafetyAction,
} from "@/app/components/Tenant-Dashboard/config/DashboardDatas";
import {
  MapPin,
  Trash2,
  BedDouble,
  Lock,
  AlertTriangle,
  X,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const Page = () => {
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="p-6 bg-[#F8F9FA] min-h-screen">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="font-bold text-4xl text-[#162B4C]">Saved Houses</h2>
            <p className="text-gray-500 mt-1">
              You have {SavedHousesData.length} saved properties
            </p>
          </div>
          <Link href="/properties">
            <button className="bg-[#43A047] text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-all active:scale-95 shadow-md cursor-pointer">
              Browse More Houses
            </button>
          </Link>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SavedHousesData.map((house) => (
            <div
              key={house.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-all duration-300"
            >
              {/* Image Area - Navigation Link */}
              <Link href={`/properties/${house.id}`}>
                <div className="relative h-56 bg-gray-200 p-2 rounded-[12px] cursor-pointer overflow-hidden">
                  <img
                    src={house.img}
                    alt={house.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-[12px]"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Removing item", house.id);
                    }}
                    className="absolute top-4 right-4 bg-white p-2.5 rounded-full text-red-500 shadow-lg hover:bg-red-50 z-10"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </Link>

              <div className="p-5 flex flex-col gap-3">
                {house.isVerified && (
                  <div className="flex">
                    <span className="bg-[#E8F5E9] text-[#43A047] text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 uppercase">
                      ✓ Verified
                    </span>
                  </div>
                )}
                <Link href={`/properties/${house.id}`}>
                  <h3 className="font-bold text-xl text-[#162B4C] hover:text-[#43A047] transition-colors cursor-pointer">
                    {house.title}
                  </h3>
                </Link>

                <p className="text-gray-400 text-sm flex items-center gap-1 font-medium">
                  <MapPin size={16} /> {house.location}
                </p>

                <div className="flex items-center justify-between mt-1">
                  <span className="text-[#43A047] font-bold text-2xl">
                    ₦{house.price}
                  </span>
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <BedDouble size={16} /> {house.beds} Beds
                  </span>
                </div>

                <div className="flex gap-2 mt-2">
                  <Link href={`/properties/${house.id}`} className="flex-[3]">
                    <button className="w-full bg-[#43A047] text-white py-3 rounded-xl font-bold text-sm hover:bg-green-700 transition-all cursor-pointer">
                      View Details
                    </button>
                  </Link>

                  <button className="flex-1 border-2 border-[#43A047] text-[#43A047] p-3 rounded-xl flex items-center justify-center hover:bg-green-50 transition-all cursor-pointer">
                    <Lock size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Safety Modal Logic */}
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
                          : action.variant === "success" ||
                              action.variant === "Success"
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

        {/* Safety Floating Button */}
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

export default Page;
