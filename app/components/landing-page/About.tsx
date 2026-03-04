import React from "react";
import Image from "next/image";

const About = () => {
  return (
    <div className="bg-[#E8F0E9] py-24 px-4 mb-5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#4CAF50] font-bold text-2xl uppercase tracking-wider">
            How it works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A2B49] mt-4 mb-6">
            Simple. Transparent. Stress-free
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
            Renting a house shouldn't be complicated. We connect you directly to
            verified landlords in four easy steps
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="h-32 flex items-center justify-center mb-6">
              <Image src="/sign up.png" alt="SIGN UP" width={90} height={90} />
            </div>
            <div className="mt-auto">
              <div className="flex items-center gap-2 mb-3">
                <Image
                  src="/personal for IDU.png"
                  alt="icon"
                  width={22}
                  height={22}
                />
                <h3 className="font-bold text-lg text-[#1A2B49]">
                  Sign up or log in
                </h3>
              </div>
              <p className="text-[#807979] text-sm font-medium leading-relaxed">
                Create a free account as a House Seeker or Landlord
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="h-32 flex items-center justify-center mb-6 relative w-full">
              <Image
                src="/map.png"
                alt="World Map"
                width={180}
                height={100}
                className="absolute opacity-40"
              />
              <Image
                src="/map2.png"
                alt="Location Bubble"
                width={150}
                height={80}
                className="relative z-10"
              />
            </div>
            <div className="mt-auto">
              <div className="flex items-center gap-2 mb-3">
                <Image
                  src="/searchbar for IDU (1).png"
                  alt="icon"
                  width={22}
                  height={22}
                />
                <h3 className="font-bold text-lg text-[#1A2B49]">
                  Search by location
                </h3>
              </div>
              <p className="text-[#807979] text-sm font-medium leading-relaxed">
                Find available houses around your preferred area instantly
              </p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="h-32 relative w-full mb-6">
              <Image
                src="/connect image1.png"
                alt="Chat 1"
                width={150}
                height={50}
                className="absolute top-0 left-0"
              />
              <Image
                src="/connect image2.png"
                alt="Chat 2"
                width={120}
                height={40}
                className="absolute bottom-0 right-0"
              />
            </div>
            <div className="mt-auto">
              <div className="flex items-center gap-2 mb-3">
                <Image
                  src="/chat for IDU (2).png"
                  alt="icon"
                  width={22}
                  height={22}
                />
                <h3 className="font-bold text-lg text-[#1A2B49]">
                  Connect directly
                </h3>
              </div>
              <p className="text-[#807979] text-sm font-medium leading-relaxed">
                Message verified landlords or tenants. No agents. No hidden fees
              </p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="h-32 flex items-center justify-center mb-6">
              <Image src="/House.png" alt="house" width={60} height={60} />
            </div>
            <div className="mt-auto">
              <div className="flex items-center gap-2 mb-3">
                <Image
                  src="/home for IDU (3).png"
                  alt="icon"
                  width={22}
                  height={22}
                />
                <h3 className="font-bold text-lg text-[#1A2B49]">
                  Rent with confidence
                </h3>
              </div>
              <p className="text-[#807979] text-sm font-medium leading-relaxed">
                Visit, confirm and finalize the deal with peace of mind.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
