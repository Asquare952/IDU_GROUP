"use client";
import React from "react";
import properties from "@/app/components/properties";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PropertyDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const house = properties.find((item) => String(item.id) === String(id));

  if (!house)
    return <div className="p-20 text-center font-bold">House not found!</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto p-6">
        <Link
          href="/properties"
          className="flex items-center gap-2 mb-6 font-bold text-gray-600 hover:text-[#4CAF50]"
        >
          <ChevronLeft size={20} /> Back to Listings
        </Link>

        <div className="relative h-[500px] w-full rounded-[40px] overflow-hidden mb-10">
          <Image
            src={house.img}
            alt={house.title}
            fill
            className="object-cover rounded-3xl p-2 transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-extrabold mb-2">{house.title}</h1>
            <p className="text-[#4CAF50] text-3xl font-black mb-6">
              {house.price}{" "}
              <span className="text-sm font-normal text-gray-400">/ year</span>
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              This beautiful {house.title} is verified and ready for move-in.
              Contact the landlord directly through RentULO.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-[30px] h-fit border border-gray-100">
            <button className="w-full bg-[#4CAF50] text-white py-4 rounded-2xl font-bold mb-4 shadow-lg shadow-green-100 cursor-pointer">
              Book Inspection
            </button>
            <button className="w-full border-2 border-gray-200 py-4 rounded-2xl font-bold hover:bg-white transition-all cursor-pointer">
              Message Landlord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
