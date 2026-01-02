import React from "react";
import Image from "next/image";
import properties from "@/app/components/properties";

const Listing = () => {
  const primaryGreen = "#43A047";
  const textColor = "#1A1C1F";

  return (
    <section id="listing">
      <div className="mb-20 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 mx-auto text-center">
          <span className="text-green-600 font-bold text-sm text-xl tracking-wide">
            Featured listings
          </span>
          <h2
            className={`text-4xl md:text-5xl font-bold mt-2 mb-4 text-[${textColor}]`}
          >
            Simple. Transparent. Stress-free
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Explore top-rated rentals and properties from trusted landlords in
            your area
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover rounded-3xl p-2"
                />
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-gray-900 font-bold text-xl">
                      {item.price}
                      <span className="text-sm font-normal text-gray-400">
                        / 2 days ago
                      </span>
                    </p>
                    <h3 className="text-gray-800 font-semibold text-lg">
                      {item.title}
                    </h3>
                  </div>
                  <button className="bg-[#E8F5E9] text-[#43A047] text-xs font-bold px-4 py-1.5 rounded-full cursor-pointer">
                    View
                  </button>
                </div>

                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  Cozy rooms, large jacuzzi, spacious kitchen. Convenient
                  lifestyle living.
                </p>
                <div className="flex flex-wrap gap-4 border-t border-gray-50 pt-4">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/shawer.png"
                      alt="bath"
                      width={16}
                      height={16}
                    />
                    <span className="text-xs text-gray-500 font-medium">
                      2 bathrooms
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image src="/bed.png" alt="bed" width={16} height={16} />
                    <span className="text-xs text-gray-500 font-medium">
                      5 bedrooms
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center w-full">
          <button className="bg-[#34A853] hover:bg-green-700 text-white font-semibold py-2 px-8 rounded-full transition duration-300 mt-8 cursor-pointer transition-all active:scale-95">
            browse Listings <span className="text-sm"> &rarr;</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Listing;
