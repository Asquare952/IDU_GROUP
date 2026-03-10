"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import propertiesLocal from "@/app/components/properties";
import {
  MapPin,
  Bed,
  Star,
  Shield,
  Zap,
  Droplets,
  Leaf,
  CheckCircle,
  Play,
} from "lucide-react";
import Image from "next/image";
import Navbar from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function PropertyDesktopView() {
  const { id } = useParams();
  const property = propertiesLocal.find((p) => String(p.id) === String(id));

  if (!property)
    return <div className="p-20 text-center">Property not found</div>;

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="mb-6 text-sm text-gray-500 font-medium">
          Properties / <span className="text-gray-900">{property.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-video w-full bg-black rounded-[40px] overflow-hidden group shadow-2xl">
              <Image
                src={property.img}
                alt={property.title}
                fill
                className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                <div className="w-20 h-20 bg-white/30 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/50 cursor-pointer hover:scale-110 transition shadow-2xl">
                  <Play fill="white" className="text-white ml-1" size={32} />
                </div>
              </div>
              <div className="absolute top-8 left-8 bg-[#4CAF50] px-4 py-2 rounded-full text-xs font-bold text-white flex items-center gap-2 shadow-lg">
                <CheckCircle size={14} /> VERIFIED VIDEO TOUR
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-[32px] grid grid-cols-3 gap-4">
              <Spec
                icon={<MapPin className="text-[#4CAF50]" />}
                label="Location"
                value="Lekki, Lagos"
              />
              <Spec
                icon={<Bed className="text-[#4CAF50]" />}
                label="Rooms"
                value="5 Bedrooms"
              />
              <Spec
                icon={<Shield className="text-[#4CAF50]" />}
                label="Security"
                value="High Grade"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-gray-900">Description</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Spacious 5-bed in secure estate. Modern kitchen, en-suite rooms,
                and balcony with a view. Perfect for growing families or young
                professionals seeking luxury in the heart of Lagos.
              </p>
            </div>
            <div className="space-y-4 bg-blue-50 p-6 rounded-[32px] border border-blue-100">
              <h2 className="text-3xl font-black text-gray-900">Safety Tips</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                1. Ensure you meet the Agent in an open location. <br />
                2. Always verify the Landlord's identity and ownership of the
                property before making any payments. <br />
                3. Be cautious of deals that seem too good to be true, as they
                may be scams. <br />
                4. Always use secure payment methods and avoid cash transactions
                when possible. <br />
              </p>
            </div>
            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-xl font-bold mb-6">Building Amenities</h3>
              <div className="flex flex-wrap gap-8">
                <Amenity icon={<Zap />} label="24/7 Power" />
                <Amenity icon={<Shield />} label="Armed Security" />
                <Amenity icon={<Droplets />} label="Water Treatment" />
                <Amenity icon={<Leaf />} label="Green Area" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-6">Strictly "NO" Smoking</h2>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-10 space-y-6">
              <div className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-xl shadow-gray-200/50">
                <div className="flex items-center gap-3 mb-6 bg-green-50 p-3 rounded-2xl border border-green-100">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-700 font-bold text-sm uppercase">
                    Available - High Demand
                  </span>
                </div>

                <div className="mb-8">
                  <p className="text-gray-400 text-sm font-medium mb-1">
                    Annual Rent
                  </p>
                  <h1 className="text-4xl font-black text-gray-900">
                    ₦2,500,000
                    <span className="text-lg font-normal text-gray-500">
                      /yr
                    </span>
                  </h1>
                </div>
                <div className="space-y-4">
                  <button className="w-full bg-[#4CAF50] text-white font-bold py-5 rounded-[24px] hover:bg-[#43A047] transition-all active:scale-95 shadow-lg shadow-green-100 cursor-pointer">
                    Book Inspection
                  </button>

                  <button className="w-full bg-[#FF9800] text-white font-black py-5 rounded-[24px] hover:bg-[#F57C00] transition-all active:scale-95 shadow-lg shadow-orange-100 uppercase">
                    Lock This House (₦5,000)
                  </button>
                </div>

                <p className="text-center text-gray-400 text-xs mt-6">
                  * Locking a house reserves it for 48 hours while you process
                  your application.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-[32px] flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                  <Image
                    src="/Company.png"
                    width={48}
                    height={48}
                    alt="Agent"
                  />
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    RentULO Verified Agent
                  </p>
                  <p className="text-xs text-gray-500">Member since 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Spec({ icon, label, value }: any) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-xs text-gray-400 uppercase font-bold tracking-wider">
        {icon} {label}
      </div>
      <p className="font-bold text-gray-900">{value}</p>
    </div>
  );
}

function Amenity({ icon, label }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-[#E8F5E9] text-[#4CAF50] rounded-full flex items-center justify-center">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <span className="font-bold text-gray-700 text-sm">{label}</span>
    </div>
  );
}
