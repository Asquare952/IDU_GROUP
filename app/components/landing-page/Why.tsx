import React from "react";
import Image from "next/image";

const Why = () => {
  return (
    <div className="mb-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div>
        <h1 className="text-3xl mb-16 mt-12 text-center">
          Why Rent With{" "}
          <span className="text-green-600 font-semibold">IDU</span>?
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-7">
        <div className="bg-white p-2 rounded-xl shadow-md border-none border-[background: linear-gradient(94.1deg, #F9F9F9 0.39%, rgba(236, 245, 237, 0.62) 102.86%);]">
          <div className="mb-4 h-24 flex items-center justify-center">
            <Image
              src="/verify.png"
              alt="verify icon"
              width={170}
              height={150}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Image
              src="/verify listing.png"
              alt="verify icon"
              width={26}
              height={26}
              className="mt-7"
            />
            <h2 className="font-semibold text-xl mt-7">Verify listing</h2>
          </div>
          <p className="mt-3 text-[#807979] font-semibold text-xl">
            Every house is verified before going <br />
            live. No scams. No fake landlords.
          </p>
        </div>
        <div className="bg-white p-2 rounded-xl shadow-md border-none border-[background: linear-gradient(94.1deg, #F9F9F9 0.39%, rgba(236, 245, 237, 0.62) 102.86%);]">
          <div className="mb-4 h-24 relative flex items-center justify-center">
            <Image
              src="/smart charge .png"
              alt="Property details card 1"
              width={140}
              height={90}
              className="absolute top-0 left-4 z-10"
            />
            <Image
              src="/smart charge2.png"
              alt="Property details card 2"
              width={140}
              height={90}
              className="absolute top-4 right-4 z-0"
            />
            <Image
              src="/green search.png"
              alt="Green search icon"
              width={40}
              height={40}
              className="absolute bottom-0"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Image
              src="/filter.png"
              alt="verify icon"
              width={26}
              height={26}
              className="mt-7"
            />
            <h2 className="font-semibold text-xl mt-7">Quick, Smart Search</h2>
          </div>
          <p className="mt-3 text-[#807979] font-semibold text-xl">
            Find your dream home faster with filters <br />
            for price location, and amenities.
          </p>
        </div>
        <div className="bg-white p-2 rounded-xl shadow-md border-none border-[background: linear-gradient(94.1deg, #F9F9F9 0.39%, rgba(236, 245, 237, 0.62) 102.86%);]">
          <div className="mb-4 h-24 flex items-center justify-center">
            <Image
              src="/google .png"
              alt="verify icon"
              width={200}
              height={160}
              className="mt-24"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Image
              src="/mapping.png"
              alt="verify icon"
              width={26}
              height={26}
              className="mt-7"
            />
            <h2 className="font-semibold text-xl mt-7">Map-based discovery</h2>
          </div>
          <p className="mt-3 text-[#807979] font-semibold text-xl">
            Find available houses around <br />
            your preferred area instantly
          </p>
        </div>
        <div className="bg-white p-2 rounded-xl shadow-md border-none border-[background: linear-gradient(94.1deg, #F9F9F9 0.39%, rgba(236, 245, 237, 0.62) 102.86%);]">
          <div className="mb-4 h-24 relative flex items-center justify-center">
            <Image
              src="/comment.png"
              alt='Chat bubble "You say?" background'
              width={110}
              height={110}
              className="absolute top-[-10px] left-10 z-0"
            />
            <span className="absolute top-[28px] left-[78px] text-sm font-semibold z-10 text-gray-800">
            </span>
            <Image
              src="/comment2.png"
              alt='Chat bubble "Sealed!" background'
              width={110}
              height={110}
              className="absolute top-1 right-10 z-10"
            />
            <span className="absolute top-[38px] right-[58px] text-sm font-semibold z-20 text-gray-800">
            </span>
            <Image
              src="/peoples.png"
              alt="Two people icon"
              width={40}
              height={40}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Image
              src="/peoples.png"
              alt="verify icon"
              width={26}
              height={26}
              className="mt-7"
            />
            <h2 className="font-semibold text-xl mt-7">
              Direct with landlords
            </h2>
          </div>
          <p className="mt-3 text-[#807979] font-semibold text-xl">
            Chat directly with verified owners. <br /> Skip agents and hidden
            fees.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Why;
