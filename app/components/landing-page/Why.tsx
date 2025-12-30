import React from "react";
import Image from "next/image";

const Why = () => {
  return (
    <div className="w-full bg-[#E8F0E9] py-20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl text-[#4CAF50] font-bold mb-4 text-center">
            Why Rent<span className="font-semi">ULO</span>?
          </h1>
          <p className="text-4xl text-center font-bold mb-5 text-gray-900">
            Why Rent with US?
          </p>
          <p className="text-xl text-center text-gray-500 mb-16 max-w-2xl mx-auto">
            Explore top-rated rentals and properties from trusted landlords in
            your area
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 h-24 flex items-center justify-center">
              <Image src="/verify.png" alt="verify" width={140} height={120} />
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <Image
                src="/verify listing.png"
                alt="icon"
                width={24}
                height={24}
              />
              <h2 className="font-bold text-xl">Verify listing</h2>
            </div>
            <p className="text-[#807979] font-medium text-base leading-relaxed">
              Every house is verified before going live. No scams. No fake
              landlords.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 h-24 relative flex items-center justify-center">
              <Image
                src="/smart charge .png"
                alt="card1"
                width={100}
                height={70}
                className="absolute top-0 left-2 z-10"
              />
              <Image
                src="/smart charge2.png"
                alt="card2"
                width={100}
                height={70}
                className="absolute top-2 right-2 z-0"
              />
              <Image
                src="/green search.png"
                alt="search"
                width={35}
                height={35}
                className="absolute bottom-0"
              />
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <Image src="/filter.png" alt="icon" width={24} height={24} />
              <h2 className="font-bold text-xl">Quick, Smart Search</h2>
            </div>
            <p className="text-[#807979] font-medium text-base leading-relaxed">
              Find your dream home faster with filters for price, location, and
              amenities.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 h-24 flex items-center justify-center overflow-hidden">
              <Image
                src="/google .png"
                alt="map"
                width={180}
                height={140}
                className="mt-4"
              />
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <Image src="/mapping.png" alt="icon" width={24} height={24} />
              <h2 className="font-bold text-xl">Map-based discovery</h2>
            </div>
            <p className="text-[#807979] font-medium text-base leading-relaxed">
              Find available houses around your preferred area instantly.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 h-24 relative flex items-center justify-center">
              <Image
                src="/comment.png"
                alt="chat1"
                width={80}
                height={80}
                className="absolute top-0 left-4"
              />
              <Image
                src="/comment2.png"
                alt="chat2"
                width={80}
                height={80}
                className="absolute top-2 right-4"
              />
              <Image
                src="/peoples.png"
                alt="people"
                width={35}
                height={35}
                className="absolute bottom-2"
              />
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <Image src="/peoples.png" alt="icon" width={24} height={24} />
              <h2 className="font-bold text-xl">Direct with landlords</h2>
            </div>
            <p className="text-[#807979] font-medium text-base leading-relaxed">
              Chat directly with verified owners. Skip agents and hidden fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Why;
