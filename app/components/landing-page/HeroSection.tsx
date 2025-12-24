"use client";
import React from "react";
import Image from "next/image";
interface SearchItemProps {
  icon: string;
  title: string;
  placeholder: string;
  isLast?: boolean;
}

const SearchItem = ({ icon, title, placeholder, isLast }: SearchItemProps) => (
  <div
    className={`flex-1 flex flex-col px-8 py-2 ${!isLast ? "border-r border-gray-100" : ""}`}
  >
    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
      {title}
    </span>
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder={placeholder}
        className="bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-300 w-full"
      />
    </div>
  </div>
);

const HeroSection = () => {
  return (
    <div className="relative w-full bg-white">
      <section className="relative h-[85vh] w-full px-4 pt-4">
        <div className="relative w-full h-full rounded-[40px] overflow-hidden">
          <Image
            src="/IDU GROUP HOME.png"
            alt="Hero Background"
            fill
            className="object-cover brightness-[0.8]"
            priority
          />
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 pb-20">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-[1.1]">
                Find Verified Homes <br />
                No Agents. <span className="text-[#4CAF50]">No Scams.</span>
              </h1>

              <p className="text-gray-100 text-sm md:text-lg max-w-xl mb-10 opacity-90">
                Discover trusted houses for rents near you. Directly from
                landlords, verified and location-based.
              </p>

              <div className="flex items-center gap-4">
                <button className="bg-[#4CAF50] hover:bg-green-600 text-white font-semibold py-3.5 px-10 rounded-full transition shadow-lg cursor-pointer">
                  Find a house
                </button>
                <button className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white font-semibold py-3.5 px-10 rounded-full transition cursor-pointer">
                  List a property
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-full max-w-5xl px-6 z-30">
          <div className="bg-white rounded-[24px] shadow-2xl p-3 flex flex-col md:flex-row items-center">
            <SearchItem
              icon="/location.png"
              title="Enter Keyword"
              placeholder="Lagos, Nigeria"
            />
            <SearchItem
              icon="/location.png"
              title="Location"
              placeholder="Select location"
            />
            <SearchItem
              icon="/property.png"
              title="Property Type"
              placeholder="Select type"
              isLast={true}
            />

            <button className="w-full md:w-auto bg-[#5BBF6B] hover:bg-green-600 text-white px-8 py-4 rounded-[18px] font-bold text-sm transition ml-2 cursor-pointer">
              Search Properties
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
