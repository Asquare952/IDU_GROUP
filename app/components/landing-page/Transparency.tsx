import React from "react";
import Image from "next/image";

const Transparency = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-40 mt-29">
      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="relative group">
          <div>
            <Image
              src="/building.png"
              alt="IDU Building"
              width={550}
              height={400}
              className="rounded-[24px] object-cover"
            />
          </div>
        </div>
        <div className="lg:w-1/2">
          <div className="mb-6">
            <Image src="/peoples.png" alt="Icon" width={45} height={45} />
          </div>
          <h2 className="font-semibold text-2xl sm:text-2xl lg:text-2xl leading-[1.2] text-gray-900">
            Built by Innovators. <br />
            <span className="text-gray-900">Driven by Transparency</span>
          </h2>
          <p className="mt-6 text-[#807979] font-medium text-lg sm:text-xl leading-relaxed max-w-lg">
            IDU Group is a tech-driven team solving <br /> real-world challenges with
            innovation, <br />development, and unity. <br /> Our mission: to simplify housing
            for every <br />one.
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-8 rounded-full transition duration-300 text-base cursor-pointer mt-9 shadow-lg">
            Join our mission
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transparency;
