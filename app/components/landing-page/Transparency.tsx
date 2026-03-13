import React from "react";
import Image from "next/image";

const Transparency = () => {
  return (
    <div id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-40 mt-20">
        <div className="bg-white rounded-[32px] p-6 lg:p-10 flex flex-col lg:flex-row items-center gap-14 lg:gap-16">
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-[5/4] w-full">
              <Image
                src="/Company.png"
                alt="IDU Building"
                fill
                className="rounded-[24px] object-cover"
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col items-start">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/IDU GROUP LOGO.png"
                alt="RentULO Icon"
                width={24}
                height={24}
              />
              <span className="font-bold text-xl text-[#111827]">
                Rent<span className="text-green-600">ULO</span>
              </span>
            </div>

            <h2 className="font-bold text-3xl lg:text-4xl leading-tight text-gray-900">
              Built by Innovators.
              <br />
              Driven by Transparency
            </h2>

            <p className="mt-6 text-gray-500 font-normal text-lg leading-relaxed max-w-lg">
              IDU Group is a tech-driven team solving real-world challenges with
              innovation, development, and unity. Our mission: to simplify
              housing for everyone.
            </p>

            <button className="bg-[#22C55E] hover:bg-green-700 text-white font-semibold py-3 px-10 rounded-full duration-300 text-base mt-8 cursor-pointer transition-all active:scale-95">
              Join our mission
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transparency;