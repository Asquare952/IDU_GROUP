"use client";
import React, { useState } from "react";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import { listingData } from "../my-listings/data/listingData";
import { Plus, MapPin, Bed, Bath, } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Page = () => {
  const [activeTab, setActiveTab] = useState("All Properties");

  const tabs = ["All Properties", "Active", "Locked", "Rented"];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-[#FBFBFC] min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#162B4C] tracking-tight">
              My Properties
            </h1>
            <p className="text-gray-400 text-[13px] mt-0.5">
              Manage your property listings
            </p>
          </div>
          <button className="bg-[#43A047] text-white px-5 py-2.5 rounded-xl font-bold text-[13px] flex items-center gap-2 hover:bg-green-700 transition-all shadow-sm active:scale-95 cursor-pointer">
            <Plus size={18} /> Add New Property
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all border ${
                activeTab === tab
                  ? "bg-[#43A047] text-white border-[#43A047]"
                  : "bg-white text-gray-400 border-gray-100 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listingData.map((house) => (
            <div
              key={house.id}
              className="bg-white rounded-[1.2rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all duration-300"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={house.img}
                  alt={house.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider shadow-sm ${
                    house.status === "Active"
                      ? "bg-[#43A047] text-white"
                      : house.status === "Rented"
                        ? "bg-[#162B4C] text-white"
                        : "bg-[#FF8A00] text-white"
                  }`}
                >
                  {house.status}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[15px] text-[#162B4C] mb-0.5">
                  {house.title}
                </h3>
                <p className="flex items-center gap-1 text-gray-400 text-[11px] mb-3">
                  <MapPin size={11} /> {house.location}
                </p>
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center gap-1.5 text-[#43A047] text-[11px] font-semibold">
                    <Bed size={13} className="text-[#43A047]" /> {house.beds}
                    Bedroom
                  </span>
                  <span className="flex items-center gap-1.5 text-[#43A047] text-[11px] font-semibold">
                    <Bath size={13} className="text-[#43A047]" /> {house.baths}
                    Bathroom
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-gray-50 pt-3.5">
                  <div>
                    <p className="text-gray-300 text-[9px] font-bold uppercase">
                      Monthly Rent
                    </p>
                    <p className="text-[#43A047] font-bold text-base">
                      ₦{house.price}
                    </p>
                  </div>

                  <div className="flex gap-1.5">
                    <Link href={`/landlord/properties/edit/${house.id}`}>
                      <button className="px-3 py-1.5 border border-gray-100 rounded-lg text-gray-500 text-[11px] font-bold hover:bg-gray-50 transition-colors cursor-pointer">
                        Edit
                      </button>
                    </Link>
                    <Link href={`/properties/${house.id}`}>
                      <button className="px-3 py-1.5 bg-[#43A047] text-white rounded-lg text-[11px] font-bold hover:bg-green-700 transition-all shadow-sm cursor-pointer">
                        View
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Page;
