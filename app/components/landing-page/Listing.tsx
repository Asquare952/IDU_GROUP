import React from "react";
import Image from "next/image";

const Listing = () => {
  const primaryGreen = "#43A047";
  return (
    <div className="mb-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-3 mx-auto max-w-fit">
        <h1 className="text-5xl text-green-600 mb-0 font-bold text-center">
          Feature listings
        </h1>
        <div className="w-full h-4 relative mt-2">
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
        <p className="mt-3 text-[#807979] font-semibold text-xl mb-7 text-center">
          Explore top-rated rentals and properties <br /> from trusted landlords
          in your area
        </p>
      </div>
      <div className="flex justify-between items-center mt-6 mb-8">
        <h3 className="text-2xl font-semibold text-gray-900">
          Verified Homes Near You
        </h3>
        <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded-full transition duration-300 text-sm cursor-pointer">
          View all rentals
        </button>
      </div>
      <div className="grid grid-cols-3 gap-8 mx-auto">
        <div className="mb-5 p-2 bg-white shadow-lg rounded-xl">
          <Image
            src="/mini flat 1.png"
            alt="flats"
            width={330}
            height={330}
            className="mb-7 w-full h-auto rounded-xl"
          />
          <h2 className="mt-3 text-[#807979] font-semibold text-xl mb-2">
            Compact mini flat
          </h2>

          <div className="flex flex-wrap gap-y-3 gap-x-6">
            <div className="flex items-center space-x-2">
              <Image
                src="/icons for IDU.png"
                alt="location icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979]">Yaba, Lagos</p>
            </div>

            <div className="flex items-center space-x-2">
              <Image
                src="/verified.png"
                alt="verified icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979] text-sm">verified Landlords</p>
            </div>

            <div className="flex items-center space-x-2  bg-gray-200 py-1 px-3 rounded-full text-sm">
              <Image
                src="/bed.png"
                alt="bed icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979] text-sm">5, bedroom</p>
            </div>
            <div className="flex items-center space-x-2  bg-gray-200 py-1 px-3 rounded-full">
              <Image
                src="/shawer.png"
                alt="shower icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979] text-sm">5, bathrooms</p>
            </div>
          </div>
          <div className="flex gap-30 mx-auto items-center mt-6 mb-8">
            <p className="font-bold text-2xl text-[#3D3F42]">$230.000</p>
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 text-sm cursor-pointer">
              View details
            </button>
          </div>
        </div>
        <div className="mb-5 p-2 bg-white shadow-lg rounded-xl">
          <Image
            src="/mini flat 2.png"
            alt="flats"
            width={330}
            height={330}
            className="mb-7 w-full h-auto rounded-xl"
          />
          <h2 className="mt-3 text-[#807979] font-semibold text-xl mb-2">
            Compact mini flat
          </h2>

          <div className="flex flex-wrap gap-y-3 gap-x-6">
            <div className="flex items-center space-x-2">
              <Image
                src="/icons for IDU.png"
                alt="location icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979]">Yaba, Lagos</p>
            </div>

            <div className="flex items-center space-x-2">
              <Image
                src="/verified.png"
                alt="verified icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979] text-sm">verified Landlords</p>
            </div>

            <div className="flex items-center space-x-2  bg-gray-200 py-1 px-3 rounded-full text-sm">
              <Image
                src="/bed.png"
                alt="bed icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979] text-sm">5, bedroom</p>
            </div>
            <div className="flex items-center space-x-2  bg-gray-200 py-1 px-3 rounded-full">
              <Image
                src="/shawer.png"
                alt="shower icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979] text-sm">5, bathrooms</p>
            </div>
          </div>
          <div className="flex gap-30 mx-auto items-center mt-6 mb-8">
            <p className="font-bold text-2xl text-[#3D3F42]">$160.000</p>
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 text-sm cursor-pointer">
              View details
            </button>
          </div>
        </div>
        <div className="mb-5 p-2 bg-white shadow-lg rounded-xl">
          <Image
            src="/mini flat 3.png"
            alt="flats"
            width={330}
            height={330}
            className="mb-7 w-full h-auto rounded-xl"
          />
          <h2 className="mt-3 text-[#807979] font-semibold text-xl mb-2">
            Compact mini flat
          </h2>

          <div className="flex flex-wrap gap-y-3 gap-x-6">
            <div className="flex items-center space-x-2">
              <Image
                src="/icons for IDU.png"
                alt="location icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979]">Yaba, Lagos</p>
            </div>

            <div className="flex items-center space-x-2">
              <Image
                src="/verified.png"
                alt="verified icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979] text-sm">verified Landlords</p>
            </div>

            <div className="flex items-center space-x-2  bg-gray-200 py-1 px-3 rounded-full text-sm">
              <Image
                src="/bed.png"
                alt="bed icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979] text-sm">5, bedroom</p>
            </div>
            <div className="flex items-center space-x-2  bg-gray-200 py-1 px-3 rounded-full">
              <Image
                src="/shawer.png"
                alt="shower icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979] text-sm">5, bathrooms</p>
            </div>
          </div>
          <div className="flex gap-30 mx-auto items-center mt-6 mb-8">
            <p className="font-bold text-2xl text-[#3D3F42]">$165.000</p>
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 text-sm cursor-pointer">
              View details
            </button>
          </div>
        </div>
        <div className="mb-5 p-2 bg-white shadow-lg rounded-xl">
          <Image
            src="/mini flat 4.png"
            alt="flats"
            width={330}
            height={330}
            className="mb-7 w-full h-auto rounded-xl"
          />
          <h2 className="mt-3 text-[#807979] font-semibold text-xl mb-2">
            Compact mini flat
          </h2>

          <div className="flex flex-wrap gap-y-3 gap-x-6">
            <div className="flex items-center space-x-2">
              <Image
                src="/icons for IDU.png"
                alt="location icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979]">Yaba, Lagos</p>
            </div>

            <div className="flex items-center space-x-2">
              <Image
                src="/verified.png"
                alt="verified icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979] text-sm">verified Landlords</p>
            </div>

            <div className="flex items-center space-x-2  bg-gray-200 py-1 px-3 rounded-full text-sm">
              <Image
                src="/bed.png"
                alt="bed icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979] text-sm">5, bedroom</p>
            </div>
            <div className="flex items-center space-x-2  bg-gray-200 py-1 px-3 rounded-full">
              <Image
                src="/shawer.png"
                alt="shower icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979] text-sm">5, bathrooms</p>
            </div>
          </div>
          <div className="flex gap-30 mx-auto items-center mt-6 mb-8">
            <p className="font-bold text-2xl text-[#3D3F42]">$120.000</p>
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 text-sm cursor-pointer">
              View details
            </button>
          </div>
        </div>
        <div className="mb-5 p-2 bg-white shadow-lg rounded-xl">
          <Image
            src="/mini flat 5.png"
            alt="flats"
            width={330}
            height={330}
            className="mb-7 w-full h-auto rounded-xl"
          />
          <h2 className="mt-3 text-[#807979] font-semibold text-xl mb-2">
            Compact mini flat
          </h2>

          <div className="flex flex-wrap gap-y-3 gap-x-6">
            <div className="flex items-center space-x-2">
              <Image
                src="/icons for IDU.png"
                alt="location icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979]">Yaba, Lagos</p>
            </div>

            <div className="flex items-center space-x-2">
              <Image
                src="/verified.png"
                alt="verified icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979] text-sm">verified Landlords</p>
            </div>

            <div className="flex items-center space-x-2  bg-gray-200 py-1 px-3 rounded-full text-sm">
              <Image
                src="/bed.png"
                alt="bed icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979] text-sm">5, bedroom</p>
            </div>
            <div className="flex items-center space-x-2  bg-gray-200 py-1 px-3 rounded-full">
              <Image
                src="/shawer.png"
                alt="shower icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979] text-sm">5, bathrooms</p>
            </div>
          </div>
          <div className="flex gap-30 mx-auto items-center mt-6 mb-8">
            <p className="font-bold text-2xl text-[#3D3F42]">$130.000</p>
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 text-sm cursor-pointer">
              View details
            </button>
          </div>
        </div>
        <div className="mb-5 p-2 bg-white shadow-lg rounded-xl">
          <Image
            src="/mini flat 6.png"
            alt="flats"
            width={330}
            height={330}
            className="mb-7 w-full h-auto rounded-xl"
          />
          <h2 className="mt-3 text-[#807979] font-semibold text-xl mb-2">
            Compact mini flat
          </h2>

          <div className="flex flex-wrap gap-y-3 gap-x-6">
            <div className="flex items-center space-x-2">
              <Image
                src="/icons for IDU.png"
                alt="location icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979]">Yaba, Lagos</p>
            </div>

            <div className="flex items-center space-x-2">
              <Image
                src="/verified.png"
                alt="verified icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979] text-sm">verified Landlords</p>
            </div>

            <div className="flex items-center space-x-2  bg-gray-200 py-1 px-3 rounded-full text-sm">
              <Image
                src="/bed.png"
                alt="bed icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979] text-sm">5, bedroom</p>
            </div>
            <div className="flex items-center space-x-2  bg-gray-200 py-1 px-3 rounded-full">
              <Image
                src="/shawer.png"
                alt="shower icon"
                width={15}
                height={15}
                className="mb-0"
              />
              <p className="text-[#807979] text-sm">5, bathrooms</p>
            </div>
          </div>
          <div className="flex gap-30 mx-auto items-center mt-6 mb-8">
            <p className="font-bold text-2xl text-[#3D3F42]">$340.000</p>
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 text-sm cursor-pointer">
              View details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listing;
