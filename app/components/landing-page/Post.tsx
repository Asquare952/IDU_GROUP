import React from "react";
import Image from "next/image";

const Post = () => {
  return (
    <div
      className="mt-40 mb-20 py-20 relative flex-wrap"
      style={{
        background:
          "linear-gradient(94.1deg, #F9F9F9 0.39%, rgba(236, 245, 237, 0.62) 102.86%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-5/12">
            <h1 className="font-semibold text-xl sm:text-4xl leading-tight">
              List your Properties. <br className="hidden sm:inline" /> Get Real
              Tenants Fast
            </h1>
            <p className="mt-5 text-[#807979] font-medium text-lg sm:text-xl max-w-sm">
              Post your house once, and reach <br />
              verified tenants in your location
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-8 rounded-full transition duration-300 text-base cursor-pointer mt-9 shadow-lg">
              Start Listing
            </button>
          </div>

          <div className="lg:w-7/12 flex justify-end mt-10">
            <div className="relative w-full max-w-2xl">
              <Image
                src="/Landlord Dashboard.png"
                alt="Landlord Dashboard"
                width={850}
                height={550}
                className="relative rounded-xl shadow-2xl border border-gray-100 z-20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
