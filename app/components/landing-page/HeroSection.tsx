"use client";
import React from "react";
import Navbar from "../Header";
import { useState } from "react";
import Image from "next/image";

interface SearchDropdownProps {
  iconPath: string;
  title: string;
  placeholder: string;
  dropdownContent: React.ReactNode;
  isLast: boolean;
}
const SearchDropdown = ({
  iconPath,
  title,
  placeholder,
  dropdownContent,
  isLast,
}: SearchDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    // Container for the whole item, set to relative for the absolute dropdown
    <div
      className={`relative cursor-pointer ${
        !isLast ? "border-r border-white" : ""
      }`}
      onClick={toggleDropdown}
    >
      {/* Search Input Display (The GREEN Box) */}
      <div
        className="flex items-center space-x-2 py-3 px-4 rounded-xl"
        style={{ backgroundColor: "#43A047" }} // Using the exact green color from Figma
      >
        {iconPath && (
          <Image src={iconPath} alt={`${title} icon`} width={20} height={20} />
        )}
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-xs text-white opacity-80">{placeholder}</p>
        </div>
      </div>

      {isOpen && (
        <div
          className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 min-w-max bg-white rounded-xl shadow-2xl z-20 border border-gray-100 p-4"
          style={{ marginTop: "10px" }}
        >
          {dropdownContent}
        </div>
      )}
    </div>
  );
};


const HeroSection = () => {
  const locationDropdown = (
    <div className="space-y-2 w-48">
      <p className="font-semibold text-gray-800">New York City</p>
      <p className="text-sm text-gray-500">Select another city</p>
    </div>
  );

  const categoryDropdown = (
    <div className="space-y-2 w-48">
      <p className="font-semibold text-gray-800">House Category</p>
      <p className="text-sm text-gray-500">Apartment, Condo, etc.</p>
    </div>
  );

  const priceDropdown = (
    <div className="space-y-2 w-48">
      <p className="font-semibold text-gray-800">Apartment $3</p>
      <p className="text-sm text-gray-500">Select range</p>
    </div>
  );

  return (
    <header
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/IDU GROUP HOME.png')" }}
    >
      <Navbar />
      <div className="flex flex-col items-center justify-center h-full pt-20">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white text-center leading-tight mb-4 max-w-4xl">
          Find Verified Homes.
          <br />
          <span className="text-white-400">No Agents. No Scams.</span>
        </h1>
        <p className="text-lg md:text-xl text-white text-center max-w-2xl mb-10">
          Discover trusted houses for rents near you. <br /> Directly from
          landlords, verified and location-based
        </p>
        <div className="flex space-x-4 mb-40">
          <button className="bg-green-600 hover:bg-green-600 text-black font-semibold py-3 px-8 rounded-full transition duration-300 text-sm cursor-pointer">
            Find a house
          </button>
          <button className="bg-transparent border border-white hover:bg-white text-white hover:text-black font-semibold py-3 px-6 rounded-full transition duration-300 text-sm cursor-pointer">
            List a property
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          className="absolute inset-x-0 bottom-0 flex justify-center z-30"
          style={{ bottom: "-100px" }}
        >
          <div className="flex space-x-4 bg-white-900 p-4 rounded-xl shadow-xl">
            <SearchDropdown
              iconPath="/location.png"
              title="Location"
              placeholder="Select your city"
              isLast={false}
              dropdownContent={locationDropdown}
            />

            <SearchDropdown
              iconPath="/property.png"
              title="Property Category"
              placeholder="Select property type"
              isLast={false}
              dropdownContent={categoryDropdown}
            />

            <div className="flex items-center space-x-4">
              <SearchDropdown
                iconPath="/price.png"
                title="Price range"
                placeholder="Select price range"
                isLast={true}
                dropdownContent={priceDropdown}
              />

              {/* Search Button (Final search icon) */}
              <button
                className="bg-green-400 text-white p-3 rounded-xl hover:bg-green-700 transition duration-300 ml-2"
                style={{ backgroundColor: "#43A047" }}
              >
                <Image
                  src="/search.png"
                  alt="Search"
                  width={18}
                  height={18} 
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
