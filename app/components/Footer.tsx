import React from "react";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaTelegramPlane } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";

const Footer = () => {
  return (
    <footer className="relative w-full bg-white pt-16 pb-12 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-37 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Image
                src="/IDU GROUP LOGO.png"
                alt="RentULO"
                width={28}
                height={28}
              />
              <span className="text-2xl font-bold text-gray-900">
                Rent<span className="text-[#4CAF50]">ULO</span>
              </span>
            </div>
            <p className="text-gray-600 text-[19px] leading-relaxed max-w-[260px]">
              Discover trusted houses for rents near you. <br /> Directly from
              landlords, verified and <br />
              location-based.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900 text-[21px]">Company</h4>
            <nav className="flex flex-col gap-3 text-gray-500 text-[19px]">
              <a href="#" className="hover:text-green-600">
                About IDU
              </a>
              <a href="#" className="hover:text-green-600">
                Careers
              </a>
              <a href="#" className="hover:text-green-600">
                Join us
              </a>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900 text-[21px]">Discover</h4>
            <nav className="flex flex-col gap-3 text-gray-500 text-[19px]">
              <a href="#" className="hover:text-green-600">
                Find a house
              </a>
              <a href="#" className="hover:text-green-600">
                List a property
              </a>
              <a href="#" className="hover:text-green-600">
                FAQs
              </a>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900 text-[21px]">Support</h4>
            <nav className="flex flex-col gap-3 text-gray-500 text-[19px]">
              <a href="#" className="hover:text-green-600">
                Help center
              </a>
              <a href="#" className="hover:text-green-600">
                Contact us
              </a>
              <a href="#" className="hover:text-green-600">
                Terms and Privacy
              </a>
            </nav>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-1 text-[21px]">
                Stay updated on new rentals
              </h4>
              <p className="text-gray-400 text-[21px]">
                Get notified when verified listings appear near you
              </p>
            </div>

            <div className="flex gap-3">
              {[
                { icon: <FaFacebookF />, link: "#" },
                { icon: <RiTwitterXFill />, link: "#" },
                { icon: <FaInstagram />, link: "#" },
                { icon: <FaTelegramPlane />, link: "#" },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#4CAF50] flex items-center justify-center hover:bg-[#4CAF50] hover:text-white transition-colors"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="w-full max-w-md">
            <div className="relative flex items-center border border-gray-100 rounded-full bg-white p-1 shadow-sm">
              <input
                type="email"
                placeholder="enter email"
                className="w-full pl-6 pr-4 py-3 text-sm:2 focus:outline-none bg-transparent"
              />
              <button className="bg-[#4CAF50] text-white px-8 py-2.5 rounded-full text-sm:2 cursor-pointer font-medium hover:bg-green-700 transition">
                Subscribe
              </button>
            </div>
            <p className="text-right text-gray-400 text-[16px] mt-8">
              2025, RentULO, IDU GROUP
            </p>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <h1 className="text-[120px] md:text-[200px] lg:text-[280px] font-bold text-gray-50 select-none opacity-40">
          RentULO
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
