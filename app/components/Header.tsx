import React from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="w-full bg-transparent flex items-center justify-between py-6 px-6 md:px-12 relative z-50">
      <div className="flex items-center text-xl font-bold text-gray-900 tracking-tight">
        <Image
          src="/IDU GROUP LOGO.png"
          alt="RentULO Logo"
          width={28}
          height={28}
          className="mr-2"
        />
        Rent<span className="text-[#4CAF50]">ULO</span>
      </div>
      <div className="hidden md:flex items-center space-x-10">
        {[
          { name: "Home", href: "/" },
          { name: "House", href: "/house" },
          { name: "Property", href: "/property" },
          { name: "About Us", href: "/about" },
          { name: "Join Us", href: "/join" },
        ].map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-[15px] font-medium text-gray-700 hover:text-[#4CAF50] transition duration-200"
          >
            {link.name}
          </Link>
        ))}
      </div>
      <div className="flex items-center">
        <button
          className="px-8 py-2.5 rounded-xl text-gray-900 font-semibold text-sm transition duration-150 active:scale-95 shadow-sm cursor-pointer"
          style={{ backgroundColor: "#43A047"}}
        >
          Log in
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
