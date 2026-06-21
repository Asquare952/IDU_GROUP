import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";

const Footer = () => {
  return (
    <footer className="relative w-full bg-white pt-16 pb-12 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
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
            <p className="text-gray-600 text-base md:text-[19px] leading-relaxed max-w-65">
              Discover trusted houses for rents near you. <br /> Directly from
              landlords, verified and <br />
              location-based.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900 text-lg md:text-[21px]">
              Company
            </h4>
            <nav className="flex flex-col gap-3 text-gray-500 text-base md:text-[19px]">
              <a href="/about-us" className="hover:text-green-600">
                About RentULO
              </a>
              <a href="#" className="hover:text-green-600">
                Careers
              </a>
              <a href="/signup" className="hover:text-green-600">
                Join us
              </a>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900 text-lg md:text-[21px]">
              Discover
            </h4>
            <nav className="flex flex-col gap-3 text-gray-500 text-base md:text-[19px]">
              <Link href="/login" className="hover:text-green-600">
                Find a house
              </Link>
              <Link href="/login" className="hover:text-green-600">
                List a property
              </Link>
              <a href="/faqs" className="hover:text-green-600">
                FAQs
              </a>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900 text-lg md:text-[21px]">
              Support
            </h4>
            <nav className="flex flex-col gap-3 text-gray-500 text-base md:text-[19px]">
              <a href="/help-center" className="hover:text-green-600">
                Help center
              </a>
              <a href="/contact" className="hover:text-green-600">
                Contact us
              </a>
              <a href="/terms-privacy" className="hover:text-green-600">
                Terms and Privacy
              </a>
            </nav>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-1 text-lg md:text-[21px]">
                Stay updated on new rentals
              </h4>
              <p className="text-gray-400 text-base md:text-[21px]">
                Get notified when verified listings appear near you
              </p>
            </div>

            <div className="flex gap-3">
              {[
                { icon: <FaFacebookF />, link: "#" },
                {
                  icon: <RiTwitterXFill />,
                  link: "https://x.com/Rentulonigeria",
                },
                {
                  icon: <FaInstagram />,
                  link: "https://www.instagram.com/rentulonigeria?igsh=YmF3N2ZjYjRkNjQ2&utm_source=qr",
                },
                {
                  icon: <FaTiktok />,
                  link: "https://www.tiktok.com/@rentulonigeria?lang=en-GB",
                },
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
                className="w-full pl-6 pr-4 py-3 text-base focus:outline-none bg-transparent"
              />
              <button className="bg-[#4CAF50] text-white px-8 py-2.5 rounded-full text-base cursor-pointer font-medium hover:bg-green-700 transition">
                Subscribe
              </button>
            </div>
            <p className="text-right text-gray-400 text-sm md:text-[16px] mt-8">
              © 2026 RentULO. All rights reserved.
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
