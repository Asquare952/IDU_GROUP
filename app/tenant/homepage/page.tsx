"use client";
import React from "react";
import Navbar from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import HeroSection from "@/app/components/TenantHeroSection";
import PropertyCard from "@/app/components/TenantPropertyCard";
import { PROPERTY_LIST } from "@/app/components/tenant-properties";

const Page = () => {
  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <section className="px-6 md:px-12 mt-24 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {PROPERTY_LIST.map((house) => (
              <PropertyCard key={house.id} house={house} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Page;
