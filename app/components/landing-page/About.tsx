import React from "react";
import Image from "next/image";

const About = () => {
  const primaryGreen = "#43A047";
  return (
    <div className="flex justify-around mb-25">
      <div className="font-Inter flex-wrap">
        <div className="inline-block mb-3">
          <h1 className="text-5xl text-green-600 mb-0 font-bold">
            How it works
          </h1>
          <div className="w-full h-4 relative">
            <svg
              className="absolute top-0 left-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            >
              <path
                fill="none"
                stroke={primaryGreen}
                strokeWidth="1.5"
                d="M 0 5 C 25 2, 75 8, 100 5"
              ></path>
            </svg>
          </div>
        </div>

        <p className="font-semibold mt-3 text-2xl">
          Simple. Transparent. <br /> Stress-free
        </p>
        <p className="mt-3 text-[#807979] font-semibold text-xl">
          Renting a house shouldn’t be <br /> complicated. We connect you
          directly to <br />
          verified landlords in four easy steps
        </p>

        <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full transition duration-300 text-sm mt-10 mb-5 cursor-pointer">
          Get started now
        </button>
      </div>
      <div className="grid grid-cols-2 gap-6 flex-wrap mb-7">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="mb-4 h-24 flex items-center justify-center">
            <Image
              src="/sign up.png"
              alt="SIGN UP"
              width={90}
              height={90}
              className="mb-7"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Image
              src="/personal for IDU.png"
              alt="Person icon"
              width={26}
              height={26}
              className="mt-7"
            />
            <h2 className="font-semibold text-xl mt-7">Sign up or log in</h2>
          </div>
          <p className="mt-3 text-[#807979] font-semibold text-xl">
            Create a free account as a House <br />
            Seeker or Landlord
          </p>
        </div>
        <div className="bg-white p-9 rounded-xl shadow-md border border-gray-100">
          <div className="mb-4 h-24 flex items-center justify-end relative w-full">
            <Image
              src="/map.png"
              alt="World Map"
              width={180}
              height={120}
              className="absolute top-0 right-0 z-0 opacity-75"
            />
            <Image
              src="/map2.png"
              alt="Location Bubble"
              width={200}
              height={100}
              className="absolute top-10 left-0 z-10"
            />
            <Image
              src="/dot.png"
              alt="Location Dot"
              width={15}
              height={15}
              className="absolute top-10 right-10 z-20"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Image
              src="/searchbar for IDU (1).png"
              alt="searchbar"
              width={26}
              height={26}
              className="mt-7"
            />
            <h2 className="font-semibold text-xl mt-7">Search by location</h2>
          </div>
          <p className="mt-3 text-[#807979] font-semibold text-xl">
            Find available houses around your <br />
            preferred area instantly
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="mb-4 h-24 relative w-full">
            <Image
              src="/connect image2.png"
              alt="Chat bubble 2"
              width={160}
              height={50}
              className="absolute bottom-0 right-0 z-10"
            />
            <Image
              src="/connect image1.png"
              alt="Chat bubble 1"
              width={190}
              height={60}
              className="absolute top-0 left-0"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Image
              src="/chat for IDU (2).png"
              alt="char icon"
              width={26}
              height={26}
            />
            <h2 className="font-semibold text-xl">Connect directly</h2>
          </div>
          <p className="mt-3 text-[#807979] font-semibold text-xl">
            Message verified landlords or <br />
            tenants. No agents. No hidden fees
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="mb-4 h-24 flex items-center justify-center">
            <Image
              src="/House.png"
              alt="house"
              width={50}
              height={50}
              className="mb-8"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Image
              src="/home for IDU (3).png"
              alt="Person icon"
              width={26}
              height={26}
            />
            <h2 className="font-semibold text-xl">Rent with confidence</h2>
          </div>
          <p className="mt-3 text-[#807979] font-semibold text-xl">
            Visit, confirm and finalize the deal <br /> with peace of mind.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
