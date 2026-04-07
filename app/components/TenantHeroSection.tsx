import Image from "next/image";
import { FiSearch, FiMapPin, FiChevronDown } from "react-icons/fi";

const TenantHeroSection = () => {
  return (
  <section className="relative w-full px-6 md:px-12 pt-6">
          <div className="relative w-full h-[250px] overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="/Duplex.jpeg"
              alt="RentULO Banner"
              fill
              className="object-cover object-[center_35%]"
              priority
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-40px] w-[92%] max-w-6xl z-10">
            <div className="bg-white px-6 py-5 md:px-8 md:py-6 rounded-[28px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <div className="flex-1 w-full">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Keyword
                </p>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    placeholder="Enter keyword"
                    className="w-full bg-gray-100 rounded-xl pl-10 pr-4 py-3 text-sm outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="flex-1 w-full">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Location
                </p>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
                  <input
                    type="text"
                    placeholder="Lagos, Nigeria"
                    className="w-full bg-gray-100 rounded-xl pl-10 pr-4 py-3 text-sm outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="flex-1 w-full">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Property type
                </p>
                <div className="relative">
                  <select className="w-full bg-gray-100 rounded-xl px-4 pr-10 py-3 text-sm text-gray-700 outline-none appearance-none cursor-pointer">
                    <option>Modern Bungalow</option>
                    <option>2 Bedroom Flat</option>
                    <option>Duplex</option>
                  </select>

                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-lg" />
                </div>
              </div>
              <button className="flex items-center gap-2 bg-[#4CAF50] hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-md whitespace-nowrap">
                <FiSearch />
                Search Properties
              </button>
            </div>
          </div>
        </section>
  );
};

export default TenantHeroSection;
