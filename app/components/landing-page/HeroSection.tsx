"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getCurrentUserRole, hasAccessToken } from "@/app/lib/auth";



interface SearchItemProps {
  title: string;
  placeholder: string;
  isLast?: boolean;
  showLocationIcon?: boolean;
  isDropdown?: boolean;
  options?: string[];
  value: string;
  onChange: (value: string) => void;
}

const SearchItem = ({
  title,
  placeholder,
  isLast,
  showLocationIcon,
  isDropdown,
  options,
  value,
  onChange,
}: SearchItemProps) => (
  <div
    className={`w-full md:flex-1 flex flex-col px-6 md:px-8 py-4 md:py-2 ${!isLast ? "border-b md:border-b-0 md:border-r border-gray-100" : ""
      }`}
  >
    <span className="text-xs md:text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">
      {title}
    </span>
    <div className="flex items-center justify-between gap-2">
      {isDropdown ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-base md:text-sm font-semibold text-[#1A2B49] outline-none w-full cursor-pointer appearance-none pr-4"
        >
          <option value="">{placeholder}</option>
          {options?.map((option) => (
            <option key={option} value={option.toLowerCase()}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent text-base md:text-sm font-semibold text-[#1A2B49] outline-none placeholder:text-gray-300 w-full"
        />
      )}
      {showLocationIcon && (
        <div className="flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
              stroke="#22C55E"
              strokeWidth="2"
            />
            <path
              d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
              stroke="#22C55E"
              strokeWidth="2"
            />
          </svg>
        </div>
      )}
    </div>
  </div>
);

const HeroSection = () => {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [showTenantModal, setShowTenantModal] = useState(false);
  const isLoggedIn = hasAccessToken();
  const userRole = getCurrentUserRole();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (location) params.append("search", location);
    if (propertyType) params.append("category", propertyType);
    router.push(`/tenant/homepage?${params.toString()}`);
  };

  const handleFindHouse = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      router.push("/tenant/homepage");
    }
  };

  const handleListProperty = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else if (userRole === "tenant") {
      setShowTenantModal(true);
    } else {
      router.push("/landlord/dashboard");
    }
  };

  return (
    <div className="relative w-full bg-white">
      {/* Tenant Modal */}
      {showTenantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] p-8 max-w-md mx-4 shadow-2xl text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg
                className="w-8 h-8 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Landlords Only
            </h3>
            <p className="text-gray-500 mb-2 leading-relaxed">
              Property listings can only be created by verified landlords.
              You're signed in as a{" "}
              <span className="font-semibold text-emerald-600">tenant</span>.
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Want to list your property? Switch to a landlord account or
              register as one.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowTenantModal(false);
                  router.push("/signup");
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-full transition-all active:scale-95"
              >
                Become a Landlord
              </button>
              <button
                onClick={() => {
                  setShowTenantModal(false);
                  router.push("/tenant/homepage");
                }}
                className="border border-gray-200 hover:border-gray-300 text-gray-600 font-semibold py-3 px-6 rounded-full transition-all active:scale-95"
              >
                Browse Homes
              </button>
              <button
                onClick={() => setShowTenantModal(false)}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="relative h-[85vh] md:h-[800px] w-full px-4 pt-4">
        <div className="relative w-full h-full rounded-[32px] md:rounded-[40px] overflow-hidden">
          <Image
            src="/IDU GROUP HOME.webp"
            alt="Hero Background"
            fill
            className="object-cover brightness-[0.7]"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pb-24 md:pb-32">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-[1.1]">
              Find Verified Homes <br />
              No Agents. <span className="text-[#22C55E]">No Scams.</span>
            </h1>
            <p className="text-gray-100 text-base md:text-lg max-w-xl mb-10 opacity-90">
              Discover trusted houses for rents near you. Directly from
              landlords, verified and location-based.
            </p>
            <div className="flex flex-row gap-4">
              <button
                onClick={handleFindHouse}
                className="cursor-pointer bg-[#43A047] hover:bg-green-600 text-white font-semibold py-3 px-6 md:px-10 rounded-full transition-all active:scale-95 shadow-lg shadow-green-900/20"
              >
                Find a house
              </button>
              {userRole === "tenant" ? null : (
                <button
                  onClick={handleListProperty}
                  className="cursor-pointer bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white font-semibold py-3 px-6 md:px-10 rounded-full transition-all active:scale-95"
                >
                  List a property
                </button>
              )}

            </div>
          </div>
        </div>

        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-[92%] max-w-6xl z-30">
          <div className="bg-white rounded-[24px] md:rounded-full shadow-2xl p-2 md:p-3 flex flex-col md:flex-row items-center border border-gray-100">
            <SearchItem
              title="Enter Keyword"
              placeholder="e.g. Pool"
              value={keyword}
              onChange={setKeyword}
            />
            <SearchItem
              title="Location"
              placeholder="Select location"
              isDropdown={true}
              options={["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Enugu"]}
              showLocationIcon={true}
              value={location}
              onChange={setLocation}
            />
            <SearchItem
              title="Property Type"
              placeholder="Select type"
              isDropdown={true}
              options={["Bungalow", "Duplex", "Apartment"]}
              isLast={true}
              value={propertyType}
              onChange={setPropertyType}
            />
            <button
              onClick={handleSearch}
              className="cursor-pointer w-full md:w-auto bg-[#22C55E] hover:bg-green-600 text-white px-8 py-4 rounded-[16px] md:rounded-full font-bold text-base md:text-sm transition mt-2 md:mt-0 md:ml-2 active:scale-95"
            >
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
