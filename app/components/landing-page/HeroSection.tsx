"use client";
import React from "react";
import Image from "next/image";

interface SearchItemProps {
  title: string;
  placeholder: string;
  isLast?: boolean;
  showLocationIcon?: boolean;
}

const SearchItem = ({
  title,
  placeholder,
  isLast,
  showLocationIcon,
}: SearchItemProps) => (
  <div
    className={`w-full md:flex-1 flex flex-col px-6 md:px-8 py-4 md:py-2 ${
      !isLast ? "border-b md:border-b-0 md:border-r border-gray-100" : ""
    }`}
  >
    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">
      {title}
    </span>
    <div className="flex items-center justify-between gap-2">
      <input
        type="text"
        placeholder={placeholder}
        className="bg-transparent text-sm font-semibold text-[#1A2B49] outline-none placeholder:text-gray-300 w-full"
      />

      {showLocationIcon && (
        <div className="flex-shrink-0">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
              stroke="#22C55E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
              stroke="#22C55E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
      {isLast && (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      )}
    </div>
  </div>
);

const HeroSection = () => {
  return (
    <div className="relative w-full bg-white">
      <section className="relative h-[85vh] md:h-[800px] w-full px-4 pt-4">
        <div className="relative w-full h-full rounded-[32px] md:rounded-[40px] overflow-hidden">
          <Image
            src="/IDU GROUP HOME.png"
            alt="Hero Background"
            fill
            className="object-cover brightness-[0.7]"
            priority
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pb-24 md:pb-32">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-[1.1]">
              Find Verified Homes <br />
              No Agents. <span className="text-[#22C55E]">No Scams.</span>
            </h1>

            <p className="text-gray-100 text-sm md:text-lg max-w-xl mb-10 opacity-90">
              Discover trusted houses for rents near you. Directly from
              landlords, verified and location-based.
            </p>

            <div className="flex flex-row gap-4">
              <button className="bg-[#43A047] hover:bg-green-600 text-white font-semibold py-3 px-6 md:px-10 rounded-full transition shadow-lg cursor-pointer transition-all active:scale-95">
                Find a house
              </button>
              <button className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white font-semibold py-3 px-6 md:px-10 rounded-full transition cursor-pointer transition-all active:scale-95">
                List a property
              </button>
            </div>
          </div>
        </div>
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-[92%] max-w-6xl z-30">
          <div className="bg-white rounded-[24px] md:rounded-full shadow-2xl p-2 md:p-3 flex flex-col md:flex-row items-center border border-gray-100">
            <SearchItem title="Enter Keyword" placeholder="Lagos, Nigeria" />
            <SearchItem
              title="Location"
              placeholder="Select location"
              showLocationIcon={true}
            />
            <SearchItem
              title="Property Type"
              placeholder="Select type"
              isLast={true}
            />

            <button className="w-full md:w-auto bg-[#22C55E] hover:bg-green-600 text-white px-8 py-4 rounded-[16px] md:rounded-full font-bold text-sm transition mt-2 md:mt-0 md:ml-2 cursor-pointer transition-all active:scale-95">
              Search Properties
            </button>
          </div>
        </div>
      </section>
      <div className="h-24 md:h-32"></div>
    </div>
  );
};

export default HeroSection;
